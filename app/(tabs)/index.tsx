// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   Animated,
//   Pressable,
//   TextInput,
// } from "react-native"
// import { Ionicons } from "@expo/vector-icons"
// import { useState, useRef, useEffect } from "react"
// import { useRoute, type RouteProp, useNavigation } from "@react-navigation/native"
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
// import AsyncStorage from "@react-native-async-storage/async-storage"
// import React from "react"

// type HistoryItem = {
//   id: number
//   amount: number
//   date: string
//   time: string
//   hidden?: boolean // Nova propriedade para controlar visibilidade na tela principal
// }

// type RootStackParamList = {
//   Profile: undefined
//   MainTabs: { waterIntake?: number } | undefined
// }

// type UserData = {
//   weight: number
//   height: number
//   name: string
//   waterIntake: number
// }

// type MainTabsRouteProp = RouteProp<RootStackParamList, "MainTabs">
// type MainTabsNavigationProp = NativeStackNavigationProp<RootStackParamList, "MainTabs">

// export default function HomeScreen() {
//   // Navegação e rota
//   const route = useRoute<MainTabsRouteProp>()
//   const navigation = useNavigation<MainTabsNavigationProp>()

//   // Estado para os dados do usuário
//   const [userData, setUserData] = useState<UserData>({
//     weight: 0,
//     height: 0,
//     name: "Usuário",
//     waterIntake: 0,
//   })

//   // Recuperar o consumo diário recomendado dos parâmetros da rota ou estado (em ml)
//   const [recommendedWaterIntake, setRecommendedWaterIntake] = useState(0)

//   // Converter para litros para exibição
//   const recommendedWaterIntakeLiters = recommendedWaterIntake / 1000

//   // Estado para controlar a visibilidade do modal de adicionar água
//   const [modalVisible, setModalVisible] = useState(false)
//   // Estado para o modo do modal (adicionar ou editar)
//   const [modalMode, setModalMode] = useState<"add" | "edit">("add")
//   // Estado para armazenar o item sendo editado
//   const [editingItem, setEditingItem] = useState<HistoryItem | null>(null)
//   // Estado para controlar a visibilidade do modal de parabéns
//   const [congratsModalVisible, setCongratsModalVisible] = useState(false)
//   // Estado para controlar se a meta já foi celebrada (para evitar mostrar o modal várias vezes)
//   const [goalCelebrated, setGoalCelebrated] = useState(false)
//   // Estado para controlar a visibilidade do modal de confirmação de exclusão
//   const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] = useState(false)
//   // Lista de opções de água com seus respectivos valores em litros
//   const lista = {
//     "100 ml": 0.1,
//     "200 ml": 0.2,
//     "300 ml": 0.3,
//     "400 ml": 0.4,
//     "500 ml": 0.5,
//     "1 Litro": 1,
//   }

//   // Estados para confirmação de exclusão
//   const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false)
//   const [itemToDelete, setItemToDelete] = useState<HistoryItem | null>(null)
//   const [selectorExpanded, setSelectorExpanded] = useState(false)
//   const [selectedAmount, setSelectedAmount] = useState("200 ml")
//   // valor personalizado em ml
//   const [customValue, setCustomValue] = useState("")
//   // controlar se esta usando um valor personalizado
//   const [isCustomValueSelected, setIsCustomValueSelected] = useState(false)
//   // total de água consumida
//   const [totalWaterConsumed, setTotalWaterConsumed] = useState(0)
//   // itens do histórico
//   const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
//   // Referência para o ScrollView do histórico
//   const historyScrollRef = useRef<ScrollView>(null)
//   // Animação para a expansão do seletor
//   const expandAnimation = useRef(new Animated.Value(0)).current
//   // Timestamp do último reinício
//   const [lastResetTimestamp, setLastResetTimestamp] = useState<number>(0)

//   // Função para calcular o consumo diário de água com base no peso e altura
//   const calculateWaterIntake = (weight: number, height: number): number => {
//     if (weight <= 0 || height <= 0) return 0

//     // Fórmula para calcular o consumo diário:
//     // Peso (kg) * 35 + Altura (cm) * 0.2 = ml por dia
//     const waterIntakeInML = Math.round(weight * 35 + height * 0.2)

//     return waterIntakeInML
//   }

//   // Função para salvar os dados do usuário
//   const saveUserData = async (data: UserData) => {
//     try {
//       await AsyncStorage.setItem("userData", JSON.stringify(data))
//       console.log("Dados do usuário salvos com sucesso")
//     } catch (error) {
//       console.error("Erro ao salvar dados do usuário:", error)
//     }
//   }

//   // Função para carregar os dados do usuário
//   const loadUserData = async () => {
//     try {
//       const jsonValue = await AsyncStorage.getItem("userData")
//       if (jsonValue !== null) {
//         const data = JSON.parse(jsonValue) as UserData
//         setUserData(data)

//         // Calcular o consumo diário com base nos dados carregados
//         const intake = calculateWaterIntake(data.weight, data.height)
//         setRecommendedWaterIntake(intake)
//         return data
//       }
//     } catch (error) {
//       console.error("Erro ao carregar dados do usuário:", error)
//     }
//     return null
//   }

//   // Carregar o timestamp do último reinício
//   const loadLastResetTimestamp = async () => {
//     try {
//       const timestamp = await AsyncStorage.getItem("lastResetTimestamp")
//       if (timestamp) {
//         setLastResetTimestamp(Number(timestamp))
//       }
//     } catch (error) {
//       console.error("Erro ao carregar timestamp do último reinício:", error)
//     }
//   }

//   // Efeito para carregar os dados do usuário e calcular a meta
//   useEffect(() => {
//     const initializeData = async () => {
//       await loadLastResetTimestamp()

//       if (route.params?.waterIntake) {
//         console.log("Received water intake from route params:", route.params.waterIntake)
//         setRecommendedWaterIntake(route.params.waterIntake)
//         const updatedUserData = { ...userData }
//         updatedUserData.waterIntake = route.params.waterIntake
//         setUserData(updatedUserData)

//         try {
//           await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData))
//           console.log("Updated user data saved with new water intake")
//         } catch (error) {
//           console.error("Error saving updated user data:", error)
//         }
//       } else {
//         try {
//           const data = await loadUserData()

//           if (!data || data.weight <= 0 || data.height <= 0) {
//             alert("Por favor, configure seu perfil para calcular sua meta de consumo de água diário.")
//             setTimeout(() => {
//               goToProfile()
//             }, 100)
//           } else if (data.waterIntake > 0) {
//             setRecommendedWaterIntake(data.waterIntake)
//           }
//         } catch (error) {
//           console.error("Error loading user data:", error)
//           alert("Erro ao carregar dados. Por favor, configure seu perfil.")
//           setTimeout(() => {
//             goToProfile()
//           }, 100)
//         }
//       }
//     }

//     initializeData()
//     loadHistoryItems()
//   }, [route.params])

//   // Carregar itens do histórico do AsyncStorage
//   const loadHistoryItems = async () => {
//     try {
//       const savedItems = await AsyncStorage.getItem("historyItems")
//       if (savedItems) {
//         const items = JSON.parse(savedItems) as HistoryItem[]
//         setHistoryItems(items)

//         // Recalcular o total de água consumida para o dia atual
//         // Apenas para itens adicionados após o último reinício
//         const today = getCurrentDate()
//         const visibleItems = items.filter((item) => item.date === today && !item.hidden && item.id > lastResetTimestamp)
//         const newTotal = calculateTotalWaterConsumed(visibleItems)
//         setTotalWaterConsumed(newTotal)
//       }
//     } catch (error) {
//       console.error("Erro ao carregar histórico:", error)
//     }
//   }

