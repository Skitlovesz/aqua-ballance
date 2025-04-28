// import React from "react"
// import type { FC } from "react"
// import { useState } from "react"
// import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from "react-native"
// import { Ionicons } from "@expo/vector-icons"
// import { Link } from "expo-router"

// const SettingsScreen: FC = () => {
//   const [notificationsEnabled, setNotificationsEnabled] = useState(true)
//   const [achievementsEnabled, setAchievementsEnabled] = useState(true)
//   const [notificationsExpanded, setNotificationsExpanded] = useState(false)

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Configurações</Text>
//       </View>

//       <ScrollView style={styles.content}>
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Perfil</Text>
//           <Text style={styles.sectionSubtitle}>Edite suas informações e metas</Text>

//           <TouchableOpacity style={styles.profileItem}>
//             <View style={styles.profileInfo}>
//               <Ionicons name="person" size={20} color="#2196F3" style={styles.profileIcon} />
//               <View>
//                 <Text style={styles.profileName}>USUARIO_XYX</Text>
//                 <Text style={styles.profileAge}>Meta diária de 2.5 litros</Text>
//               </View>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color="#999" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Notificações</Text>
//           <Text style={styles.sectionSubtitle}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Text>

//           <View style={styles.settingItem}>
//             <View style={styles.settingIcon}>
//               <Ionicons name="notifications" size={20} color="#2196F3" />
//             </View>
//             <Text style={styles.settingText}>Lembretes</Text>
//             <Switch
//               value={notificationsEnabled}
//               onValueChange={setNotificationsEnabled}
//               trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
//               thumbColor={notificationsEnabled ? "#2196F3" : "#f4f3f4"}
//             />
//           </View>

//           <TouchableOpacity style={styles.settingItem} onPress={() => setNotificationsExpanded(!notificationsExpanded)}>
//             <View style={styles.settingIcon}>
//               <Ionicons name="trophy" size={20} color="#2196F3" />
//             </View>
//             <Text style={styles.settingText}>Conquistas</Text>
//             <Switch
//               value={achievementsEnabled}
//               onValueChange={setAchievementsEnabled}
//               trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
//               thumbColor={achievementsEnabled ? "#2196F3" : "#f4f3f4"}
//             />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.settingItem}>
//             <View style={styles.settingIcon}>
//               <Ionicons name="notifications-outline" size={20} color="#2196F3" />
//             </View>
//             <Text style={styles.settingText}>Notificações</Text>
//             <Ionicons name="chevron-forward" size={20} color="#999" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Copos</Text>
//           <Text style={styles.sectionSubtitle}>Clique no copo para ajustar o valor</Text>

//           <View style={styles.cupContainer}>
//             <TouchableOpacity style={styles.cupItem}>
//               <View style={styles.cup}>
//                 <Ionicons name="water-outline" size={24} color="#2196F3" />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.cupItem}>
//               <View style={styles.cup}>
//                 <Ionicons name="cafe-outline" size={24} color="#2196F3" />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.cupItem}>
//               <View style={styles.cup}>
//                 <Ionicons name="beer-outline" size={24} color="#2196F3" />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.cupItem}>
//               <View style={styles.cup}>
//                 <Ionicons name="wine-outline" size={24} color="#2196F3" />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.cupItem}>
//               <View style={styles.cup}>
//                 <Ionicons name="flask-outline" size={24} color="#2196F3" />
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <TouchableOpacity style={styles.googleButton}>
//           <Ionicons name="logo-google" size={20} color="#2196F3" style={styles.googleIcon} />
//           <Text style={styles.googleText}>Or sign in with Google</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   )
// }

