import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BarChart } from "react-native-chart-kit"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"
import React from "react"

type DailyConsumption = {
  morning: number
  afternoon: number
  evening: number
  total: number
}

type ConsumptionHistory = {
  [date: string]: DailyConsumption
}

type HistoryItem = {
  id: number
  amount: number
  date: string
  time: string
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

  const screenWidth = Dimensions.get("window").width - 40

  useFocusEffect(
    React.useCallback(() => {
      console.log("HistoryScreen recebeu foco - carregando dados")
      loadHistoryItems()
      return () => {}
    }, []),
  )

  useEffect(() => {
    updateStats()
    updateDateRange()
  }, [consumptionData, activeTab])

  const convertDateFormat = (dateStr: string): string => {
    const dateParts = dateStr.split("/")
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
  }

  const getTodayISOString = (): string => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const loadHistoryItems = async () => {
    try {
      const historyItemsJson = await AsyncStorage.getItem("historyItems")
      console.log("Dados carregados do AsyncStorage:", historyItemsJson)

      if (historyItemsJson) {
        const historyItems: HistoryItem[] = JSON.parse(historyItemsJson)
        console.log(`Encontrados ${historyItems.length} itens no histórico`)

        const consumptionByDate: ConsumptionHistory = {}

        historyItems.forEach((item) => {
          const dateKey = convertDateFormat(item.date)
          console.log(`Processando item: ${item.amount}ml em ${dateKey} às ${item.time}`)

          if (!consumptionByDate[dateKey]) {
            consumptionByDate[dateKey] = {
              morning: 0,
              afternoon: 0,
              evening: 0,
              total: 0,
            }
          }

          const timeParts = item.time.split(":")
          const hour = Number.parseInt(timeParts[0])
          const amountInLiters = Number.parseFloat((item.amount / 1000).toFixed(2))

          if (hour >= 0 && hour < 12) {
            consumptionByDate[dateKey].morning += amountInLiters
          } else if (hour >= 12 && hour < 18) {
            consumptionByDate[dateKey].afternoon += amountInLiters
          } else {
            consumptionByDate[dateKey].evening += amountInLiters
          }

          consumptionByDate[dateKey].total += amountInLiters
        })

        console.log("Dados processados:", JSON.stringify(consumptionByDate))
        setConsumptionData(consumptionByDate)
      } else {
        console.log("Nenhum dado de histórico encontrado no AsyncStorage")
        setConsumptionData({})
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error)
    }
  }

  const updateStats = () => {
    const now = new Date()
    let stats = { morning: 0, afternoon: 0, evening: 0, total: 0 }

    if (activeTab === "day") {
      const today = getTodayISOString()
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
      const today = getTodayISOString()
      if (consumptionData[today]) {
        data = [
          Number.parseFloat(consumptionData[today].morning.toFixed(2)),
          Number.parseFloat(consumptionData[today].afternoon.toFixed(2)),
          Number.parseFloat(consumptionData[today].evening.toFixed(2))
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

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        const dateStr = `${year}-${month}-${day}`

        days.push(dateStr)
        const dayOfWeek = date.getDay()
        dayLabels.push(getDayOfWeekName(dayOfWeek))
      }

      labels = dayLabels

      data = days.map((day) => {
        return consumptionData[day] ? Number.parseFloat(consumptionData[day].total.toFixed(2)) : 0
      })
    } else if (activeTab === "month") {
      labels = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"]
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      const weeks = []

      for (let i = 0; i < 5; i++) {
        const weekStart = new Date(firstDay)
        weekStart.setDate(1 + i * 7)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)

        if (weekStart.getMonth() !== now.getMonth()) continue

        let weekTotal = 0
        for (let j = 0; j < 7; j++) {
          const day = new Date(weekStart)
          day.setDate(weekStart.getDate() + j)

          const year = day.getFullYear()
          const month = String(day.getMonth() + 1).padStart(2, "0")
          const dayOfMonth = String(day.getDate()).padStart(2, "0")
          const dayStr = `${year}-${month}-${dayOfMonth}`

          if (day.getMonth() === now.getMonth() && consumptionData[dayStr]) {
            weekTotal += consumptionData[dayStr].total
          }
        }

        weeks.push(Number.parseFloat(weekTotal.toFixed(2)))
      }

      data = weeks
    } else if (activeTab === "year") {
      labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
      const months = Array(12).fill(0)

      Object.entries(consumptionData).forEach(([dateStr, day]) => {
        const dayDate = new Date(dateStr)
        if (dayDate.getFullYear() === now.getFullYear()) {
          months[dayDate.getMonth()] += day.total
        }
      })

      data = months.map((val) => Number.parseFloat(val.toFixed(2)))
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
          <BarChart
            data={getChartData()}
            width={screenWidth}
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
            style={styles.chart}
            showBarTops={false}
            fromZero
            withInnerLines={false}
            showValuesOnTopOfBars={true}
          />
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