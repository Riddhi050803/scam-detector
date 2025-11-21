import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const options = [
    { title: "Text Detector", icon: "text-box-search-outline", link: "/textDetector" },
    { title: "URL Detector", icon: "link-variant", link: "/urlDetector" },
   { title: "OCR Adhaar", icon: "camera", link: "/selfie" }
  ];

  return (
    <View style={styles.container}>
      {/* Welcome Section */}
      <Text style={styles.welcome}>Welcome 👋</Text>
      <Text style={styles.heading}>Scam / Legit Detector</Text>
      <Text style={styles.subHeading}>
        Choose a tool to continue
      </Text>

      {/* Options Grid */}
      <View style={styles.grid}>
        {options.map((opt, index) => (
          <Link key={index} href={opt.link} asChild>
            <TouchableOpacity style={styles.card}>
              <MaterialCommunityIcons name={opt.icon} size={48} color="#4A4CFF" />
              <Text style={styles.cardText}>{opt.title}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F8",
    alignItems: "center",
    paddingTop: 80,
  },

  welcome: {
    fontSize: 20,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#4A4CFF",
    marginBottom: 8,
  },

  subHeading: {
    fontSize: 15,
    color: "#666",
    marginBottom: 40,
  },

  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "white",
    paddingVertical: 28,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 22,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
});
