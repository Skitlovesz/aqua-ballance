import { useState, useEffect } from "react"
import {View,Text,StyleSheet,TouchableOpacity,Switch,ScrollView,Modal,Alert,Platform,TextInput} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import * as Notifications from "expo-notifications"
import { signOut } from "firebase/auth"
import { auth } from "../../firebaseConfig"
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, getFirestore } from "firebase/firestore"
import React from "react"
const firestore = getFirestore()

// Configuração correta do handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
})

// Função para registrar token de notificações
const registerForPushNotificationsAsync = async () => {
  let token

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("water-reminders", {
      name: "Lembretes para beber água",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#2196F3",
      sound: "default",
    })
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== "granted") {
    console.log("Permissão de notificação não concedida")
    return null
  }

  // Não exibir alerta se a permissão não for concedida
  // Removido o Alert para não mostrar mensagem na inicialização

  token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: "your-project-id",
    })
  ).data

  return token
}

type RootStackParamList = {
  Profile: undefined
  MainTabs: undefined
  Login: undefined
}

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "MainTabs">

type ReminderItem = {
  id: string
  time: string
  text: string
  enabled: boolean
  type?: string // Adicionado para identificar o tipo de lembrete
  startTime?: string // Para lembretes de intervalo
  endTime?: string // Para lembretes de intervalo
  interval?: number // Intervalo em minutos
}

type UserSettings = {
  notificationsEnabled: boolean
  remindersEnabled: boolean
  achievementsEnabled: boolean
  reminders: ReminderItem[]
}

type RemindersModalProps = {
  visible: boolean
  onClose: () => void
}

const DEFAULT_REMINDER_IDS = ["reminder-1", "reminder-2", "reminder-3", "reminder-4"]

const requestNotificationPermissions = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("water-reminders", {
      name: "Lembretes para beber água",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#2196F3",
      sound: "default",
    })
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== "granted") {
    // Não exibir alerta na inicialização
    console.log("Permissão para notificações não concedida")
    return false
  }

  return true
}

// Função para salvar configurações do usuário no Firebase
const saveUserSettings = async (userId: string, settings: UserSettings) => {
  try {
    const userSettingsRef = doc(firestore, "userSettings", userId)
    await setDoc(userSettingsRef, settings, { merge: true })
    console.log("Configurações do usuário salvas com sucesso")
    return true
  } catch (error) {
    console.error("Erro ao salvar configurações do usuário:", error)
    return false
  }
}

// Função para carregar configurações do usuário do Firebase
const loadUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const userSettingsRef = doc(firestore, "userSettings", userId)
    const userSettingsDoc = await getDoc(userSettingsRef)

    if (userSettingsDoc.exists()) {
      return userSettingsDoc.data() as UserSettings
    }

    return null
  } catch (error) {
    console.error("Erro ao carregar configurações do usuário:", error)
    return null
  }
}

// Função para salvar um lembrete específico no Firebase
const saveReminder = async (userId: string, reminder: ReminderItem) => {
  try {
    const reminderRef = doc(firestore, `userSettings/${userId}/reminders`, reminder.id)
    await setDoc(reminderRef, reminder)
    console.log(`Lembrete ${reminder.id} salvo com sucesso`)
    return true
  } catch (error) {
    console.error(`Erro ao salvar lembrete ${reminder.id}:`, error)
    return false
  }
}

// Função para excluir um lembrete específico do Firebase
const deleteReminder = async (userId: string, reminderId: string) => {
  try {
    const reminderRef = doc(firestore, `userSettings/${userId}/reminders`, reminderId)
    await deleteDoc(reminderRef)
    console.log(`Lembrete ${reminderId} excluído com sucesso`)
    return true
  } catch (error) {
    console.error(`Erro ao excluir lembrete ${reminderId}:`, error)
    return false
  }
}

// Função para carregar todos os lembretes do usuário do Firebase
const loadReminders = async (userId: string): Promise<ReminderItem[]> => {
  try {
    const remindersRef = collection(firestore, `userSettings/${userId}/reminders`)
    const remindersSnapshot = await getDocs(remindersRef)

    const reminders: ReminderItem[] = []
    remindersSnapshot.forEach((doc) => {
      reminders.push(doc.data() as ReminderItem)
    })

    console.log(`Carregados ${reminders.length} lembretes do Firebase`)
    return reminders
  } catch (error) {
    console.error("Erro ao carregar lembretes:", error)
    return []
  }
}

