// app/stats/SleepCycleScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions, Text } from "react-native";
import SleepCycleGraph from "../stats/sleepCycleGraph";
import { fetchSleepDataAndProcess } from "../utils/sleepCycleUtils";

const screenWidth = Dimensions.get("window").width;

export default function SleepCycleScreen() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sleepMetrics, setSleepMetrics] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [highlightX, setHighlightX] = useState(null);

  useEffect(() => {
    fetchSleepDataAndProcess(
      (data) => setChartData(data),
      setSleepMetrics,
      setLoading
    );
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sleep Cycle Statistics</Text>
      <SleepCycleGraph
        chartData={chartData}
        loading={loading}
        screenWidth={screenWidth}
        selectedStage={selectedStage}
        highlightX={highlightX}
        onDataPointClick={({ index, x }) => {
          const stage = chartData.stages[index];
          const duration = chartData.durations[index];
          const confidence = chartData.confidences[index];
          const timestamp = chartData.timestamps[index];
          setSelectedStage({ stage, duration, confidence, timestamp });
          setHighlightX(x);
        }}
      />
      
      {sleepMetrics && (
        <View style={styles.metricsContainer}>
          <Text style={styles.metricsText}>
            Total Sleep: {sleepMetrics.totalSleep} min
          </Text>
          <Text style={styles.metricsText}>
            Sleep Efficiency: {sleepMetrics.sleepEfficiency.toFixed(1)}%
          </Text>
          <Text style={styles.metricsText}>
            Avg Confidence: {(sleepMetrics.averageConfidence * 100).toFixed(1)}%
          </Text>
        </View>
      )}
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
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingHorizontal: 10,
  },
  metricsText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
});