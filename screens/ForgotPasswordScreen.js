import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { TextInput, Card } from 'react-native-paper';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebaseSetup';
import { styles, colors } from '../styles/styles';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordReset = async () => {
    try {
      if (!email.trim()) {
        setErrorMessage('Email cannot be empty.');
        return;
      }
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to send password reset email. Please try again.');
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <Card style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.compactInput}
          placeholderTextColor={colors.placeholder}
          mode="outlined"
          theme={{
            colors: {
              primary: colors.primary,
              underlineColor: 'transparent',
              text: colors.text,
            },
          }}
        />
        {message ? <Text style={styles.successText}>{message}</Text> : null}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
          <Text style={styles.buttonText}>Send Reset Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default ForgotPasswordScreen;
