import { StyleSheet } from "react-native"

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

export default styles
