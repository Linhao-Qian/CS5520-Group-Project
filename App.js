import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStackNavigator from "./navigation/MainStackNavigator";
import { Provider as PaperProvider } from "react-native-paper";

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <MainStackNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
