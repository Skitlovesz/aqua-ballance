
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Animated, Pressable, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useRef, useEffect } from "react"
import React from "react"

// Definir o tipo para os itens do histórico
type HistoryItem = {
  id: number
  amount: number
  date: string
  time: string
}

export default function HomeScreen() {
  // Estado para controlar a visibilidade do modal de adicionar água
  const [modalVisible, setModalVisible] = useState(false)
  // Estado para o modo do modal (adicionar ou editar)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  // Estado para armazenar o item sendo editado
  const [editingItem, setEditingItem] = useState<HistoryItem | null>(null)
  // Estado para controlar a visibilidade do modal de parabéns
  const [congratsModalVisible, setCongratsModalVisible] = useState(false)
  // Estado para controlar se a meta já foi celebrada (para evitar mostrar o modal várias vezes)
  const [goalCelebrated, setGoalCelebrated] = useState(false)
  // Lista de opções de água com seus respectivos valores em litros
  const lista = {
    '100 ml': 0.1,
    '200 ml': 0.2,
    '300 ml': 0.3,
    '400 ml': 0.4,
    '500 ml': 0.5,
    '1 Litro': 1,
  }
  // Estado para controlar se o seletor está expandido
  const [selectorExpanded, setSelectorExpanded] = useState(false)
  // Estado para a quantidade selecionada
  const [selectedAmount, setSelectedAmount] = useState("200 ml")
  // Estado para o valor personalizado em ml
  const [customValue, setCustomValue] = useState('')
  // Estado para controlar se estamos usando um valor personalizado
  const [isCustomValueSelected, setIsCustomValueSelected] = useState(false)
  // Estado para o total de água consumida
  const [totalWaterConsumed, setTotalWaterConsumed] = useState(0)
  // Estado para os itens do histórico
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  // Referência para o ScrollView do histórico
  const historyScrollRef = useRef<ScrollView>(null)
  // Animação para a expansão do seletor
  const expandAnimation = useRef(new Animated.Value(0)).current
  // Função para resetar o consumo de água e o estado de celebração
  const resetWaterConsumed = () => {
    // Limpar o histórico completamente
    setHistoryItems([])
    // Zerar o total de água consumida
    setTotalWaterConsumed(0)
    // Resetar o estado de celebração
    setGoalCelebrated(false)
  }
  // Função para abrir o modal de adicionar água
  const openAddWaterModal = () => {
    setModalMode('add')
    setModalVisible(true)
    setSelectorExpanded(false)
    setEditingItem(null)
    setIsCustomValueSelected(false)
    setCustomValue('')
  }
  
  // Função para abrir o modal de editar água
  const openEditWaterModal = (item: HistoryItem) => {
    // Converter de ml para o formato da lista
    const amountInLiters = item.amount / 1000
    
    // Verificar se o valor existe na lista de valores predefinidos
    let foundInList = false
    for (const [key, value] of Object.entries(lista)) {
      if (value === amountInLiters) {
        setSelectedAmount(key)
        foundInList = true
        break
      }
    }
    
    // Se não encontrou na lista, é um valor personalizado
    if (!foundInList) {
      setIsCustomValueSelected(true)
      setCustomValue(item.amount.toString())
    } else {
      setIsCustomValueSelected(false)
    }
    
    setModalMode('edit')
    setEditingItem(item)
    setModalVisible(true)
    setSelectorExpanded(false)
  }

  // Função para alternar a expansão do seletor
  const toggleSelector = () => {
    const newValue = !selectorExpanded
    setSelectorExpanded(newValue)

    Animated.timing(expandAnimation, {
      toValue: newValue ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  // Função para selecionar uma quantidade
  const selectAmount = (amount: string) => {
    setSelectedAmount(amount)
    setIsCustomValueSelected(false)
    toggleSelector()
  }
  
  // Função para selecionar a opção personalizada
  const selectCustomAmount = () => {
    setIsCustomValueSelected(true)
    toggleSelector()
  }

  // Função para formatar a data atual
  const getCurrentDate = (): string => {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, "0")
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const year = now.getFullYear()

    return `${day}/${month}/${year}`
  }

  // Função para formatar a hora atual
  const getCurrentTime = (): string => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")

    return `${hours}:${minutes}`
  }

  // Função para calcular o total de água consumida com base no histórico
  const calculateTotalWaterConsumed = (items: HistoryItem[]): number => {
    // Somamos todos os valores em ml e convertemos para litros
    const totalInML = items.reduce((sum, item) => sum + item.amount, 0)
    // Convertemos para litros e limitamos a 2 casas decimais
    return parseFloat((totalInML / 1000).toFixed(2))
  }

  // Função para adicionar ou editar consumo de água
  const handleWaterConsumption = () => {
    let amountInMl: number = 0;
    
    // Verificar se estamos usando um valor personalizado ou um valor da lista
    if (isCustomValueSelected) {
      // Converter o valor personalizado para número
      const parsedValue = parseInt(customValue)
      
      // Verificar se o valor é válido
      if (isNaN(parsedValue) || parsedValue <= 0) {
        alert('Por favor, insira um valor válido maior que zero.')
        return
      }
      
      amountInMl = parsedValue
    } else {
      // Obter o valor em litros da opção selecionada e converter para ml
      const amountValue = lista[selectedAmount as keyof typeof lista]
      amountInMl = amountValue * 1000
    }

    if (amountInMl > 0) {
      let updatedHistory: HistoryItem[]

      if (modalMode === 'add') {
        // Criar um novo item para o histórico
        const newItem: HistoryItem = {
          id: Date.now(), // Usar timestamp como ID único
          amount: amountInMl,
          date: getCurrentDate(),
          time: getCurrentTime(),
        }

        // Adicionar o novo item ao início do histórico
        updatedHistory = [newItem, ...historyItems]
      } else {
        // Modo de edição - atualizamos o item existente
        if (!editingItem) return // Segurança para não executar se não houver item para editar
        
        // Encontrar o índice do item sendo editado
        const editIndex = historyItems.findIndex(item => item.id === editingItem.id)
        if (editIndex === -1) return // Item não encontrado
        
        // Criar cópia do array e atualizar o item específico
        updatedHistory = [...historyItems]
        updatedHistory[editIndex] = {
          ...updatedHistory[editIndex],
          amount: amountInMl,
          // Manter data e hora originais
        }
      }

      // Atualizar o histórico
      setHistoryItems(updatedHistory)
      
      // Recalcular o total de água consumida
      const newTotal = calculateTotalWaterConsumed(updatedHistory)
      setTotalWaterConsumed(newTotal)

      // Mostrar no console o novo total
      console.log(newTotal + ' Litros')
      
      // Verificar se a meta foi atingida (2.5 litros) e ainda não foi celebrada
      if (newTotal >= 2.5 && !goalCelebrated) {
        // Fechar o modal de adição primeiro
        setModalVisible(false)
        // Resetar o estado do seletor
        setSelectorExpanded(false)
        // Mostrar o modal de parabéns após um breve atraso
        setTimeout(() => {
          setCongratsModalVisible(true)
          setGoalCelebrated(true)
        }, 500)
      } else {
        // Fechar o modal após adicionar
        setModalVisible(false)
        // Resetar o estado do seletor
        setSelectorExpanded(false)
      }
    }
  }

  // Efeito para rolar para o topo do histórico quando um novo item é adicionado
  useEffect(() => {
    if (historyScrollRef.current && modalMode === 'add') {
      setTimeout(() => {
        historyScrollRef.current?.scrollTo({ y: 0, animated: true })
      }, 300)
    }
  }, [historyItems.length])

  // Calcular a porcentagem de progresso (baseado na meta de 2.5 litros)
  const progressPercentage = Math.min((totalWaterConsumed / 2.5) * 100, 100)

  // Função para lidar com o clique no botão "Continuar" do modal de parabéns
  const handleContinueAfterCongrats = () => {
    // Fechar o modal de parabéns
    setCongratsModalVisible(false)
    // Resetar completamente - limpar histórico e zerar contador
    resetWaterConsumed()
  }

  // Função para excluir um item do histórico
  const deleteHistoryItem = (id: number) => {
    const updatedHistory = historyItems.filter(item => item.id !== id)
    setHistoryItems(updatedHistory)
    // Recalcular o total
    const newTotal = calculateTotalWaterConsumed(updatedHistory)
    setTotalWaterConsumed(newTotal)
  }

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
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.resetButton} onPress={resetWaterConsumed}>
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.resetButtonText}>Reiniciar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={openAddWaterModal}>
                <Ionicons name="add" size={24} color="white" style={styles.addIcon} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
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
            {historyItems.length > 0 ? (
              historyItems.map((item) => (
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

                  <TouchableOpacity 
                    style={styles.waterActionButton}
                    onPress={() => openEditWaterModal(item)}
                  >
                    <Ionicons name="pencil" size={20} color="#2196F3" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.emptyHistoryText}>Nenhum registro encontrado</Text>
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Modal para adicionar ou editar consumo de água */}
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
              <Text style={styles.modalTitle}>
                {modalMode === 'add' ? 'Adicionar Consumo' : 'Editar Consumo'}
              </Text>
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

            {/* Seletor de quantidade com dropdown */}
            <View style={styles.selectorContainer}>
              <TouchableOpacity 
                style={[styles.amountSelector, isCustomValueSelected && styles.customAmountSelector]} 
                onPress={toggleSelector}
              >
                <Ionicons name="water-outline" size={20} color="#2196F3" style={styles.selectorIcon} />
                {isCustomValueSelected ? (
                  <Text style={styles.selectorText}>Personalizado</Text>
                ) : (
                  <Text style={styles.selectorText}>{selectedAmount}</Text>
                )}
                <Ionicons name={selectorExpanded ? "chevron-up" : "chevron-down"} size={20} color="#2196F3" />
              </TouchableOpacity>

              {/* Campo para valor personalizado */}
              {isCustomValueSelected && (
                <View style={styles.customInputContainer}>
                  <TextInput
                    style={styles.customInput}
                    placeholder="Digite o valor em ml"
                    keyboardType="numeric"
                    value={customValue}
                    onChangeText={setCustomValue}
                  />
                  <Text style={styles.customInputUnit}>ml</Text>
                </View>
              )}

              {/* Opções do seletor usando Object.keys */}
              {selectorExpanded && (
                <View style={styles.optionsContainer}>
                  <ScrollView style={styles.optionsScroll} nestedScrollEnabled={true}>
                    {Object.keys(lista).map((key, index) => (
                      <Pressable
                        key={index}
                        style={[styles.optionItem, selectedAmount === key && !isCustomValueSelected && styles.selectedOption]}
                        onPress={() => selectAmount(key)}
                      >
                        <Ionicons
                          name="water"
                          size={16}
                          color={selectedAmount === key && !isCustomValueSelected ? "white" : "#2196F3"}
                          style={styles.optionIcon}
                        />
                        <Text style={[styles.optionText, selectedAmount === key && !isCustomValueSelected && styles.selectedOptionText]}>
                          {key}
                        </Text>
                      </Pressable>
                    ))}
                    
                    {/* Opção para valor personalizado */}
                    <Pressable
                      style={[styles.optionItem, isCustomValueSelected && styles.selectedOption]}
                      onPress={selectCustomAmount}
                    >
                      <Ionicons
                        name="create-outline"
                        size={16}
                        color={isCustomValueSelected ? "white" : "#2196F3"}
                        style={styles.optionIcon}
                      />
                      <Text style={[styles.optionText, isCustomValueSelected && styles.selectedOptionText]}>
                        Personalizado
                      </Text>
                    </Pressable>
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Botão de adicionar ou editar */}
            <TouchableOpacity style={styles.addConsumptionButton} onPress={handleWaterConsumption}>
              <Text style={styles.addConsumptionButtonText}>
                {modalMode === 'add' ? 'Adicionar' : 'Alterar'}
              </Text>
              <Ionicons name={modalMode === 'add' ? "add" : "checkmark"} size={20} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal de parabéns quando atingir a meta */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={congratsModalVisible}
        onRequestClose={() => setCongratsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.congratsModalView}>
            <View style={styles.congratsIconContainer}>
              <Ionicons name="trophy" size={50} color="#FFD700" />
            </View>
            <Text style={styles.congratsTitle}>Parabéns!</Text>
            <Text style={styles.congratsMessage}>Você concluiu sua META!</Text>
            <Text style={styles.congratsSubtitle}>2.5 Litros de água consumidos</Text>
            <TouchableOpacity
              style={styles.congratsButton}
              onPress={handleContinueAfterCongrats}
            >
              <Text style={styles.congratsButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#FF5252",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  resetButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 3,
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
  waterActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
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
  emptyHistoryText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
  // Estilos para o modal
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
  customAmountSelector: {
    backgroundColor: "#E8F5E9", // Cor diferente para indicar que é um valor personalizado
  },
  selectorIcon: {
    marginRight: 10,
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    color: "#2196F3",
  },
  // Estilos para o campo de entrada personalizado
  customInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2196F3",
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  customInput: {
    flex: 1,
    height: 45,
    paddingVertical: 8,
    paddingHorizontal: 5,
    fontSize: 16,
    color: "#2196F3",
  },
  customInputUnit: {
    fontSize: 16,
    color: "#2196F3",
    marginLeft: 5,
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
      // Estilos para o modal de parabéns
      congratsModalView: {
        width: "85%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
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
      congratsIconContainer: {
        backgroundColor: "#E3F2FD",
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
      },
      congratsTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2196F3",
        marginBottom: 10,
      },
      congratsMessage: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        textAlign: "center",
      },
      congratsSubtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
        textAlign: "center",
      },
      congratsButton: {
        backgroundColor: "#2196F3",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 30,
        elevation: 2,
      },
      congratsButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
      },
    })