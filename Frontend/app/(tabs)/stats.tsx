// app/(tabs)/stats.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

const StatisticsTab = () => {
  const healthData = [
    { id: '1', title: 'Heart', iconName: 'heart', iconColor: '#e74c3c', navigateTo: '/stats/bloodPressureScreen' },
    { id: '2', title: 'Sleep', iconName: 'bed', iconColor: '#9b59b6', navigateTo: '/stats/sleepCycleScreen' },
    { id: '3', title: 'Steps', iconName: 'flame', iconColor: '#f39c12' }
  ];

  const handleItemPress = (item) => {
    if (item.navigateTo) {
      router.push(item.navigateTo);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Statistics</Text>
      <FlatList
        data={healthData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={item.iconName} size={22} color={item.iconColor} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={styles.chevron}>
              <Text style={styles.chevronText}>›</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f5f5f5' 
  },
  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    marginTop: 40,
    color: '#000'
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: { 
    fontSize: 17, 
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  value: { 
    fontSize: 15, 
    color: '#666',
  },
  chevron: {
    marginLeft: 8,
  },
  chevronText: {
    fontSize: 20,
    color: '#c7c7cc',
    fontWeight: '300',
  },
});

export default StatisticsTab;