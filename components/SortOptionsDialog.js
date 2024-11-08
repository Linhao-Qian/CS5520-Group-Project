import React from 'react';
import { Dialog, Portal, RadioButton, Button } from 'react-native-paper';

const SortOptionsDialog = ({ visible, onDismiss, selectedOption, onOptionSelect }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Select Sort Option</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group onValueChange={onOptionSelect} value={selectedOption}>
            <RadioButton.Item label="Date" value="date" />
            <RadioButton.Item label="Blood Pressure" value="bloodPressure" />
            <RadioButton.Item label="Blood Sugar" value="bloodSugar" />
            <RadioButton.Item label="Weight" value="weight" />
          </RadioButton.Group>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default SortOptionsDialog;
