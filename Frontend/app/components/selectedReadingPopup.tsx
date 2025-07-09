import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SelectedReading {
  systolic: number;
  diastolic: number;
  average: number;
  label: string;
}

interface Props {
  selectedReading: SelectedReading;
}

const SelectedReadingPopup: React.FC<Props> = ({ selectedReading }) => {
  if (!selectedReading) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reading at {selectedReading.label}</Text>
      <View style={styles.grid}>
        <View style={styles.item}>
          <View style={[styles.dot, { backgroundColor: '#e74c3c' }]} />
          <Text style={styles.label}>Systolic</Text>
          <Text style={styles.value}>{selectedReading.systolic} mmHg</Text>
        </View>
        <View style={styles.item}>
          <View style={[styles.dot, { backgroundColor: '#3498db' }]} />
          <Text style={styles.label}>Diastolic</Text>
          <Text style={styles.value}>{selectedReading.diastolic} mmHg</Text>
        </View>
        <View style={styles.item}>
          <View style={[styles.dot, { backgroundColor: '#2ecc71' }]} />
          <Text style={styles.label}>Average</Text>
          <Text style={styles.value}>{selectedReading.average} mmHg</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
});

export default SelectedReadingPopup;