// Função de agendamento corrigida
const scheduleReminderNotification = async (reminder: ReminderItem) => {
  if (!reminder.enabled) return

  try {
    // Cancela notificação existente com este ID
    await Notifications.cancelScheduledNotificationAsync(reminder.id)

    // Verificar se é um lembrete de intervalo
    if (reminder.type === "interval" && reminder.startTime && reminder.endTime && reminder.interval) {
      return await scheduleIntervalNotifications(reminder)
    }

    const [hours, minutes] = reminder.time.split(":").map((num) => Number.parseInt(num, 10))
    const now = new Date()
    const scheduledTime = new Date()

    scheduledTime.setHours(hours, minutes, 0, 0)

    // Se o horário já passou hoje, agendar para amanhã
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1)
    }

    // Calcular o delay em segundos até o horário agendado
    const delay = Math.max(10, Math.floor((scheduledTime.getTime() - now.getTime()) / 1000))

    const isCustomReminder = !DEFAULT_REMINDER_IDS.includes(reminder.id)
    const isRepeating = reminder.text === "Todos os dias"

    const notificationContent = {
      title: "Hora de beber água",
      body: "Lembre-se de se hidratar!", // Mensagem genérica para o lembrete atual
      sound: true,
      data: {
        reminderId: reminder.id,
        isWaterReminder: true,
        isSetupNotification: true,
      },
      categoryIdentifier: "water-reminders",
    }

    let identifier

    if (isRepeating) {
      // Para notificações diárias repetitivas - certifique-se de que o objeto trigger está correto
      // Calculate seconds until first occurrence
      const now = new Date()
      const scheduledTime = new Date()
      scheduledTime.setHours(hours, minutes, 0, 0)
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1)
      }
      const secondsUntilFirstTrigger = Math.floor((scheduledTime.getTime() - now.getTime()) / 1000)

      console.log(`Scheduled time: ${scheduledTime}`)
      identifier = await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: {
          date: scheduledTime,
          type: Notifications.SchedulableTriggerInputTypes.DATE,
        },
      })
    } else {
      // Para notificações únicas - usar date em vez de seconds para evitar disparos prematuros
      identifier = await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: scheduledTime,
        },
      })
    }

    console.log(`Notificação agendada com ID: ${identifier} para: ${scheduledTime.toLocaleString()}`)

    return identifier
  } catch (error) {
    console.error("Erro ao agendar notificação:", error)
    return null
  }
}

// Função para cancelar todas as notificações antes de reagendar
const cancelAllAndReschedule = async (reminders: ReminderItem[]) => {
  try {
    // Primeiro cancela todas as notificações
    await Notifications.cancelAllScheduledNotificationsAsync()
    console.log("Todas as notificações foram canceladas")

    // Depois reagenda apenas as ativas
    for (const reminder of reminders) {
      if (reminder.enabled) {
        await scheduleReminderNotification(reminder)
      }
    }
    console.log("Notificações reagendadas com sucesso")
  } catch (error) {
    console.error("Erro ao reagendar notificações:", error)
  }
}

// Corrigir a função scheduleIntervalNotifications para garantir que as notificações sejam enviadas no horário correto
const scheduleIntervalNotifications = async (reminder: ReminderItem) => {
  if (!reminder.startTime || !reminder.endTime || !reminder.interval || !reminder.enabled) return null

  try {
    // Cancelar notificações existentes com este ID
    await Notifications.cancelScheduledNotificationAsync(reminder.id)

    const [startHours, startMinutes] = reminder.startTime.split(":").map((num) => Number.parseInt(num, 10))
    const [endHours, endMinutes] = reminder.endTime.split(":").map((num) => Number.parseInt(num, 10))

    const now = new Date()
    const startTime = new Date()
    const endTime = new Date()

    startTime.setHours(startHours, startMinutes, 0, 0)
    endTime.setHours(endHours, endMinutes, 0, 0)

    // Verificar se o horário de início é depois do horário atual
    let isToday = true

    // Se o horário de início já passou hoje, mas o fim ainda não, começar de agora
    if (startTime < now && endTime > now) {
      // Ajustar o horário de início para o próximo intervalo válido
      const timePassedSinceStart = now.getTime() - startTime.getTime()
      const intervalMs = reminder.interval * 60000
      const intervalsElapsed = Math.floor(timePassedSinceStart / intervalMs)
      const nextIntervalTime = new Date(startTime.getTime() + (intervalsElapsed + 1) * intervalMs)

      // Só agendar se o próximo intervalo ainda estiver dentro do período final
      if (nextIntervalTime < endTime) {
        startTime.setTime(nextIntervalTime.getTime())
      } else {
        // Se não houver mais intervalos hoje, agendar para amanhã
        startTime.setDate(startTime.getDate() + 1)
        endTime.setDate(endTime.getDate() + 1)
        isToday = false
      }
    }
    // Se ambos já passaram hoje, agendar para amanhã
    else if (startTime < now && endTime < now) {
      startTime.setDate(startTime.getDate() + 1)
      endTime.setDate(endTime.getDate() + 1)
      isToday = false
    }
    // Se o horário de início ainda não chegou hoje, manter como está

    // Calcular o número de notificações a serem agendadas
    const intervalMs = reminder.interval * 60000 // Converter minutos para milissegundos
    const totalTimeMs = endTime.getTime() - startTime.getTime()
    const notificationsCount = Math.floor(totalTimeMs / intervalMs)

    console.log(
      `Agendando ${notificationsCount} notificações entre ${startTime.toLocaleTimeString()} e ${endTime.toLocaleTimeString()} a cada ${
        reminder.interval
      } minutos`,
    )

    const identifiers = []

    // Agendar cada notificação no intervalo
    for (let i = 0; i < notificationsCount; i++) {
      const notificationTime = new Date(startTime.getTime() + i * intervalMs)

      // Verificar se o horário é válido (não deve ser antes de agora)
      if (notificationTime <= now) continue

      const notificationContent = {
        title: "Hora de beber água",
        body: `Lembrete de intervalo: ${notificationTime.toLocaleTimeString()}`,
        sound: true,
        data: {
          reminderId: `${reminder.id}-${i}`,
          isWaterReminder: true,
          isIntervalReminder: true,
        },
        categoryIdentifier: "water-reminders",
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notificationTime,
        },
      })

      identifiers.push(identifier)
      console.log(`Notificação de intervalo agendada para: ${notificationTime.toLocaleTimeString()}`)
    }

    return identifiers
  } catch (error) {
    console.error("Erro ao agendar notificações de intervalo:", error)
    return null
  }
}

