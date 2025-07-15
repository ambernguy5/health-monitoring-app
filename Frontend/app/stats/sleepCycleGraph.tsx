import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import Svg, {
  G,
  Path,
  Circle,
  Line,
  Text as SvgText,
} from "react-native-svg";

// Sleep stage to numeric mapping for visualization
const STAGE_VALUES = {
  'AWAKE': 5,
  'REM': 4,
  'N1': 3,
  'N2': 2,
  'N3': 1
} as const;

// Stage labels for Y-axis
const STAGE_LABELS = {
  5: 'AWAKE',
  4: 'REM',
  3: 'N1',
  2: 'N2', 
  1: 'N3'
} as const;

export interface SleepCycleGraphProps {
  chartData: any;
  loading: boolean;
  screenWidth: number;
  selectedStage?: any;
  highlightX?: number;
  onDataPointClick?: (data: { index: number; x: number }) => void;
}

const SleepCycleGraph: React.FC<SleepCycleGraphProps> = ({
  chartData,
  loading,
  screenWidth,
  selectedStage,
  highlightX,
  onDataPointClick,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading sleep data...</Text>
      </View>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No sleep data available</Text>
      </View>
    );
  }

  const graphWidth = screenWidth - 40;
  const graphHeight = 300;
  const margin = { top: 20, right: 30, bottom: 60, left: 80 };
  const chartWidth = graphWidth - margin.left - margin.right;
  const chartHeight = graphHeight - margin.top - margin.bottom;

  // Process the data for step chart
  const totalDurationSeconds = chartData.reduce((sum: number, point: any) => sum + point.duration, 0);
  const totalDurationHours = totalDurationSeconds / 3600;

  let cumulativeTime = 0;
  const stepPoints = chartData.map((point: any, index: number) => {
    const startTime = cumulativeTime;
    const endTime = cumulativeTime + point.duration;
    cumulativeTime = endTime;
    
    const startX = (startTime / totalDurationSeconds) * chartWidth;
    const endX = (endTime / totalDurationSeconds) * chartWidth;
    const stageValue = STAGE_VALUES[point.stage as keyof typeof STAGE_VALUES];
    const y = chartHeight - ((stageValue - 1) / 4) * chartHeight;
    
    return {
      ...point,
      startX,
      endX,
      y,
      stageValue,
      index,
    };
  });

  // Create the step path
  const createStepPath = () => {
    if (stepPoints.length === 0) return '';
    
    let path = `M ${stepPoints[0].startX} ${stepPoints[0].y}`;
    
    stepPoints.forEach((point: any, index: number) => {
      path += ` L ${point.endX} ${point.y}`;
      
      if (index < stepPoints.length - 1) {
        const nextPoint = stepPoints[index + 1];
        path += ` L ${point.endX} ${nextPoint.y}`;
      }
    });
    
    return path;
  };

  // Generate hour markers
  const hourMarkers = [];
  for (let i = 0; i <= Math.ceil(totalDurationHours); i++) {
    const x = (i / totalDurationHours) * chartWidth;
    hourMarkers.push({ hour: i, x });
  }

  return (
    <View style={styles.container}>
      {/* Header with legend */}
      <View style={styles.header}>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#4f46e5" }]} />
            <Text style={styles.legendText}>Sleep Stages</Text>
          </View>
        </View>
      </View>

      {/* Graph */}
      <View style={styles.graphContainer}>
        <Svg width={graphWidth} height={graphHeight}>
          <G x={margin.left} y={margin.top}>
            {/* Background grid lines */}
            {[1, 2, 3, 4, 5].map(stage => {
              const y = chartHeight - ((stage - 1) / 4) * chartHeight;
              return (
                <Line
                  key={stage}
                  x1={0}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
              );
            })}
            
            {/* Vertical hour grid lines */}
            {hourMarkers.map(marker => (
              <Line
                key={marker.hour}
                x1={marker.x}
                y1={0}
                x2={marker.x}
                y2={chartHeight}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
            ))}
            
            {/* Step chart path */}
            <Path
              d={createStepPath()}
              fill="none"
              stroke="#4f46e5"
              strokeWidth={2}
              strokeLinejoin="miter"
            />
            
            {/* Data points */}
            {stepPoints.map((point: any) => (
              <G key={point.index}>
                <Circle
                  cx={point.startX}
                  cy={point.y}
                  r={3}
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  onPress={() => onDataPointClick?.({ index: point.index, x: point.startX })}
                />
                <Circle
                  cx={point.endX}
                  cy={point.y}
                  r={3}
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  onPress={() => onDataPointClick?.({ index: point.index, x: point.endX })}
                />
              </G>
            ))}
            
            {/* Highlight selected point */}
            {highlightX && (
              <Line
                x1={highlightX}
                y1={0}
                x2={highlightX}
                y2={chartHeight}
                stroke="#ff6b6b"
                strokeWidth={2}
                strokeDasharray="5,5"
              />
            )}
            
            {/* Y-axis labels */}
            {Object.entries(STAGE_LABELS).map(([value, label]) => {
              const numValue = parseInt(value);
              const y = chartHeight - ((numValue - 1) / 4) * chartHeight;
              
              return (
                <SvgText
                  key={value}
                  x={-15}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {label}
                </SvgText>
              );
            })}
            
            {/* X-axis hour labels */}
            {hourMarkers.map(marker => (
              <SvgText
                key={marker.hour}
                x={marker.x}
                y={chartHeight + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {marker.hour}h
              </SvgText>
            ))}
          </G>
        </Svg>
      </View>

      {/* Selected stage info */}
      {selectedStage && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedText}>
            {selectedStage.stage} - {Math.round(selectedStage.duration / 60)} min
            ({(selectedStage.confidence * 100).toFixed(1)}% confidence)
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#374151",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: "#6b7280",
  },
  graphContainer: {
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    backgroundColor: "#ffffff",
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    backgroundColor: "#ffffff",
    borderRadius: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
  },
  selectedInfo: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
  },
  selectedText: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
  },
});

export default SleepCycleGraph;