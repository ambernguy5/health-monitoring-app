import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the HealtheTile App</Text>
      <Link href="/blood_pressure">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to Blood Pressure</Text>
      </Link>
    </View>
  );
}
