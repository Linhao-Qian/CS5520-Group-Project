import { StyleSheet } from "react-native";

export const colors = {
  primary: "#4CAF50",
  secondary: "#C5EBC7",
  text: "#2E7D32",
  error: "#f44336",
  placeholder: "#81C784",
  border: "#A5D6A7",
  background: "#C5EBC7",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: colors.text,
  },
});
