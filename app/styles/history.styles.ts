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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  syncButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 25,
    marginBottom: 15,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  activePeriodTab: {
    backgroundColor: "#2196F3",
    borderRadius: 25,
  },
  periodTabText: {
    color: "#666",
    fontWeight: "500",
  },
  activePeriodTabText: {
    color: "white",
  },
  dateRange: {
    alignItems: "center",
    marginBottom: 20,
  },
  dateRangeText: {
    color: "#666",
    fontSize: 12,
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 220,
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    flex: 1,
    paddingRight: 10,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
})

export default styles
