import { useState, useEffect } from "react"
import {  View,Text,StyleSheet,TouchableOpacity,ScrollView,Alert,Modal,TextInput,FlatList,AppState,} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation, useRoute } from "@react-navigation/native"
import { auth, db } from "../../firebaseConfig"
import { doc, setDoc, getDoc, collection, updateDoc, increment, serverTimestamp } from "firebase/firestore"
import React from "react"
import styles from "../styles/index.styles"

declare global {
  var EventEmitter: {
    emit: (event: string, data?: any) => void
  } | undefined
}


type HistoryItem = {
  id: number
  amount: number
  date: string
  time: string
  hidden?: boolean
}

type Achievement = {
  id: string
  title: string
  completed: boolean
  icon: string
  description: string
}

export default function HomeScreen() {
  const [waterIntake, setWaterIntake] = useState(0)
  const [dailyGoal, setDailyGoal] = useState(2000) // Default 2L
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [customAmount, setCustomAmount] = useState("")
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [userName, setUserName] = useState("Usuário")
  const [isLoading, setIsLoading] = useState(true)
  const [lastResetDate, setLastResetDate] = useState<string>("")
  const [congratsModalVisible, setCongratsModalVisible] = useState(false)
  const [goalCelebrated, setGoalCelebrated] = useState(false)
  const [appState, setAppState] = useState(AppState.currentState)

  const navigation = useNavigation()
  const route = useRoute()

  // Função para obter a data atual no formato YYYY-MM-DD no fuso horário local
  const getCurrentLocalDate = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
  }

  // Função para verificar se é um novo dia (após meia-noite)
  const isNewDay = (lastDate: string) => {
    if (!lastDate) return false // Se não tiver data anterior, não é um novo dia (primeiro uso)

    const currentDate = getCurrentLocalDate()
    return currentDate !== lastDate
  }

  // Load last reset date
  const loadLastResetDate = async () => {
    try {
      const userId = auth.currentUser?.uid || "guest"
      const date = await AsyncStorage.getItem(`lastResetDate_${userId}`)

      if (date) {
        setLastResetDate(date)
        return date
      } else {
        // Se não existir data salva, salvar a data atual
        const currentDate = getCurrentLocalDate()
        setLastResetDate(currentDate)
        await AsyncStorage.setItem(`lastResetDate_${userId}`, currentDate)
        return currentDate
      }
    } catch (error) {
      console.error("Erro ao carregar data do último reinício:", error)
      // Em caso de erro, retornar a data atual para evitar resets indesejados
      return getCurrentLocalDate()
    }
  }

  // Verificar se precisa resetar o contador (meia-noite)
  const checkAndResetAtMidnight = async () => {
    try {
      const userId = auth.currentUser?.uid || "guest"
      const lastDate = await loadLastResetDate()

      // Verificar se é um novo dia
      if (isNewDay(lastDate)) {
        console.log("Resetando contador à meia-noite")

        // Importante: Salvar o histórico do dia anterior antes de resetar
        if (auth.currentUser) {
          const user = auth.currentUser

          // Garantir que o histórico do dia anterior esteja salvo com o valor correto
          if (lastDate) {
            const historyCollectionRef = collection(db, "users", user.uid, "history")
            const yesterdayDoc = doc(historyCollectionRef, lastDate)

            // Verificar se existe um documento para o dia anterior
            const yesterdaySnapshot = await getDoc(yesterdayDoc)

            if (yesterdaySnapshot.exists()) {
              // Garantir que o valor total está correto
              const visibleItems = history.filter((item) => !item.hidden)
              const totalYesterday = visibleItems.reduce((sum, item) => sum + item.amount, 0)

              if (totalYesterday > 0) {
                await updateDoc(yesterdayDoc, {
                  totalIntake: totalYesterday,
                })
              }
            }
          }
        }

        // Resetar o contador mas manter o histórico
        try {
          const user = auth.currentUser
          if (!user) return

          // Zerar o total de água consumida
          setWaterIntake(0)
          setGoalCelebrated(false)

          // Obter a data atual para o histórico
          const today = getCurrentLocalDate()

          // Atualizar no Firestore - usuário principal
          const userDocRef = doc(db, "users", user.uid)
          await updateDoc(userDocRef, {
            currentIntake: 0,
            lastUpdated: serverTimestamp(),
            lastResetDate: today,
          })

          // Atualizar a data do último reset
          const currentDate = getCurrentLocalDate()
          setLastResetDate(currentDate)
          await AsyncStorage.setItem(`lastResetDate_${userId}`, currentDate)

          console.log("Contador de água resetado à meia-noite, histórico mantido")
        } catch (error) {
          console.error("Erro ao resetar contador à meia-noite:", error)
        }
      }
    } catch (error) {
      console.error("Erro ao verificar reset automático:", error)
    }
  }

  // Carregar dados do usuário do Firestore
  const loadUserData = async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        console.log("Usuário não autenticado")
        setIsLoading(false)
        return
      }

      console.log("Carregando dados do usuário...")

      // Carregar dados do Firestore
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        setUserName(userData.name || user.email?.split("@")[0] || "Usuário")
        setDailyGoal(userData.waterIntake || 2000)

        // Importante: Carregar a quantidade atual de água
        const currentIntake = userData.currentIntake || 0
        setWaterIntake(currentIntake)
        console.log(`Quantidade de água carregada: ${currentIntake}ml`)

        // Carregar histórico do dia atual
        const today = getCurrentLocalDate()
        const historyCollectionRef = collection(db, "users", user.uid, "history")
        const historyDoc = await getDoc(doc(historyCollectionRef, today))

        if (historyDoc.exists()) {
          const historyData = historyDoc.data()
          if (Array.isArray(historyData.items)) {
            setHistory(historyData.items)
            console.log(`Histórico carregado: ${historyData.items.length} itens`)
          } else {
            setHistory([])
            console.log("Histórico vazio ou em formato inválido")
          }
        } else {
          // Se não existir documento para hoje, criar um novo
          console.log("Criando novo documento de histórico para hoje")
          await setDoc(doc(historyCollectionRef, today), {
            date: today,
            totalIntake: currentIntake,
            items: [],
          })
          setHistory([])
        }
      } else {
        // Se o documento do usuário não existir, criar um novo
        console.log("Criando novo documento de usuário")
        await setDoc(userDocRef, {
          name: user.email?.split("@")[0] || "Usuário",
          waterIntake: 2000,
          currentIntake: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        setWaterIntake(0)
        setHistory([])
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error)
      setIsLoading(false)
    }
  }

  // Efeito para inicialização e configuração de listeners
  useEffect(() => {
    // Carregar data do último reset
    loadLastResetDate().then(() => {
      // Só verificar reset após carregar a data
      checkAndResetAtMidnight()
    })

    // Carregar dados do usuário
    loadUserData()

    // Configurar um intervalo para verificar a cada minuto
    const intervalId = setInterval(() => {
      checkAndResetAtMidnight()
    }, 60000) // Verificar a cada minuto

    // Configurar listener para quando o app mudar de estado
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        console.log("App voltou para o primeiro plano!")
        // Recarregar dados quando o app voltar ao primeiro plano
        loadUserData()
        loadLastResetDate().then(() => {
          checkAndResetAtMidnight()
        })
      }
      setAppState(nextAppState)
    })

    // Limpar o intervalo e subscription quando o componente for desmontado
    return () => {
      clearInterval(intervalId)
      subscription.remove()
    }
  }, [])

  // Atualizar meta diária quando receber nova meta da tela de perfil
  useEffect(() => {
    if (route.params?.waterIntake) {
      setDailyGoal(route.params.waterIntake)
      updateUserData({ waterIntake: route.params.waterIntake })
    }
  }, [route.params?.waterIntake])

  const updateUserData = async (data: any) => {
    try {
      const user = auth.currentUser
      if (!user) return

      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error)
    }
  }

  const addWater = async (amount: number) => {
    try {
      const user = auth.currentUser
      if (!user) {
        Alert.alert("Erro", "Você precisa estar logado para registrar seu consumo de água.")
        return
      }

      const newAmount = waterIntake + amount
      setWaterIntake(newAmount)

      // Criar novo item no histórico
      const now = new Date()
      const newHistoryItem: HistoryItem = {
        id: Date.now(),
        amount,
        date: now.toLocaleDateString("pt-BR"),
        time: now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }

      const updatedHistory = [...history, newHistoryItem]
      setHistory(updatedHistory)

      // Atualizar dados no Firestore
      const userDocRef = doc(db, "users", user.uid)
      const historyCollectionRef = collection(db, "users", user.uid, "history")
      const todayDoc = doc(historyCollectionRef, getCurrentLocalDate())

      // Atualizar o documento do usuário com a nova quantidade
      await updateDoc(userDocRef, {
        currentIntake: newAmount,
        lastUpdated: serverTimestamp(),
      })

      // Verificar se o documento de hoje existe
      const todaySnapshot = await getDoc(todayDoc)

      if (todaySnapshot.exists()) {
        // Se existir, atualizar com o novo item
        const existingItems = todaySnapshot.data().items || []
        await updateDoc(todayDoc, {
          items: [...existingItems, newHistoryItem],
          totalIntake: increment(amount),
        })
      } else {
        // Se não existir, criar um novo
        await setDoc(todayDoc, {
          date: getCurrentLocalDate(),
          items: [newHistoryItem],
          totalIntake: amount,
        })
      }

      // Verificar conquistas
      if (newAmount >= dailyGoal && !goalCelebrated) {
        await checkAndUpdateAchievements(user.uid)
        setCongratsModalVisible(true)
        setGoalCelebrated(true)
      }
    } catch (error) {
      console.error("Erro ao adicionar água:", error)
      Alert.alert("Erro", "Não foi possível registrar seu consumo de água.")
    }
  }

  const checkAndUpdateAchievements = async (userId: string) => {
    try {
      const achievementsRef = collection(db, "users", userId, "achievements")
      const dailyGoalAchievement = doc(achievementsRef, "daily_goal")
      const achievementDoc = await getDoc(dailyGoalAchievement)

      if (!achievementDoc.exists() || !achievementDoc.data()?.completed) {
        await setDoc(
          dailyGoalAchievement,
          {
            id: "daily_goal",
            title: "Meta Diária Alcançada",
            completed: true,
            completedAt: serverTimestamp(),
            icon: "trophy",
            description: "Parabéns! Você atingiu sua meta diária de consumo de água!",
          },
          { merge: true },
        )
      }
    } catch (error) {
      console.error("Erro ao verificar conquistas:", error)
    }
  }

  const deleteHistoryItem = async (itemId: number) => {
    try {
      const user = auth.currentUser
      if (!user) return

      const updatedHistory = history.map((item) => (item.id === itemId ? { ...item, hidden: true } : item))
      setHistory(updatedHistory)

      const visibleItems = updatedHistory.filter((item) => !item.hidden)
      const newTotal = visibleItems.reduce((sum, item) => sum + item.amount, 0)
      setWaterIntake(newTotal)

      // Atualizar no Firestore
      const historyCollectionRef = collection(db, "users", user.uid, "history")
      const todayDoc = doc(historyCollectionRef, getCurrentLocalDate())

      await updateDoc(todayDoc, {
        items: updatedHistory,
        totalIntake: newTotal,
      })

      await updateDoc(doc(db, "users", user.uid), {
        currentIntake: newTotal,
      })
    } catch (error) {
      console.error("Erro ao deletar item do histórico:", error)
      Alert.alert("Erro", "Não foi possível deletar o registro.")
    }
  }

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    if (item.hidden) return null

    return (
      <View style={styles.historyItem}>
        <View style={styles.historyItemInfo}>
          <Text style={styles.historyItemAmount}>{item.amount}ml</Text>
          <Text style={styles.historyItemTime}>
            {item.date} às {item.time}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert("Confirmar", "Deseja remover este registro?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Confirmar", onPress: () => deleteHistoryItem(item.id) },
            ])
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    )
  }

  const handleCustomAmount = () => {
    const amount = Number.parseInt(customAmount)
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Erro", "Por favor, insira uma quantidade válida.")
      return
    }
    addWater(amount)
    setCustomAmount("")
    setShowAddModal(false)
  }

  const resetWaterConsumed = async () => {
    try {
      const user = auth.currentUser
      if (!user) return

      // Zerar o total de água consumida
      setWaterIntake(0)
      setGoalCelebrated(false)

      // Obter a data atual para o histórico
      const today = getCurrentLocalDate()

      // Atualizar no Firestore - usuário principal
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        currentIntake: 0,
        lastUpdated: serverTimestamp(),
        lastResetDate: today, // Adicionar data do último reset
      })

      // Importante: Atualizar também a coleção de histórico para o dia atual
      const historyCollectionRef = collection(db, "users", user.uid, "history")
      const todayDoc = doc(historyCollectionRef, today)

      // Verificar se já existe um documento para hoje
      const todaySnapshot = await getDoc(todayDoc)

      if (!todaySnapshot.exists()) {
        // Se não existir, criar um novo com valor zerado mas sem limpar histórico
        await setDoc(todayDoc, {
          date: today,
          totalIntake: 0,
          items: [], // Iniciar com array vazio apenas se não existir documento
        })
      } else {
        // Se já existir, apenas atualizar o totalIntake para zero
        // mas MANTER os itens existentes
        await updateDoc(todayDoc, {
          totalIntake: 0,
        })
      }

      // Atualizar a data do último reset
      setLastResetDate(today)
      await AsyncStorage.setItem(`lastResetDate_${user.uid}`, today)
    } catch (error) {
      console.error("Erro ao resetar contador:", error)
      Alert.alert("Erro", "Não foi possível resetar o contador.")
    }
  }

  // Adicione este useEffect após os outros useEffects existentes
  useEffect(() => {
    // Função para emitir evento de atualização
    const emitUpdateEvent = () => {
      if (global.EventEmitter) {
        global.EventEmitter.emit("waterDataUpdated", {
          currentIntake: waterIntake,
          lastResetDate: lastResetDate,
          history: history,
        })
      }
    }

    // Emitir evento quando os valores relevantes mudarem
    emitUpdateEvent()
  }, [waterIntake, lastResetDate, history])

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Carregando...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-Vindo,</Text>
        <Text style={styles.headerTitle}>{userName}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.waterCard}>
          <View style={styles.waterInfoContainer}>
            <View>
              <Text style={styles.waterAmount}>{(waterIntake / 1000).toFixed(2)} Litros</Text>
              <Text style={styles.waterLabel}>Consumidos Hoje</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.resetButton} onPress={resetWaterConsumed}>
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.resetButtonText}>Reiniciar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
                <Ionicons name="add" size={24} color="white" style={styles.addIcon} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.waveContainer}>
            <View style={styles.wave1} />
            <View style={styles.wave2} />
            <View style={styles.wave3} />
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min((waterIntake / dailyGoal) * 100, 100)}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.goalContainer}>
              <Text style={styles.goalText}>{(dailyGoal / 1000).toFixed(2)} Litros</Text>
              <Text style={styles.goalLabel}>Minha Meta</Text>
            </View>
            <TouchableOpacity style={styles.infoButton} onPress={() => navigation.navigate("Profile")}>
              <Ionicons name="settings-outline" size={24} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Histórico</Text>
            <TouchableOpacity onPress={() => setShowHistoryModal(true)}>
              <Text style={styles.viewAllText}>Ver Tudo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          {history.filter((item) => !item.hidden).length > 0 ? (
            history
              .filter((item) => !item.hidden)
              .slice(-3)
              .reverse()
              .map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.historyItemLeft}>
                    <View style={styles.bottleIconContainer}>
                      <Ionicons name="water" size={24} color="#2196F3" />
                    </View>
                    <Text style={styles.historyAmount}>{item.amount} ml</Text>
                  </View>

                  <View style={styles.historyItemCenter}>
                    <View>
                      <Text style={styles.historyLabel}>Data:</Text>
                      <Text style={styles.historyValue}>{item.date}</Text>
                    </View>
                    <View>
                      <Text style={styles.historyLabel}>Horário:</Text>
                      <Text style={styles.historyValue}>{item.time}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.waterActionButton}
                    onPress={() => {
                      Alert.alert("Confirmar", "Deseja remover este registro?", [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: "Confirmar",
                          onPress: () => deleteHistoryItem(item.id),
                        },
                      ])
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#2196F3" />
                  </TouchableOpacity>
                </View>
              ))
          ) : (
            <Text style={styles.noHistoryText}>Nenhum registro hoje</Text>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Consumo</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              placeholder="Digite a quantidade em ml"
              value={customAmount}
              onChangeText={setCustomAmount}
            />

            <View style={styles.quickAddButtons}>
              <TouchableOpacity
                style={styles.quickAddButton}
                onPress={() => {
                  setCustomAmount("200")
                }}
              >
                <Text style={styles.quickAddButtonText}>200ml</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAddButton}
                onPress={() => {
                  setCustomAmount("300")
                }}
              >
                <Text style={styles.quickAddButtonText}>300ml</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAddButton}
                onPress={() => {
                  setCustomAmount("500")
                }}
              >
                <Text style={styles.quickAddButtonText}>500ml</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={handleCustomAmount}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showHistoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.historyModalContent]}>
            <View style={styles.historyModalHeader}>
              <Text style={styles.modalTitle}>Histórico Completo</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={history.filter((item) => !item.hidden).reverse()}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.historyList}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de parabéns quando atingir a meta */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={congratsModalVisible}
        onRequestClose={() => setCongratsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.congratsModalView}>
            <View style={styles.congratsIconContainer}>
              <Ionicons name="trophy" size={50} color="#FFD700" />
            </View>
            <Text style={styles.congratsTitle}>Parabéns!</Text>
            <Text style={styles.congratsMessage}>Você concluiu sua META!</Text>
            <Text style={styles.congratsSubtitle}>{(dailyGoal / 1000).toFixed(2)} Litros de água consumidos</Text>
            <TouchableOpacity style={styles.congratsButton} onPress={() => setCongratsModalVisible(false)}>
              <Text style={styles.congratsButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}
