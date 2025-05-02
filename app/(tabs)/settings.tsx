// import { useState } from "react"
// import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Modal, Pressable } from "react-native"
// import { Ionicons } from "@expo/vector-icons"
// import { useNavigation } from "@react-navigation/native"
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
// import React from "react"

// type RootStackParamList = {
//   Profile: undefined
//   MainTabs: undefined
// }

// type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "MainTabs">

// // Definindo tipos para o modal e seus dados
// type ReminderItem = {
//   time: string;
//   text: string;
//   enabled: boolean;
// };

// type RemindersModalProps = {
//   visible: boolean;
//   onClose: () => void;
// };

// // Componente para o Modal de Lembretes
// const RemindersModal = ({ visible, onClose }: RemindersModalProps) => {
//   const [reminders, setReminders] = useState<ReminderItem[]>([
//     { time: "6:00", text: "Todos os dias", enabled: true },
//     { time: "7:30", text: "Todos os dias", enabled: true },
//     { time: "9:00", text: "Todos os dias", enabled: true },
//     { time: "11:00", text: "Todos os dias", enabled: false },
//   ]);
  
//   // Estados para o novo modal de adicionar alarme
//   const [addAlarmModalVisible, setAddAlarmModalVisible] = useState(false);
//   const [selectedHour, setSelectedHour] = useState("19");
//   const [selectedMinute, setSelectedMinute] = useState("30");
//   const [repeatOption, setRepeatOption] = useState("Todos os dias");
//   const [repeatModalVisible, setRepeatModalVisible] = useState(false);

//   const toggleReminder = (index: number) => {
//     const updatedReminders = [...reminders];
//     updatedReminders[index].enabled = !updatedReminders[index].enabled;
//     setReminders(updatedReminders);
//   };
  
//   const addNewReminder = () => {
//     const newReminder: ReminderItem = {
//       time: `${selectedHour}:${selectedMinute}`,
//       text: repeatOption,
//       enabled: true
//     };
    
//     setReminders([...reminders, newReminder]);
//     setAddAlarmModalVisible(false);
//   };
  
//   const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
//   const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  
//   // Renderiza as opções de hora/minuto no seletor
//   const renderTimeOptions = (data: string[], selected: string, onSelect: (value: string) => void) => {
//     const selectedIndex = data.indexOf(selected);
//     const visibleItems = data.slice(
//       Math.max(0, selectedIndex - 2),
//       Math.min(data.length, selectedIndex + 3)
//     );
    
//     return (
//       <View style={styles.timePickerColumn}>
//         {visibleItems.map((value) => (
//           <TouchableOpacity
//             key={value}
//             style={[
//               styles.timeOption,
//               value === selected && styles.selectedTimeOption
//             ]}
//             onPress={() => onSelect(value)}
//           >
//             <Text style={[
//               styles.timeOptionText,
//               value === selected && styles.selectedTimeOptionText
//             ]}>
//               {value}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   };

//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={visible}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Ajuste Seus Lembretes</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Ionicons name="close" size={24} color="#333" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.remindersList}>
//             {reminders.map((reminder, index) => (
//               <View key={index} style={styles.reminderItem}>
//                 <TouchableOpacity 
//                   style={styles.deleteButton}
//                   onPress={() => {
//                     const updatedReminders = [...reminders];
//                     updatedReminders.splice(index, 1);
//                     setReminders(updatedReminders);
//                   }}
//                 >
//                   <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
//                 </TouchableOpacity>
//                 <View style={styles.reminderContent}>
//                   <Text style={styles.reminderTime}>{reminder.time}</Text>
//                   <Text style={styles.reminderText}>{reminder.text}</Text>
//                 </View>
//                 <Switch
//                   value={reminder.enabled}
//                   onValueChange={() => toggleReminder(index)}
//                   trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
//                   thumbColor={reminder.enabled ? "#2196F3" : "#f4f3f4"}
//                 />
//               </View>
//             ))}
//           </View>

//           <TouchableOpacity 
//             style={styles.addButton} 
//             onPress={() => setAddAlarmModalVisible(true)}
//           >
//             <Ionicons name="add" size={30} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>
      
