import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { IconButton, Button, Provider } from "react-native-paper";
import { fetchHealthRecords } from "../services/firestoreHelper";
import { colors } from "../styles/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RecordCard from "../components/RecordCard";
import SortOptionsDialog from "../components/SortOptionsDialog";

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  return `Health Record: ${new Date(date.seconds * 1000).toLocaleDateString('en-US', options)}`;
};

const HealthRecordsScreen = ({ navigation }) => {
  const [records, setRecords] = useState([]);
  const [sortOption, setSortOption] = useState("date");
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadHealthRecords();
    });

    loadHealthRecords();

    return unsubscribe;
  }, [navigation]);

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
      headerTintColor: '#fff',
    });
  }, [navigation]);

  const loadHealthRecords = async () => {
    try {
      const recordsList = await fetchHealthRecords();
      setRecords(recordsList);
    } catch (error) {
      console.error("Failed to load health records:", error);
    }
  };

  const sortRecords = (records, option) => {
    switch (option) {
      case "date":
        return records.sort((a, b) => b.date.seconds - a.date.seconds);
      case "bloodPressure":
        return records.sort((a, b) => parseFloat(b.bloodPressure) - parseFloat(a.bloodPressure));
      case "bloodSugar":
        return records.sort((a, b) => parseFloat(b.bloodSugar) - parseFloat(a.bloodSugar));
      case "weight":
        return records.sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));
      default:
        return records;
    }
  };

  const isHealthy = (record) => {
    const { bloodPressure, bloodSugar, sleepDuration, heartRate } = record;

    const healthyRanges = {
      bloodPressure: { min: 90, max: 120 },
      bloodSugar: { min: 70, max: 110 },
      sleepDuration: { min: 7, max: 9 },
      heartRate: { min: 60, max: 100 },
    };

    const checkInRange = (value, { min, max }) => {
      const num = parseFloat(value);
      return num >= min && num <= max;
    };

    const warnings = [];

    if (!checkInRange(bloodPressure, healthyRanges.bloodPressure)) {
      warnings.push(`Blood Pressure should be between ${healthyRanges.bloodPressure.min}-${healthyRanges.bloodPressure.max} mmHg.`);
    }

    if (!checkInRange(bloodSugar, healthyRanges.bloodSugar)) {
      warnings.push(`Blood Sugar should be between ${healthyRanges.bloodSugar.min}-${healthyRanges.bloodSugar.max} mg/dL.`);
    }

    if (!checkInRange(sleepDuration, healthyRanges.sleepDuration)) {
      warnings.push(`Sleep Duration should be between ${healthyRanges.sleepDuration.min}-${healthyRanges.sleepDuration.max} hours.`);
    }

    if (!checkInRange(heartRate, healthyRanges.heartRate)) {
      warnings.push(`Heart Rate should be between ${healthyRanges.heartRate.min}-${healthyRanges.heartRate.max} bpm.`);
    }

    return {
      isHealthy: warnings.length === 0,
      warnings: warnings,
    };
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setDialogVisible(false);
  };

  return (
    <Provider>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.sortContainer}>
          <Button
            mode="outlined"
            onPress={() => setDialogVisible(true)}
            style={styles.sortButton}
            contentStyle={{ flexDirection: 'row-reverse' }}
            icon={() => (
              <MaterialIcons name="arrow-drop-down" size={24} color={colors.primary} />
            )}
            labelStyle={{ color: colors.primary, fontSize: 16 }}
          >
            Sort by: {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
          </Button>
          
          <SortOptionsDialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
            selectedOption={sortOption}
            onOptionSelect={handleSortChange}
          />
        </View>

        <FlatList
          data={sortRecords(records, sortOption)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const { isHealthy: recordIsHealthy, warnings } = isHealthy(item);
            const cardBackgroundColor = recordIsHealthy ? '#DFF0E5' : '#FFE5E5';

            return (
              <RecordCard
                title={formatDate(item.date)}
                subtitle={`Blood Pressure: ${item.bloodPressure} mmHg`}
                details={[
                  `Blood Sugar: ${item.bloodSugar} mg/dL`,
                  `Weight: ${item.weight} kg`,
                  `Sleep Duration: ${item.sleepDuration} hours`,
                  `Heart Rate: ${item.heartRate} bpm`
                ]}
                warnings={warnings}
                backgroundColor={cardBackgroundColor}
                onPress={() => navigation.navigate("EditHealthRecord", { record: item })}
              />
            );
          }}
          ListEmptyComponent={() => (
            <Text style={styles.noResultsText}>No Health Records Found</Text>
          )}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sortContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  sortButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default HealthRecordsScreen;
