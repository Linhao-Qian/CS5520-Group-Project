import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, ScrollView, StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { fetchRecoveryRecordById, deleteRecoveryRecord } from "../services/firestoreHelper";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/styles";

const RecordDetail = ({ route, navigation }) => {
  const [record, setRecord] = useState(route.params.record);

  const loadRecord = async () => {
    try {
      const updatedRecord = await fetchRecoveryRecordById(record.id);
      setRecord(updatedRecord);
    } catch (error) {
      console.error("Error fetching updated record:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadRecord();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDeleteRecord = async () => {
    try {
      await deleteRecoveryRecord(record.id);
      Alert.alert("Success", "Recovery record deleted.");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting record:", error);
      Alert.alert("Error", "Failed to delete the recovery record.");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this recovery record?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: handleDeleteRecord, style: "destructive" },
      ]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={confirmDelete} style={{ marginRight: 15 }}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: '#fff',
    });
  }, [navigation, record]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Disease Name:</Text>
          <Text style={styles.text}>{record.diseaseName}</Text>

          <Text style={styles.label}>Symptoms:</Text>
          <Text style={styles.text}>{record.symptoms}</Text>

          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.text}>{new Date(record.startDate).toLocaleDateString()}</Text>

          <Text style={styles.label}>Notes:</Text>
          <Text style={styles.text}>{record.notes}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.photoCard}>
        <Card.Title title="Photos" />
        <Card.Content>
          <View style={styles.photoContainer}>
            {record.photos && record.photos.map((photo, index) => (
              <Image key={index} source={{ uri: photo.downloadURL }} style={styles.photo} />
            ))}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("AddRecoveryRecord", { record })}
        style={styles.editButton}
        icon="pencil"
      >
        Edit
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  photoCard: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.primary,
  },
  text: {
    marginBottom: 10,
  },
  photoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  photo: {
    width: 95,
    height: 95,
    borderRadius: 5,
    margin: 5,
  },
  editButton: {
    backgroundColor: colors.primary,
    marginTop: 10,
  },
});

export default RecordDetail;