//       {/* Modal para adicionar novo alarme */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={addAlarmModalVisible}
//         onRequestClose={() => setAddAlarmModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.addAlarmModalContainer}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Adicionar Alarme</Text>
//               <TouchableOpacity onPress={() => setAddAlarmModalVisible(false)}>
//                 <Ionicons name="close" size={24} color="#333" />
//               </TouchableOpacity>
//             </View>
            
//             {/* Seletor de hora */}
//             <View style={styles.timePickerContainer}>
//               {renderTimeOptions(hours, selectedHour, setSelectedHour)}
//               <View style={styles.timePickerSeparator}>
//                 <Text style={styles.timePickerSeparatorText}>:</Text>
//               </View>
//               {renderTimeOptions(minutes, selectedMinute, setSelectedMinute)}
//             </View>
            
//             {/* Opções de configuração */}
//             <View style={styles.alarmOptionsContainer}>
//               <TouchableOpacity 
//                 style={styles.alarmOption}
//               >
//                 <Text style={styles.alarmOptionLabel}>Toque</Text>
//                 <View style={styles.alarmOptionValue}>
//                   <Text style={styles.alarmOptionValueText}>Toque Padrão</Text>
//                   <Ionicons name="chevron-forward" size={20} color="#999" />
//                 </View>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={styles.alarmOption}
//                 onPress={() => setRepeatModalVisible(true)}
//               >
//                 <Text style={styles.alarmOptionLabel}>Repetir</Text>
//                 <View style={styles.alarmOptionValue}>
//                   <Text style={styles.alarmOptionValueText}>{repeatOption}</Text>
//                   <Ionicons name="chevron-forward" size={20} color="#999" />
//                 </View>
//               </TouchableOpacity>
//             </View>
            
//             {/* Botão de adicionar */}
//             <TouchableOpacity 
//               style={styles.addAlarmButton}
//               onPress={addNewReminder}
//             >
//               <Text style={styles.addAlarmButtonText}>Adicionar</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
      
//       {/* Modal de opções de repetição */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={repeatModalVisible}
//         onRequestClose={() => setRepeatModalVisible(false)}
//       >
//         <TouchableOpacity 
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setRepeatModalVisible(false)}
//         >
//           <View style={styles.repeatModalContainer}>
//             <TouchableOpacity 
//               style={styles.repeatOption}
//               onPress={() => {
//                 setRepeatOption("Todos os dias");
//                 setRepeatModalVisible(false);
//               }}
//             >
//               <Text style={styles.repeatOptionText}>Todos os dias</Text>
//               {repeatOption === "Todos os dias" && (
//                 <Ionicons name="checkmark" size={20} color="#2196F3" />
//               )}
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.repeatOption}
//               onPress={() => {
//                 setRepeatOption("Uma Vez");
//                 setRepeatModalVisible(false);
//               }}
//             >
//               <Text style={styles.repeatOptionText}>Uma Vez</Text>
//               {repeatOption === "Uma Vez" && (
//                 <Ionicons name="checkmark" size={20} color="#2196F3" />
//               )}
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </Modal>
//   );
// };

// export default function SettingsScreen() {
//   const [notificationsEnabled, setNotificationsEnabled] = useState(true)
//   const [achievementsEnabled, setAchievementsEnabled] = useState(true)
//   const [remindersEnabled, setRemindersEnabled] = useState(true)
//   const [notificationsExpanded, setNotificationsExpanded] = useState(false)
//   const [remindersModalVisible, setRemindersModalVisible] = useState(false)
//   const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  
//   // Guardar o estado anterior para restaurar quando reativar
//   const [previousRemindersState, setPreviousRemindersState] = useState(true)
//   const [previousAchievementsState, setPreviousAchievementsState] = useState(true)

//   const navigation = useNavigation<SettingsScreenNavigationProp>()

//   const navigateToProfile = () => {
//     navigation.navigate("Profile")
//   }
  
//   const handleNotificationsToggle = (value: boolean) => {
//     if (value === false) {
//       // Ao desativar, mostrar modal de confirmação
//       setConfirmModalVisible(true)
//     } else {
//       // Ao reativar, restaurar estados anteriores
//       setNotificationsEnabled(true)
//       setRemindersEnabled(previousRemindersState)
//       setAchievementsEnabled(previousAchievementsState)
//     }
//   }
  
//   const confirmDisableNotifications = () => {
//     // Guardar estados atuais para restaurar depois
//     setPreviousRemindersState(remindersEnabled)
//     setPreviousAchievementsState(achievementsEnabled)
    
