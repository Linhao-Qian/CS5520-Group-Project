import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#4CAF50',
  secondary: '#C5EBC7',
  text: '#2E7D32',
  error: '#f44336',
  placeholder: '#81C784',
  border: '#A5D6A7',
  background: '#C5EBC7',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 40,
    resizeMode: 'contain',
    marginTop: 50,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
    textAlign: 'left',
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 10,
    paddingVertical: 10,
  },
  linkText: {
    color: colors.primary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: colors.error,
    marginBottom: 10,
    textAlign: 'center',
  },
});
