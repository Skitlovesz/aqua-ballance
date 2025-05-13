import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView,} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React from "react"
import { auth, db } from "../../firebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

type RootStackParamList = {
  Login: undefined
  Register: undefined
  Profile: undefined
}

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Register">

export default function Register() {
  const [name, setName] = useState("")
  const [sobrenome, setSobrenome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigation = useNavigation<RegisterScreenNavigationProp>()

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!")
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Salvar dados adicionais no Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        sobrenome,
        email,
      })

      alert("Usuário registrado com sucesso!")
      navigation.navigate("Profile")
    } catch (error) {
      if (error instanceof Error) {
        alert("Erro ao registrar: " + error.message)
      } else {
        alert("Erro ao registrar: " + String(error))
      }
    }
  }

  const handleLogin = () => {
    navigation.navigate("Login")
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          {/* <Image source={require("../assets/aqua-balance-logo.png")} style={styles.logo} resizeMode="contain" /> */}
          <Text style={styles.title}>AQUA</Text>
          <Text style={styles.subtitle}>BALANCE</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Criar Conta</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#2196F3" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#2196F3" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Sobrenome"
              value={sobrenome}
              onChangeText={setSobrenome}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#2196F3" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#2196F3" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#2196F3" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Registrar</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
  },
  subtitle: {
    fontSize: 16,
    color: "#2196F3",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  registerButton: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
})
