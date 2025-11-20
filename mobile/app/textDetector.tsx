import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TextDetector() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
  if (!text.trim()) {
    alert("Please enter some text first");
    return;
  }

  setLoading(true);
  setResult(null);

  try {
    const res = await axios.post("http://172.20.10.14:8000/predict/message", {
      text: text,
    });

    // Backend returns: { prediction: "scam" or "legit" }
    const pred = res.data.prediction;

    if (pred === "scam") {
      setResult({
        status: "SCAM",
        message: "⚠️ This message is likely a scam. Be cautious!"
      });
    } else {
      setResult({
        status: "LEGIT",
        message: "✅ This message seems safe."
      });
    }
    
  } catch (err) {
    console.error(err);
    setResult({
      status: "ERROR",
      message: "Failed to analyze text.",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>

      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/")}>
        <MaterialCommunityIcons name="arrow-left" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.heading}>Text Detector</Text>

      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="Enter text to analyze..."
        value={text}
        onChangeText={setText}
        multiline
      />

      <TouchableOpacity style={styles.btn} onPress={handleCheck} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.btnText}>Analyze Text</Text>
        )}
      </TouchableOpacity>

      {result && (
        <View style={styles.card}>
          <Text
            style={[
              styles.status,
              {
                color:
                  result.status === "SCAM"
                    ? "red"
                    : result.status === "LEGIT"
                    ? "green"
                    : "orange",
              },
            ]}
          >
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
