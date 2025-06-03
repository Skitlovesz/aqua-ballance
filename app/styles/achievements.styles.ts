import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2196F3",
  },
  tabText: {
    color: "#999",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#2196F3",
  },
  achievementsList: {
    padding: 15,
  },
  achievementItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  completedIcon: {
    backgroundColor: "#E3F2FD",
  },
  incompleteIcon: {
    backgroundColor: "#f9f9f9",
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  completedDate: {
    fontSize: 10,
    color: "#2196F3",
    fontStyle: "italic",
  },
  moreButton: {
    padding: 5,
  },
  tabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerTab: {
    justifyContent: "flex-start",
  },
  centerTabButton: {
    backgroundColor: "#2196F3",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -25,
    borderWidth: 5,
    borderColor: "white",
  },
  // Estilos para o popup de conquista
  achievementPopup: {
    position: "absolute",
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 1000,
  },
  popupIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF9C4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  popupContent: {
    flex: 1,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 4,
  },
  popupDescription: {
    fontSize: 14,
    color: "#333",
  },
})

export default styles
