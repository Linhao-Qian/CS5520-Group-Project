import React, { useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { IconButton } from "react-native-paper";
import { colors } from "../styles/styles";

const HealthRecordsScreen = ({ navigation }) => {
  const [records, setRecords] = useState([
    { id: "1", date: "2024-10-01", bloodPressure: "120/80", bloodSugar: "90", weight: "70 kg" },
    { id: "2", date: "2024-10-02", bloodPressure: "125/85", bloodSugar: "95", weight: "71 kg" },
  ]);

  const renderRecord = ({ item }) => (
    <View style={styles.recordCard}>
      <Text style={styles.recordText}>Date: {item.date}</Text>
      <Text style={styles.recordText}>Blood Pressure: {item.bloodPressure}</Text>
      <Text style={styles.recordText}>Blood Sugar: {item.bloodSugar}</Text>
      <Text style={styles.recordText}>Weight: {item.weight}</Text>
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="plus"
          color="#fff"
          size={24}
          onPress={() => navigation.navigate("AddHealthRecord")}
        />
      ),
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: "#fff",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Records</Text>
      <FlatList
        data={records}
        renderItem={renderRecord}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
  },
  recordCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  recordText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
  },
});

export default HealthRecordsScreen;
