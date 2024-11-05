import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseSetup';
import { createUserProfile } from '../services/firestoreHelper';
import { styles } from '../styles/styles';
import FormInput from '../components/FormInput';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email) => {
    return email.trim() !== '';
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async () => {
    if (!validateEmail(email)) {
      setErrorMessage('Email cannot be empty.');
      return;
    }
    if (!validatePassword(password)) {
      setErrorMessage(
        'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await createUserProfile({
        uid: user.uid,
        email: user.email,
        username: 'default_user',
        avatar: null,
        height: null,
        gender: 'Prefer Not to Say',
        age: null,
        allergies: null,
      });
      navigation.replace('Home');
    } catch (error) {
      setErrorMessage('Error creating account. Please try again.');
      console.error('Error creating user:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Card style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>
        <Text>Create a new account</Text>
        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter your email"
        />
        <FormInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
        />
        <FormInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm your password"
        />
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default SignUpScreen;
