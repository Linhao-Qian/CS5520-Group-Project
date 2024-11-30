import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import TabNavigator from "./TabNavigator";
import AddMedicineScreen from "../screens/AddMedicineScreen";
import EditMedicineScreen from "../screens/EditMedicineScreen";
import AddRecoveryRecord from "../screens/AddRecoveryRecord";
import RecoveryScreen from "../screens/RecoveryScreen";
import RecordDetail from "../screens/RecordDetail";
import AddHealthRecordScreen from "../screens/AddHealthRecordScreen";
import EditHealthRecordScreen from "../screens/EditHealthRecordScreen";
import { colors } from "../styles/styles";

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Home" 
        component={TabNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="AddMedicine"
        component={AddMedicineScreen}
        options={{
          title: "Add Medicine",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="EditMedicine"
        component={EditMedicineScreen}
        options={{
          title: "Edit Medicine",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="Recovery"
        component={RecoveryScreen}
        options={{
          title: "Recovery",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="AddRecoveryRecord"
        component={AddRecoveryRecord}
        options={{
          title: "Add Recovery Record",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="RecordDetail"
        component={RecordDetail}
        options={{
          title: "Record Details",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="AddHealthRecord"
        component={AddHealthRecordScreen}
        options={{
          title: "Add Health Record",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="EditHealthRecord"
        component={EditHealthRecordScreen}
        options={{
          title: "Edit Health Record",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
