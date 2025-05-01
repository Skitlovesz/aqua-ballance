import { useState, useEffect } from "react" 
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native" 
import { Ionicons } from "@expo/vector-icons" 
import { useNavigation } from "@react-navigation/native" 
import type { NativeStackNavigationProp } from "@react-navigation/native-stack" 
import React from "react" 
import AsyncStorage from "@react-native-async-storage/async-storage"

type UserData = {
  weight: number;
  height: number;
  name: string;
  waterIntake: number;
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
  
  const navigation = useNavigation<ProfileScreenNavigationProp>()
  
  // Carregar dados salvos ao iniciar a tela
  useEffect(() => {
    loadUserData();
  }, []);
  
  // Função para carregar os dados do usuário
  const loadUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userData');
      if (jsonValue !== null) {
        const data = JSON.parse(jsonValue) as UserData;
        setName(data.name || 'Usuário');
        setWeight(data.weight ? data.weight.toString() : '');
        setHeight(data.height ? data.height.toString() : '');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };
  
  const calculateWaterIntake = async () => {
    // Convertendo valores para números
    const weightNum = parseFloat(weight)
    const heightNum = parseFloat(height)
    
    if (isNaN(weightNum) || isNaN(heightNum) || weightNum <= 0 || heightNum <= 0) {
      // Validações básicas
      alert("Por favor, insira valores válidos para altura e peso")
      return
    }
    
    // Cálculo baseado no peso (30ml por kg) com ajuste baseado na altura
    // Fator de ajuste: +10% a cada 10cm acima de 160cm, -10% a cada 10cm abaixo
    const baseWaterIntake = weightNum * 30 // ml por dia baseado apenas no peso
    
    const heightFactor = 1 + ((heightNum - 160) / 100)
    const finalWaterIntake = baseWaterIntake * heightFactor
    
    // Arredondando para ml inteiros
    const waterIntakeRounded = Math.round(finalWaterIntake)
    
    // Salvar dados no AsyncStorage para persistência
    try {
      const userData: UserData = {
        name: name,
        weight: weightNum,
        height: heightNum,
        waterIntake: waterIntakeRounded
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
    
    // Navegar de volta passando o parâmetro calculado
    navigation.navigate("MainTabs", { waterIntake: waterIntakeRounded })
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>
      
      <ScrollView style={styles.formContainer}>
        <View style={styles.formContent}>
          <Text style={styles.formTitle}>Calcular minha meta diária de água</Text>
    
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Altura</Text>
            <View style={styles.inputWithUnit}>
              <TextInput
                style={[styles.input, styles.inputWithUnitText]}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="Insira sua altura"
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
              />
              <Text style={styles.unitText}>kg</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={calculateWaterIntake}>
            <Text style={styles.calculateButtonText}>Calcular</Text>
         </TouchableOpacity>

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
  },
  calculateButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonIcon: {
    marginLeft: 5,
  }
})

