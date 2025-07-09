import React from "react";
import { View, Text, ActivityIndicator, ScrollView, Platform } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Svg, { Line } from "react-native-svg";
import SelectedReadingPopup from "../selectedReadingPopup"

interface SelectedReading {
  systolic: number;
  diastolic: number;
  average: number;
  label: string;
}

interface BloodPressureGraphProps {
  chartData: any;
  loading: boolean;
  screenWidth: number;
  chartHeight?: number;
  selectedReading: SelectedReading | null;
  highlightX: number | null;
  onDataPointClick: (event: { index: number; x: number }) => void;
}

export default function BloodPressureGraph({
  chartData,
  loading,
  screenWidth,
  chartHeight = 280,
  selectedReading,
  highlightX,
  onDataPointClick,
}: BloodPressureGraphProps) {
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    strokeWidth: Platform.OS === "ios" ? 3 : 2,
    paddingRight: 50,
    paddingLeft: 60,
    paddingTop: 20,
    paddingBottom: 20,
    propsForDots: {
      r: Platform.OS === "ios" ? "6" : "5",
      strokeWidth: "2",
      stroke: "#2c3e50",
      fill: "#ffffff",
    },
    formatYLabel: (yValue: string) => `${yValue} mmHg`,
    propsForBackgroundLines: {
      strokeDasharray: "",
    },
    useShadowColorFromDataset: false,
  };

  if (loading) {
    return (
      <View style={{ height: chartHeight, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Loading blood pressure data...</Text>
      </View>
    );
  }

  if (!chartData) {
    return (
      <View style={{ height: chartHeight, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#e74c3c" }}>Failed to load data</Text>
      </View>
    );
  }

  return (
    <View style={{ position: "relative" }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={chartData}
          width={screenWidth * 1.5}
          height={chartHeight}
          yAxisSuffix=" mmHg"
          yAxisInterval={10}
          chartConfig={chartConfig}
          bezier
          withDots
          withShadow={false}
          withInnerLines
          withOuterLines={false}
          withVerticalLines
          withHorizontalLines
          onDataPointClick={onDataPointClick}
          withHorizontalLabels
          withVerticalLabels
          fromZero={false}
          style={{ borderRadius: 12 }}
        />
        {highlightX !== null && (
          <Svg
            style={{
              position: "absolute",
              top: 20,
              left: 60 + highlightX,
              height: chartHeight,
              width: 1,
              zIndex: 1,
            }}
          >
            <Line
              x1="0"
              y1="0"
              x2="0"
              y2={chartHeight - 40}
              stroke="#e74c3c"
              strokeWidth="2"
              strokeDasharray="4"
            />
          </Svg>
        )}
      </ScrollView>

      
      {selectedReading && (
        <SelectedReadingPopup selectedReading={selectedReading} />
      )}
    </View>
  );
}
