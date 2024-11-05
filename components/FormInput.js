import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { colors } from '../styles/styles';

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  errorMessage,
  secureTextEntry = false,
  mode = 'outlined',
  theme = { colors: { primary: colors.primary } },
  style,
  editable = true,
  ...props
}) => {
  return (
    <View style={style}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        mode={mode}
        theme={theme}
        style={styles.input}
        editable={editable}
        {...props}
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormInput;
