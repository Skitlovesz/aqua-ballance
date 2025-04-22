import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import React from "react"

type Achievement = {
  id: string
  title: string
  completed: boolean
}

type Challenge = {
  id: string
  title: string
  completed: boolean
}

const achievements: Achievement[] = [
  {
    id: "1",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    completed: true,
  },
  {
    id: "2",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    completed: true,
  },
  {
    id: "3",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    completed: true,
  },
  {
    id: "4",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    completed: true,
  },
  {
    id: "5",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    completed: true,
  },
]

const challenges: Challenge[] = [
  {
    id: "1",
    title: "Beba 2 litros de água por 7 dias consecutivos",
    completed: false,
  },
  {
    id: "2",
    title: "Complete seu perfil com todas as informações",
    completed: true,
  },
  {
    id: "3",
    title: "Compartilhe o app com 3 amigos",
    completed: false,
  },
]

export default function AchievementsScreen() {
  const [activeTab, setActiveTab] = useState("achievements")

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <View style={styles.achievementItem}>
      <View style={styles.achievementIcon}>
        <Ionicons name="trophy" size={24} color="#2196F3" />
      </View>
      <View style={styles.achievementContent}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  )

  const renderChallenge = ({ item }: { item: Challenge }) => (
    <View style={styles.achievementItem}>
      <View style={[styles.achievementIcon, !item.completed && styles.incompleteIcon]}>
        <Ionicons
          name={item.completed ? "checkmark-circle" : "time-outline"}
          size={24}
          color={item.completed ? "#2196F3" : "#999"}
        />
      </View>
      <View style={styles.achievementContent}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
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
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  incompleteIcon: {
    backgroundColor: "#f9f9f9",
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    color: "#333",
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
})