// Modal de Lembretes
const RemindersModal = ({ visible, onClose }: RemindersModalProps) => {
  const [reminders, setReminders] = useState<ReminderItem[]>([])
  const [justAdded, setJustAdded] = useState(false)

  const [addAlarmModalVisible, setAddAlarmModalVisible] = useState(false)
  const [selectedHour, setSelectedHour] = useState("19")
  const [selectedMinute, setSelectedMinute] = useState("30")
  const [repeatOption, setRepeatOption] = useState("Todos os dias")
  const [repeatModalVisible, setRepeatModalVisible] = useState(false)

  // Novo estado para o modal de intervalo
  const [intervalModalVisible, setIntervalModalVisible] = useState(false)
  const [reminderTypeModalVisible, setReminderTypeModalVisible] = useState(false)
  const [selectedReminderType, setSelectedReminderType] = useState("single") // 'single' ou 'interval'

  // Estados para configuração de intervalo
  const [startHour, setStartHour] = useState("17")
  const [startMinute, setStartMinute] = useState("00")
  const [endHour, setEndHour] = useState("22")
  const [endMinute, setEndMinute] = useState("00")
  const [intervalMinutes, setIntervalMinutes] = useState("60") // Intervalo padrão de 60 minutos

  // Carregar lembretes do Firebase quando o modal for aberto
  useEffect(() => {
    const loadUserReminders = async () => {
      const user = auth.currentUser
      if (!user) return

      try {
        const loadedReminders = await loadReminders(user.uid)
        if (loadedReminders.length > 0) {
          setReminders(loadedReminders)
          console.log("Lembretes carregados do Firebase:", loadedReminders.length)
        }
      } catch (error) {
        console.error("Erro ao carregar lembretes do Firebase:", error)
      }
    }

    if (visible) {
      loadUserReminders()
    }
  }, [visible])

  // Efeito para reagendar notificações quando os lembretes mudarem
  useEffect(() => {
    const setupNotifications = async () => {
      if (justAdded) return

      const permissionGranted = await requestNotificationPermissions()

      if (permissionGranted && reminders.length > 0) {
        console.log("Reconfigurando notificações agendadas")

        // Usar a nova função para cancelar tudo e reagendar
        await cancelAllAndReschedule(reminders)
      }
    }

    // Adicione um pequeno atraso para evitar configurar notificações na inicialização
    // se o modal estiver visível (quando o usuário abriu manualmente)
    if (visible) {
      setupNotifications()
    }
  }, [reminders, visible, justAdded])

  // Salvar lembretes no Firebase quando houver mudanças
  useEffect(() => {
    const saveRemindersToFirebase = async () => {
      const user = auth.currentUser
      if (!user || reminders.length === 0 || justAdded) return

      try {
        // Salvar cada lembrete individualmente
        for (const reminder of reminders) {
          await saveReminder(user.uid, reminder)
        }
        console.log("Todos os lembretes foram salvos no Firebase")
      } catch (error) {
        console.error("Erro ao salvar lembretes no Firebase:", error)
      }
    }

    saveRemindersToFirebase()
  }, [reminders])

  const toggleReminder = async (index: number) => {
    const updatedReminders = [...reminders]
    updatedReminders[index].enabled = !updatedReminders[index].enabled

    // Se o lembrete foi ativado, agenda a notificação
    if (updatedReminders[index].enabled) {
      await scheduleReminderNotification(updatedReminders[index])
    } else {
      // Se foi desativado, cancela a notificação
      await Notifications.cancelScheduledNotificationAsync(updatedReminders[index].id)
    }

    setReminders(updatedReminders)

    // Salvar a alteração no Firebase
    const user = auth.currentUser
    if (user) {
      await saveReminder(user.uid, updatedReminders[index])
    }
  }

  const addNewReminder = async () => {
    if (selectedReminderType === "single") {
      if (!selectedHour || !selectedMinute) {
        Alert.alert("Erro", "Selecione um horário válido")
        return
      }

      const formattedHour = selectedHour.padStart(2, "0")
      const formattedMinute = selectedMinute.padStart(2, "0")
      const formattedTime = `${formattedHour}:${formattedMinute}`

      // Verificar se já existe um lembrete com este horário
      const existingReminder = reminders.find((r) => r.time === formattedTime && r.type !== "interval")
      if (existingReminder) {
        Alert.alert("Horário já existe", "Você já tem um lembrete configurado para este horário.")
        return
      }

      const newReminder: ReminderItem = {
        id: `reminder-custom-${Date.now()}`,
        time: formattedTime,
        text: repeatOption,
        enabled: true,
        type: "single",
      }

      const updatedReminders = [...reminders, newReminder]
      setReminders(updatedReminders)

      // Agende a notificação para o novo lembrete
      await scheduleReminderNotification(newReminder)
      setJustAdded(true) // Marca que acabou de adicionar

      // Salvar o novo lembrete no Firebase
      const user = auth.currentUser
      if (user) {
        await saveReminder(user.uid, newReminder)
      }

      setAddAlarmModalVisible(false)

      setTimeout(() => {
        setJustAdded(false)
      }, 1000)
    } else {
      setAddAlarmModalVisible(false)
      setIntervalModalVisible(true)
    }
  }

  const addIntervalReminder = async () => {
    // Validar os dados de entrada
    if (!startHour || !startMinute || !endHour || !endMinute || !intervalMinutes) {
      Alert.alert("Erro", "Preencha todos os campos corretamente")
      return
    }

    const startTimeFormatted = `${startHour.padStart(2, "0")}:${startMinute.padStart(2, "0")}`
    const endTimeFormatted = `${endHour.padStart(2, "0")}:${endMinute.padStart(2, "0")}`

    // Verificar se o horário de início é anterior ao horário de fim
    const startDate = new Date()
    const endDate = new Date()
    startDate.setHours(Number.parseInt(startHour), Number.parseInt(startMinute), 0, 0)
    endDate.setHours(Number.parseInt(endHour), Number.parseInt(endMinute), 0, 0)

    if (startDate >= endDate) {
      Alert.alert("Erro", "O horário de início deve ser anterior ao horário de fim")
      return
    }

    // Calcular o intervalo em minutos
    const intervalValue = Number.parseInt(intervalMinutes)
    if (isNaN(intervalValue) || intervalValue <= 0) {
      Alert.alert("Erro", "O intervalo deve ser um número positivo")
      return
    }

    // Calcular a duração total em minutos
    const durationMinutes =
      (endDate.getHours() - startDate.getHours()) * 60 + (endDate.getMinutes() - startDate.getMinutes())

    // Ajustar o intervalo se necessário
    let finalInterval = intervalValue
    if (durationMinutes < 60 && intervalValue > 30) {
      finalInterval = 30 // Se o intervalo total for menor que 1 hora, usar 30 minutos
      Alert.alert(
        "Intervalo Ajustado",
        "Como o período é curto (menos de 1 hora), o intervalo foi ajustado para 30 minutos.",
      )
    }

    // Criar o novo lembrete de intervalo
    const newReminder: ReminderItem = {
      id: `reminder-interval-${Date.now()}`,
      time: `${startTimeFormatted} - ${endTimeFormatted}`,
      text: `A cada ${finalInterval} min`,
      enabled: true,
      type: "interval",
      startTime: startTimeFormatted,
      endTime: endTimeFormatted,
      interval: finalInterval,
    }

    const updatedReminders = [...reminders, newReminder]
    setReminders(updatedReminders)

    // Agendar as notificações para o intervalo
    await scheduleReminderNotification(newReminder)
    setJustAdded(true)

    // Salvar o novo lembrete de intervalo no Firebase
    const user = auth.currentUser
    if (user) {
      await saveReminder(user.uid, newReminder)
    }

    setIntervalModalVisible(false)

    setTimeout(() => {
      setJustAdded(false)
    }, 1000)
  }

  const deleteReminderItem = async (index: number) => {
    const reminderToDelete = reminders[index]

    // Cancela a notificação antes de remover o lembrete
    await Notifications.cancelScheduledNotificationAsync(reminderToDelete.id)

    // Remove o lembrete do estado local
    const updatedReminders = [...reminders]
    updatedReminders.splice(index, 1)
    setReminders(updatedReminders)

    // Remove o lembrete do Firebase
    const user = auth.currentUser
    if (user) {
      await deleteReminder(user.uid, reminderToDelete.id)
    }
  }

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))

  const testReminder = async (reminder: ReminderItem) => {
    const isCustomReminder = !DEFAULT_REMINDER_IDS.includes(reminder.id)

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Teste: Hora de beber água",
          body:
            reminder.type === "interval"
              ? `Teste do lembrete de intervalo (${reminder.startTime} - ${reminder.endTime})`
              : isCustomReminder
                ? `Teste do lembrete das ${reminder.time} (está ativo!)`
                : `Teste do lembrete das ${reminder.time}`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: null, // Isso faz a notificação disparar imediatamente
      })

      console.log(`Notificação de teste enviada com ID: ${notificationId}`)

      Alert.alert(
        "Teste de Lembrete",
        reminder.type === "interval"
          ? `Um lembrete de teste para o intervalo ${reminder.startTime} - ${reminder.endTime} foi enviado!`
          : `Um lembrete de teste para o horário ${reminder.time} foi enviado!`,
      )
    } catch (error) {
      console.error("Erro ao enviar notificação de teste:", error)
      Alert.alert("Erro", "Não foi possível enviar a notificação de teste. Verifique as permissões.")
    }
  }

  const renderTimeOptions = (data: string[], selected: string, onSelect: (value: string) => void) => {
    const selectedIndex = data.indexOf(selected)
    const visibleItems = data.slice(Math.max(0, selectedIndex - 2), Math.min(data.length, selectedIndex + 3))

    return (
      <View style={styles.timePickerColumn}>
        {visibleItems.map((value) => (
          <TouchableOpacity
            key={value}
            style={[styles.timeOption, value === selected && styles.selectedTimeOption]}
            onPress={() => onSelect(value)}
          >
            <Text style={[styles.timeOptionText, value === selected && styles.selectedTimeOptionText]}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ajuste Seus Lembretes</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.remindersList}>
            {reminders.length === 0 ? (
              <View style={styles.emptyRemindersContainer}>
                <Ionicons name="water-outline" size={40} color="#90CAF9" />
                <Text style={styles.emptyRemindersText}>Você não tem lembretes configurados</Text>
                <Text style={styles.emptyRemindersSubtext}>Toque no botão + para adicionar</Text>
              </View>
            ) : (
              reminders.map((reminder, index) => (
                <View key={index} style={styles.reminderItem}>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => deleteReminderItem(index)}>
                    <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                  </TouchableOpacity>
                  <View style={styles.reminderContent}>
                    <Text style={styles.reminderTime}>{reminder.time}</Text>
                    <Text style={styles.reminderText}>
                      {reminder.type === "interval" ? "Lembrete de intervalo" : reminder.text}
                    </Text>
                  </View>
                  <View style={styles.reminderActions}>
                    <TouchableOpacity style={styles.testButton} onPress={() => testReminder(reminder)}>
                      <Ionicons name="play-outline" size={18} color="#2196F3" />
                    </TouchableOpacity>
                    <Switch
                      value={reminder.enabled}
                      onValueChange={() => toggleReminder(index)}
                      trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
                      thumbColor={reminder.enabled ? "#2196F3" : "#f4f3f4"}
                    />
                  </View>
                </View>
              ))
            )}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setSelectedReminderType("single")
              setReminderTypeModalVisible(true)
            }}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para escolher o tipo de lembrete - versão compacta */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={reminderTypeModalVisible}
        onRequestClose={() => setReminderTypeModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setReminderTypeModalVisible(false)}
        >
          <View style={styles.miniModalContainer}>
            <Text style={styles.miniModalTitle}>Escolha o tipo</Text>

            <View style={styles.miniOptionsContainer}>
              <TouchableOpacity
                style={styles.miniOption}
                onPress={() => {
                  setSelectedReminderType("single")
                  setReminderTypeModalVisible(false)
                  setAddAlarmModalVisible(true)
                }}
              >
                <Ionicons name="alarm-outline" size={22} color="#2196F3" />
                <Text style={styles.miniOptionText}>Único</Text>
              </TouchableOpacity>

              <View style={styles.miniDivider} />

              <TouchableOpacity
                style={styles.miniOption}
                onPress={() => {
                  setSelectedReminderType("interval")
                  setReminderTypeModalVisible(false)
                  setIntervalModalVisible(true)
                }}
              >
                <Ionicons name="time-outline" size={22} color="#2196F3" />
                <Text style={styles.miniOptionText}>Intervalo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal para adicionar novo alarme */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addAlarmModalVisible}
        onRequestClose={() => setAddAlarmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addAlarmModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Alarme</Text>
              <TouchableOpacity onPress={() => setAddAlarmModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.timePickerContainer}>
              {renderTimeOptions(hours, selectedHour, setSelectedHour)}
              <View style={styles.timePickerSeparator}>
                <Text style={styles.timePickerSeparatorText}>:</Text>
              </View>
              {renderTimeOptions(minutes, selectedMinute, setSelectedMinute)}
            </View>

            <View style={styles.alarmOptionsContainer}>
              <TouchableOpacity style={styles.alarmOption}>
                <Text style={styles.alarmOptionLabel}>Toque</Text>
                <View style={styles.alarmOptionValue}>
                  <Text style={styles.alarmOptionValueText}>Toque Padrão</Text>
                  {/* <Ionicons name="chevron-forward" size={20} color="#999" /> */}
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.alarmOption} onPress={() => setRepeatModalVisible(true)}>
                <Text style={styles.alarmOptionLabel}>Repetir</Text>
                <View style={styles.alarmOptionValue}>
                  <Text style={styles.alarmOptionValueText}>{repeatOption}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addAlarmButton} onPress={addNewReminder}>
              <Text style={styles.addAlarmButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para configurar lembrete por intervalo - versão simplificada */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={intervalModalVisible}
        onRequestClose={() => setIntervalModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIntervalModalVisible(false)}>
          <View style={styles.miniModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.miniModalTitle}>Intervalo</Text>
              <TouchableOpacity onPress={() => setIntervalModalVisible(false)}>
                <Ionicons name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.simpleIntervalContainer}>
              <View style={styles.simpleIntervalRow}>
                <Text style={styles.simpleIntervalLabel}>Início:</Text>
                <View style={styles.simpleTimePicker}>
                  <TextInput
                    style={styles.simpleTimeInput}
                    keyboardType="numeric"
                    maxLength={2}
                    value={startHour}
                    onChangeText={setStartHour}
                  />
                  <Text style={styles.simpleTimeSeparator}>:</Text>
                  <TextInput
                    style={styles.simpleTimeInput}
                    keyboardType="numeric"
                    maxLength={2}
                    value={startMinute}
                    onChangeText={setStartMinute}
                  />
                </View>
              </View>

              <View style={styles.simpleIntervalRow}>
                <Text style={styles.simpleIntervalLabel}>Fim:</Text>
                <View style={styles.simpleTimePicker}>
                  <TextInput
                    style={styles.simpleTimeInput}
                    keyboardType="numeric"
                    maxLength={2}
                    value={endHour}
                    onChangeText={setEndHour}
                  />
                  <Text style={styles.simpleTimeSeparator}>:</Text>
                  <TextInput
                    style={styles.simpleTimeInput}
                    keyboardType="numeric"
                    maxLength={2}
                    value={endMinute}
                    onChangeText={setEndMinute}
                  />
                </View>
              </View>

              <View style={styles.simpleIntervalRow}>
                <Text style={styles.simpleIntervalLabel}>A cada:</Text>
                <View style={styles.simpleIntervalPicker}>
                  <TextInput
                    style={styles.simpleIntervalInput}
                    keyboardType="numeric"
                    value={intervalMinutes}
                    onChangeText={setIntervalMinutes}
                  />
                  <Text style={styles.simpleIntervalUnit}>min</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.simpleIntervalButton} onPress={addIntervalReminder}>
              <Text style={styles.simpleIntervalButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de opções de repetição */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={repeatModalVisible}
        onRequestClose={() => setRepeatModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setRepeatModalVisible(false)}>
          <View style={styles.repeatModalContainer}>
            <TouchableOpacity
              style={styles.repeatOption}
              onPress={() => {
                setRepeatOption("Todos os dias")
                setRepeatModalVisible(false)
              }}
            >
              <Text style={styles.repeatOptionText}>Todos os dias</Text>
              {repeatOption === "Todos os dias" && <Ionicons name="checkmark" size={20} color="#2196F3" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.repeatOption}
              onPress={() => {
                setRepeatOption("Uma Vez")
                setRepeatModalVisible(false)
              }}
            >
              <Text style={styles.repeatOptionText}>Uma Vez</Text>
              {repeatOption === "Uma Vez" && <Ionicons name="checkmark" size={20} color="#2196F3" />}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  )
}

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [achievementsEnabled, setAchievementsEnabled] = useState(true)
  const [remindersEnabled, setRemindersEnabled] = useState(true)
  const [notificationsExpanded, setNotificationsExpanded] = useState(false)
  const [remindersModalVisible, setRemindersModalVisible] = useState(false)
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)

  const [previousRemindersState, setPreviousRemindersState] = useState(true)
  const [previousAchievementsState, setPreviousAchievementsState] = useState(true)
  const [userName, setUserName] = useState("Usuário")
  const [userId, setUserId] = useState<string | null>(null)

  const navigation = useNavigation<SettingsScreenNavigationProp>()

  // Carregar configurações do usuário do Firebase
  useEffect(() => {
    const loadSettings = async () => {
      const user = auth.currentUser
      if (!user) return

      setUserId(user.uid)

      try {
        const settings = await loadUserSettings(user.uid)
        if (settings) {
          setNotificationsEnabled(settings.notificationsEnabled)
          setRemindersEnabled(settings.remindersEnabled)
          setAchievementsEnabled(settings.achievementsEnabled)
          console.log("Configurações do usuário carregadas do Firebase")
        }
      } catch (error) {
        console.error("Erro ao carregar configurações do usuário:", error)
      }
    }

    loadSettings()
  }, [])

  // Salvar configurações do usuário no Firebase quando houver mudanças
  useEffect(() => {
    const saveSettings = async () => {
      const user = auth.currentUser
      if (!user) return

      try {
        const settings: UserSettings = {
          notificationsEnabled,
          remindersEnabled,
          achievementsEnabled,
          reminders: [], // Os lembretes são salvos separadamente
        }

        await saveUserSettings(user.uid, settings)
        console.log("Configurações do usuário salvas no Firebase")
      } catch (error) {
        console.error("Erro ao salvar configurações do usuário:", error)
      }
    }

    // Salvar apenas se o usuário estiver autenticado e o ID do usuário estiver definido
    if (userId) {
      saveSettings()
    }
  }, [notificationsEnabled, remindersEnabled, achievementsEnabled, userId])

  useEffect(() => {
    const notificationReceivedSubscription = Notifications.addNotificationReceivedListener((notification) => {})
    const notificationResponseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {})

    // Verificar permissões silenciosamente, sem mostrar alertas
    const checkPermissions = async () => {
      const permissionGranted = await requestNotificationPermissions()
      if (!permissionGranted) {
        setNotificationsEnabled(false)
        setRemindersEnabled(false)
        setAchievementsEnabled(false)
      }
    }

    // Registrar para notificações push silenciosamente
    const setupNotifications = async () => {
      await registerForPushNotificationsAsync()
      await checkPermissions()
    }

    setupNotifications()

    // Limpar assinaturas ao desmontar
    return () => {
      notificationReceivedSubscription.remove()
      notificationResponseSubscription.remove()
    }
  }, [])

  useEffect(() => {
    // Configurar um listener para mudanças no estado de autenticação
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const userId = user ? user.uid : "guest"
      setUserId(user ? user.uid : null)

      if (user) {
        setUserName(user.name || user.email?.split("@")[0] || "Usuário")
      }

      if (userId !== "guest") {
        const userDocRef = doc(firestore, "users", userId)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const firebaseData = userDoc.data() as any
          setUserName(firebaseData.name || user?.email?.split("@")[0] || "Usuário")
        }
      }
    })

    // Limpar o listener quando o componente for desmontado
    return () => unsubscribe()
  }, [])

  // Modificado: Não exibir automaticamente o modal na inicialização
  useEffect(() => {
    const updateNotificationSettings = async () => {
      if (!notificationsEnabled) {
        // Cancelar todas as notificações quando desativadas
        await Notifications.cancelAllScheduledNotificationsAsync()
      }
      // Removido o código que abria automaticamente o modal
    }

    updateNotificationSettings()
  }, [notificationsEnabled, remindersEnabled])

  const navigateToProfile = () => {
    navigation.navigate("Profile")
  }

  const handleNotificationsToggle = (value: boolean) => {
    if (value === false) {
      setConfirmModalVisible(true)
    } else {
      setNotificationsEnabled(true)
      setRemindersEnabled(previousRemindersState)
      setAchievementsEnabled(previousAchievementsState)
    }
  }

  const confirmDisableNotifications = async () => {
    setPreviousRemindersState(remindersEnabled)
    setPreviousAchievementsState(achievementsEnabled)

    setNotificationsEnabled(false)
    setRemindersEnabled(false)
    setAchievementsEnabled(false)

    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync()
      console.log(`Cancelando ${scheduledNotifications.length} notificações agendadas`)
      await Notifications.cancelAllScheduledNotificationsAsync()
    } catch (error) {
      console.error("Erro ao cancelar notificações:", error)
    }

    setConfirmModalVisible(false)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      // Navigate to login screen after successful logout
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente mais tarde.")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil</Text>
          <Text style={styles.sectionSubtitle}>Edite suas informações e metas</Text>

          <TouchableOpacity style={styles.profileItem} onPress={navigateToProfile}>
            <View style={styles.profileInfo}>
              <Ionicons name="person" size={20} color="#2196F3" style={styles.profileIcon} />
              <View>
                <Text style={styles.profileName}>{userName}</Text>
                <Text style={styles.profileAge}>Clique aqui para ajustar sua nova meta</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <Text style={styles.sectionSubtitle}>Configure seus lembretes, conquistas e notificações</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => notificationsEnabled && setRemindersModalVisible(true)}
          >
            <View style={styles.settingIcon}>
              <Ionicons name="notifications" size={20} color={notificationsEnabled ? "#2196F3" : "#999"} />
            </View>
            <Text style={[styles.settingText, !notificationsEnabled && styles.disabledText]}>Lembretes</Text>
            <Switch
              value={remindersEnabled}
              onValueChange={(value) => {
                setRemindersEnabled(value)
                // Salvar a alteração no Firebase
                if (userId) {
                  saveUserSettings(userId, {
                    notificationsEnabled,
                    remindersEnabled: value,
                    achievementsEnabled,
                    reminders: [],
                  })
                }
              }}
              trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
              thumbColor={remindersEnabled ? "#2196F3" : "#f4f3f4"}
              disabled={!notificationsEnabled}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => notificationsEnabled && setNotificationsExpanded(!notificationsExpanded)}
          >
            <View style={styles.settingIcon}>
              <Ionicons name="trophy" size={20} color={notificationsEnabled ? "#2196F3" : "#999"} />
            </View>
            <Text style={[styles.settingText, !notificationsEnabled && styles.disabledText]}>Conquistas</Text>
            <Switch
              value={achievementsEnabled}
              onValueChange={(value) => {
                setAchievementsEnabled(value)
                // Salvar a alteração no Firebase
                if (userId) {
                  saveUserSettings(userId, {
                    notificationsEnabled,
                    remindersEnabled,
                    achievementsEnabled: value,
                    reminders: [],
                  })
                }
              }}
              trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
              thumbColor={achievementsEnabled ? "#2196F3" : "#f4f3f4"}
              disabled={!notificationsEnabled}
            />
          </TouchableOpacity>
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="notifications-outline" size={20} color="#2196F3" />
            </View>
            <Text style={styles.settingText}>Notificações</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
              thumbColor={notificationsEnabled ? "#2196F3" : "#f4f3f4"}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="white" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>

      <RemindersModal visible={remindersModalVisible} onClose={() => setRemindersModalVisible(false)} />

      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContainer}>
            <Text style={styles.confirmModalTitle}>Desativar Notificações</Text>
            <Text style={styles.confirmModalText}>
              Isso irá desativar todas as notificações, incluindo lembretes e conquistas. Deseja continuar?
            </Text>

            <View style={styles.confirmModalButtons}>
              <TouchableOpacity
                style={[styles.confirmModalButton, styles.cancelButton]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmModalButton, styles.confirmButton]}
                onPress={confirmDisableNotifications}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

