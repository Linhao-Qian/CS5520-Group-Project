import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { fetchRecoveryRecords } from "../services/firestoreHelper";
import { IconButton } from "react-native-paper";
import { colors } from "../styles/styles";
import RecordCard from "../components/RecordCard";

const RecoveryScreen = ({ navigation }) => {
  const [records, setRecords] = useState([]);
  const cardBackgroundColor = '#DFF0E5';

  const loadRecords = async () => {
    try {
      const fetchedRecords = await fetchRecoveryRecords();
      const processedRecords = fetchedRecords.map((record) => ({
        ...record,
        photos: record.photos ? record.photos.slice(0, 3).map(photo => photo.downloadURL) : [],
      }));
      setRecords(processedRecords);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadRecords();
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
          onPress={() => navigation.navigate("AddRecoveryRecord")}
        />
      ),
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: '#fff',
    });
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordCard
            title={item.diseaseName}
            subtitle={`Start Date: ${new Date(item.startDate).toLocaleDateString()}`}
            details={[
              `Symptoms: ${item.symptoms}`,
              `Notes: ${item.notes}`
            ]}
            photos={item.photos}
            backgroundColor={cardBackgroundColor}
            onPress={() => navigation.navigate("RecordDetail", { record: item })}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.noResultsText}>No Recovery Records Found</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default RecoveryScreen;