//   // Adicionar logs para depura��ão no método saveHistoryItems
//   const saveHistoryItems = async (items: HistoryItem[]) => {
//     try {
//       await AsyncStorage.setItem("historyItems", JSON.stringify(items))
//       console.log(`Salvos ${items.length} itens no histórico:`, JSON.stringify(items))
//     } catch (error) {
//       console.error("Erro ao salvar histórico:", error)
//     }
//   }

//   // Modificar a função resetWaterConsumed para marcar itens como ocultos
//   const resetWaterConsumed = async () => {
//     // Zerar o total de água consumida
//     setTotalWaterConsumed(0)
//     // Resetar o estado de celebração
//     setGoalCelebrated(false)

//     // Gerar um novo timestamp para o reinício
//     const resetTimestamp = Date.now()
//     setLastResetTimestamp(resetTimestamp)

//     // Salvar o timestamp no AsyncStorage
//     try {
//       await AsyncStorage.setItem("lastResetTimestamp", resetTimestamp.toString())
//       console.log("Timestamp de reinício salvo:", resetTimestamp)
//     } catch (error) {
//       console.error("Erro ao salvar timestamp de reinício:", error)
//     }

//     console.log("Contador de água consumida zerado (apenas para a tela principal)")
//   }

//   // Função para voltar à tela de perfil para recalcular a meta
//   const goToProfile = () => {
//     // Navegar para a tela de perfil para recalcular o consumo recomendado com base no peso e altura
//     navigation.navigate("Profile")
//   }
//   // Função para abrir o modal de adicionar água
//   const openAddWaterModal = () => {
//     setModalMode("add")
//     setModalVisible(true)
//     setSelectorExpanded(false)
//     setEditingItem(null)
//     setIsCustomValueSelected(false)
//     setCustomValue("")
//   }

//   // Função para abrir o modal de editar água
//   const openEditWaterModal = (item: HistoryItem) => {
//     // Converter de ml para o formato da lista
//     const amountInLiters = item.amount / 1000
//     // Verifica se o valor existe na lista de valores predefinidos
//     let foundInList = false
//     for (const [key, value] of Object.entries(lista)) {
//       if (value === amountInLiters) {
//         setSelectedAmount(key)
//         foundInList = true
//         break
//       }
//     }
//     // Se não encontrou na lista, é um valor personalizado
//     if (!foundInList) {
//       setIsCustomValueSelected(true)
//       setCustomValue(item.amount.toString())
//     } else {
//       setIsCustomValueSelected(false)
//     }

//     setModalMode("edit")
//     setEditingItem(item)
//     setModalVisible(true)
//     setSelectorExpanded(false)
//   }
//   // Função para alternar a expansão do seletor
//   const toggleSelector = () => {
//     const newValue = !selectorExpanded
//     setSelectorExpanded(newValue)

//     Animated.timing(expandAnimation, {
//       toValue: newValue ? 1 : 0,
//       duration: 300,
//       useNativeDriver: false,
//     }).start()
//   }
//   // Função para selecionar uma quantidade
//   const selectAmount = (amount: string) => {
//     setSelectedAmount(amount)
//     setIsCustomValueSelected(false)
//     toggleSelector()
//   }
//   // Função para selecionar a opção personalizada
//   const selectCustomAmount = () => {
//     setIsCustomValueSelected(true)
//     toggleSelector()
//   }
//   // Função para formatar a data atual
//   const getCurrentDate = (): string => {
//     const now = new Date()
//     const day = String(now.getDate()).padStart(2, "0")
//     const month = String(now.getMonth() + 1).padStart(2, "0")
//     const year = now.getFullYear()

//     return `${day}/${month}/${year}`
//   }

//   // Função para formatar a hora atual
//   const getCurrentTime = (): string => {
//     const now = new Date()
//     const hours = String(now.getHours()).padStart(2, "0")
//     const minutes = String(now.getMinutes()).padStart(2, "0")

//     return `${hours}:${minutes}`
//   }

//   // Função para calcular o total de água consumida com base no histórico
//   const calculateTotalWaterConsumed = (items: HistoryItem[]): number => {
//     // Somamos todos os valores em ml e convertemos para litros
//     const totalInML = items.reduce((sum, item) => sum + item.amount, 0)
//     // Convertemos para litros e limitamos a 2 casas decimais
//     return Number.parseFloat((totalInML / 1000).toFixed(2))
//   }

//   // Modificar o método handleWaterConsumption para garantir que os dados sejam salvos corretamente
//   const handleWaterConsumption = async () => {
//     let amountInMl = 0

//     // Verificar se estamos usando um valor personalizado ou um valor da lista
//     if (isCustomValueSelected) {
//       // Converter o valor personalizado para número
//       const parsedValue = Number.parseInt(customValue)

//       // Verificar se o valor é válido
//       if (isNaN(parsedValue) || parsedValue <= 0) {
//         alert("Por favor, insira um valor válido maior que zero.")
//         return
//       }

//       amountInMl = parsedValue
//     } else {
//       // Obter o valor em litros da opção selecionada e converter para ml
//       const amountValue = lista[selectedAmount as keyof typeof lista]
//       amountInMl = amountValue * 1000
//     }

//     if (amountInMl > 0) {
//       let updatedHistory: HistoryItem[]

//       if (modalMode === "add") {
//         // Criar um novo item para o histórico
//         const newItem: HistoryItem = {
//           id: Date.now(), // Usar timestamp como ID único
//           amount: amountInMl,
//           date: getCurrentDate(),
//           time: getCurrentTime(),
//           hidden: false,
//         }
//         console.log("Novo item criado:", JSON.stringify(newItem))
//         // Adicionar o novo item ao início do histórico
//         updatedHistory = [newItem, ...historyItems]
//       } else {
//         // Modo de edição - atualizamos o item existente
//         if (!editingItem) return // Segurança para não executar se não houver item para editar

//         // Encontrar o índice do item sendo editado
//         const editIndex = historyItems.findIndex((item) => item.id === editingItem.id)
//         if (editIndex === -1) return // Item não encontrado

//         // Criar cópia do array e atualizar o item específico
//         updatedHistory = [...historyItems]
//         updatedHistory[editIndex] = {
//           ...updatedHistory[editIndex],
//           amount: amountInMl,
//           // Manter data e hora originais
//         }
//         console.log("Item editado:", JSON.stringify(updatedHistory[editIndex]))
//       }

//       // Atualizar o histórico
//       setHistoryItems(updatedHistory)

//       // Salvar o histórico atualizado no AsyncStorage
//       await saveHistoryItems(updatedHistory)
//       console.log("Histórico atualizado e salvo com sucesso")

//       // Recalcular o total de água consumida para o dia atual
//       // Apenas para itens adicionados após o último reinício
//       const today = getCurrentDate()
//       const visibleItems = updatedHistory.filter(
//         (item) => item.date === today && !item.hidden && item.id > lastResetTimestamp,
//       )
//       const newTotal = calculateTotalWaterConsumed(visibleItems)
//       setTotalWaterConsumed(newTotal)

//       // Mostrar no console o novo total
//       console.log(newTotal + " Litros consumidos hoje")

