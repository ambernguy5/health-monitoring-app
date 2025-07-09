// app/stats/bloodPressureScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions, Text } from "react-native";
import BloodPressureGraph from "../components/graphs/bloodPressureGraph";
import Config from "../config";
import { fetchBloodPressureDataAndProcess } from "../utils/bloodPressureUtils";

const screenWidth = Dimensions.get("window").width;

export default function BloodPressureScreen() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentValue, setCurrentValue] = useState(null);
  const [selectedReading, setSelectedReading] = useState(null);
  const [highlightX, setHighlightX] = useState(null);

  useEffect(() => {
    fetchBloodPressureDataAndProcess(
      (data) => setChartData(data),
      setCurrentValue,
      setLoading,
      Config.API_BASE_URL
    );
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Blood Pressure Stats</Text>
      <BloodPressureGraph
        chartData={chartData}
        loading={loading}
        screenWidth={screenWidth}
        selectedReading={selectedReading}
        highlightX={highlightX}
        onDataPointClick={({ index, x }) => {
          const systolic = chartData.datasets[0].data[index];
          const diastolic = chartData.datasets[1].data[index];
          const average = chartData.datasets[2].data[index];
          const label = chartData.labels[index];
          setSelectedReading({ systolic, diastolic, average, label });
          setHighlightX(x);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
});
