import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native"
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"
import { BarChart } from "react-native-chart-kit"

export default function HomeScreen() {
  const screenWidth = Dimensions.get("window").width - 40
  const [litros, setLitros] = useState(1.3)
  const totalDots = 30 

  const chartData = {
    labels: ["", "", "", "", "", "", ""],
    datasets: [
      {
        data: [0.2, 0.3, 0.4, 0.3, 0.2, 0.5, 0.6],
      },
    ],
  }

  const addLitro = () => {
    setLitros((prev) => parseFloat((prev + 0.1).toFixed(1)))
  }

  const removeLitro = () => {
    setLitros((prev) => Math.max(0, parseFloat((prev - 0.1).toFixed(1))))
  }

  const renderArcoDePontos = () => {
    const raio = 100
    const preenchidos = Math.round((litros / 2) * totalDots)

    return (
      <View style={{ width: raio * 2, height: raio + 20, alignItems: "center" }}>
        {Array.from({ length: totalDots }).map((_, i) => {
          const angulo = Math.PI - (Math.PI * i) / (totalDots - 1) // esquerda → direita
          const x = raio + raio * Math.cos(angulo)
          const y = raio - raio * Math.sin(angulo)
          const cor = i < preenchidos ? "#2196F3" : "#e0e0e0"

          return (
            <Text
              key={i}
              style={{
                position: "absolute",
                left: x - 6,
                top: y - 6,
                color: cor,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              !
            </Text>
          )
        })}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-Vindo,</Text>
        <Text style={styles.headerTitle}>Usuário!</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.waterProgressContainer}>
          <View style={styles.arcoContainer}>{renderArcoDePontos()}</View>

          <View style={styles.progressContent}>
            <Text style={styles.progressValue}>{litros}</Text>
            <Text style={styles.progressUnit}>Litros</Text>
          </View>

          <View style={styles.progressActions}>
            <TouchableOpacity onPress={removeLitro} style={styles.actionButton}>
              <Ionicons name="remove" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.progressGoal}>Sua Meta é de: 2 Litros</Text>
            <TouchableOpacity onPress={addLitro} style={styles.actionButton}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.waterInfoContainer}>
            <View style={styles.waterInfoItem}>
              <Text style={styles.waterInfoLabel}>Seu Copo</Text>
              <View style={styles.cupIcon}>
                <FontAwesome5 name="glass-whiskey" size={24} color="#2196F3" />
              </View>
            </View>
            <View style={styles.waterInfoItem}>
              <Text style={styles.waterInfoLabel}>Hoje</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <BarChart
              data={chartData}
              width={screenWidth}
              height={180}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                labelColor: () => "transparent",
              }}
              style={styles.chart}
              showBarTops={false}
              fromZero
              withInnerLines={false}
              showValuesOnTopOfBars={false}
            />
            <Text style={styles.chartLabel}>Hoje</Text>
          </View>
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
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  waterProgressContainer: {
    padding: 20,
    alignItems: "center",
  },
  arcoContainer: {
    position: "relative",
    marginBottom: 20,
  },
  progressContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2196F3",
  },
  progressUnit: {
    fontSize: 14,
    color: "#2196F3",
  },
  progressActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: "#2196F3",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  progressGoal: {
    marginHorizontal: 10,
    fontSize: 12,
  },
  waterInfoContainer: {
    flexDirection: "row",
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
  waterInfoItem: {
    flex: 1,
    alignItems: "center",
  },
  waterInfoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  cupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
})
