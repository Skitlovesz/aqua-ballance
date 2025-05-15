import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { auth } from "../../firebaseConfig"
import { getFirestore } from "firebase/firestore"
const firestore = getFirestore()
import { doc, setDoc, getDoc } from "firebase/firestore"
import React from "react"

type UserData = {
  weight: number
  height: number
  name: string
  waterIntake: number
}

type RootStackParamList = {
  Profile: undefined
  MainTabs: { waterIntake: number }
}

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Profile">

export default function ProfileScreen() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [name, setName] = useState("Usuário")
  const [currentUserId, setCurrentUserId] = useState<string>("guest")
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation<ProfileScreenNavigationProp>()

  // Efeito para verificar o usuário atual e carregar seus dados
  useEffect(() => {
    const checkCurrentUser = () => {
      const user = auth.currentUser
      const userId = user ? user.uid : "guest"
      setCurrentUserId(userId)

      // Atualizar o nome do usuário se estiver logado
      if (user) {
        setName(user.displayName || user.email?.split("@")[0] || "Usuário")
      }

      console.log(`[ProfileScreen] Usuário atual: ${userId}`)
    }

    checkCurrentUser()

    // Configurar um listener para mudanças no estado de autenticação
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const userId = user ? user.uid : "guest"
      console.log(`[ProfileScreen] Auth state changed - user: ${userId}`)
      setCurrentUserId(userId)

      if (user) {
        setName(user.displayName || user.email?.split("@")[0] || "Usuário")
      } else {
        setName("Usuário")
      }

      // Recarregar os dados do usuário quando mudar
      loadUserData(userId)
    })

    // Carregar dados do usuário atual
    loadUserData(currentUserId)

    // Limpar o listener quando o componente for desmontado
    return () => unsubscribe()
  }, [])

  // Função para carregar os dados do usuário do AsyncStorage e Firebase
  const loadUserData = async (userId: string) => {
    try {
      setIsLoading(true)
      console.log(`[ProfileScreen] Carregando dados para usuário: ${userId}`)

      // Primeiro, tentar carregar do Firebase
      if (userId !== "guest") {
        try {
          const userDocRef = doc(firestore, "users", userId)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const firebaseData = userDoc.data() as UserData
            console.log(`[ProfileScreen] Dados carregados do Firebase:`, firebaseData)

            setName(firebaseData.name || "Usuário")
            setWeight(firebaseData.weight ? firebaseData.weight.toString() : "")
            setHeight(firebaseData.height ? firebaseData.height.toString() : "")

            // Também salvar no AsyncStorage para acesso offline
            await AsyncStorage.setItem(`userData_${userId}`, JSON.stringify(firebaseData))

            setIsLoading(false)
            return
          } else {
            console.log(`[ProfileScreen] Nenhum dado encontrado no Firebase para ${userId}`)
          }
        } catch (error) {
          console.error(`[ProfileScreen] Erro ao carregar dados do Firebase:`, error)
          // Continuar para tentar carregar do AsyncStorage
        }
      }

      // Se não conseguiu carregar do Firebase ou é usuário convidado, tentar do AsyncStorage
      const jsonValue = await AsyncStorage.getItem(`userData_${userId}`)
      if (jsonValue !== null) {
        const data = JSON.parse(jsonValue) as UserData
        console.log(`[ProfileScreen] Dados carregados do AsyncStorage:`, data)

        setName(data.name || "Usuário")
        setWeight(data.weight ? data.weight.toString() : "")
        setHeight(data.height ? data.height.toString() : "")
      } else {
        console.log(`[ProfileScreen] Nenhum dado encontrado no AsyncStorage para ${userId}`)
        // Limpar os campos se não houver dados
        setWeight("")
        setHeight("")
      }
    } catch (error) {
      console.error("[ProfileScreen] Erro ao carregar dados do usuário:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Função para salvar os dados do usuário no AsyncStorage e Firebase
  const saveUserData = async (userData: UserData) => {
    try {
      console.log(`[ProfileScreen] Salvando dados para usuário: ${currentUserId}`, userData)

      // Sempre salvar no AsyncStorage para acesso offline
      await AsyncStorage.setItem(`userData_${currentUserId}`, JSON.stringify(userData))

      // Se for um usuário autenticado, também salvar no Firebase
      if (currentUserId !== "guest" && auth.currentUser) {
        try {
          const userDocRef = doc(firestore, "users", currentUserId)
          await setDoc(userDocRef, userData, { merge: true })
          console.log(`[ProfileScreen] Dados salvos no Firebase para ${currentUserId}`)
        } catch (firebaseError) {
          console.error(`[ProfileScreen] Erro ao salvar no Firebase:`, firebaseError)
          // Mostrar alerta, mas continuar com o fluxo já que salvamos no AsyncStorage
          Alert.alert(
            "Aviso",
            "Seus dados foram salvos localmente, mas houve um erro ao sincronizar com a nuvem. Suas configurações funcionarão normalmente.",
          )
        }
      }

      return true
    } catch (error) {
      console.error("[ProfileScreen] Erro ao salvar dados:", error)
      Alert.alert("Erro", "Não foi possível salvar seus dados. Por favor, tente novamente.")
      return false
    }
  }

  const calculateWaterIntake = async () => {
    // Convertendo valores para números
    const weightNum = Number.parseFloat(weight)
    const heightNum = Number.parseFloat(height)

    if (isNaN(weightNum) || isNaN(heightNum) || weightNum <= 0 || heightNum <= 0) {
      // Validações básicas
      Alert.alert("Erro", "Por favor, insira valores válidos para altura e peso")
      return
    }

    setIsLoading(true)

    // Cálculo baseado no peso (30ml por kg) com ajuste baseado na altura
    // Fator de ajuste: +10% a cada 10cm acima de 160cm, -10% a cada 10cm abaixo
    const baseWaterIntake = weightNum * 30 // ml por dia baseado apenas no peso

    const heightFactor = 1 + (heightNum - 160) / 100
    const finalWaterIntake = baseWaterIntake * heightFactor

    // Arredondando para ml inteiros
    const waterIntakeRounded = Math.round(finalWaterIntake)

    // Preparar dados do usuário
    const userData: UserData = {
      name: name,
      weight: weightNum,
      height: heightNum,
      waterIntake: waterIntakeRounded,
    }

    // Salvar dados
    const saveSuccess = await saveUserData(userData)

    setIsLoading(false)

    if (saveSuccess) {
      // Navegar de volta passando o parâmetro calculado
      navigation.navigate("MainTabs", { waterIntake: waterIntakeRounded })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.formContent}>
          <Text style={styles.formTitle}>Calcular minha meta diária de água</Text>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userStatus}>{currentUserId !== "guest" ? "Conta conectada" : "Usuário convidado"}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Altura</Text>
            <View style={styles.inputWithUnit}>
              <TextInput
                style={[styles.input, styles.inputWithUnitText]}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="Insira sua altura"
                editable={!isLoading}
              />
              <Text style={styles.unitText}>cm</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Peso</Text>
            <View style={styles.inputWithUnit}>
              <TextInput
                style={[styles.input, styles.inputWithUnitText]}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="Insira seu peso"
                editable={!isLoading}
              />
              <Text style={styles.unitText}>kg</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.calculateButton, isLoading && styles.disabledButton]}
            onPress={calculateWaterIntake}
            disabled={isLoading}
          >
            <Text style={styles.calculateButtonText}>{isLoading ? "Calculando..." : "Calcular"}</Text>
            {!isLoading && <Ionicons name="calculator-outline" size={18} color="white" style={styles.buttonIcon} />}
          </TouchableOpacity>

          {currentUserId === "guest" && (
            <Text style={styles.guestNote}>
              Nota: Como usuário convidado, seus dados serão salvos apenas neste dispositivo. Faça login para
              sincronizar seus dados entre dispositivos.
            </Text>
          )}
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
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
  },
  userStatus: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
    fontSize: 14,
  },
  inputWithUnit: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputWithUnitText: {
    flex: 1,
  },
  unitText: {
    marginLeft: 10,
    color: "#666",
  },
  selectInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 12,
  },
  calculateButton: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    paddingVertical: 12,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9E9E9E",
  },
  calculateButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonIcon: {
    marginLeft: 8,
  },
  guestNote: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
})


