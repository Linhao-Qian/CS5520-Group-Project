import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { Button, Card } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
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

  const handleSaveRecord = () => {
    console.log("Record saved:", currentRecord);
    navigation.goBack();
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
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Add Health Record</Text>
          <FormInput
            label="Blood Pressure (mmHg)"
            value={currentRecord.bloodPressure}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, bloodPressure: text })}
            keyboardType="numeric"
          />
          <FormInput
            label="Blood Sugar (mg/dL)"
            value={currentRecord.bloodSugar}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, bloodSugar: text })}
            keyboardType="numeric"
          />
          <FormInput
            label="Weight (kg)"
            value={currentRecord.weight}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, weight: text })}
            keyboardType="numeric"
          />
          <FormInput
            label="Sleep Duration (hours)"
            value={currentRecord.sleepDuration}
            onChangeText={(text) => setCurrentRecord({ ...currentRecord, sleepDuration: text })}
            keyboardType="numeric"
          />
          <FormInput
            label="Heart Rate (bpm)"
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
    backgroundColor: colors.background,
    padding: 20,
  },
  card: {
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    marginTop: 20,
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