//       // Verificar se a meta foi atingida e ainda não foi celebrada
//       if (newTotal >= recommendedWaterIntakeLiters && !goalCelebrated) {
//         // Fechar o modal de adição primeiro
//         setModalVisible(false)
//         // Resetar o estado do seletor
//         setSelectorExpanded(false)
//         // Mostrar o modal de parabéns após um breve atraso
//         setTimeout(() => {
//           setCongratsModalVisible(true)
//           setGoalCelebrated(true)
//         }, 500)
//       } else {
//         // Fechar o modal após adicionar
//         setModalVisible(false)
//         // Resetar o estado do seletor
//         setSelectorExpanded(false)
//       }
//     }
//   }

//   // Efeito para rolar para o topo do histórico quando um novo item é adicionado
//   useEffect(() => {
//     if (historyScrollRef.current && modalMode === "add") {
//       setTimeout(() => {
//         historyScrollRef.current?.scrollTo({ y: 0, animated: true })
//       }, 300)
//     }
//   }, [historyItems.length])
//   // Calcular a porcentagem de progresso baseado na meta calculada
//   // Evitamos divisão por zero se a meta ainda não foi definida
//   const progressPercentage =
//     recommendedWaterIntakeLiters > 0 ? Math.min((totalWaterConsumed / recommendedWaterIntakeLiters) * 100, 100) : 0

//   // Função para lidar com o clique no botão "Continuar" do modal de parabéns
//   const handleContinueAfterCongrats = () => {
//     // Fechar o modal de parabéns
//     setCongratsModalVisible(false)
//     // Resetar apenas o contador diário, não o histórico
//     resetWaterConsumed()
//   }
//   // Função para excluir um item do histórico
//   const deleteHistoryItem = async (id: number) => {
//     const updatedHistory = historyItems.filter((item) => item.id !== id)
//     setHistoryItems(updatedHistory)

//     // Salvar o histórico atualizado no AsyncStorage
//     await saveHistoryItems(updatedHistory)

//     // Recalcular o total de água consumida para o dia atual
//     // Apenas para itens adicionados após o último reinício
//     const today = getCurrentDate()
//     const visibleItems = updatedHistory.filter(
//       (item) => item.date === today && !item.hidden && item.id > lastResetTimestamp,
//     )
//     const newTotal = calculateTotalWaterConsumed(visibleItems)
//     setTotalWaterConsumed(newTotal)
//   }

//   // Função para confirmar a exclusão
//   const confirmDelete = () => {
//     if (itemToDelete) {
//       deleteHistoryItem(itemToDelete.id)
//       setConfirmDeleteModalVisible(false)
//       setItemToDelete(null)
//     }
//   }

//   // Filtrar itens do histórico para mostrar apenas os adicionados após o último reinício
//   const filteredHistoryItems = historyItems.filter((item) => item.id > lastResetTimestamp)

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.welcomeText}>Bem-Vindo,</Text>
//         <Text style={styles.headerTitle}>{userData.name || "Usuário"}!</Text>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.waterCard}>
//           <View style={styles.waterInfoContainer}>
//             <View>
//               <Text style={styles.waterAmount}>{totalWaterConsumed} Litros</Text>
//               <Text style={styles.waterLabel}>Consumidos Hoje</Text>
//             </View>
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity style={styles.resetButton} onPress={resetWaterConsumed}>
//                 <Ionicons name="refresh" size={20} color="white" />
//                 <Text style={styles.resetButtonText}>Reiniciar</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.addButton} onPress={openAddWaterModal}>
//                 <Ionicons name="add" size={24} color="white" style={styles.addIcon} />
//                 <Text style={styles.addButtonText}>Adicionar</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.waveContainer}>
//             <View style={styles.wave1} />
//             <View style={styles.wave2} />
//             <View style={styles.wave3} />
//           </View>

//           <View style={styles.progressContainer}>
//             <View style={styles.progressBar}>
//               <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
//             </View>
//             <View style={styles.goalContainer}>
//               <Text style={styles.goalText}>
//                 {recommendedWaterIntakeLiters > 0
//                   ? `${recommendedWaterIntakeLiters.toFixed(1)} Litros`
//                   : "Configure seu perfil"}
//               </Text>
//               <Text style={styles.goalLabel}>Minha Meta</Text>
//             </View>
//             <TouchableOpacity style={styles.infoButton} onPress={goToProfile}>
//               <Ionicons name="settings-outline" size={24} color="#2196F3" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.historySection}>
//           <Text style={styles.historyTitle}>Histórico</Text>
//           <View style={styles.divider} />

//           <ScrollView
//             ref={historyScrollRef}
//             style={styles.historyList}
//             showsVerticalScrollIndicator={false}
//             nestedScrollEnabled={true}
//           >
//             {filteredHistoryItems.length > 0 ? (
//               filteredHistoryItems.map((item) => (
//                 <View key={item.id} style={styles.historyItem}>
//                   <View style={styles.historyItemLeft}>
//                     <View style={styles.bottleIconContainer}>
//                       <Ionicons name="water" size={24} color="#2196F3" />
//                     </View>
//                     <Text style={styles.historyAmount}>{item.amount} ml</Text>
//                   </View>

//                   <View style={styles.historyItemCenter}>
//                     <View>
//                       <Text style={styles.historyLabel}>Data:</Text>
//                       <Text style={styles.historyValue}>{item.date}</Text>
//                     </View>
//                     <View>
//                       <Text style={styles.historyLabel}>Horário:</Text>
//                       <Text style={styles.historyValue}>{item.time}</Text>
//                     </View>
//                   </View>

//                   <TouchableOpacity style={styles.waterActionButton} onPress={() => openEditWaterModal(item)}>
//                     <Ionicons name="pencil" size={20} color="#2196F3" />
//                   </TouchableOpacity>
//                 </View>
//               ))
//             ) : (
//               <Text style={styles.emptyHistoryText}>Nenhum registro encontrado</Text>
//             )}
//           </ScrollView>
//         </View>
//       </ScrollView>
//       {/* Modal para adicionar ou editar consumo de água */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(false)
//           setSelectorExpanded(false)
//         }}
//       >
//         <TouchableOpacity
//           style={styles.centeredView}
//           activeOpacity={1}
//           onPress={() => {
//             setModalVisible(false)
//             setSelectorExpanded(false)
//           }}
//         >
//           <TouchableOpacity style={styles.modalView} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>{modalMode === "add" ? "Adicionar Consumo" : "Editar Consumo"}</Text>
//               <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={() => {
//                   setModalVisible(false)
//                   setSelectorExpanded(false)
//                 }}
//               >
//                 <Ionicons name="close" size={24} color="#999" />
//               </TouchableOpacity>
//             </View>

//             {/* Seletor de quantidade com dropdown */}
//             <View style={styles.selectorContainer}>
//               <TouchableOpacity
//                 style={[styles.amountSelector, isCustomValueSelected && styles.customAmountSelector]}
//                 onPress={toggleSelector}
//               >
//                 <Ionicons name="water-outline" size={20} color="#2196F3" style={styles.selectorIcon} />
//                 {isCustomValueSelected ? (
//                   <Text style={styles.selectorText}>Personalizado</Text>
//                 ) : (
//                   <Text style={styles.selectorText}>{selectedAmount}</Text>
//                 )}
//                 <Ionicons name={selectorExpanded ? "chevron-up" : "chevron-down"} size={20} color="#2196F3" />
//               </TouchableOpacity>

//               {/* Campo para valor personalizado */}
//               {isCustomValueSelected && (
//                 <View style={styles.customInputContainer}>
//                   <TextInput
//                     style={styles.customInput}
//                     placeholder="Digite o valor em ml"
//                     keyboardType="numeric"
//                     value={customValue}
//                     onChangeText={setCustomValue}
//                   />
//                   <Text style={styles.customInputUnit}>ml</Text>
//                 </View>
//               )}

