import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React from "react"
import { auth } from "../../firebaseConfig"
import { signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import styles from "../styles/login.styles"

type RootStackParamList = {
  Login: undefined
  Register: undefined
  Profile: undefined
  MainTabs: undefined
}

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigation = useNavigation<LoginScreenNavigationProp>()

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Buscar nome do usuário no Firestore e salvar no AsyncStorage
      try {
        const db = getFirestore()
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          if (userData && userData.name) {
            await AsyncStorage.setItem("userName", userData.name)
            // Salvar perfil inicial para o index.tsx encontrar
            await AsyncStorage.setItem(
              `userData_${user.uid}`,
              JSON.stringify({
                name: userData.name,
                weight: 0,
                height: 0,
                waterIntake: 0,
                email: user.email,
              }),
            )
          }
        }
      } catch (e) {
        // Se não conseguir buscar, não impede o login
        console.warn("Não foi possível sincronizar o nome do usuário:", e)
      }

      alert("Login realizado com sucesso!")
      navigation.navigate("Profile")
    } catch (error) {
      if (error instanceof Error) {
        alert("Erro ao fazer login: " + error.message)
      } else {
        alert("Erro ao fazer login: Erro desconhecido")
      }
    }
  }

  const handleRegister = () => {
    navigation.navigate("Register")
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
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Registre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