// export default SettingsScreen

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
//   headerTitle: {
//     color: "white",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//   },
//   section: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   sectionSubtitle: {
//     fontSize: 12,
//     color: "#666",
//     marginBottom: 15,
//   },
//   profileItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 10,
//   },
//   profileInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   profileIcon: {
//     marginRight: 10,
//   },
//   profileName: {
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   profileAge: {
//     fontSize: 12,
//     color: "#666",
//   },
//   settingItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   settingIcon: {
//     width: 30,
//     marginRight: 10,
//   },
//   settingText: {
//     flex: 1,
//     fontSize: 14,
//   },
//   cupContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 10,
//   },
//   cupItem: {
//     alignItems: "center",
//   },
//   cup: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#f0f0f0",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   googleButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   googleIcon: {
//     marginRight: 10,
//   },
//   googleText: {
//     fontSize: 14,
//     color: "#666",
//   },
//   tabBar: {
//     flexDirection: "row",
//     height: 60,
//     backgroundColor: "#2196F3", 
//     borderTopWidth: 0,
//   },
//   tabItem: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   centerTab: {
//     justifyContent: "flex-start",
//   },
//   centerTabButton: {
//     backgroundColor: "#2196F3",
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: -25,
//     borderWidth: 5,
//     borderColor: "white",
//   },
// })

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React from "react"

// Define the navigation types directly here
type RootStackParamList = {
  Profile: undefined
  MainTabs: undefined
}

// Define the navigation prop type
type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "MainTabs">

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [achievementsEnabled, setAchievementsEnabled] = useState(true)
  const [notificationsExpanded, setNotificationsExpanded] = useState(false)

  // Get the navigation object
  const navigation = useNavigation<SettingsScreenNavigationProp>()

  // Function to navigate to the Profile screen
  const navigateToProfile = () => {
    // Navigate to the Profile screen in the stack
    navigation.navigate("Profile")
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil</Text>
          <Text style={styles.sectionSubtitle}>Edite suas informações e metas</Text>

          {/* Make the profile item clickable and navigate to Profile screen */}
          <TouchableOpacity style={styles.profileItem} onPress={navigateToProfile}>
            <View style={styles.profileInfo}>
              <Ionicons name="person" size={20} color="#2196F3" style={styles.profileIcon} />
              <View>
                <Text style={styles.profileName}>USUARIO_XYX</Text>
                <Text style={styles.profileAge}>Meta diária de 2.5 litros</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <Text style={styles.sectionSubtitle}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="notifications" size={20} color="#2196F3" />
            </View>
            <Text style={styles.settingText}>Lembretes</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
              thumbColor={notificationsEnabled ? "#2196F3" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={() => setNotificationsExpanded(!notificationsExpanded)}>
            <View style={styles.settingIcon}>
              <Ionicons name="trophy" size={20} color="#2196F3" />
            </View>
            <Text style={styles.settingText}>Conquistas</Text>
            <Switch
              value={achievementsEnabled}
              onValueChange={setAchievementsEnabled}
              trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
              thumbColor={achievementsEnabled ? "#2196F3" : "#f4f3f4"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="notifications-outline" size={20} color="#2196F3" />
            </View>
            <Text style={styles.settingText}>Notificações</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Copos</Text>
          <Text style={styles.sectionSubtitle}>Clique no copo para ajustar o valor</Text>

          <View style={styles.cupContainer}>
            <TouchableOpacity style={styles.cupItem}>
              <View style={styles.cup}>
                <Ionicons name="water-outline" size={24} color="#2196F3" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cupItem}>
              <View style={styles.cup}>
                <Ionicons name="cafe-outline" size={24} color="#2196F3" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cupItem}>
              <View style={styles.cup}>
                <Ionicons name="beer-outline" size={24} color="#2196F3" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cupItem}>
              <View style={styles.cup}>
                <Ionicons name="wine-outline" size={24} color="#2196F3" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cupItem}>
              <View style={styles.cup}>
                <Ionicons name="flask-outline" size={24} color="#2196F3" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Ionicons name="logo-google" size={20} color="#2196F3" style={styles.googleIcon} />
          <Text style={styles.googleText}>Or sign in with Google</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 15,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    marginRight: 10,
  },
  profileName: {
    fontSize: 14,
    fontWeight: "500",
  },
  profileAge: {
    fontSize: 12,
    color: "#666",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingIcon: {
    width: 30,
    marginRight: 10,
  },
  settingText: {
    flex: 1,
    fontSize: 14,
  },
  cupContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  cupItem: {
    alignItems: "center",
  },
  cup: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  googleIcon: {
    marginRight: 10,
  },
  googleText: {
    fontSize: 14,
    color: "#666",
  },
  tabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#2196F3",
    borderTopWidth: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})

