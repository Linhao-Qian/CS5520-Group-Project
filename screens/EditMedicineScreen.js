import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { addOrUpdateMedicineReminder, deleteMedicineReminder } from '../services/firestoreHelper';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { colors } from '../styles/styles';

const EditMedicineScreen = ({ navigation, route }) => {
  const reminderToEdit = route.params?.reminder || null;

  const [medicineName, setMedicineName] = useState(reminderToEdit?.medicineName || '');
  const [dosage, setDosage] = useState(reminderToEdit?.dosage || '');
  const [time, setTime] = useState(reminderToEdit?.time ? new Date(reminderToEdit?.time) : new Date());
  const [condition, setCondition] = useState(reminderToEdit?.condition || '');
  const [notes, setNotes] = useState(reminderToEdit?.notes || '');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useLayoutEffect(() => {
    if (reminderToEdit && reminderToEdit.id) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={handleDeleteReminder}>
            <MaterialIcons name="delete" size={24} color="red" style={{ marginRight: 15 }} />
          </TouchableOpacity>
        ),
        headerBackTitle: 'Back',
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: colors.primary,
        },
      });
    }
  }, [navigation, reminderToEdit]);

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

    const reminderData = {
      medicineName,
      dosage,
      time: time.toISOString(),
      condition,
      notes,
      id: reminderToEdit ? reminderToEdit.id : null,
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

  const handleDeleteReminder = () => {
    if (!reminderToEdit || !reminderToEdit.id) {
      Alert.alert('Error', 'Invalid reminder selected for deletion.');
      return;
    }

    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this medicine reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMedicineReminder(reminderToEdit.id);
              await Notifications.cancelScheduledNotificationAsync(reminderToEdit.id);
              Alert.alert('Success', 'Medicine reminder deleted.');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting reminder:', error);
              Alert.alert('Error', 'Failed to delete the reminder.');
            }
          },
        },
      ],
      { cancelable: true }
    );
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
          <TextInput
            label="Medicine Name *"
            value={medicineName}
            onChangeText={setMedicineName}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          <TextInput
            label="Dosage *"
            value={dosage}
            onChangeText={setDosage}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          <TouchableOpacity onPress={showDatePicker}>
            <TextInput
              label="Time"
              value={time ? time.toLocaleString() : ''}
              mode="outlined"
              style={styles.input}
              editable={false}
              pointerEvents="none"
              theme={{ colors: { primary: colors.primary } }}
              right={<TextInput.Icon name="calendar" />}
            />
          </TouchableOpacity>

          <TextInput
            label="Condition *"
            value={condition}
            onChangeText={setCondition}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          <TextInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          <Button
            mode="contained"
            onPress={handleSaveReminder}
            style={styles.saveButton}
          >
            Save
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
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
  input: {
    marginBottom: 15,
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

export default EditMedicineScreen;
