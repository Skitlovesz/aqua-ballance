import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useIsFocused } from "@react-navigation/native"
import { auth, db } from "../../firebaseConfig"
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, serverTimestamp, type Timestamp } from "firebase/firestore"
import React from "react"
import * as Notifications from 'expo-notifications'

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

// Tipos existentes...
type IconName = keyof typeof Ionicons.glyphMap

type Achievement = {
  id: string
  title: string
  completed: boolean
  completedAt?: Timestamp
  icon: IconName
  description: string
}

type Challenge = {
  id: string
  title: string
  completed: boolean
  completedAt?: Timestamp
  achievementId: string
  icon: IconName
  description: string
}

// Dados iniciais...
const initialAchievements: Achievement[] = [
  {
    id: "achievement_1",
    title: "Hidratação Consistente",
    completed: false,
    icon: "trophy",
    description: "Beba água por 7 dias seguidos.",
  },
  {
    id: "achievement_2",
    title: "Meta Diária Alcançada",
    completed: false,
    icon: "ribbon",
    description: "Complete sua meta diária de consumo de água.",
  },
  {
    id: "achievement_3",
    title: "Hidratação Completa",
    completed: false,
    icon: "water",
    description: "Beba 2 litros de água em um único dia.",
  },
]

const initialChallenges: Challenge[] = [
  {
    id: "challenge_1",
    title: "Beba água por 7 dias consecutivos",
    completed: false,
    achievementId: "achievement_1",
    icon: "time-outline",
    description: "Mantenha o consumo de água por uma semana inteira.",
  },
  {
    id: "challenge_2",
    title: "Complete sua meta diária",
    completed: false,
    achievementId: "achievement_2",
    icon: "time-outline",
    description: "Atinja sua meta diária de consumo de água.",
  },
  {
    id: "challenge_3",
    title: "Beba 2 litros hoje",
    completed: false,
    achievementId: "achievement_3",
    icon: "time-outline",
    description: "Consuma pelo menos 2 litros de água hoje.",
  },
]

// Função para solicitar permissões de notificação
async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  return finalStatus === 'granted'
}

// Função para enviar notificação
async function sendAchievementNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Nova conquista obtida! 🏆",
      body: `Parabéns! Você desbloqueou: ${title}`,
      sound: true,
    },
    trigger: null,
  })
}

export default function AchievementsScreen() {
  // Estados existentes...
  const [activeTab, setActiveTab] = useState("achievements")
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements)
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges)
  const [showAchievementPopup, setShowAchievementPopup] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)
  const [popupAnimation] = useState(new Animated.Value(0))
  const [achievementsLoaded, setAchievementsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [notificationsPermission, setNotificationsPermission] = useState(false)

  const isFocused = useIsFocused()

  // Efeito para verificar permissões de notificação
  useEffect(() => {
    registerForPushNotificationsAsync().then(permission => {
      setNotificationsPermission(permission)
    })
  }, [])

  // Restante dos useEffects...

  // Modificar a função checkAndUpdateAchievements para incluir notificação
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

        // Enviar notificação
        if (notificationsPermission) {
          await sendAchievementNotification(
            "Meta Diária Alcançada",
            "Parabéns! Você atingiu sua meta diária de consumo de água!"
          )
        }
      }
    } catch (error) {
      console.error("Erro ao verificar conquistas:", error)
    }
  }

  // Restante do código permanece o mesmo...
  // (Mantenha todas as outras funções e o JSX existente)

  // Resto do código...
}

// Estilos permanecem os mesmos...
const styles = StyleSheet.create({
  // ... (mantenha todos os estilos existentes)
})