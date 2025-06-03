import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView,} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React from "react"
import { auth, db } from "../../firebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import styles from "../styles/register.styles"

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
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salvar dados adicionais no Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        sobrenome,
        email,
      });

      // Salvar o nome do usuário no AsyncStorage
      await AsyncStorage.setItem("userName", name);
      // Salvar perfil inicial para o index.tsx encontrar
      await AsyncStorage.setItem(
        `userData_${user.uid}`,
        JSON.stringify({
          name,
          weight: 0,
          height: 0,
          waterIntake: 0,
          email,
        }),
      );

      console.log("Nome salvo no AsyncStorage:", name); // Log para depuração

      alert("Usuário registrado com sucesso!");
      navigation.navigate("Profile");
    } catch (error) {
      const firebaseError = error as { code: string; message: string };
      switch (firebaseError.code) {
        case "auth/email-already-in-use":
          alert("O email já está em uso. Por favor, use outro email.");
          break;
        case "auth/invalid-email":
          alert("O email fornecido é inválido. Verifique e tente novamente.");
          break;
        case "auth/weak-password":
          alert("A senha é muito fraca. Use pelo menos 6 caracteres.");
          break;
        case "auth/configuration-not-found":
          alert("Erro de configuração do Firebase. Verifique a inicialização.");
          break;
        default:
          alert("Erro ao registrar: " + firebaseError.message);
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
          <Text style={styles.title}>AQUA</Text>
          <Text style={styles.subtitle}>BALLANCE</Text>
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