//     // Desativar tudo
//     setNotificationsEnabled(false)
//     setRemindersEnabled(false)
//     setAchievementsEnabled(false)
    
//     // Fechar modal
//     setConfirmModalVisible(false)
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Configurações</Text>
//       </View>

//       <ScrollView style={styles.content}>
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Perfil</Text>
//           <Text style={styles.sectionSubtitle}>Edite suas informações e metas</Text>

//           <TouchableOpacity style={styles.profileItem} onPress={navigateToProfile}>
//             <View style={styles.profileInfo}>
//               <Ionicons name="person" size={20} color="#2196F3" style={styles.profileIcon} />
//               <View>
//                 <Text style={styles.profileName}>USUARIO_XYX</Text>
//                 <Text style={styles.profileAge}>Clique aqui para ajustar sua nova meta</Text>
//               </View>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color="#999" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Notificações</Text>
//           <Text style={styles.sectionSubtitle}>Configure seus lembretes, conquistas e notifcações</Text>

//           <TouchableOpacity 
//             style={styles.settingItem} 
//             onPress={() => notificationsEnabled && setRemindersModalVisible(true)}
//           >
//             <View style={styles.settingIcon}>
//               <Ionicons name="notifications" size={20} color={notificationsEnabled ? "#2196F3" : "#999"} />
//             </View>
//             <Text style={[styles.settingText, !notificationsEnabled && styles.disabledText]}>Lembretes</Text>
//             <Switch
//               value={remindersEnabled}
//               onValueChange={setRemindersEnabled}
//               trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
//               thumbColor={remindersEnabled ? "#2196F3" : "#f4f3f4"}
//               disabled={!notificationsEnabled}
//             />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.settingItem} 
//             onPress={() => notificationsEnabled && setNotificationsExpanded(!notificationsExpanded)}
//           >
//             <View style={styles.settingIcon}>
//               <Ionicons name="trophy" size={20} color={notificationsEnabled ? "#2196F3" : "#999"} />
//             </View>
//             <Text style={[styles.settingText, !notificationsEnabled && styles.disabledText]}>Conquistas</Text>
//             <Switch
//               value={achievementsEnabled}
//               onValueChange={setAchievementsEnabled}
//               trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
//               thumbColor={achievementsEnabled ? "#2196F3" : "#f4f3f4"}
//               disabled={!notificationsEnabled}
//             />
//           </TouchableOpacity>

//           <View style={styles.settingItem}>
//             <View style={styles.settingIcon}>
//               <Ionicons name="notifications-outline" size={20} color="#2196F3" />
//             </View>
//             <Text style={styles.settingText}>Notificações</Text>
//             <Switch
//               value={notificationsEnabled}
//               onValueChange={handleNotificationsToggle}
//               trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
//               thumbColor={notificationsEnabled ? "#2196F3" : "#f4f3f4"}
//             />
//           </View>
//         </View>
//       </ScrollView>

//       {/* Modal de Lembretes */}
//       <RemindersModal 
//         visible={remindersModalVisible} 
//         onClose={() => setRemindersModalVisible(false)} 
//       />
      
//       {/* Modal de Confirmação para Desativar Notificações */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={confirmModalVisible}
//         onRequestClose={() => setConfirmModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.confirmModalContainer}>
//             <Text style={styles.confirmModalTitle}>Desativar Notificações</Text>
//             <Text style={styles.confirmModalText}>
//               Isso irá desativar todas as notificações, incluindo lembretes e conquistas. Deseja continuar?
//             </Text>
            
