import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AddMedicineScreen = ({ navigation }) => {
  const [time, setTime] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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

      {/* 日期选择器 */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};
