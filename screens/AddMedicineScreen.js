import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { colors } from '../styles/styles';
import FormInput from '../components/FormInput';

const AddMedicineScreen = ({ navigation }) => {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [condition, setCondition] = useState('');
  const [notes, setNotes] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back',
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: colors.primary,
      },
    });
  }, [navigation]);

  const handleSaveReminder = () => {
    if (!medicineName.trim() || !dosage.trim() || !condition.trim()) {
      Alert.alert('Invalid Input', 'Please fill in all required fields');
      return;
    }

    Alert.alert('Success', 'Medicine reminder saved.');
    navigation.goBack();
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