//             <View style={styles.confirmModalButtons}>
//               <TouchableOpacity 
//                 style={[styles.confirmModalButton, styles.cancelButton]}
//                 onPress={() => setConfirmModalVisible(false)}
//               >
//                 <Text style={styles.cancelButtonText}>Cancelar</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={[styles.confirmModalButton, styles.confirmButton]}
//                 onPress={confirmDisableNotifications}
//               >
//                 <Text style={styles.confirmButtonText}>Confirmar</Text>
//               </TouchableOpacity>
//             </View>
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
//   disabledText: {
//     color: "#999",
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
//   // Estilos para o Modal de Lembretes
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     width: "85%",
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   modalHeader: {
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
//   remindersList: {
//     marginBottom: 20,
//   },
//   reminderItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   deleteButton: {
//     paddingRight: 12,
//     paddingVertical: 8,
//   },
//   reminderContent: {
//     flex: 1,
//   },
//   reminderTime: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   reminderText: {
//     fontSize: 12,
//     color: "#666",
//     marginTop: 4,
//   },
//   addButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#2196F3",
//     justifyContent: "center",
//     alignItems: "center",
//     alignSelf: "center",
//     marginTop: 10,
//   },
//   // Estilos para o Modal de Adicionar Alarme
//   addAlarmModalContainer: {
//     width: "90%",
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   timePickerContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     height: 200,
//     marginVertical: 20,
//   },
//   timePickerColumn: {
//     height: 200,
//     justifyContent: "center",
//     alignItems: "center",
//     width: 80,
//   },
//   timePickerSeparator: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 10,
//   },
//   timePickerSeparatorText: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   timeOption: {
//     paddingVertical: 15,
//     width: "100%",
//     alignItems: "center",
//   },
//   selectedTimeOption: {
//     backgroundColor: "#f0f8ff",
//   },
//   timeOptionText: {
//     fontSize: 22,
//     color: "#666",
//   },
//   selectedTimeOptionText: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#2196F3",
//   },
//   alarmOptionsContainer: {
//     marginBottom: 20,
//   },
//   alarmOption: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   alarmOptionLabel: {
//     fontSize: 16,
//     color: "#333",
//   },
//   alarmOptionValue: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   alarmOptionValueText: {
//     fontSize: 16,
//     color: "#666",
//     marginRight: 8,
//   },
//   addAlarmButton: {
//     backgroundColor: "#2196F3",
//     borderRadius: 25,
//     paddingVertical: 15,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   addAlarmButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   // Estilos para o Modal de Opções de Repetição
//   repeatModalContainer: {
//     width: "80%",
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 0,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     overflow: "hidden",
//   },
//   repeatOption: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   repeatOptionText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   // Estilos para o Modal de Confirmação
//   confirmModalContainer: {
//     width: "85%",
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   confirmModalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 15,
//   },
//   confirmModalText: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   confirmModalButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   confirmModalButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 5,
//     alignItems: "center",
//     marginHorizontal: 5,
//   },
//   cancelButton: {
//     backgroundColor: "#f5f5f5",
//   },
//   cancelButtonText: {
//     color: "#666",
//     fontWeight: "500",
//   },
//   confirmButton: {
//     backgroundColor: "#2196F3",
//   },
//   confirmButtonText: {
//     color: "white",
//     fontWeight: "500",
//   },
// });
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Modal, Pressable, Alert, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React from "react"
import * as Notifications from 'expo-notifications'

// Configurar as notificações para mostrar alertas quando o app estiver em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async (notification) => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type RootStackParamList = {
  Profile: undefined
  MainTabs: undefined
}

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "MainTabs">

// Definindo tipos para o modal e seus dados
type ReminderItem = {
  id: string;
  time: string;
  text: string;
  enabled: boolean;
};

type RemindersModalProps = {
  visible: boolean;
  onClose: () => void;
};

// Função para agendar um lembrete baseado no horário
const scheduleReminderNotification = async (reminder: ReminderItem) => {
  if (!reminder.enabled) return;
  
  // Cancelar qualquer notificação existente com este ID
  await Notifications.cancelScheduledNotificationAsync(reminder.id);
  
  // Calcular o próximo horário para a notificação
  const [hours, minutes] = reminder.time.split(':').map(num => parseInt(num, 10));
  
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);
  
  // Se o horário já passou hoje, agendar para amanhã
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  // Calcular o atraso em segundos
  const delay = Math.floor((scheduledTime.getTime() - now.getTime()) / 1000);
  
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hora de beber água",
        body: `Seu lembrete das ${reminder.time} está ativo!`,
        sound: true,
      },
      trigger: {
        seconds: delay,
        repeats: reminder.text === "Todos os dias",
      },
      identifier: reminder.id,
    });
    
    console.log(`Lembrete agendado para ${scheduledTime.toLocaleString()}`);
  } catch (error) {
    console.error("Erro ao agendar notificação:", error);
  }
};

