import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

export default function Selfie() {
  const navigation = useNavigation();
  const cameraRef = useRef<any>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [selfie, setSelfie] = useState<any>(null);
  const [document, setDocument] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const baseUrl =
    process.env.EXPO_PUBLIC_API_HOST || "http://192.168.1.33:5000";

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (!permission.granted) return <Text>No camera permission</Text>;

  // Capture Selfie
  const captureSelfie = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
    });

    const file = {
      uri: photo.uri,
      type: "image/jpeg",
      name: "selfie.jpg",
    };

    setSelfie(file);
    Toast.show({ type: "success", text1: "Selfie captured!" });
  };

  // Pick Document
  const pickDocument = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const file = {
        uri: asset.uri,
        type: "image/jpeg",
        name: "document.jpg",
      };
      setDocument(file);
      Toast.show({ type: "success", text1: "Document selected!" });
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!selfie || !document) {
      Toast.show({ type: "error", text1: "Please add selfie & document" });
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("selfie", selfie);
    formData.append("document", document);

    try {
      const qualityResponse = await axios.post(
        `${baseUrl}/check-quality`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { document_feedback, selfie_feedback } = qualityResponse.data;

      if (document_feedback?.length || selfie_feedback?.length) {
        document_feedback?.forEach((m: string) =>
          Toast.show({ type: "info", text1: `Doc: ${m}` })
        );
        selfie_feedback?.forEach((m: string) =>
          Toast.show({ type: "info", text1: `Selfie: ${m}` })
        );
        setLoading(false);
        return;
      }

      const verifyResponse = await axios.post(
        `${baseUrl}/verify`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(verifyResponse.data);

      if (verifyResponse.data.face_match?.match) {
        Toast.show({ type: "success", text1: "Verification Successful!" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Verification Failed" });
      setResult({ error: true, message: "Verification failed" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelfie(null);
    setDocument(null);
    setResult(null);
  };

  return (
    <View style={{ flex: 1, padding: 16, marginTop: 60 }}>
      
      {/* 🔙 BACK BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          paddingVertical: 6,
          paddingHorizontal: 10,
          backgroundColor: "#eee",
          borderRadius: 8,
          width: 80,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 16 }}>← Back</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Face & Age Verification
      </Text>

      {/* CAMERA */}
      <CameraView
        style={{
          width: "100%",
          height: 300,
          borderRadius: 10,
          marginTop: 10,
        }}
        facing="front"
        ref={cameraRef}
      />

      <TouchableOpacity
        onPress={captureSelfie}
        style={{
          padding: 12,
          backgroundColor: "#007bff",
          borderRadius: 6,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Capture Selfie
        </Text>
      </TouchableOpacity>

      {selfie && <Text style={{ marginTop: 5 }}>Selfie captured!</Text>}

      <TouchableOpacity
        onPress={pickDocument}
        style={{
          padding: 12,
          backgroundColor: "black",
          borderRadius: 6,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Upload Document
        </Text>
      </TouchableOpacity>

      {document && <Text style={{ marginTop: 5 }}>{document.name}</Text>}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={{
          padding: 12,
          backgroundColor: "green",
          borderRadius: 6,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {loading ? "Verifying..." : "Submit"}
        </Text>
      </TouchableOpacity>

      {result && (
        <View style={{ marginTop: 20 }}>
          {result.error ? (
            <Text style={{ color: "red" }}>{result.message}</Text>
          ) : (
            <View>
              <Text>Face Similarity: {result.confidence}%</Text>
              <Text>Match: {JSON.stringify(result.face_match)}</Text>
              <Text>DOB: {result.dob}</Text>
              <Text>Age: {result.age}</Text>
            </View>
          )}
        </View>
      )}

      {result && (
        <TouchableOpacity
          onPress={resetForm}
          style={{
            padding: 10,
            backgroundColor: "red",
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Reset</Text>
        </TouchableOpacity>
      )}

      <Toast />
    </View>
  );
}
