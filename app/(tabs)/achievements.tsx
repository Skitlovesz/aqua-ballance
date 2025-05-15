import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useIsFocused } from "@react-navigation/native"
import { auth, db } from "../../firebaseConfig"
import {doc,getDoc,setDoc,collection,getDocs,updateDoc,serverTimestamp, type Timestamp,} from "firebase/firestore"
import React from "react"

// Corrigindo a tipagem dos ícones para usar o tipo correto do Ionicons
type IconName = keyof typeof Ionicons.glyphMap

// Tipos para nossas conquistas e desafios com a tipagem correta para ícones
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
  achievementId: string // ID da conquista relacionada
  icon: IconName
  description: string
}

// Dados iniciais de conquistas com tipagem correta
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

// Dados iniciais de desafios com tipagem correta
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

export default function AchievementsScreen() {
  const [activeTab, setActiveTab] = useState("achievements")
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements)
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges)
  const [showAchievementPopup, setShowAchievementPopup] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)
  const [popupAnimation] = useState(new Animated.Value(0))
  // Novo estado para rastrear se as conquistas foram carregadas
  const [achievementsLoaded, setAchievementsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const isFocused = useIsFocused()

  // Carregar dados salvos quando a tela for focada
  useEffect(() => {
    if (isFocused) {
      loadAchievementsFromFirebase()
      checkForNewAchievements()
    }
  }, [isFocused])

  // Efeito de animação para o popup
  useEffect(() => {
    if (showAchievementPopup) {
      Animated.sequence([
        Animated.timing(popupAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(popupAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowAchievementPopup(false)
      })
    }
  }, [showAchievementPopup])

  // Carregar conquistas e desafios do Firebase
  const loadAchievementsFromFirebase = async () => {
    try {
      setIsLoading(true)
      console.log("Carregando conquistas e desafios do Firebase...")

      const user = auth.currentUser
      if (!user) {
        console.log("Usuário não autenticado")
        setIsLoading(false)
        return
      }

      // Referência para a coleção de conquistas do usuário
      const achievementsRef = collection(db, "users", user.uid, "achievements")
      const achievementsSnapshot = await getDocs(achievementsRef)

      // Referência para a coleção de desafios do usuário
      const challengesRef = collection(db, "users", user.uid, "challenges")
      const challengesSnapshot = await getDocs(challengesRef)

      // Se não houver documentos, inicializar com os valores padrão
      if (achievementsSnapshot.empty) {
        console.log("Nenhuma conquista encontrada, inicializando...")
        await initializeAchievementsAndChallenges(user.uid)
      } else {
        // Mapear os documentos para o formato de Achievement
        const loadedAchievements: Achievement[] = []
        achievementsSnapshot.forEach((doc) => {
          const data = doc.data() as Achievement
          loadedAchievements.push({
            id: doc.id,
            title: data.title,
            completed: data.completed,
            completedAt: data.completedAt,
            icon: data.icon as IconName,
            description: data.description,
          })
        })
        setAchievements(loadedAchievements)
        console.log("Conquistas carregadas:", loadedAchievements)

        // Mapear os documentos para o formato de Challenge
        const loadedChallenges: Challenge[] = []
        challengesSnapshot.forEach((doc) => {
          const data = doc.data() as Challenge
          loadedChallenges.push({
            id: doc.id,
            title: data.title,
            completed: data.completed,
            completedAt: data.completedAt,
            achievementId: data.achievementId,
            icon: data.icon as IconName,
            description: data.description,
          })
        })
        setChallenges(loadedChallenges)
        console.log("Desafios carregados:", loadedChallenges)
      }

      setAchievementsLoaded(true)
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao carregar conquistas e desafios:", error)
      setIsLoading(false)
      Alert.alert("Erro", "Não foi possível carregar suas conquistas e desafios.")
    }
  }

  // Inicializar conquistas e desafios no Firebase
  const initializeAchievementsAndChallenges = async (userId: string) => {
    try {
      console.log("Inicializando conquistas e desafios no Firebase...")

      // Adicionar cada conquista ao Firebase
      for (const achievement of initialAchievements) {
        await setDoc(doc(db, "users", userId, "achievements", achievement.id), {
          ...achievement,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }

      // Adicionar cada desafio ao Firebase
      for (const challenge of initialChallenges) {
        await setDoc(doc(db, "users", userId, "challenges", challenge.id), {
          ...challenge,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }

      // Atualizar o estado local
      setAchievements(initialAchievements)
      setChallenges(initialChallenges)

      console.log("Conquistas e desafios inicializados com sucesso!")
    } catch (error) {
      console.error("Erro ao inicializar conquistas e desafios:", error)
      Alert.alert("Erro", "Não foi possível inicializar suas conquistas e desafios.")
    }
  }

  // Verificar se há novas conquistas a serem desbloqueadas
  const checkForNewAchievements = async () => {
    try {
      const user = auth.currentUser
      if (!user) return

      console.log("Verificando novas conquistas...")

      // 1. Verificar se o usuário bebeu 2 litros hoje (Hidratação Completa)
      await check2LitersAchievement(user.uid)

      // 2. Verificar se o usuário atingiu a meta diária (Meta Diária Alcançada)
      await checkDailyGoalAchievement(user.uid)

      // 3. Verificar se o usuário bebeu água por 7 dias consecutivos (Hidratação Consistente)
      await check7DaysConsecutiveAchievement(user.uid)

      // Recarregar conquistas após as verificações
      loadAchievementsFromFirebase()
    } catch (error) {
      console.error("Erro ao verificar novas conquistas:", error)
    }
  }

  // Verificar conquista de 2 litros
  const check2LitersAchievement = async (userId: string) => {
    try {
      // Obter o consumo atual do usuário
      const userDocRef = doc(db, "users", userId)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        const currentIntake = userData.currentIntake || 0

        // Verificar se o usuário bebeu pelo menos 2 litros (2000ml)
        if (currentIntake >= 2000) {
          // Verificar se a conquista já foi completada
          const achievementRef = doc(db, "users", userId, "achievements", "achievement_3")
          const achievementDoc = await getDoc(achievementRef)

          if (achievementDoc.exists() && !achievementDoc.data().completed) {
            // Atualizar a conquista
            await updateDoc(achievementRef, {
              completed: true,
              completedAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            })

            // Atualizar o desafio relacionado
            const challengeRef = doc(db, "users", userId, "challenges", "challenge_3")
            await updateDoc(challengeRef, {
              completed: true,
              completedAt: serverTimestamp(),
              icon: "checkmark-circle", // Atualizar o ícone
              updatedAt: serverTimestamp(),
            })

            // Mostrar popup de conquista
            const achievement = {
              id: "achievement_3",
              title: "Hidratação Completa",
              completed: true,
              icon: "water" as IconName,
              description: "Beba 2 litros de água em um único dia.",
            }
            setCurrentAchievement(achievement)
            setShowAchievementPopup(true)

            console.log("Conquista de 2 litros desbloqueada!")
          }
        }
      }
    } catch (error) {
      console.error("Erro ao verificar conquista de 2 litros:", error)
    }
  }

  // Verificar conquista de meta diária
  const checkDailyGoalAchievement = async (userId: string) => {
    try {
      // Obter o consumo atual e a meta do usuário
      const userDocRef = doc(db, "users", userId)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        const currentIntake = userData.currentIntake || 0
        const dailyGoal = userData.waterIntake || 2000

        // Verificar se o usuário atingiu sua meta diária
        if (currentIntake >= dailyGoal) {
          // Verificar se a conquista já foi completada
          const achievementRef = doc(db, "users", userId, "achievements", "achievement_2")
          const achievementDoc = await getDoc(achievementRef)

          if (achievementDoc.exists() && !achievementDoc.data().completed) {
            // Atualizar a conquista
            await updateDoc(achievementRef, {
              completed: true,
              completedAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            })

            // Atualizar o desafio relacionado
            const challengeRef = doc(db, "users", userId, "challenges", "challenge_2")
            await updateDoc(challengeRef, {
              completed: true,
              completedAt: serverTimestamp(),
              icon: "checkmark-circle", // Atualizar o ícone
              updatedAt: serverTimestamp(),
            })

            // Mostrar popup de conquista
            const achievement = {
              id: "achievement_2",
              title: "Meta Diária Alcançada",
              completed: true,
              icon: "ribbon" as IconName,
              description: "Complete sua meta diária de consumo de água.",
            }
            setCurrentAchievement(achievement)
            setShowAchievementPopup(true)

            console.log("Conquista de meta diária desbloqueada!")
          }
        }
      }
    } catch (error) {
      console.error("Erro ao verificar conquista de meta diária:", error)
    }
  }

  // Verificar conquista de 7 dias consecutivos
  const check7DaysConsecutiveAchievement = async (userId: string) => {
    try {
      // Obter o histórico de consumo dos últimos 7 dias
      const today = new Date()
      const historyCollectionRef = collection(db, "users", userId, "history")

      // Array para armazenar as datas dos últimos 7 dias
      const last7Days = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateString = date.toISOString().split("T")[0]
        last7Days.push(dateString)
      }

      // Verificar se há registros para cada um dos últimos 7 dias
      let consecutiveDays = 0

      for (const dateString of last7Days) {
        const historyDocRef = doc(historyCollectionRef, dateString)
        const historyDoc = await getDoc(historyDocRef)

        if (historyDoc.exists()) {
          const historyData = historyDoc.data()
          // Verificar se houve consumo neste dia (pelo menos 1ml)
          if (historyData.totalIntake > 0) {
            consecutiveDays++
          } else {
            // Se um dia não tiver consumo, interromper a contagem
            break
          }
        } else {
          // Se não houver registro para o dia, interromper a contagem
          break
        }
      }

      // Verificar se o usuário bebeu água por 7 dias consecutivos
      if (consecutiveDays >= 7) {
        // Verificar se a conquista já foi completada
        const achievementRef = doc(db, "users", userId, "achievements", "achievement_1")
        const achievementDoc = await getDoc(achievementRef)

        if (achievementDoc.exists() && !achievementDoc.data().completed) {
          // Atualizar a conquista
          await updateDoc(achievementRef, {
            completed: true,
            completedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })

          // Atualizar o desafio relacionado
          const challengeRef = doc(db, "users", userId, "challenges", "challenge_1")
          await updateDoc(challengeRef, {
            completed: true,
            completedAt: serverTimestamp(),
            icon: "checkmark-circle", // Atualizar o ícone
            updatedAt: serverTimestamp(),
          })

          // Mostrar popup de conquista
          const achievement = {
            id: "achievement_1",
            title: "Hidratação Consistente",
            completed: true,
            icon: "trophy" as IconName,
            description: "Beba água por 7 dias seguidos.",
          }
          setCurrentAchievement(achievement)
          setShowAchievementPopup(true)

          console.log("Conquista de 7 dias consecutivos desbloqueada!")
        }
      }
    } catch (error) {
      console.error("Erro ao verificar conquista de 7 dias consecutivos:", error)
    }
  }

  // Renderizar item de conquista
  const renderAchievement = ({ item }: { item: Achievement }) => (
    <View style={styles.achievementItem}>
      <View style={[styles.achievementIcon, item.completed ? styles.completedIcon : styles.incompleteIcon]}>
        <Ionicons
          name={item.completed ? item.icon : "time-outline"}
          size={24}
          color={item.completed ? "#2196F3" : "#999"}
        />
      </View>
      <View style={styles.achievementContent}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
        {item.completed && item.completedAt && (
          <Text style={styles.completedDate}>
            Concluído em: {new Date(item.completedAt.toDate()).toLocaleDateString("pt-BR")}
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  )

  // Renderizar item de desafio
  const renderChallenge = ({ item }: { item: Challenge }) => (
    <View style={styles.achievementItem}>
      <View style={[styles.achievementIcon, item.completed ? styles.completedIcon : styles.incompleteIcon]}>
        <Ionicons
          name={item.completed ? "checkmark-circle" : item.icon}
          size={24}
          color={item.completed ? "#2196F3" : "#999"}
        />
      </View>
      <View style={styles.achievementContent}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
        {item.completed && item.completedAt && (
          <Text style={styles.completedDate}>
            Concluído em: {new Date(item.completedAt.toDate()).toLocaleDateString("pt-BR")}
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  )

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Carregando conquistas...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Conquistas</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "achievements" && styles.activeTab]}
          onPress={() => setActiveTab("achievements")}
        >
          <Text style={[styles.tabText, activeTab === "achievements" && styles.activeTabText]}>Minhas Conquistas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "challenges" && styles.activeTab]}
          onPress={() => setActiveTab("challenges")}
        >
          <Text style={[styles.tabText, activeTab === "challenges" && styles.activeTabText]}>Desafios</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "achievements" ? (
        <FlatList
          data={achievements}
          renderItem={renderAchievement}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.achievementsList}
        />
      ) : (
        <FlatList
          data={challenges}
          renderItem={renderChallenge}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.achievementsList}
        />
      )}

      {/* Popup de conquista desbloqueada */}
      {showAchievementPopup && currentAchievement && (
        <Animated.View
          style={[
            styles.achievementPopup,
            {
              opacity: popupAnimation,
              transform: [
                {
                  translateY: popupAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.popupIconContainer}>
            <Ionicons name={currentAchievement.icon} size={40} color="#FFD700" />
          </View>
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>Conquista Desbloqueada!</Text>
            <Text style={styles.popupDescription}>{currentAchievement.title}</Text>
          </View>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#2196F3",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2196F3",
  },
  tabText: {
    color: "#999",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#2196F3",
  },
  achievementsList: {
    padding: 15,
  },
  achievementItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  completedIcon: {
    backgroundColor: "#E3F2FD",
  },
  incompleteIcon: {
    backgroundColor: "#f9f9f9",
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  completedDate: {
    fontSize: 10,
    color: "#2196F3",
    fontStyle: "italic",
  },
  moreButton: {
    padding: 5,
  },
  tabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerTab: {
    justifyContent: "flex-start",
  },
  centerTabButton: {
    backgroundColor: "#2196F3",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -25,
    borderWidth: 5,
    borderColor: "white",
  },
  // Estilos para o popup de conquista
  achievementPopup: {
    position: "absolute",
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 1000,
  },
  popupIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF9C4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  popupContent: {
    flex: 1,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 4,
  },
  popupDescription: {
    fontSize: 14,
    color: "#333",
  },
})
