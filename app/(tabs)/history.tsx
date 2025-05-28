import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BarChart } from "react-native-chart-kit"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"
import React from "react"
import { auth, db } from "../../firebaseConfig"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"

type DailyConsumption = {
  morning: number
  afternoon: number
  evening: number
  total: number
}

type ConsumptionHistory = {
  [date: string]: DailyConsumption
}

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState("day")
  const [consumptionData, setConsumptionData] = useState<ConsumptionHistory>({})
  const [currentStats, setCurrentStats] = useState({
    morning: 0,
    afternoon: 0,
    evening: 0,
    total: 0,
  })
  const [dateRange, setDateRange] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  const screenWidth = Dimensions.get("window").width - 40

  useFocusEffect(
    React.useCallback(() => {
      console.log("HistoryScreen recebeu foco - carregando dados")
      loadHistoryData()
      return () => {}
    }, []),
  )

  useEffect(() => {
    updateStats()
    updateDateRange()
  }, [consumptionData, activeTab])

  const loadHistoryData = async () => {
    setIsLoading(true)
    try {
      const user = auth.currentUser
      if (!user) {
        console.log("Usuário não autenticado")
        setIsLoading(false)
        return
      }

      // Carregar dados do Firestore
      const historyCollectionRef = collection(db, "users", user.uid, "history")
      const historyDocs = await getDocs(historyCollectionRef)

      const consumptionByDate: ConsumptionHistory = {}

      historyDocs.forEach((doc) => {
        const data = doc.data()
        const items = data.items || []

        items.forEach((item: any) => {
          if (item.hidden) return

          const dateKey = item.date.split("/").reverse().join("-") // Converter DD/MM/YYYY para YYYY-MM-DD
          const hour = parseInt(item.time.split(":")[0])
          const amountInLiters = item.amount / 1000 // Converter ml para litros

          if (!consumptionByDate[dateKey]) {
            consumptionByDate[dateKey] = {
              morning: 0,
              afternoon: 0,
              evening: 0,
              total: 0,
            }
          }

          // Classificar por período do dia
          if (hour >= 0 && hour < 12) {
            consumptionByDate[dateKey].morning += amountInLiters
          } else if (hour >= 12 && hour < 18) {
            consumptionByDate[dateKey].afternoon += amountInLiters
          } else {
            consumptionByDate[dateKey].evening += amountInLiters
          }

          consumptionByDate[dateKey].total += amountInLiters
        })
      })

      setConsumptionData(consumptionByDate)
      setIsOnline(true)
    } catch (error) {
      console.error("Erro ao carregar dados do histórico:", error)
      setIsOnline(false)
      // Em caso de erro, tentar carregar do AsyncStorage
      const localData = await loadHistoryFromAsyncStorage()
      if (localData) {
        setConsumptionData(localData)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loadHistoryFromAsyncStorage = async (): Promise<ConsumptionHistory | null> => {
    try {
      const historyItemsJson = await AsyncStorage.getItem("historyItems")
      if (!historyItemsJson) return null

      const historyItems = JSON.parse(historyItemsJson)
      const consumptionByDate: ConsumptionHistory = {}

      historyItems.forEach((item: any) => {
        if (item.hidden) return

        const dateKey = item.date.split("/").reverse().join("-")
        const hour = parseInt(item.time.split(":")[0])
        const amountInLiters = item.amount / 1000

        if (!consumptionByDate[dateKey]) {
          consumptionByDate[dateKey] = {
            morning: 0,
            afternoon: 0,
            evening: 0,
            total: 0,
          }
        }

        if (hour >= 0 && hour < 12) {
          consumptionByDate[dateKey].morning += amountInLiters
        } else if (hour >= 12 && hour < 18) {
          consumptionByDate[dateKey].afternoon += amountInLiters
        } else {
          consumptionByDate[dateKey].evening += amountInLiters
        }

        consumptionByDate[dateKey].total += amountInLiters
      })

      return consumptionByDate
    } catch (error) {
      console.error("Erro ao carregar histórico do AsyncStorage:", error)
      return null
    }
  }

  const updateStats = () => {
    const now = new Date()
    let stats = { morning: 0, afternoon: 0, evening: 0, total: 0 }

    if (activeTab === "day") {
      const today = now.toISOString().split("T")[0]
      if (consumptionData[today]) {
        stats = { ...consumptionData[today] }
      }
    } else if (activeTab === "week") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      Object.entries(consumptionData).forEach(([dateStr, day]) => {
        const dayDate = new Date(dateStr)
        if (dayDate >= oneWeekAgo && dayDate <= now) {
          stats.morning += day.morning
          stats.afternoon += day.afternoon
          stats.evening += day.evening
          stats.total += day.total
        }
      })
    } else if (activeTab === "month") {
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      Object.entries(consumptionData).forEach(([dateStr, day]) => {
        const dayDate = new Date(dateStr)
        if (dayDate.getMonth() === currentMonth && dayDate.getFullYear() === currentYear) {
          stats.morning += day.morning
          stats.afternoon += day.afternoon
          stats.evening += day.evening
          stats.total += day.total
        }
      })
    } else if (activeTab === "year") {
      const currentYear = now.getFullYear()

      Object.entries(consumptionData).forEach(([dateStr, day]) => {
        const dayDate = new Date(dateStr)
        if (dayDate.getFullYear() === currentYear) {
          stats.morning += day.morning
          stats.afternoon += day.afternoon
          stats.evening += day.evening
          stats.total += day.total
        }
      })
    }

    stats.morning = Number.parseFloat(stats.morning.toFixed(2))
    stats.afternoon = Number.parseFloat(stats.afternoon.toFixed(2))
    stats.evening = Number.parseFloat(stats.evening.toFixed(2))
    stats.total = Number.parseFloat(stats.total.toFixed(2))

    setCurrentStats(stats)
  }

  const updateDateRange = () => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" }

    if (activeTab === "day") {
      setDateRange(now.toLocaleDateString("pt-BR", options))
    } else if (activeTab === "week") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      setDateRange(`${oneWeekAgo.toLocaleDateString("pt-BR", options)} - ${now.toLocaleDateString("pt-BR", options)}`)
    } else if (activeTab === "month") {
      const monthOptions: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" }
      setDateRange(now.toLocaleDateString("pt-BR", monthOptions))
    } else if (activeTab === "year") {
      setDateRange(now.getFullYear().toString())
    }
  }

  const getDayOfWeekName = (dayIndex: number): string => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    return days[dayIndex]
  }

  const getChartData = () => {
    const now = new Date()
    let labels: string[] = []
    let data: number[] = []

    if (activeTab === "day") {
      labels = ["Manhã", "Tarde", "Noite"]
      const today = now.toISOString().split("T")[0]
      if (consumptionData[today]) {
        data = [
          Number(consumptionData[today].morning.toFixed(2)),
          Number(consumptionData[today].afternoon.toFixed(2)),
          Number(consumptionData[today].evening.toFixed(2)),
        ]
      } else {
        data = [0, 0, 0]
      }
    } else if (activeTab === "week") {
      const days = []
      const dayLabels = []

      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]
        days.push(dateStr)
        dayLabels.push(getDayOfWeekName(date.getDay()))
      }

      labels = dayLabels
      data = days.map((day) => (consumptionData[day] ? Number(consumptionData[day].total.toFixed(2)) : 0))
    } else if (activeTab === "month") {
      labels = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"]
      const weeks = Array(5).fill(0)
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)

      Object.entries(consumptionData).forEach(([dateStr, day]) => {
        const date = new Date(dateStr)
        if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
          const weekIndex = Math.floor((date.getDate() - 1) / 7)
          if (weekIndex < 5) {
            weeks[weekIndex] += day.total
          }
        }
      })

      data = weeks.map((val) => Number(val.toFixed(2)))
    } else if (activeTab === "year") {
      labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
      const months = Array(12).fill(0)

      Object.entries(consumptionData).forEach(([dateStr, day]) => {
        const date = new Date(dateStr)
        if (date.getFullYear() === now.getFullYear()) {
          months[date.getMonth()] += day.total
        }
      })

      data = months.map((val) => Number(val.toFixed(2)))
    }

    return {
      labels,
      datasets: [
        {
          data,
        },
      ],
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico</Text>
        {!isOnline && (
          <TouchableOpacity style={styles.syncButton} onPress={loadHistoryData}>
            <Ionicons name="sync" size={24} color="white" />
          </TouchableOpacity>
        )}
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
          <Text style={styles.dateRangeText}>{dateRange}</Text>
        </View>

        <View style={styles.chartContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando dados...</Text>
            </View>
          ) : (
            <BarChart
              data={getChartData()}
              // width={screenWidth}
              width={screenWidth - 60}
              height={220}
              yAxisLabel=""
              yAxisSuffix="L"
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 2,
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
              style={{ ...styles.chart, alignSelf: 'center' }}
              showBarTops={false}
              fromZero
              withInnerLines={false}
              showValuesOnTopOfBars={true}
            />
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Consumo pela manhã</Text>
            <Text style={styles.statValue}>{currentStats.morning.toFixed(2)}L</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Consumo pela tarde</Text>
            <Text style={styles.statValue}>{currentStats.afternoon.toFixed(2)}L</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Consumo pela noite</Text>
            <Text style={styles.statValue}>{currentStats.evening.toFixed(2)}L</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Consumo Total</Text>
            <Text style={styles.statValue}>{currentStats.total.toFixed(2)}L</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  syncButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
    minHeight: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 220,
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
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
})