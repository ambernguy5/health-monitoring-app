import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Svg, { Line } from "react-native-svg";

interface HeartRateGraphProps {
  chartData: any;
  screenWidth: number;
  chartConfig: any;
  loading: boolean;
  selectedReading: any;
  highlightX: number | null;
  onDataPointClick: (event: any) => void;
}

export default function HeartRateGraph({
  chartData,
  screenWidth,
  chartConfig,
  loading,
  selectedReading,
  highlightX,
  onDataPointClick,
}: HeartRateGraphProps) {
  if (loading || !chartData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading heart rate data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Heart Rate Over Time</Text>

      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={280}
        yAxisSuffix=" bpm"
        yAxisInterval={10}
        chartConfig={chartConfig}
        style={styles.chart}
        withDots={false}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={true}
        withHorizontalLines={true}
        segments={4}
        bezier
        onDataPointClick={onDataPointClick}
      />

      {highlightX !== null && (
        <Svg
          style={{
            position: "absolute",
            top: 15,
            left: 20 + highlightX,
            height: 280,
            width: 1,
            zIndex: 1,
          }}
        >
          <Line
            x1="0"
            y1="0"
            x2="0"
            y2="280"
            stroke="red"
            strokeWidth="2"
            strokeDasharray="4"
          />
        </Svg>
      )}

      {selectedReading && (
        <View style={{ marginTop: 10, alignItems: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {selectedReading.label}
          </Text>
          <Text>Heart Rate: {selectedReading.heartRate} bpm</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    padding: 10,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
  },
});
