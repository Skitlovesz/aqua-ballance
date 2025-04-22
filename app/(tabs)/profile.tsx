import { useState } from "react"
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React from "react"


type RootStackParamList = {
  Profile: undefined
  MainTabs: undefined
}

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Profile">

export default function ProfileScreen() {
  const [name, setName] = useState("José Maria dos Santos")
  const [birthDate, setBirthDate] = useState("01/11/1990")
  const [height, setHeight] = useState("168")
  const [weight, setWeight] = useState("70.5")
  const [gender, setGender] = useState("Mulher Cis")

  const navigation = useNavigation<ProfileScreenNavigationProp>()

  const handleCalculate = () => {
    navigation.navigate("MainTabs")
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.formContent}>
          <Text style={styles.formTitle}>Calcular minha meta diária</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Nascimento</Text>
            <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} placeholder="DD/MM/AAAA" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Altura</Text>
            <View style={styles.inputWithUnit}>
              <TextInput
                style={[styles.input, styles.inputWithUnitText]}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
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
              />
              <Text style={styles.unitText}>kg</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gênero</Text>
            <TouchableOpacity style={styles.selectInput}>
              <Text>{gender}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
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
})

