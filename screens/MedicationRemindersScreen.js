import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, Card, Paragraph } from 'react-native-paper';
import { fetchMedicineReminders } from '../services/firestoreHelper';
import { colors } from '../styles/styles';
import SearchBar from '../components/SearchBar';

const MedicationRemindersScreen = ({ navigation }) => {
  const [reminders, setReminders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReminders, setFilteredReminders] = useState([]);

  const loadReminders = async () => {
    try {
      const fetchedReminders = await fetchMedicineReminders();
      setReminders(fetchedReminders);
      setFilteredReminders(fetchedReminders);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadReminders();
    });
    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="plus"
          color={colors.primary}
          size={24}
          onPress={() => navigation.navigate('AddMedicine')}
        />
      ),
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: '#fff',
    });
  }, [navigation]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = reminders.filter((reminder) =>
        reminder.medicineName?.toLowerCase().includes(query.toLowerCase()) ||
        reminder.notes?.toLowerCase().includes(query.toLowerCase()) ||
        reminder.condition?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredReminders(filtered);
    } else {
      setFilteredReminders(reminders);
    }
  };

  const isPastReminder = (reminderTime) => {
    const currentTime = new Date();
    return new Date(reminderTime) < currentTime;
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: undefined, 
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar
        placeholder="Search Medications"
        query={searchQuery}
        onChangeQuery={handleSearch}
      />

      <FlatList
        data={filteredReminders}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => {
          const pastReminder = isPastReminder(item.time);
          const cardBackgroundColor = pastReminder ? '#DFF0E5' : '#FFE5E5';
          const iconColor = pastReminder ? 'green' : 'red';
          const iconName = pastReminder ? 'check-circle' : 'close-circle';

          return (
            <Card style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditMedicine', { reminder: item })}
              >
                <Card.Title
                  title={item.medicineName}
                  titleStyle={styles.cardTitle}
                  subtitle={`Dosage: ${item.dosage}`}
                  subtitleStyle={styles.cardSubtitle}
                  right={() => (
                    <IconButton
                      icon={iconName}
                      size={28}
                      color={iconColor}
                      style={styles.statusIcon}
                    />
                  )}
                />
                <Card.Content>
                  <Paragraph style={styles.detailsText}>{`Time: ${formatTime(item.time)}`}</Paragraph>
                  <Paragraph style={styles.detailsText}>{`Condition: ${item.condition}`}</Paragraph>
                  <Paragraph style={styles.detailsText}>{`Notes: ${item.notes}`}</Paragraph>
                </Card.Content>
              </TouchableOpacity>
            </Card>
          );
        }}
        ListEmptyComponent={() => (
          <Text style={styles.noResultsText}>No Medications Found</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 10,
    borderRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  statusIcon: {
    marginRight: 10,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default MedicationRemindersScreen;
