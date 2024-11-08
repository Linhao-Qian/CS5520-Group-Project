import React, { useState } from "react";
import { View, Alert, ScrollView, Text, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addOrUpdateHealthRecord } from "../services/firestoreHelper";
import { colors } from "../styles/styles";
import FormInput from "../components/FormInput";

const AddHealthRecordScreen = ({ navigation }) => {
  const [currentRecord, setCurrentRecord] = useState({
    bloodPressure: "",
    bloodSugar: "",
    weight: "",
    sleepDuration: "",
    heartRate: "",
    date: new Date(),
  });
  const [datePickerVisible, setDatePickerVisible] = useState(false);

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
      Alert.alert("Success", "Health record saved.");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save record:", error);
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
          <FormInput
            label="Blood Pressure (mmHg) *"
            value={currentRecord.bloodPressure}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, bloodPressure: text })}
            keyboardType="numeric"
          />
          <FormInput
            label="Blood Sugar (mg/dL) *"
            value={currentRecord.bloodSugar}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, bloodSugar: text })}
            keyboardType="numeric"
          />
          <FormInput
            label="Weight (kg) *"
            value={currentRecord.weight}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, weight: text })}
            keyboardType="numeric"
          />
          <FormInput
            label="Sleep Duration (hours) *"
            value={currentRecord.sleepDuration}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, sleepDuration: text })}
            keyboardType="numeric"
          />
          <FormInput
            label="Heart Rate (bpm) *"
            value={currentRecord.heartRate}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, heartRate: text })}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Date *</Text>
          <FormInput
            value={currentRecord.date.toLocaleDateString()}
            onPressIn={showDatePicker}
            editable={false}
          />

          {datePickerVisible && (
            <DateTimePicker
              value={currentRecord.date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <Button mode="contained" onPress={handleSaveRecord} style={styles.saveButton}>
            Save
          </Button>
          <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.cancelButton}>
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
    elevation: 4,
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

export default AddHealthRecordScreen;
