// Navegador básico temporal para el ejemplo
import { StyleSheet, Text, View } from 'react-native';

const MainNavigator = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Kredi Mobile App</Text>
      <Text style={styles.subtext}>Navegador principal aquí</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default MainNavigator;