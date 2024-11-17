import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { fetchUserProfile } from '../services/firestoreHelper';
import { auth } from '../services/firebaseSetup';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../styles/styles';
import { signOut } from 'firebase/auth';

const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Others', value: 'Others' },
  { label: 'Prefer Not to Say', value: 'Prefer Not to Say' },
];

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    username: 'default_user',
    email: '',
    avatar: null,
    height: '',
    gender: 'Male',
    age: '',
    allergies: '',
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      const userData = await fetchUserProfile();
      if (userData) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          ...userData,
          age: userData.age || '',
        }));
      } else {
        setProfile((prevProfile) => ({ ...prevProfile, email: auth.currentUser?.email }));
      }
    };
    loadUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
      console.error(error);
    }
  };

  const handleChooseAvatar = () => {
    
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.secondary }]}>
      <TouchableOpacity onPress={handleChooseAvatar}>
        <Image
          source={profile.avatar ? { uri: profile.avatar } : require('../assets/user.png')}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Email"
            value={profile.email}
            disabled
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label="Username"
            value={profile.username}
            onChangeText={(text) => setProfile({ ...profile, username: text })}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label="Height (cm)"
            value={profile.height}
            onChangeText={(text) => setProfile({ ...profile, height: text })}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <Text style={styles.label}>Gender</Text>
          <Dropdown
            style={styles.dropdown}
            data={genderOptions}
            labelField="label"
            valueField="value"
            value={profile.gender}
            onChange={(item) => setProfile({ ...profile, gender: item.value })}
          />
          <TextInput
            label="Age"
            value={profile.age.toString()}
            onChangeText={(text) => setProfile({ ...profile, age: text })}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label="Allergies"
            value={profile.allergies}
            onChangeText={(text) => setProfile({ ...profile, allergies: text })}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <Button mode="contained" onPress={handleSaveProfile} style={styles.saveButton}>
            Save Profile
          </Button>
          <Button
            mode="contained"
            onPress={handleLogOut}
            style={styles.logoutButton}
          >
            Log Out
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 3,
  },
  input: {
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
  },
  logoutButton: {
    marginTop: 10,
  },
});

export default ProfileScreen;
