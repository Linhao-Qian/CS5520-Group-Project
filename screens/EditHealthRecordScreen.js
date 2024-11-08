import React, { useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, Platform } from "react-native";
import { TextInput, Button, Card, IconButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addOrUpdateHealthRecord, deleteHealthRecord } from "../services/firestoreHelper";
import { colors } from "../styles/styles";

const EditHealthRecordScreen = ({ navigation, route }) => {
  const recordToEdit = route.params?.record;

  const [currentRecord, setCurrentRecord] = useState({
    ...recordToEdit,
    date: recordToEdit.date.toDate ? recordToEdit.date.toDate() : new Date(),
  });
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="delete"
          color="red"
          onPress={confirmDelete}
        />
      ),
    });
  }, [navigation]);

  const validateInputs = () => {
    const { bloodPressure, bloodSugar, weight, sleepDuration, heartRate } = currentRecord;
    const numericFields = [
      { label: "Blood Pressure", value: bloodPressure },
      { label: "Blood Sugar", value: bloodSugar },
      { label: "Weight", value: weight },
      { label: "Sleep Duration", value: sleepDuration },
      { label: "Heart Rate", value: heartRate },
    ];

    for (const field of numericFields) {
      if (field.value === "" || isNaN(field.value) || Number(field.value) < 0) {
        Alert.alert("Invalid Input", `${field.label} must be a non-negative number.`);
        return false;
      }
    }
    return true;
  };

  const handleSaveRecord = async () => {
    if (!validateInputs()) return;

    try {
      await addOrUpdateHealthRecord(currentRecord);
      Alert.alert("Success", "Health record updated.");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update record:", error);
    }
  };

  const confirmDelete = () => {
    Alert.alert("Delete Record", "Are you sure you want to delete this record?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: handleDeleteRecord, style: "destructive" },
    ]);
  };

  const handleDeleteRecord = async () => {
    try {
      await deleteHealthRecord(currentRecord.id);
      Alert.alert("Success", "Health record deleted.");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === "set") { 
      const currentDate = selectedDate || currentRecord.date;
      setCurrentRecord({ ...currentRecord, date: currentDate });
    }
    setDatePickerVisible(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Blood Pressure (mmHg) *"
            value={currentRecord.bloodPressure}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, bloodPressure: text })}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label="Blood Sugar (mg/dL) *"
            value={currentRecord.bloodSugar}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, bloodSugar: text })}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label="Weight (kg) *"
            value={currentRecord.weight}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, weight: text })}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label="Sleep Duration (hours) *"
            value={currentRecord.sleepDuration}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, sleepDuration: text })}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label="Heart Rate (bpm) *"
            value={currentRecord.heartRate}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, heartRate: text })}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <Text style={styles.label}>Date *</Text>
          <TextInput
            style={styles.input}
            value={currentRecord.date.toLocaleDateString()}
            onPressIn={showDatePicker}
            editable={false}
            mode="outlined"
            theme={{ colors: { primary: colors.primary } }}
          />

          {datePickerVisible && (
            <DateTimePicker
              value={currentRecord.date}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onDateChange}
            />
          )}

          <Button
            mode="contained"
            onPress={handleSaveRecord}
            style={styles.saveButton}
            theme={{ colors: { primary: colors.primary } }}
          >
            Save
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            theme={{ colors: { primary: colors.primary } }}
          >
            Cancel
          </Button>
        </Card.Content>
      </Card>
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
  input: {
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
  },
  cancelButton: {
    marginTop: 10,
    borderColor: colors.primary,
  },
});

export default EditHealthRecordScreen;
