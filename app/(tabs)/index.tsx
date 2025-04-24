import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import React from "react"

export default function HomeScreen() {
  const historyItems = [
    { id: 1, amount: 450, date: "23/03/2025", time: "16:20" },
    { id: 2, amount: 450, date: "23/03/2025", time: "16:20" },
    { id: 3, amount: 450, date: "23/03/2025", time: "16:20" },
    { id: 4, amount: 450, date: "23/03/2025", time: "16:20" },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-Vindo,</Text>
        <Text style={styles.headerTitle}>Usuário!</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.waterCard}>
          <View style={styles.waterInfoContainer}>
            <View>
              <Text style={styles.waterAmount}>1.3 Litros</Text>
              <Text style={styles.waterLabel}>Consumidos</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={24} color="white" style={styles.addIcon} />
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

     
          <View style={styles.waveContainer}>
            <View style={styles.wave1} />
            <View style={styles.wave2} />
            <View style={styles.wave3} />
          </View>

  
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <View style={styles.goalContainer}>
              <Text style={styles.goalText}>2.5 Litros</Text>
              <Text style={styles.goalLabel}>Minha Meta</Text>
            </View>
            <TouchableOpacity style={styles.infoButton}>
              <Ionicons name="water-outline" size={24} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Histórico</Text>
          <View style={styles.divider} />

          {historyItems.map((item) => (
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

              <TouchableOpacity style={styles.deleteButton}>
                <Ionicons name="water-outline" size={20} color="#2196F3" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
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
  welcomeText: {
    color: "white",
    fontSize: 14,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  waterCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  waterInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    zIndex: 1,
  },
  waterAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
  },
  waterLabel: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#2196F3",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addIcon: {
    marginRight: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "500",
  },
  waveContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    height: 80,
  },
  wave1: {
    position: "absolute",
    height: 80,
    width: "100%",
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    borderRadius: 100,
    bottom: -40,
    transform: [{ scaleX: 1.5 }],
  },
  wave2: {
    position: "absolute",
    height: 70,
    width: "100%",
    backgroundColor: "rgba(33, 150, 243, 0.15)",
    borderRadius: 100,
    bottom: -30,
    transform: [{ scaleX: 1.3 }],
  },
  wave3: {
    position: "absolute",
    height: 60,
    width: "100%",
    backgroundColor: "rgba(33, 150, 243, 0.2)",
    borderRadius: 100,
    bottom: -20,
    transform: [{ scaleX: 1.1 }],
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginRight: 10,
  },
  progressFill: {
    width: "40%", // 1.3 / 2.5 = ~50%
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  goalContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  goalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  goalLabel: {
    fontSize: 10,
    color: "#999",
  },
  infoButton: {
    marginLeft: 10,
  },
  historySection: {
    marginTop: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 5,
  },
  divider: {
    height: 2,
    backgroundColor: "#2196F3",
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: "center",
  },
  historyItemLeft: {
    flexDirection: "column",
    alignItems: "center",
    width: 60,
  },
  bottleIconContainer: {
    marginBottom: 5,
  },
  historyAmount: {
    fontSize: 12,
    color: "#666",
  },
  historyItemCenter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  historyLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  historyValue: {
    fontSize: 12,
    color: "#666",
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
  },
})
