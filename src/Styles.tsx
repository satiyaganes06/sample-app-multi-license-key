import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  normalText: {
    fontWeight: 'normal',
    fontSize: 20,
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});

export default styles;