// Solicitar permissões de notificação
const requestNotificationPermissions = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('water-reminders', {
      name: 'Lembretes para beber água',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2196F3',
      sound: 'default',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Componente para o Modal de Lembretes
const RemindersModal = ({ visible, onClose }: RemindersModalProps) => {
  const [reminders, setReminders] = useState<ReminderItem[]>([
    { id: "reminder-1", time: "6:00", text: "Todos os dias", enabled: true },
    { id: "reminder-2", time: "7:30", text: "Todos os dias", enabled: true },
    { id: "reminder-3", time: "9:00", text: "Todos os dias", enabled: true },
    { id: "reminder-4", time: "11:00", text: "Todos os dias", enabled: false },
  ]);
  
  // Estados para o novo modal de adicionar alarme
  const [addAlarmModalVisible, setAddAlarmModalVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState("19");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [repeatOption, setRepeatOption] = useState("Todos os dias");
  const [repeatModalVisible, setRepeatModalVisible] = useState(false);

  // Efeito para agendar notificações quando os lembretes mudam
  useEffect(() => {
    const setupNotifications = async () => {
      const permissionGranted = await requestNotificationPermissions();
      
      if (permissionGranted) {
        // Limpar todas as notificações existentes
        await Notifications.cancelAllScheduledNotificationsAsync();
        
        // Agendar todas as notificações ativas
        for (const reminder of reminders) {
          if (reminder.enabled) {
            await scheduleReminderNotification(reminder);
          }
        }
      } else {
        Alert.alert(
          "Permissão Negada",
          "Precisamos de permissão para enviar notificações para os lembretes funcionarem."
        );
      }
    };
    
    setupNotifications();
  }, [reminders]);

  const toggleReminder = (index: number) => {
    const updatedReminders = [...reminders];
    updatedReminders[index].enabled = !updatedReminders[index].enabled;
    setReminders(updatedReminders);
  };
  
  const addNewReminder = () => {
    const newReminder: ReminderItem = {
      id: `reminder-${Date.now()}`, // ID único baseado no timestamp
      time: `${selectedHour}:${selectedMinute}`,
      text: repeatOption,
      enabled: true
    };
    
    setReminders([...reminders, newReminder]);
    setAddAlarmModalVisible(false);
  };
  
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  
  // Função para testar um lembrete específico
  const testReminder = (reminder: ReminderItem) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Hora de beber água",
        body: `Teste do lembrete das ${reminder.time}`,
        sound: true,
      },
      trigger: null, // Envia imediatamente
    });
    
    Alert.alert(
      "Teste de Lembrete",
      `Um lembrete de teste para o horário ${reminder.time} foi enviado!`
    );
  };
  
  // Renderiza as opções de hora/minuto no seletor
  const renderTimeOptions = (data: string[], selected: string, onSelect: (value: string) => void) => {
    const selectedIndex = data.indexOf(selected);
    const visibleItems = data.slice(
      Math.max(0, selectedIndex - 2),
      Math.min(data.length, selectedIndex + 3)
    );
    
    return (
      <View style={styles.timePickerColumn}>
        {visibleItems.map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.timeOption,
              value === selected && styles.selectedTimeOption
            ]}
            onPress={() => onSelect(value)}
          >
            <Text style={[
              styles.timeOptionText,
              value === selected && styles.selectedTimeOptionText
            ]}>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ajuste Seus Lembretes</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.remindersList}>
            {reminders.map((reminder, index) => (
              <View key={index} style={styles.reminderItem}>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => {
                    const updatedReminders = [...reminders];
                    updatedReminders.splice(index, 1);
                    setReminders(updatedReminders);
                    
                    // Cancelar a notificação quando excluir
                    Notifications.cancelScheduledNotificationAsync(reminder.id);
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                </TouchableOpacity>
                <View style={styles.reminderContent}>
                  <Text style={styles.reminderTime}>{reminder.time}</Text>
                  <Text style={styles.reminderText}>{reminder.text}</Text>
                </View>
                <View style={styles.reminderActions}>
                  <TouchableOpacity 
                    style={styles.testButton}
                    onPress={() => testReminder(reminder)}
                  >
                    <Ionicons name="play-outline" size={18} color="#2196F3" />
                  </TouchableOpacity>
                  <Switch
                    value={reminder.enabled}
                    onValueChange={() => toggleReminder(index)}
                    trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
                    thumbColor={reminder.enabled ? "#2196F3" : "#f4f3f4"}
                  />
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setAddAlarmModalVisible(true)}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Modal para adicionar novo alarme */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addAlarmModalVisible}
        onRequestClose={() => setAddAlarmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addAlarmModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Alarme</Text>
              <TouchableOpacity onPress={() => setAddAlarmModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {/* Seletor de hora */}
            <View style={styles.timePickerContainer}>
              {renderTimeOptions(hours, selectedHour, setSelectedHour)}
              <View style={styles.timePickerSeparator}>
                <Text style={styles.timePickerSeparatorText}>:</Text>
              </View>
              {renderTimeOptions(minutes, selectedMinute, setSelectedMinute)}
            </View>
            
            {/* Opções de configuração */}
            <View style={styles.alarmOptionsContainer}>
              <TouchableOpacity 
                style={styles.alarmOption}
              >
                <Text style={styles.alarmOptionLabel}>Toque</Text>
                <View style={styles.alarmOptionValue}>
                  <Text style={styles.alarmOptionValueText}>Toque Padrão</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.alarmOption}
                onPress={() => setRepeatModalVisible(true)}
              >
                <Text style={styles.alarmOptionLabel}>Repetir</Text>
                <View style={styles.alarmOptionValue}>
                  <Text style={styles.alarmOptionValueText}>{repeatOption}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </TouchableOpacity>
            </View>
            
            {/* Botão de adicionar */}
            <TouchableOpacity 
              style={styles.addAlarmButton}
              onPress={addNewReminder}
            >
              <Text style={styles.addAlarmButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Modal de opções de repetição */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={repeatModalVisible}
        onRequestClose={() => setRepeatModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setRepeatModalVisible(false)}
        >
          <View style={styles.repeatModalContainer}>
            <TouchableOpacity 
              style={styles.repeatOption}
              onPress={() => {
                setRepeatOption("Todos os dias");
                setRepeatModalVisible(false);
              }}
            >
              <Text style={styles.repeatOptionText}>Todos os dias</Text>
              {repeatOption === "Todos os dias" && (
                <Ionicons name="checkmark" size={20} color="#2196F3" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.repeatOption}
              onPress={() => {
                setRepeatOption("Uma Vez");
                setRepeatModalVisible(false);
              }}
            >
              <Text style={styles.repeatOptionText}>Uma Vez</Text>
              {repeatOption === "Uma Vez" && (
                <Ionicons name="checkmark" size={20} color="#2196F3" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
};

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [achievementsEnabled, setAchievementsEnabled] = useState(true)
  const [remindersEnabled, setRemindersEnabled] = useState(true)
  const [notificationsExpanded, setNotificationsExpanded] = useState(false)
  const [remindersModalVisible, setRemindersModalVisible] = useState(false)
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  
  // Guardar o estado anterior para restaurar quando reativar
  const [previousRemindersState, setPreviousRemindersState] = useState(true)
  const [previousAchievementsState, setPreviousAchievementsState] = useState(true)

  const navigation = useNavigation<SettingsScreenNavigationProp>()
  
  // Configurar um listener para notificações quando o componente montar
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida!', notification);
    });
    
    // Solicitar permissões ao iniciar o app
    requestNotificationPermissions();
    
    return () => subscription.remove();
  }, []);

  const navigateToProfile = () => {
    navigation.navigate("Profile")
  }
  
  const handleNotificationsToggle = (value: boolean) => {
    if (value === false) {
      // Ao desativar, mostrar modal de confirmação
      setConfirmModalVisible(true)
    } else {
      // Ao reativar, restaurar estados anteriores
      setNotificationsEnabled(true)
      setRemindersEnabled(previousRemindersState)
      setAchievementsEnabled(previousAchievementsState)
    }
  }
  
  const confirmDisableNotifications = () => {
    // Guardar estados atuais para restaurar depois
    setPreviousRemindersState(remindersEnabled)
    setPreviousAchievementsState(achievementsEnabled)
    
    // Desativar tudo
    setNotificationsEnabled(false)
    setRemindersEnabled(false)
    setAchievementsEnabled(false)
    
    // Cancelar todas as notificações agendadas
    Notifications.cancelAllScheduledNotificationsAsync();
    
    // Fechar modal
    setConfirmModalVisible(false)
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

          <TouchableOpacity style={styles.profileItem} onPress={navigateToProfile}>
            <View style={styles.profileInfo}>
              <Ionicons name="person" size={20} color="#2196F3" style={styles.profileIcon} />
              <View>
                <Text style={styles.profileName}>USUARIO_XYX</Text>
                <Text style={styles.profileAge}>Clique aqui para ajustar sua nova meta</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <Text style={styles.sectionSubtitle}>Configure seus lembretes, conquistas e notifcações</Text>

          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => notificationsEnabled && setRemindersModalVisible(true)}
          >
            <View style={styles.settingIcon}>
              <Ionicons name="notifications" size={20} color={notificationsEnabled ? "#2196F3" : "#999"} />
            </View>
            <Text style={[styles.settingText, !notificationsEnabled && styles.disabledText]}>Lembretes</Text>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
              thumbColor={remindersEnabled ? "#2196F3" : "#f4f3f4"}
              disabled={!notificationsEnabled}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => notificationsEnabled && setNotificationsExpanded(!notificationsExpanded)}
          >
            <View style={styles.settingIcon}>
              <Ionicons name="trophy" size={20} color={notificationsEnabled ? "#2196F3" : "#999"} />
            </View>
            <Text style={[styles.settingText, !notificationsEnabled && styles.disabledText]}>Conquistas</Text>
            <Switch
              value={achievementsEnabled}
              onValueChange={setAchievementsEnabled}
              trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
              thumbColor={achievementsEnabled ? "#2196F3" : "#f4f3f4"}
              disabled={!notificationsEnabled}
            />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="notifications-outline" size={20} color="#2196F3" />
            </View>
            <Text style={styles.settingText}>Notificações</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: "#e0e0e0", true: "#90CAF9" }}
              thumbColor={notificationsEnabled ? "#2196F3" : "#f4f3f4"}
            />
          </View>
        </View>
      </ScrollView>

      {/* Modal de Lembretes */}
      <RemindersModal 
        visible={remindersModalVisible} 
        onClose={() => setRemindersModalVisible(false)} 
      />
      
      {/* Modal de Confirmação para Desativar Notificações */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContainer}>
            <Text style={styles.confirmModalTitle}>Desativar Notificações</Text>
            <Text style={styles.confirmModalText}>
              Isso irá desativar todas as notificações, incluindo lembretes e conquistas. Deseja continuar?
            </Text>
            
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity 
                style={[styles.confirmModalButton, styles.cancelButton]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmModalButton, styles.confirmButton]}
                onPress={confirmDisableNotifications}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    backgroundColor: "#2196F3",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    marginRight: 12,
    padding: 8,
    backgroundColor: "#e6f2ff",
    borderRadius: 8,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  profileAge: {
    fontSize: 13,
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
    padding: 8,
    backgroundColor: "#e6f2ff",
    borderRadius: 8,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  disabledText: {
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  remindersList: {
    paddingHorizontal: 16,
    maxHeight: "70%",
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  reminderContent: {
    flex: 1,
  },
  reminderTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  reminderText: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    padding: 8,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: "#2196F3",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 16,
    elevation: 3,
  },
  addAlarmModalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  timePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 24,
  },
  timePickerColumn: {
    alignItems: "center",
  },
  timePickerSeparator: {
    marginHorizontal: 16,
  },
  timePickerSeparatorText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
  },
  timeOption: {
    padding: 12,
    marginVertical: 2,
    borderRadius: 8,
  },
  selectedTimeOption: {
    backgroundColor: "#e6f2ff",
  },
  timeOptionText: {
    fontSize: 20,
    color: "#333",
  },
  selectedTimeOptionText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  alarmOptionsContainer: {
    marginBottom: 24,
  },
  alarmOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  alarmOptionLabel: {
    fontSize: 16,
    color: "#333",
  },
  alarmOptionValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  alarmOptionValueText: {
    fontSize: 16,
    color: "#666",
    marginRight: 8,
  },
  addAlarmButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addAlarmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  repeatModalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
  },
  repeatOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  repeatOptionText: {
    fontSize: 16,
    color: "#333",
  },
  confirmModalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  confirmModalText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  confirmModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: "#2196F3",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  reminderActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  testButton: {
    padding: 8,
    marginRight: 8,
  },
});