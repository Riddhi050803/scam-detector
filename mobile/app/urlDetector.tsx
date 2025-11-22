import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function URLDetector() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<
    { status: string; message: string } | null
  >(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!url.trim()) {
      alert("Please enter a URL first");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://192.168.1.33:8000/predict/url", {
        url: url,
      });

      const pred = res.data.prediction; // "benign" | "phishing" | "malware" | "defacement"

      // Map output to UI labels + messages + color
      let status = "";
      let message = "";

      switch (pred) {
        case "benign":
          status = "SAFE";
          message = "✅ This URL appears to be safe.";
          break;

        case "phishing":
          status = "PHISHING";
          message = "⚠️ This URL is likely a phishing attempt!";
          break;

        case "malware":
          status = "MALWARE";
          message = "☠️ This URL may contain malware. Avoid immediately!";
          break;

        case "defacement":
          status = "DEFACEMENT";
          message = "⚠️ This site appears to be tampered with or defaced.";
          break;

        default:
          status = "UNKNOWN";
          message = "❓ Unable to classify this URL.";
      }

      setResult({ status, message });

    } catch (err) {
      console.error(err);
      setResult({
        status: "ERROR",
        message: "Could not check URL. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Color selection based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "SAFE":
        return "green";
      case "PHISHING":
        return "orange";
      case "MALWARE":
        return "red";
      case "DEFACEMENT":
        return "purple";
      default:
        return "gray";
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/")}>
        <MaterialCommunityIcons name="arrow-left" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.heading}>URL Detector</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter URL..."
        value={url}
        onChangeText={setUrl}
      />

      <TouchableOpacity style={styles.btn} onPress={handleCheck} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.btnText}>Check URL</Text>
        )}
      </TouchableOpacity>

      {result && (
        <View style={styles.card}>
          <Text style={[styles.status, { color: getStatusColor(result.status) }]}>
            {result.status}
          </Text>
          <Text style={styles.msg}>{result.message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
    paddingTop: 80,
  },

  backBtn: {
    position: "absolute",
    top: 45,
    left: 15,
    padding: 5,
    borderRadius: 8,
  },

  heading: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 25,
    color: "#222",
  },

  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  btn: {
    backgroundColor: "#4C67F6",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  status: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },

  msg: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});