// Ajustar os estilos para tornar os modais menores
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    backgroundColor: "#2196F3",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    marginRight: 12,
    padding: 8,
    backgroundColor: "#e6f2ff",
    borderRadius: 8,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  profileAge: {
    fontSize: 13,
    color: "#666",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingIcon: {
    padding: 8,
    backgroundColor: "#e6f2ff",
    borderRadius: 8,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  disabledText: {
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%", // Reduzido de 90% para 85%
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    maxHeight: "75%", // Reduzido de 80% para 75%
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12, // Reduzido de 16 para 12
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  remindersList: {
    paddingHorizontal: 16,
    maxHeight: "65%", // Reduzido de 70% para 65%
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10, // Reduzido de 12 para 10
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  reminderContent: {
    flex: 1,
  },
  reminderTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  reminderText: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    padding: 8,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: "#2196F3",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 16,
    elevation: 3,
  },
  addAlarmModalContainer: {
    width: "85%", // Reduzido de 90% para 85%
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    maxHeight: "70%", // Adicionado maxHeight
  },
  timePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16, // Reduzido de 24 para 16
  },
  timePickerColumn: {
    alignItems: "center",
  },
  timePickerSeparator: {
    marginHorizontal: 12, // Reduzido de 16 para 12
  },
  timePickerSeparatorText: {
    fontSize: 32, // Reduzido de 36 para 32
    fontWeight: "bold",
    color: "#333",
  },
  timeOption: {
    padding: 10, // Reduzido de 12 para 10
    marginVertical: 2,
    borderRadius: 8,
  },
  selectedTimeOption: {
    backgroundColor: "#e6f2ff",
  },
  timeOptionText: {
    fontSize: 18, // Reduzido de 20 para 18
    color: "#333",
  },
  selectedTimeOptionText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  alarmOptionsContainer: {
    marginBottom: 20, // Reduzido de 24 para 20
  },
  alarmOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10, // Reduzido de 12 para 10
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  alarmOptionLabel: {
    fontSize: 16,
    color: "#333",
  },
  alarmOptionValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  alarmOptionValueText: {
    fontSize: 16,
    color: "#666",
    marginRight: 8,
  },
  addAlarmButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addAlarmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  repeatModalContainer: {
    width: "75%", // Reduzido de 80% para 75%
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
  },
  repeatOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14, // Reduzido de 16 para 14
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  repeatOptionText: {
    fontSize: 16,
    color: "#333",
  },
  confirmModalContainer: {
    width: "75%", // Reduzido de 80% para 75%
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  confirmModalText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  confirmModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: "#2196F3",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  reminderActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  testButton: {
    padding: 8,
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: "#FF5252",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Novos estilos para o modal de tipo de lembrete
  reminderTypeModalContainer: {
    width: "85%", // Reduzido de 90% para 85%
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    maxHeight: "60%", // Adicionado maxHeight
  },
  reminderTypeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  reminderTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14, // Reduzido de 16 para 14
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  reminderTypeIcon: {
    marginRight: 14, // Reduzido de 16 para 14
    padding: 10,
    backgroundColor: "#e6f2ff",
    borderRadius: 25,
  },
  reminderTypeContent: {
    flex: 1,
  },
  reminderTypeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  reminderTypeDescription: {
    fontSize: 13, // Reduzido de 14 para 13
    color: "#666",
  },
  // Estilos para o modal de intervalo
  intervalModalContainer: {
    width: "85%", // Reduzido de 90% para 85%
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    maxHeight: "75%", // Adicionado maxHeight
  },
  intervalSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12, // Reduzido de 16 para 12
    marginBottom: 6, // Reduzido de 8 para 6
  },
  intervalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12, // Reduzido de 16 para 12
  },
  intervalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10, // Reduzido de 12 para 10
    fontSize: 16,
    width: 90, // Reduzido de 100 para 90
    marginRight: 12,
  },
  intervalInputLabel: {
    fontSize: 16,
    color: "#666",
  },
  intervalNote: {
    fontSize: 13, // Reduzido de 14 para 13
    color: "#666",
    fontStyle: "italic",
    marginBottom: 16,
  },
  reminderTypeOptionsContainer: {
    marginVertical: 16,
  },
  reminderTypeOptionCompact: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 8,
  },
  reminderTypeIconCompact: {
    marginRight: 12,
    padding: 8,
    backgroundColor: "#e6f2ff",
    borderRadius: 20,
  },
  reminderTypeContentCompact: {
    flex: 1,
  },
  reminderTypeTextCompact: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  reminderTypeDescriptionCompact: {
    fontSize: 13,
    color: "#666",
  },
  // Estilos para o mini modal compacto
  miniModalContainer: {
    width: "70%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  miniModalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  miniOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  miniOption: {
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
  miniOptionText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  miniDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#e0e0e0",
  },
  // Estilos para o modal de intervalo simplificado
  simpleIntervalContainer: {
    padding: 10,
  },
  simpleIntervalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  simpleIntervalLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    width: 50,
  },
  simpleTimePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  simpleTimeInput: {
    fontSize: 16,
    width: 30,
    textAlign: "center",
  },
  simpleTimeSeparator: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  simpleIntervalPicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  simpleIntervalInput: {
    fontSize: 16,
    width: 40,
    textAlign: "center",
  },
  simpleIntervalUnit: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  simpleIntervalButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  simpleIntervalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Estilo para lista vazia de lembretes
  emptyRemindersContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  emptyRemindersText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginTop: 10,
  },
  emptyRemindersSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
})
