// graphs/blood_pressure_graph.tsx
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Svg, { Line } from "react-native-svg";

interface BloodPressureGraphProps {
  chartData: any;
  screenWidth: number;
  chartConfig: any;
  loading: boolean;
  selectedReading: {
    systolic: number;
    diastolic: number;
    average: number;
    label: string;
  } | null;
  highlightX: number | null;
  onDataPointClick: (event: { index: number; x: number }) => void;
}

export default function BloodPressureGraph({
  chartData,
  screenWidth,
  chartConfig,
  loading,
  selectedReading,
  highlightX,
  onDataPointClick,
}: BloodPressureGraphProps) {
  if (loading) {
    return (
      <View style={{ height: 280, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!chartData) {
    return (
      <View style={{ height: 280, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#e74c3c" }}>Failed to load data</Text>
      </View>
    );
  }

  return (
    <View style={{ position: "relative" }}>
      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={280}
        yAxisSuffix=" mmHg"
        yAxisInterval={10}
        chartConfig={chartConfig}
        withDots={false}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={true}
        withHorizontalLines={true}
        segments={4}
        bezier
        onDataPointClick={onDataPointClick}
        style={{ borderRadius: 10 }}
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
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{selectedReading.label}</Text>
          <Text>Systolic: {selectedReading.systolic} mmHg</Text>
          <Text>Diastolic: {selectedReading.diastolic} mmHg</Text>
          <Text>Average: {selectedReading.average} mmHg</Text>
        </View>
      )}
    </View>
  );
}