//               {/* Opções do seletor usando Object.keys */}
//               {selectorExpanded && (
//                 <View style={styles.optionsContainer}>
//                   <ScrollView style={styles.optionsScroll} nestedScrollEnabled={true}>
//                     {Object.keys(lista).map((key, index) => (
//                       <Pressable
//                         key={index}
//                         style={[
//                           styles.optionItem,
//                           selectedAmount === key && !isCustomValueSelected && styles.selectedOption,
//                         ]}
//                         onPress={() => selectAmount(key)}
//                       >
//                         <Ionicons
//                           name="water"
//                           size={16}
//                           color={selectedAmount === key && !isCustomValueSelected ? "white" : "#2196F3"}
//                           style={styles.optionIcon}
//                         />
//                         <Text
//                           style={[
//                             styles.optionText,
//                             selectedAmount === key && !isCustomValueSelected && styles.selectedOptionText,
//                           ]}
//                         >
//                           {key}
//                         </Text>
//                       </Pressable>
//                     ))}

//                     {/* Opção para valor personalizado */}
//                     <Pressable
//                       style={[styles.optionItem, isCustomValueSelected && styles.selectedOption]}
//                       onPress={selectCustomAmount}
//                     >
//                       <Ionicons
//                         name="create-outline"
//                         size={16}
//                         color={isCustomValueSelected ? "white" : "#2196F3"}
//                         style={styles.optionIcon}
//                       />
//                       <Text style={[styles.optionText, isCustomValueSelected && styles.selectedOptionText]}>
//                         Personalizado
//                       </Text>
//                     </Pressable>
//                   </ScrollView>
//                 </View>
//               )}
//             </View>

//             {/* Botão de exclusão - só aparece no modo de edição */}
//             {modalMode === "edit" && editingItem && (
//               <TouchableOpacity
//                 style={styles.deleteConsumptionButton}
//                 onPress={() => {
//                   if (editingItem) {
//                     setItemToDelete(editingItem)
//                     setConfirmDeleteModalVisible(true)
//                     setModalVisible(false) // Fecha o modal de edição
//                   }
//                 }}
//               >
//                 <Text style={styles.deleteConsumptionButtonText}>Excluir</Text>
//                 <Ionicons name="trash-outline" size={20} color="white" />
//               </TouchableOpacity>
//             )}

//             {/* Botão de adicionar ou editar */}
//             <TouchableOpacity style={styles.addConsumptionButton} onPress={handleWaterConsumption}>
//               <Text style={styles.addConsumptionButtonText}>{modalMode === "add" ? "Adicionar" : "Alterar"}</Text>
//               <Ionicons name={modalMode === "add" ? "add" : "checkmark"} size={20} color="white" />
//             </TouchableOpacity>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>

