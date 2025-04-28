import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Animated, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useRef, useEffect } from "react"
import React from "react"


type HistoryItem = {
  id: number
  amount: number
  date: string
  time: string
}

export default function HomeScreen() {

  const [modalVisible, setModalVisible] = useState(false)


  const lista = {
    '100 ml': 0.1,
    '200 ml': 0.2,
    '300 ml': 0.3,
    '400 ml': 0.4,
    '500 ml': 0.5,
    '1 Litro': 1,
  }


  const [selectorExpanded, setSelectorExpanded] = useState(false)


  const [selectedAmount, setSelectedAmount] = useState("200 ml")


  const [totalWaterConsumed, setTotalWaterConsumed] = useState(1.3)


  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    { id: 1, amount: 450, date: "23/03/2025", time: "16:20" },
    { id: 2, amount: 450, date: "23/03/2025", time: "16:20" },
    { id: 3, amount: 450, date: "23/03/2025", time: "16:20" },
    { id: 4, amount: 450, date: "23/03/2025", time: "16:20" },
  ])

 
  const historyScrollRef = useRef<ScrollView>(null)


  const expandAnimation = useRef(new Animated.Value(0)).current

 
  const toggleSelector = () => {
    const newValue = !selectorExpanded
    setSelectorExpanded(newValue)

    Animated.timing(expandAnimation, {
      toValue: newValue ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

 
  const selectAmount = (amount: string) => {
    setSelectedAmount(amount)
    toggleSelector()
  }

 
  const getCurrentDate = (): string => {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, "0")
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const year = now.getFullYear()

    return `${day}/${month}/${year}`
  }

 
  const getCurrentTime = (): string => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")

    return `${hours}:${minutes}`
  }


  const addWaterConsumption = () => {
   
    const amountValue = lista[selectedAmount as keyof typeof lista]
    
    
    const amountInMl = amountValue * 1000

    if (amountValue > 0) {
      const newItem: HistoryItem = {
        id: Date.now(), 
        amount: amountInMl,
        date: getCurrentDate(),
        time: getCurrentTime(),
      }

 
      const updatedHistory = [newItem, ...historyItems]
      setHistoryItems(updatedHistory)


      const newTotal = Number((totalWaterConsumed + amountValue).toPrecision(2))
      setTotalWaterConsumed(newTotal)


      console.log(newTotal.toPrecision(2) + ' Litros')


      setModalVisible(false)


      setSelectorExpanded(false)
    }
  }

  useEffect(() => {
    if (historyScrollRef.current) {
      setTimeout(() => {
        historyScrollRef.current?.scrollTo({ y: 0, animated: true })
      }, 300)
    }
  }, [historyItems.length])

  const progressPercentage = Math.min((totalWaterConsumed / 2.5) * 100, 100)

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
              <Text style={styles.waterAmount}>{totalWaterConsumed} Litros</Text>
              <Text style={styles.waterLabel}>Consumidos</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
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
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
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

          <ScrollView
            ref={historyScrollRef}
            style={styles.historyList}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
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
          </ScrollView>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
          setSelectorExpanded(false)
        }}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPress={() => {
            setModalVisible(false)
            setSelectorExpanded(false)
          }}
        >
          <TouchableOpacity style={styles.modalView} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Consumo</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false)
                  setSelectorExpanded(false)
                }}
              >
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            <View style={styles.selectorContainer}>
              <TouchableOpacity style={styles.amountSelector} onPress={toggleSelector}>
                <Ionicons name="water-outline" size={20} color="#2196F3" style={styles.selectorIcon} />
                <Text style={styles.selectorText}>{selectedAmount}</Text>
                <Ionicons name={selectorExpanded ? "chevron-up" : "chevron-down"} size={20} color="#2196F3" />
              </TouchableOpacity>

              {selectorExpanded && (
                <View style={styles.optionsContainer}>
                  <ScrollView style={styles.optionsScroll} nestedScrollEnabled={true}>
                    {Object.keys(lista).map((key, index) => (
                      <Pressable
                        key={index}
                        style={[styles.optionItem, selectedAmount === key && styles.selectedOption]}
                        onPress={() => selectAmount(key)}
                      >
                        <Ionicons
                          name="water"
                          size={16}
                          color={selectedAmount === key ? "white" : "#2196F3"}
                          style={styles.optionIcon}
                        />
                        <Text style={[styles.optionText, selectedAmount === key && styles.selectedOptionText]}>
                          {key}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.addConsumptionButton} onPress={addWaterConsumption}>
              <Text style={styles.addConsumptionButtonText}>Adicionar</Text>
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    overflow: "hidden",
  },
  progressFill: {
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
    marginBottom: 20,
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
  historyList: {
    maxHeight: 400,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  selectorContainer: {
    width: "100%",
    marginBottom: 20,
    zIndex: 1000,
  },
  amountSelector: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E3F2FD",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  selectorIcon: {
    marginRight: 10,
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    color: "#2196F3",
  },
  optionsContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#E3F2FD",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  optionsScroll: {
    width: "100%",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E3F2FD",
  },
  selectedOption: {
    backgroundColor: "#2196F3",
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#2196F3",
  },
  selectedOptionText: {
    color: "white",
  },
  addConsumptionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
  },
  addConsumptionButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
  },
})