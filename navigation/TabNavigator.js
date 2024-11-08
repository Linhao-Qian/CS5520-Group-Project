import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HealthRecordsScreen from "../screens/HealthRecordsScreen";
import MedicationRemindersScreen from "../screens/MedicationRemindersScreen";
import RecoveryScreen from "../screens/RecoveryScreen";
import MapScreen from "../screens/MapScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../styles/styles";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Health Stat") {
            iconName = "chart-bell-curve-cumulative";
          } else if (route.name === "Medicine") {
            iconName = "pill";
          } else if (route.name === "Recovery") {
            iconName = "emoticon-sick-outline";
          } else if (route.name === "Map") {
            iconName = "hospital-building";
          } else if (route.name === "Profile") {
            iconName = "account-settings";
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          backgroundColor: colors.primary,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: "#fff",
      })}
    >
      <Tab.Screen 
        name="Health Stat" 
        component={HealthRecordsScreen} 
      />
      <Tab.Screen 
        name="Medicine" 
        component={MedicationRemindersScreen} 
        options={{
          headerRight: () => null,
        }}
      />
      <Tab.Screen 
        name="Recovery" 
        component={RecoveryScreen} 
        options={{
          headerRight: () => null,
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
