
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BarChart } from "react-native-chart-kit"
import React from "react"

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState("month")
  const screenWidth = Dimensions.get("window").width - 40

  const chartData = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
    datasets: [
      {
        data: [1.2, 0.8, 1.5, 0.9, 1.7, 1.4, 1.1],
      },
    ],
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodTab, activeTab === "day" && styles.activePeriodTab]}
            onPress={() => setActiveTab("day")}
          >
            <Text style={[styles.periodTabText, activeTab === "day" && styles.activePeriodTabText]}>Dia</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodTab, activeTab === "week" && styles.activePeriodTab]}
            onPress={() => setActiveTab("week")}
          >
            <Text style={[styles.periodTabText, activeTab === "week" && styles.activePeriodTabText]}>Sem</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodTab, activeTab === "month" && styles.activePeriodTab]}
            onPress={() => setActiveTab("month")}
          >
            <Text style={[styles.periodTabText, activeTab === "month" && styles.activePeriodTabText]}>Mês</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodTab, activeTab === "year" && styles.activePeriodTab]}
            onPress={() => setActiveTab("year")}
          >
            <Text style={[styles.periodTabText, activeTab === "year" && styles.activePeriodTabText]}>Ano</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateRange}>
          <Text style={styles.dateRangeText}>27/10/2024 - 2/11/2024</Text>
        </View>

        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.5,
              propsForLabels: {
                fontSize: 10,
              },
            }}
            style={styles.chart}
            showBarTops={false}
            fromZero
            withInnerLines={false}
            showValuesOnTopOfBars={false}
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Consumo pela manhã</Text>
            <Text style={styles.statValue}>1.3L</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Consumo pela tarde</Text>
            <Text style={styles.statValue}>14h</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Consumo pela noite</Text>
            <Text style={styles.statValue}>1.2L</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Consumo Total</Text>
            <Text style={styles.statValue}>65%</Text>
          </View>
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 25,
    marginBottom: 15,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  activePeriodTab: {
    backgroundColor: "#2196F3",
    borderRadius: 25,
  },
  periodTabText: {
    color: "#666",
    fontWeight: "500",
  },
  activePeriodTabText: {
    color: "white",
  },
  dateRange: {
    alignItems: "center",
    marginBottom: 20,
  },
  dateRangeText: {
    color: "#666",
    fontSize: 12,
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    flex: 1,
    paddingRight: 10,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "bold",
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

