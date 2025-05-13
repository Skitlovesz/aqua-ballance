// import { useState } from "react"
// import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native"
// import { Ionicons } from "@expo/vector-icons"
// import React from "react"

// type Achievement = {
//   id: string
//   title: string
//   completed: boolean
// }

// type Challenge = {
//   id: string
//   title: string
//   completed: boolean
// }

// const achievements: Achievement[] = [
//   {
//     id: "1",
//     title: "Beba 2 litros de água por 7 dias consecutivos",
//     completed: true,
//   },
//   {
//     id: "2",
//     title: "Complete sua meta diária",
//     completed: true,
//   },
//   {
//     id: "3",
//     title: "Beba 2 litros hoje",
//     completed: true,
//   }
// ]

// const challenges: Challenge[] = [
//   {
//     id: "1",
//     title: "Beba 2 litros de água por 7 dias consecutivos",
//     completed: false,
//   },
//   {
//     id: "2",
//     title: "Complete sua meta diária",
//     completed: true,
//   },
//   {
//     id: "3",
//     title: "Beba 2 litros hoje",
//     completed: false,
//   },
// ]

// export default function AchievementsScreen() {
//   const [activeTab, setActiveTab] = useState("achievements")

//   const renderAchievement = ({ item }: { item: Achievement }) => (
//     <View style={styles.achievementItem}>
//       <View style={styles.achievementIcon}>
//         <Ionicons name="trophy" size={24} color="#2196F3" />
//       </View>
//       <View style={styles.achievementContent}>
//         <Text style={styles.achievementTitle}>{item.title}</Text>
//       </View>
//       <TouchableOpacity style={styles.moreButton}>
//         <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
//       </TouchableOpacity>
//     </View>
//   )

//   const renderChallenge = ({ item }: { item: Challenge }) => (
//     <View style={styles.achievementItem}>
//       <View style={[styles.achievementIcon, !item.completed && styles.incompleteIcon]}>
//         <Ionicons
//           name={item.completed ? "checkmark-circle" : "time-outline"}
//           size={24}
//           color={item.completed ? "#2196F3" : "#999"}
//         />
//       </View>
//       <View style={styles.achievementContent}>
//         <Text style={styles.achievementTitle}>{item.title}</Text>
//       </View>
//       <TouchableOpacity style={styles.moreButton}>
//         <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
//       </TouchableOpacity>
//     </View>
//   )

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Minhas Conquistas</Text>
//       </View>

//       <View style={styles.tabsContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === "achievements" && styles.activeTab]}
//           onPress={() => setActiveTab("achievements")}
//         >
//           <Text style={[styles.tabText, activeTab === "achievements" && styles.activeTabText]}>Minhas Conquistas</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === "challenges" && styles.activeTab]}
//           onPress={() => setActiveTab("challenges")}
//         >
//           <Text style={[styles.tabText, activeTab === "challenges" && styles.activeTabText]}>Desafios</Text>
//         </TouchableOpacity>
//       </View>

//       {activeTab === "achievements" ? (
//         <FlatList
//           data={achievements}
//           renderItem={renderAchievement}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.achievementsList}
//         />
//       ) : (
//         <FlatList
//           data={challenges}
//           renderItem={renderChallenge}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.achievementsList}
//         />
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     backgroundColor: "#2196F3",
//     paddingTop: 50,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//   },
//   headerTitle: {
//     color: "white",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   tabsContainer: {
//     flexDirection: "row",
//     backgroundColor: "white",
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 15,
//     alignItems: "center",
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: "#2196F3",
//   },
//   tabText: {
//     color: "#999",
//     fontWeight: "500",
//   },
//   activeTabText: {
//     color: "#2196F3",
//   },
//   achievementsList: {
//     padding: 15,
//   },
//   achievementItem: {
//     flexDirection: "row",
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   achievementIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#f0f0f0",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 15,
//   },
//   incompleteIcon: {
//     backgroundColor: "#f9f9f9",
//   },
//   achievementContent: {
//     flex: 1,
//   },
//   achievementTitle: {
//     fontSize: 14,
//     color: "#333",
//   },
//   moreButton: {
//     padding: 5,
//   },
//   tabBar: {
//     flexDirection: "row",
//     height: 60,
//     backgroundColor: "white",
//     borderTopWidth: 1,
//     borderTopColor: "#f0f0f0",
//   },
//   tabItem: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   centerTab: {
//     justifyContent: "flex-start",
//   },
//   centerTabButton: {
//     backgroundColor: "#2196F3",
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: -25,
//     borderWidth: 5,
//     borderColor: "white",
//   },
// })



import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useIsFocused } from "@react-navigation/native"
import React from "react"

// Corrigindo a tipagem dos ícones para usar o tipo correto do Ionicons
type IconName = keyof typeof Ionicons.glyphMap

// Tipos para nossas conquistas e desafios com a tipagem correta para ícones
type Achievement = {
  id: string
  title: string
  completed: boolean
  icon: IconName
  description: string
}

type Challenge = {
  id: string
  title: string
  completed: boolean
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

  const isFocused = useIsFocused()

  // Carregar dados salvos quando a tela for focada
  useEffect(() => {
    if (isFocused) {
      loadAchievementsAndChallenges()
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

  // Carregar conquistas e desafios do AsyncStorage
  const loadAchievementsAndChallenges = async () => {
    try {
      console.log("Carregando conquistas e desafios...")
      const savedAchievements = await AsyncStorage.getItem("achievements")
      const savedChallenges = await AsyncStorage.getItem("challenges")

      if (savedAchievements) {
        const parsedAchievements = JSON.parse(savedAchievements)
        console.log("Conquistas carregadas:", parsedAchievements)
        setAchievements(parsedAchievements)
      } else {
        // Se não houver conquistas salvas, usar os valores iniciais
        console.log("Nenhuma conquista encontrada, usando valores iniciais")
        setAchievements(initialAchievements)
        await AsyncStorage.setItem("achievements", JSON.stringify(initialAchievements))
      }

      if (savedChallenges) {
        const parsedChallenges = JSON.parse(savedChallenges)
        console.log("Desafios carregados:", parsedChallenges)
        setChallenges(parsedChallenges)
      } else {
        // Se não houver desafios salvos, usar os valores iniciais
        console.log("Nenhum desafio encontrado, usando valores iniciais")
        setChallenges(initialChallenges)
        await AsyncStorage.setItem("challenges", JSON.stringify(initialChallenges))
      }

      setAchievementsLoaded(true)

      // Verificar se há conquistas completadas para mostrar o popup
      checkForCompletedAchievements(savedAchievements)
    } catch (error) {
      console.error("Erro ao carregar conquistas e desafios:", error)
      // Em caso de erro, usar os valores iniciais
      setAchievements(initialAchievements)
      setChallenges(initialChallenges)
      setAchievementsLoaded(true)
    }
  }

  // Verificar se há conquistas recém-completadas para mostrar o popup
  const checkForCompletedAchievements = (savedAchievementsStr: string | null) => {
    if (!savedAchievementsStr) return

    try {
      const savedAchievements = JSON.parse(savedAchievementsStr)
      const completedAchievement = savedAchievements.find((a: Achievement) => a.completed)

      if (completedAchievement) {
        setCurrentAchievement(completedAchievement)
        setShowAchievementPopup(true)
      }
    } catch (error) {
      console.error("Erro ao verificar conquistas completadas:", error)
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
          name={item.completed ? "checkmark-circle" : "time-outline"}
          size={24}
          color={item.completed ? "#2196F3" : "#999"}
        />
      </View>
      <View style={styles.achievementContent}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  )

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
