import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button, Card } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { addOrUpdateMedicineReminder } from '../services/firestoreHelper';
import * as Notifications from 'expo-notifications';
import { colors } from '../styles/styles';
import FormInput from '../components/FormInput';

const AddMedicineScreen = ({ navigation }) => {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState(new Date());
  const [condition, setCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Please enable notification permissions to set reminders.'
          );
        }
      }
    };

    requestNotificationPermission();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back',
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: colors.primary,
      },
    });
  }, [navigation]);

  const handleSaveReminder = async () => {
    const currentTime = new Date();

    if (!medicineName.trim() || !dosage.trim() || !condition.trim()) {
      Alert.alert('Invalid Input', 'Please fill in all required fields');
      return;
    }

    if (time <= currentTime) {
      Alert.alert('Invalid Time', 'Please select a future time for the reminder.');
      return;
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please enable notification permissions to set reminders.'
      );
      return;
    }

    const reminderData = {
      medicineName,
      dosage,
      time: time.toISOString(),
      condition,
      notes,
    };

    try {
      await addOrUpdateMedicineReminder(reminderData);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Medicine Reminder',
          body: `It's time to take your medicine: ${medicineName} (${dosage})`,
          sound: true,
        },
        trigger: { date: time },
      });

      Alert.alert('Success', 'Medicine reminder saved.');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving reminder:', error);
      Alert.alert('Error', 'Failed to save the reminder.');
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    const roundedTime = new Date(selectedDate);
    roundedTime.setSeconds(0);
    setTime(roundedTime);
    hideDatePicker();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <FormInput
            label="Medicine Name *"
            value={medicineName}
            onChangeText={setMedicineName}
          />

          <FormInput
            label="Dosage *"
            value={dosage}
            onChangeText={setDosage}
          />

          <TouchableOpacity onPress={showDatePicker}>
            <FormInput
              label="Time"
              value={time ? time.toLocaleString() : ''}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>

          <FormInput
            label="Condition *"
            value={condition}
            onChangeText={setCondition}
          />

          <FormInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
          />

          <Button mode="contained" onPress={handleSaveReminder} style={styles.saveButton}>
            Save
          </Button>
          <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.cancelButton}>
            Cancel
          </Button>
        </Card.Content>
      </Card>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    paddingVertical: 20,
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

export default AddMedicineScreen;
