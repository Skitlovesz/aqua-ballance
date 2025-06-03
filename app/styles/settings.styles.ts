import { StyleSheet } from "react-native"

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
    width: "85%", // Reduzido de 90% para 85%
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    maxHeight: "75%", // Reduzido de 80% para 75%
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12, // Reduzido de 16 para 12
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
    maxHeight: "65%", // Reduzido de 70% para 65%
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10, // Reduzido de 12 para 10
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
    width: "85%", // Reduzido de 90% para 85%
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    maxHeight: "70%", // Adicionado maxHeight
  },
  timePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16, // Reduzido de 24 para 16
  },
  timePickerColumn: {
    alignItems: "center",
  },
  timePickerSeparator: {
    marginHorizontal: 12, // Reduzido de 16 para 12
  },
  timePickerSeparatorText: {
    fontSize: 32, // Reduzido de 36 para 32
    fontWeight: "bold",
    color: "#333",
  },
  timeOption: {
    padding: 10, // Reduzido de 12 para 10
    marginVertical: 2,
    borderRadius: 8,
  },
  selectedTimeOption: {
    backgroundColor: "#e6f2ff",
  },
  timeOptionText: {
    fontSize: 18, // Reduzido de 20 para 18
    color: "#333",
  },
  selectedTimeOptionText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  alarmOptionsContainer: {
    marginBottom: 20, // Reduzido de 24 para 20
  },
  alarmOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10, // Reduzido de 12 para 10
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
    width: "75%", // Reduzido de 80% para 75%
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
  },
  repeatOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14, // Reduzido de 16 para 14
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  repeatOptionText: {
    fontSize: 16,
    color: "#333",
  },
  confirmModalContainer: {
    width: "75%", // Reduzido de 80% para 75%
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
  logoutButton: {
    backgroundColor: "#FF5252",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Novos estilos para o modal de tipo de lembrete
  reminderTypeModalContainer: {
    width: "85%", // Reduzido de 90% para 85%
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    maxHeight: "60%", // Adicionado maxHeight
  },
  reminderTypeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  reminderTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14, // Reduzido de 16 para 14
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  reminderTypeIcon: {
    marginRight: 14, // Reduzido de 16 para 14
    padding: 10,
    backgroundColor: "#e6f2ff",
    borderRadius: 25,
  },
  reminderTypeContent: {
    flex: 1,
  },
  reminderTypeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  reminderTypeDescription: {
    fontSize: 13, // Reduzido de 14 para 13
    color: "#666",
  },
  // Estilos para o modal de intervalo
  intervalModalContainer: {
    width: "85%", // Reduzido de 90% para 85%
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    maxHeight: "75%", // Adicionado maxHeight
  },
  intervalSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12, // Reduzido de 16 para 12
    marginBottom: 6, // Reduzido de 8 para 6
  },
  intervalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12, // Reduzido de 16 para 12
  },
  intervalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10, // Reduzido de 12 para 10
    fontSize: 16,
    width: 90, // Reduzido de 100 para 90
    marginRight: 12,
  },
  intervalInputLabel: {
    fontSize: 16,
    color: "#666",
  },
  intervalNote: {
    fontSize: 13, // Reduzido de 14 para 13
    color: "#666",
    fontStyle: "italic",
    marginBottom: 16,
  },
  reminderTypeOptionsContainer: {
    marginVertical: 16,
  },
  reminderTypeOptionCompact: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 8,
  },
  reminderTypeIconCompact: {
    marginRight: 12,
    padding: 8,
    backgroundColor: "#e6f2ff",
    borderRadius: 20,
  },
  reminderTypeContentCompact: {
    flex: 1,
  },
  reminderTypeTextCompact: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  reminderTypeDescriptionCompact: {
    fontSize: 13,
    color: "#666",
  },
  // Estilos para o mini modal compacto
  miniModalContainer: {
    width: "70%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  miniModalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  miniOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  miniOption: {
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
  miniOptionText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  miniDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#e0e0e0",
  },
  // Estilos para o modal de intervalo simplificado
  simpleIntervalContainer: {
    padding: 10,
  },
  simpleIntervalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  simpleIntervalLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    width: 50,
  },
  simpleTimePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  simpleTimeInput: {
    fontSize: 16,
    width: 30,
    textAlign: "center",
  },
  simpleTimeSeparator: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  simpleIntervalPicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  simpleIntervalInput: {
    fontSize: 16,
    width: 40,
    textAlign: "center",
  },
  simpleIntervalUnit: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  simpleIntervalButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  simpleIntervalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Estilo para lista vazia de lembretes
  emptyRemindersContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  emptyRemindersText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginTop: 10,
  },
  emptyRemindersSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
})


export default styles