//       {/* Modal de confirmação para exclusão */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={confirmDeleteModalVisible}
//         onRequestClose={() => setConfirmDeleteModalVisible(false)}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.confirmationModalView}>
//             <Text style={styles.confirmationTitle}>Confirmar exclusão</Text>
//             <Text style={styles.confirmationMessage}>Tem certeza que deseja excluir este registro?</Text>
//             <View style={styles.confirmationButtonsContainer}>
//               <TouchableOpacity style={styles.confirmCancelButton} onPress={() => setConfirmDeleteModalVisible(false)}>
//                 <Text style={styles.confirmButtonText}>Não</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.confirmDeleteButton} onPress={confirmDelete}>
//                 <Text style={styles.confirmDeleteButtonText}>Sim</Text>
//                 <Ionicons name="trash-outline" size={16} color="white" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Modal de parabéns quando atingir a meta */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={congratsModalVisible}
//         onRequestClose={() => setCongratsModalVisible(false)}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.congratsModalView}>
//             <View style={styles.congratsIconContainer}>
//               <Ionicons name="trophy" size={50} color="#FFD700" />
//             </View>
//             <Text style={styles.congratsTitle}>Parabéns!</Text>
//             <Text style={styles.congratsMessage}>Você concluiu sua META!</Text>
//             <Text style={styles.congratsSubtitle}>
//               {recommendedWaterIntakeLiters.toFixed(1)} Litros de água consumidos
//             </Text>
//             <TouchableOpacity style={styles.congratsButton} onPress={handleContinueAfterCongrats}>
//               <Text style={styles.congratsButtonText}>Continuar</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
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
//   welcomeText: {
//     color: "white",
//     fontSize: 14,
//   },
//   headerTitle: {
//     color: "white",
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   waterCard: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     overflow: "hidden",
//   },
//   waterInfoContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 30,
//     zIndex: 1,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   resetButton: {
//     backgroundColor: "#FF5252",
//     borderRadius: 25,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     marginRight: 8,
//   },
//   resetButtonText: {
//     color: "white",
//     fontWeight: "500",
//     marginLeft: 3,
//   },
//   waterAmount: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#2196F3",
//   },
//   waterLabel: {
//     fontSize: 14,
//     color: "#666",
//   },
//   addButton: {
//     backgroundColor: "#2196F3",
//     borderRadius: 25,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
//   addIcon: {
//     marginRight: 5,
//   },
//   addButtonText: {
//     color: "white",
//     fontWeight: "500",
//   },
//   waveContainer: {
//     position: "absolute",
//     bottom: 60,
//     left: 0,
//     right: 0,
//     height: 80,
//   },
//   wave1: {
//     position: "absolute",
//     height: 80,
//     width: "100%",
//     backgroundColor: "rgba(33, 150, 243, 0.1)",
//     borderRadius: 100,
//     bottom: -40,
//     transform: [{ scaleX: 1.5 }],
//   },
//   wave2: {
//     position: "absolute",
//     height: 70,
//     width: "100%",
//     backgroundColor: "rgba(33, 150, 243, 0.15)",
//     borderRadius: 100,
//     bottom: -30,
//     transform: [{ scaleX: 1.3 }],
//   },
//   wave3: {
//     position: "absolute",
//     height: 60,
//     width: "100%",
//     backgroundColor: "rgba(33, 150, 243, 0.2)",
//     borderRadius: 100,
//     bottom: -20,
//     transform: [{ scaleX: 1.1 }],
//   },
//   progressContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   progressBar: {
//     flex: 1,
//     height: 10,
//     backgroundColor: "#E0E0E0",
//     borderRadius: 5,
//     marginRight: 10,
//     overflow: "hidden",
//   },
//   progressFill: {
//     height: "100%",
//     backgroundColor: "#2196F3",
//     borderRadius: 5,
//   },
//   goalContainer: {
//     flexDirection: "column",
//     alignItems: "flex-end",
//   },
//   goalText: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#666",
//   },
//   goalLabel: {
//     fontSize: 10,
//     color: "#999",
//   },
//   infoButton: {
//     marginLeft: 10,
//   },
//   historySection: {
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   historyTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#2196F3",
//     marginBottom: 5,
//   },
//   divider: {
//     height: 2,
//     backgroundColor: "#2196F3",
//     marginBottom: 16,
//   },
//   historyList: {
//     maxHeight: 400,
//   },
//   historyItem: {
//     flexDirection: "row",
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 10,
//     alignItems: "center",
//   },
//   historyItemLeft: {
//     flexDirection: "column",
//     alignItems: "center",
//     width: 60,
//   },
//   bottleIconContainer: {
//     marginBottom: 5,
//   },
//   historyAmount: {
//     fontSize: 12,
//     color: "#666",
//   },
//   historyItemCenter: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-around",
//   },
//   historyLabel: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   historyValue: {
//     fontSize: 12,
//     color: "#666",
//   },
//   waterActionButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#2196F3",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   deleteButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#2196F3",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   emptyHistoryText: {
//     textAlign: "center",
//     color: "#666",
//     marginTop: 20,
//     fontSize: 16,
//   },
//   // css para o modal
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalView: {
//     width: "80%",
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 20,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalHeader: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   closeButton: {
//     padding: 5,
//   },
//   selectorContainer: {
//     width: "100%",
//     marginBottom: 20,
//     zIndex: 1000,
//   },
//   amountSelector: {
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#E3F2FD",
//     borderRadius: 25,
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//   },
//   customAmountSelector: {
//     backgroundColor: "#E8F5E9",
//   },
//   selectorIcon: {
//     marginRight: 10,
//   },
//   selectorText: {
//     flex: 1,
//     fontSize: 16,
//     color: "#2196F3",
//   },
//   // css para o input de entrada personalizado
//   customInputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#2196F3",
//     borderRadius: 8,
//     marginTop: 10,
//     paddingHorizontal: 10,
//     backgroundColor: "white",
//   },
//   customInput: {
//     flex: 1,
//     height: 45,
//     paddingVertical: 8,
//     paddingHorizontal: 5,
//     fontSize: 16,
//     color: "#2196F3",
//   },
//   customInputUnit: {
//     fontSize: 16,
//     color: "#2196F3",
//     marginLeft: 5,
//   },
//   optionsContainer: {
//     width: "100%",
//     backgroundColor: "white",
//     borderRadius: 10,
//     marginTop: 5,
//     maxHeight: 200,
//     borderWidth: 1,
//     borderColor: "#E3F2FD",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   optionsScroll: {
//     width: "100%",
//   },
//   optionItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E3F2FD",
//   },
//   selectedOption: {
//     backgroundColor: "#2196F3",
//   },
//   optionIcon: {
//     marginRight: 10,
//   },
//   optionText: {
//     fontSize: 16,
//     color: "#2196F3",
//   },
//   selectedOptionText: {
//     color: "white",
//   },
//   addConsumptionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#2196F3",
//     borderRadius: 25,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     width: "100%",
//   },
//   addConsumptionButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     marginRight: 5,
//   },
//   //modal de parabéns
//   congratsModalView: {
//     width: "85%",
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 25,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   congratsIconContainer: {
//     backgroundColor: "#E3F2FD",
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   congratsTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#2196F3",
//     marginBottom: 10,
//   },
//   congratsMessage: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   congratsSubtitle: {
//     fontSize: 16,
//     color: "#666",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   congratsButton: {
//     backgroundColor: "#2196F3",
//     borderRadius: 25,
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     elevation: 2,
//   },
//   congratsButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   deleteConsumptionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FF5252",
//     borderRadius: 25,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     width: "100%",
//     marginBottom: 10,
//   },
//   deleteConsumptionButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     marginRight: 5,
//   },
//   confirmationModalView: {
//     backgroundColor: "white",
//     borderRadius: 20,
//     width: "80%",
//     padding: 20,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   confirmationTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: 10,
//   },
//   confirmationMessage: {
//     fontSize: 16,
//     textAlign: "center",
//     color: "#555",
//     marginBottom: 20,
//   },
//   confirmationButtonsContainer: {
//     flexDirection: "row",
//     width: "100%",
//     justifyContent: "space-between",
//   },
//   confirmCancelButton: {
//     flex: 1,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 10,
//     padding: 12,
//     alignItems: "center",
//     marginRight: 10,
//   },
//   confirmDeleteButton: {
//     flex: 1,
//     backgroundColor: "#ff4545",
//     borderRadius: 10,
//     padding: 12,
//     alignItems: "center",
//     marginLeft: 10,
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   confirmButtonText: {
//     color: "#333",
//     fontWeight: "500",
//     fontSize: 16,
//   },
//   confirmDeleteButtonText: {
//     color: "white",
//     fontWeight: "500",
//     fontSize: 16,
//     marginRight: 5,
//   },
// })
"use client"

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Pressable,
  TextInput,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useRef, useEffect } from "react"
import { useRoute, type RouteProp, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"

type HistoryItem = {
  id: number
  amount: number
  date: string
  time: string
  hidden?: boolean // Nova propriedade para controlar visibilidade na tela principal
}

type RootStackParamList = {
  Profile: undefined
  MainTabs: { waterIntake?: number } | undefined
}

type UserData = {
  weight: number
  height: number
  name: string
  waterIntake: number
}

type MainTabsRouteProp = RouteProp<RootStackParamList, "MainTabs">
type MainTabsNavigationProp = NativeStackNavigationProp<RootStackParamList, "MainTabs">

// Tipos para nossas conquistas e desafios com a tipagem correta para ícones
type Achievement = {
  id: string
  title: string
  completed: boolean
  icon: string
  description: string
}

type Challenge = {
  id: string
  title: string
  completed: boolean
  achievementId: string
  icon: string
  description: string
}

// Dados iniciais para conquistas e desafios
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

export default function HomeScreen() {
  // Navegação e rota
  const route = useRoute<MainTabsRouteProp>()
  const navigation = useNavigation<MainTabsNavigationProp>()

  // Estado para os dados do usuário
  const [userData, setUserData] = useState<UserData>({
    weight: 0,
    height: 0,
    name: "Usuário",
    waterIntake: 0,
  })

  // Recuperar o consumo diário recomendado dos parâmetros da rota ou estado (em ml)
  const [recommendedWaterIntake, setRecommendedWaterIntake] = useState(0)

  // Converter para litros para exibição
  const recommendedWaterIntakeLiters = recommendedWaterIntake / 1000

  // Estado para controlar a visibilidade do modal de adicionar água
  const [modalVisible, setModalVisible] = useState(false)
  // Estado para o modo do modal (adicionar ou editar)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  // Estado para armazenar o item sendo editado
  const [editingItem, setEditingItem] = useState<HistoryItem | null>(null)
  // Estado para controlar a visibilidade do modal de parabéns
  const [congratsModalVisible, setCongratsModalVisible] = useState(false)
  // Estado para controlar se a meta já foi celebrada (para evitar mostrar o modal várias vezes)
  const [goalCelebrated, setGoalCelebrated] = useState(false)
  // Estado para controlar a visibilidade do modal de confirmação de exclusão
  const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] = useState(false)
  // Lista de opções de água com seus respectivos valores em litros
  const lista = {
    "100 ml": 0.1,
    "200 ml": 0.2,
    "300 ml": 0.3,
    "400 ml": 0.4,
    "500 ml": 0.5,
    "1 Litro": 1,
  }

  // Estados para confirmação de exclusão
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<HistoryItem | null>(null)
  const [selectorExpanded, setSelectorExpanded] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState("200 ml")
  // valor personalizado em ml
  const [customValue, setCustomValue] = useState("")
  // controlar se esta usando um valor personalizado
  const [isCustomValueSelected, setIsCustomValueSelected] = useState(false)
  // total de água consumida
  const [totalWaterConsumed, setTotalWaterConsumed] = useState(0)
  // itens do histórico
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  // Referência para o ScrollView do histórico
  const historyScrollRef = useRef<ScrollView>(null)
  // Animação para a expansão do seletor
  const expandAnimation = useRef(new Animated.Value(0)).current
  // Timestamp do último reinício
  const [lastResetTimestamp, setLastResetTimestamp] = useState<number>(0)

  // Função para calcular o consumo diário de água com base no peso e altura
  const calculateWaterIntake = (weight: number, height: number): number => {
    if (weight <= 0 || height <= 0) return 0

    // Fórmula para calcular o consumo diário:
    // Peso (kg) * 35 + Altura (cm) * 0.2 = ml por dia
    const waterIntakeInML = Math.round(weight * 35 + height * 0.2)

    return waterIntakeInML
  }

  // Função para salvar os dados do usuário
  const saveUserData = async (data: UserData) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(data))
      console.log("Dados do usuário salvos com sucesso")
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error)
    }
  }

  // Função para carregar os dados do usuário
  const loadUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData")
      if (jsonValue !== null) {
        const data = JSON.parse(jsonValue) as UserData
        setUserData(data)

        // Calcular o consumo diário com base nos dados carregados
        const intake = calculateWaterIntake(data.weight, data.height)
        setRecommendedWaterIntake(intake)
        return data
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error)
    }
    return null
  }

  // Carregar o timestamp do último reinício
  const loadLastResetTimestamp = async () => {
    try {
      const timestamp = await AsyncStorage.getItem("lastResetTimestamp")
      if (timestamp) {
        setLastResetTimestamp(Number(timestamp))
      }
    } catch (error) {
      console.error("Erro ao carregar timestamp do último reinício:", error)
    }
  }

  // Efeito para carregar os dados do usuário e calcular a meta
  useEffect(() => {
    const initializeData = async () => {
      await loadLastResetTimestamp()

      if (route.params?.waterIntake) {
        console.log("Received water intake from route params:", route.params.waterIntake)
        setRecommendedWaterIntake(route.params.waterIntake)
        const updatedUserData = { ...userData }
        updatedUserData.waterIntake = route.params.waterIntake
        setUserData(updatedUserData)

        try {
          await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData))
          console.log("Updated user data saved with new water intake")
        } catch (error) {
          console.error("Error saving updated user data:", error)
        }
      } else {
        try {
          const data = await loadUserData()

          if (!data || data.weight <= 0 || data.height <= 0) {
            alert("Por favor, configure seu perfil para calcular sua meta de consumo de água diário.")
            setTimeout(() => {
              goToProfile()
            }, 100)
          } else if (data.waterIntake > 0) {
            setRecommendedWaterIntake(data.waterIntake)
          }
        } catch (error) {
          console.error("Error loading user data:", error)
          alert("Erro ao carregar dados. Por favor, configure seu perfil.")
          setTimeout(() => {
            goToProfile()
          }, 100)
        }
      }
    }

    initializeData()
    loadHistoryItems()
    checkDailyReset() // Verificar se precisa resetar os dados diários

    // Inicializar conquistas e desafios se não existirem
    initializeAchievementsAndChallenges()
  }, [route.params])

  // Inicializar conquistas e desafios se não existirem
  const initializeAchievementsAndChallenges = async () => {
    try {
      const savedAchievements = await AsyncStorage.getItem("achievements")
      const savedChallenges = await AsyncStorage.getItem("challenges")

      if (!savedAchievements) {
        await AsyncStorage.setItem("achievements", JSON.stringify(initialAchievements))
        console.log("Conquistas inicializadas com sucesso")
      }

      if (!savedChallenges) {
        await AsyncStorage.setItem("challenges", JSON.stringify(initialChallenges))
        console.log("Desafios inicializados com sucesso")
      }
    } catch (error) {
      console.error("Erro ao inicializar conquistas e desafios:", error)
    }
  }

  // Função para verificar se é um novo dia e resetar os dados se necessário
  const checkDailyReset = async () => {
    try {
      const lastResetDate = await AsyncStorage.getItem("lastResetDate")
      const today = new Date().toDateString()

      if (lastResetDate !== today) {
        console.log("Novo dia detectado, resetando dados diários e conquistas")

        // É um novo dia, resetar o contador e as conquistas
        await resetWaterConsumed(true) // true indica que é um reset diário

        // Salvar a data atual como último reset
        await AsyncStorage.setItem("lastResetDate", today)
      }
    } catch (error) {
      console.error("Erro ao verificar reset diário:", error)
    }
  }

  // Carregar itens do histórico do AsyncStorage
  const loadHistoryItems = async () => {
    try {
      const savedItems = await AsyncStorage.getItem("historyItems")
      if (savedItems) {
        const items = JSON.parse(savedItems) as HistoryItem[]
        setHistoryItems(items)

        // Recalcular o total de água consumida para o dia atual
        // Apenas para itens adicionados após o último reinício
        const today = getCurrentDate()
        const visibleItems = items.filter((item) => item.date === today && !item.hidden && item.id > lastResetTimestamp)
        const newTotal = calculateTotalWaterConsumed(visibleItems)
        setTotalWaterConsumed(newTotal)
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error)
    }
  }

  // Adicionar logs para depuração no método saveHistoryItems
  const saveHistoryItems = async (items: HistoryItem[]) => {
    try {
      await AsyncStorage.setItem("historyItems", JSON.stringify(items))
      console.log(`Salvos ${items.length} itens no histórico:`, JSON.stringify(items))

      // Atualizar dados de conquistas
      updateAchievements(items)
    } catch (error) {
      console.error("Erro ao salvar histórico:", error)
    }
  }

  // Função para atualizar conquistas com base no consumo de água
  const updateAchievements = async (items: HistoryItem[]) => {
    try {
      // Calcular dados para conquistas
      const today = getCurrentDate()
      const todayItems = items.filter((item) => item.date === today && !item.hidden)
      const todayTotal = calculateTotalWaterConsumed(todayItems)

      console.log(`Consumo total de hoje: ${todayTotal}L, Meta: ${recommendedWaterIntakeLiters}L`)

      // Verificar dias consecutivos
      let consecutiveDays = 0
      const lastConsecutiveDaysStr = await AsyncStorage.getItem("consecutiveDays")
      if (lastConsecutiveDaysStr) {
        consecutiveDays = Number.parseInt(lastConsecutiveDaysStr)
      }

      // Se atingiu a meta hoje, incrementar dias consecutivos
      if (todayTotal >= recommendedWaterIntakeLiters) {
        consecutiveDays += 1
        await AsyncStorage.setItem("consecutiveDays", consecutiveDays.toString())
        console.log(`Meta atingida! Dias consecutivos: ${consecutiveDays}`)
      }

      // Salvar dados de consumo para o sistema de conquistas
      const waterConsumptionData = {
        dailyConsumption: todayTotal,
        dailyGoal: recommendedWaterIntakeLiters,
        consecutiveDays: consecutiveDays,
        lastUpdated: today,
      }

      await AsyncStorage.setItem("waterConsumption", JSON.stringify(waterConsumptionData))

      // Atualizar conquistas e desafios diretamente
      await updateAchievementsAndChallenges(todayTotal, recommendedWaterIntakeLiters, consecutiveDays)
    } catch (error) {
      console.error("Erro ao atualizar conquistas:", error)
    }
  }

  // Nova função para atualizar diretamente as conquistas e desafios
  const updateAchievementsAndChallenges = async (
    todayConsumption: number,
    dailyGoal: number,
    consecutiveDays: number,
  ) => {
    try {
      // Carregar conquistas e desafios atuais
      const savedAchievementsStr = await AsyncStorage.getItem("achievements")
      const savedChallengesStr = await AsyncStorage.getItem("challenges")

      if (!savedAchievementsStr || !savedChallengesStr) {
        console.error("Conquistas ou desafios não encontrados no AsyncStorage")
        return
      }

      const achievements: Achievement[] = JSON.parse(savedAchievementsStr)
      const challenges: Challenge[] = JSON.parse(savedChallengesStr)

      let achievementsUpdated = false
      let challengesUpdated = false

      // Verificar e atualizar desafios
      for (let i = 0; i < challenges.length; i++) {
        const challenge = challenges[i]

        // Desafio de meta diária
        if (challenge.id === "challenge_2" && !challenge.completed && todayConsumption >= dailyGoal) {
          challenge.completed = true
          challengesUpdated = true
          console.log("Desafio de meta diária completado!")

          // Atualizar conquista relacionada
          const relatedAchievement = achievements.find((a) => a.id === challenge.achievementId)
          if (relatedAchievement && !relatedAchievement.completed) {
            relatedAchievement.completed = true
            achievementsUpdated = true
            console.log("Conquista de meta diária desbloqueada!")
          }
        }

        // Desafio de 2 litros
        if (challenge.id === "challenge_3" && !challenge.completed && todayConsumption >= 2) {
          challenge.completed = true
          challengesUpdated = true
          console.log("Desafio de 2 litros completado!")

          // Atualizar conquista relacionada
          const relatedAchievement = achievements.find((a) => a.id === challenge.achievementId)
          if (relatedAchievement && !relatedAchievement.completed) {
            relatedAchievement.completed = true
            achievementsUpdated = true
            console.log("Conquista de 2 litros desbloqueada!")
          }
        }

        // Desafio de 7 dias consecutivos
        if (challenge.id === "challenge_1" && !challenge.completed && consecutiveDays >= 7) {
          challenge.completed = true
          challengesUpdated = true
          console.log("Desafio de 7 dias consecutivos completado!")

          // Atualizar conquista relacionada
          const relatedAchievement = achievements.find((a) => a.id === challenge.achievementId)
          if (relatedAchievement && !relatedAchievement.completed) {
            relatedAchievement.completed = true
            achievementsUpdated = true
            console.log("Conquista de 7 dias consecutivos desbloqueada!")
          }
        }
      }

      // Salvar conquistas e desafios atualizados
      if (achievementsUpdated) {
        await AsyncStorage.setItem("achievements", JSON.stringify(achievements))
        console.log("Conquistas atualizadas e salvas com sucesso")
      }

      if (challengesUpdated) {
        await AsyncStorage.setItem("challenges", JSON.stringify(challenges))
        console.log("Desafios atualizados e salvos com sucesso")
      }
    } catch (error) {
      console.error("Erro ao atualizar conquistas e desafios:", error)
    }
  }

  // Modificar a função resetWaterConsumed para aceitar um parâmetro que indica se é um reset diário
  const resetWaterConsumed = async (isDailyReset = false) => {
    // Zerar o total de água consumida
    setTotalWaterConsumed(0)
    // Resetar o estado de celebração
    setGoalCelebrated(false)

    // Gerar um novo timestamp para o reinício
    const resetTimestamp = Date.now()
    setLastResetTimestamp(resetTimestamp)

    // Salvar o timestamp no AsyncStorage
    try {
      await AsyncStorage.setItem("lastResetTimestamp", resetTimestamp.toString())
      console.log("Timestamp de reinício salvo:", resetTimestamp)

      // Marcar todos os itens do dia atual como ocultos
      const today = getCurrentDate()
      const updatedItems = historyItems.map((item) => {
        if (item.date === today) {
          return { ...item, hidden: true }
        }
        return item
      })

      setHistoryItems(updatedItems)
      await saveHistoryItems(updatedItems)

      // Se for um reset diário, resetar também as conquistas
      if (isDailyReset) {
        // Resetar dias consecutivos apenas se for um reset diário
        await AsyncStorage.setItem("consecutiveDays", "0")

        // Resetar conquistas e desafios
        await resetAchievements()
      }
    } catch (error) {
      console.error("Erro ao salvar timestamp de reinício:", error)
    }

    console.log("Contador de água consumida zerado (apenas para a tela principal)")
  }

  // Função para resetar conquistas e desafios (chamada apenas no reset diário)
  const resetAchievements = async () => {
    try {
      // Carregar conquistas e desafios atuais
      const savedAchievementsStr = await AsyncStorage.getItem("achievements")
      const savedChallengesStr = await AsyncStorage.getItem("challenges")

      let achievements = initialAchievements
      let challenges = initialChallenges

      if (savedAchievementsStr) {
        achievements = JSON.parse(savedAchievementsStr)
      }

      if (savedChallengesStr) {
        challenges = JSON.parse(savedChallengesStr)
      }

      // Resetar todas as conquistas e desafios para não completados
      const resetAchievements = achievements.map((achievement) => ({
        ...achievement,
        completed: false,
      }))

      const resetChallenges = challenges.map((challenge) => ({
        ...challenge,
        completed: false,
      }))

      // Salvar conquistas e desafios resetados
      await AsyncStorage.setItem("achievements", JSON.stringify(resetAchievements))
      await AsyncStorage.setItem("challenges", JSON.stringify(resetChallenges))

      console.log("Conquistas e desafios resetados com sucesso")

      // Resetar dados de consumo de água para o sistema de conquistas
      const waterConsumptionData = {
        dailyConsumption: 0,
        dailyGoal: recommendedWaterIntakeLiters,
        consecutiveDays: 0,
        lastUpdated: getCurrentDate(),
      }

      await AsyncStorage.setItem("waterConsumption", JSON.stringify(waterConsumptionData))
    } catch (error) {
      console.error("Erro ao resetar conquistas:", error)
    }
  }

  // Função para voltar à tela de perfil para recalcular a meta
  const goToProfile = () => {
    // Navegar para a tela de perfil para recalcular o consumo recomendado com base no peso e altura
    navigation.navigate("Profile")
  }
  // Função para abrir o modal de adicionar água
  const openAddWaterModal = () => {
    setModalMode("add")
    setModalVisible(true)
    setSelectorExpanded(false)
    setEditingItem(null)
    setIsCustomValueSelected(false)
    setCustomValue("")
  }

  // Função para abrir o modal de editar água
  const openEditWaterModal = (item: HistoryItem) => {
    // Converter de ml para o formato da lista
    const amountInLiters = item.amount / 1000
    // Verifica se o valor existe na lista de valores predefinidos
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

    setModalMode("edit")
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
    return Number.parseFloat((totalInML / 1000).toFixed(2))
  }

  // Modificar o método handleWaterConsumption para garantir que os dados sejam salvos corretamente
  const handleWaterConsumption = async () => {
    let amountInMl = 0

    // Verificar se estamos usando um valor personalizado ou um valor da lista
    if (isCustomValueSelected) {
      // Converter o valor personalizado para número
      const parsedValue = Number.parseInt(customValue)

      // Verificar se o valor é válido
      if (isNaN(parsedValue) || parsedValue <= 0) {
        alert("Por favor, insira um valor válido maior que zero.")
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

      if (modalMode === "add") {
        // Criar um novo item para o histórico
        const newItem: HistoryItem = {
          id: Date.now(), // Usar timestamp como ID único
          amount: amountInMl,
          date: getCurrentDate(),
          time: getCurrentTime(),
          hidden: false,
        }
        console.log("Novo item criado:", JSON.stringify(newItem))
        // Adicionar o novo item ao início do histórico
        updatedHistory = [newItem, ...historyItems]
      } else {
        // Modo de edição - atualizamos o item existente
        if (!editingItem) return // Segurança para não executar se não houver item para editar

        // Encontrar o índice do item sendo editado
        const editIndex = historyItems.findIndex((item) => item.id === editingItem.id)
        if (editIndex === -1) return // Item não encontrado

        // Criar cópia do array e atualizar o item específico
        updatedHistory = [...historyItems]
        updatedHistory[editIndex] = {
          ...updatedHistory[editIndex],
          amount: amountInMl,
          // Manter data e hora originais
        }
        console.log("Item editado:", JSON.stringify(updatedHistory[editIndex]))
      }

      // Atualizar o histórico
      setHistoryItems(updatedHistory)

      // Salvar o histórico atualizado no AsyncStorage
      await saveHistoryItems(updatedHistory)
      console.log("Histórico atualizado e salvo com sucesso")

      // Recalcular o total de água consumida para o dia atual
      // Apenas para itens adicionados após o último reinício
      const today = getCurrentDate()
      const visibleItems = updatedHistory.filter(
        (item) => item.date === today && !item.hidden && item.id > lastResetTimestamp,
      )
      const newTotal = calculateTotalWaterConsumed(visibleItems)
      setTotalWaterConsumed(newTotal)

      // Mostrar no console o novo total
      console.log(newTotal + " Litros consumidos hoje")

      // Verificar se a meta foi atingida e ainda não foi celebrada
      if (newTotal >= recommendedWaterIntakeLiters && !goalCelebrated) {
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
    if (historyScrollRef.current && modalMode === "add") {
      setTimeout(() => {
        historyScrollRef.current?.scrollTo({ y: 0, animated: true })
      }, 300)
    }
  }, [historyItems.length])
  // Calcular a porcentagem de progresso baseado na meta calculada
  // Evitamos divisão por zero se a meta ainda não foi definida
  const progressPercentage =
    recommendedWaterIntakeLiters > 0 ? Math.min((totalWaterConsumed / recommendedWaterIntakeLiters) * 100, 100) : 0

  // Função para lidar com o clique no botão "Continuar" do modal de parabéns
  const handleContinueAfterCongrats = () => {
    // Fechar o modal de parabéns
    setCongratsModalVisible(false)
    // Resetar apenas o contador diário, não o histórico e não as conquistas
    resetWaterConsumed(false) // false indica que não é um reset diário
  }
  // Função para excluir um item do histórico
  const deleteHistoryItem = async (id: number) => {
    const updatedHistory = historyItems.filter((item) => item.id !== id)
    setHistoryItems(updatedHistory)

    // Salvar o histórico atualizado no AsyncStorage
    await saveHistoryItems(updatedHistory)

    // Recalcular o total de água consumida para o dia atual
    // Apenas para itens adicionados após o último reinício
    const today = getCurrentDate()
    const visibleItems = updatedHistory.filter(
      (item) => item.date === today && !item.hidden && item.id > lastResetTimestamp,
    )
    const newTotal = calculateTotalWaterConsumed(visibleItems)
    setTotalWaterConsumed(newTotal)
  }

  // Função para confirmar a exclusão
  const confirmDelete = () => {
    if (itemToDelete) {
      deleteHistoryItem(itemToDelete.id)
      setConfirmDeleteModalVisible(false)
      setItemToDelete(null)
    }
  }

  // Filtrar itens do histórico para mostrar apenas os adicionados após o último reinício
  const filteredHistoryItems = historyItems.filter((item) => item.id > lastResetTimestamp)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-Vindo,</Text>
        <Text style={styles.headerTitle}>{userData.name || "Usuário"}!</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.waterCard}>
          <View style={styles.waterInfoContainer}>
            <View>
              <Text style={styles.waterAmount}>{totalWaterConsumed} Litros</Text>
              <Text style={styles.waterLabel}>Consumidos Hoje</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.resetButton} onPress={() => resetWaterConsumed(false)}>
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
              <Text style={styles.goalText}>
                {recommendedWaterIntakeLiters > 0
                  ? `${recommendedWaterIntakeLiters.toFixed(1)} Litros`
                  : "Configure seu perfil"}
              </Text>
              <Text style={styles.goalLabel}>Minha Meta</Text>
            </View>
            <TouchableOpacity style={styles.infoButton} onPress={goToProfile}>
              <Ionicons name="settings-outline" size={24} color="#2196F3" />
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
            {filteredHistoryItems.length > 0 ? (
              filteredHistoryItems.map((item) => (
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

                  <TouchableOpacity style={styles.waterActionButton} onPress={() => openEditWaterModal(item)}>
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
              <Text style={styles.modalTitle}>{modalMode === "add" ? "Adicionar Consumo" : "Editar Consumo"}</Text>
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
                        style={[
                          styles.optionItem,
                          selectedAmount === key && !isCustomValueSelected && styles.selectedOption,
                        ]}
                        onPress={() => selectAmount(key)}
                      >
                        <Ionicons
                          name="water"
                          size={16}
                          color={selectedAmount === key && !isCustomValueSelected ? "white" : "#2196F3"}
                          style={styles.optionIcon}
                        />
                        <Text
                          style={[
                            styles.optionText,
                            selectedAmount === key && !isCustomValueSelected && styles.selectedOptionText,
                          ]}
                        >
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

            {/* Botão de exclusão - só aparece no modo de edição */}
            {modalMode === "edit" && editingItem && (
              <TouchableOpacity
                style={styles.deleteConsumptionButton}
                onPress={() => {
                  if (editingItem) {
                    setItemToDelete(editingItem)
                    setConfirmDeleteModalVisible(true)
                    setModalVisible(false) // Fecha o modal de edição
                  }
                }}
              >
                <Text style={styles.deleteConsumptionButtonText}>Excluir</Text>
                <Ionicons name="trash-outline" size={20} color="white" />
              </TouchableOpacity>
            )}

            {/* Botão de adicionar ou editar */}
            <TouchableOpacity style={styles.addConsumptionButton} onPress={handleWaterConsumption}>
              <Text style={styles.addConsumptionButtonText}>{modalMode === "add" ? "Adicionar" : "Alterar"}</Text>
              <Ionicons name={modalMode === "add" ? "add" : "checkmark"} size={20} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal de confirmação para exclusão */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmDeleteModalVisible}
        onRequestClose={() => setConfirmDeleteModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.confirmationModalView}>
            <Text style={styles.confirmationTitle}>Confirmar exclusão</Text>
            <Text style={styles.confirmationMessage}>Tem certeza que deseja excluir este registro?</Text>
            <View style={styles.confirmationButtonsContainer}>
              <TouchableOpacity style={styles.confirmCancelButton} onPress={() => setConfirmDeleteModalVisible(false)}>
                <Text style={styles.confirmButtonText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDeleteButton} onPress={confirmDelete}>
                <Text style={styles.confirmDeleteButtonText}>Sim</Text>
                <Ionicons name="trash-outline" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
            <Text style={styles.congratsSubtitle}>
              {recommendedWaterIntakeLiters.toFixed(1)} Litros de água consumidos
            </Text>
            <TouchableOpacity style={styles.congratsButton} onPress={handleContinueAfterCongrats}>
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
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },
  // css para o modal
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
    backgroundColor: "#E8F5E9",
  },
  selectorIcon: {
    marginRight: 10,
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    color: "#2196F3",
  },
  // css para o input de entrada personalizado
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
  //modal de parabéns
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
  deleteConsumptionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF5252",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 10,
  },
  deleteConsumptionButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
  },
  confirmationModalView: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "80%",
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
  confirmationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  confirmationMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  confirmationButtonsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  confirmCancelButton: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginRight: 10,
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: "#ff4545",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#333",
    fontWeight: "500",
    fontSize: 16,
  },
  confirmDeleteButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
    marginRight: 5,
  },
})
