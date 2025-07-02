// app/BloodPressureGraph.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  Text, 
  ActivityIndicator, 
  ScrollView,
  Platform,
  TouchableOpacity 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart } from "react-native-chart-kit";
import { Stack, router } from 'expo-router';
import Svg, { Line } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import Config from '../config';
import { fetchBloodPressureDataAndProcess } from '../utils/bloodPressureUtils';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function BloodPressureGraphScreen() {
  const insets = useSafeAreaInsets();
  
  // Calculate responsive dimensions
  const chartWidth = Math.max(screenWidth * 1.5, 600); // Make chart wider for horizontal scrolling
  const chartHeight = Math.min(screenHeight * 0.4, 350);
  
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentValue, setCurrentValue] = useState(null);
  const [selectedReading, setSelectedReading] = useState(null);
  const [highlightX, setHighlightX] = useState(null);
  const [error, setError] = useState(false);

  // Function to ensure data is properly formatted for 10-minute intervals
  const processChartData = (rawData) => {
    if (!rawData || !rawData.labels) return rawData;
    
    // Filter to only show 10-minute intervals (every other data point if you have 5-min intervals)
    const filteredLabels = rawData.labels.filter((label, index) => {
      // Only show labels that end in :00, :10, :20, :30, :40, :50
      const time = label.split(':');
      if (time.length >= 2) {
        const minutes = parseInt(time[1]);
        return minutes % 10 === 0;
      }
      return index % 2 === 0; // Fallback: show every other point
    });

    const filteredIndices = rawData.labels.map((label, index) => {
      const time = label.split(':');
      if (time.length >= 2) {
        const minutes = parseInt(time[1]);
        return minutes % 10 === 0 ? index : -1;
      }
      return index % 2 === 0 ? index : -1;
    }).filter(index => index !== -1);

    const filteredDatasets = rawData.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.filter((_, index) => filteredIndices.includes(index))
    }));

    return {
      ...rawData,
      labels: filteredLabels,
      datasets: filteredDatasets
    };
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff", 
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    strokeWidth: Platform.OS === 'ios' ? 3 : 2,
    paddingRight: 50,
    paddingLeft: 60,
    paddingTop: 20,
    paddingBottom: 20,
    propsForDots: {
      r: Platform.OS === 'ios' ? "6" : "5", // Bigger dots for easier clicking
      strokeWidth: "2",
      stroke: "#2c3e50",
      fill: "#ffffff", // White fill to make dots more visible
    },
    formatYLabel: (yValue) => {
      return yValue.toString() + " mmHg";
    },
    // Make dots more interactive
    propsForBackgroundLines: {
      strokeDasharray: "", // solid background lines
    },
    // Ensure proper dot rendering
    useShadowColorFromDataset: false,
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);
      await fetchBloodPressureDataAndProcess(
        (data) => setChartData(processChartData(data)), // Process data for 10-min intervals
        setCurrentValue, 
        setLoading, 
        Config.API_BASE_URL
      );
    } catch (err) {
      console.error('Error loading blood pressure data:', err);
      setError(true);
      setLoading(false);
    }
  };

  const handleDataPointClick = ({ index, x, y, value }) => {
    // Only allow selection if clicking on actual data points (with valid index)
    if (chartData && chartData.datasets && index !== undefined && index >= 0 && index < chartData.labels.length) {
      const systolic = chartData.datasets[0]?.data[index];
      const diastolic = chartData.datasets[1]?.data[index];
      const average = chartData.datasets[2]?.data[index];
      const label = chartData.labels[index];
      
      // Only set data if all values are valid
      if (systolic !== undefined && diastolic !== undefined && average !== undefined && label) {
        setSelectedReading({ systolic, diastolic, average, label });
        setHighlightX(x);
      }
    }
  };

  const renderChart = () => {
    if (loading) {
      return (
        <View style={[styles.loadingContainer, { height: chartHeight }]}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading blood pressure data...</Text>
        </View>
      );
    }

    if (error || !chartData) {
      return (
        <View style={[styles.errorContainer, { height: chartHeight }]}>
          <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
          <Text style={styles.errorText}>Failed to load data</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.chartScrollContainer}
        contentContainerStyle={styles.chartScrollContent}
      >
        <View style={styles.chartWrapper}>
          <LineChart
            data={chartData}
            width={chartWidth}
            height={chartHeight}
            yAxisSuffix=" mmHg"
            yAxisInterval={10}
            chartConfig={chartConfig}
            withDots={true}
            withShadow={false}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={true}
            withHorizontalLines={true}
            segments={4}
            bezier
            onDataPointClick={handleDataPointClick}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            fromZero={false}
            style={styles.chart}
          />

          {highlightX !== null && (
            <Svg
              style={[
                styles.highlightLine,
                { 
                  left: 60 + highlightX, // Adjusted for new padding
                  height: chartHeight,
                }
              ]}
            >
              <Line
                x1="0"
                y1="20"
                x2="0"
                y2={chartHeight - 40}
                stroke="#e74c3c"
                strokeWidth="2"
                strokeDasharray="4"
              />
            </Svg>
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        {/* Custom Header with Back Button */}
        <View style={styles.customHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#3498db" />
            <Text style={styles.backButtonText}>Stats</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Blood Pressure Monitor</Text>
            <Text style={styles.subtitle}>Real-time tracking</Text>
          </View>

          {/* Chart Section */}
          <View style={styles.chartContainer}>
            {renderChart()}
          </View>

          {/* Selected Reading Display */}
          {selectedReading && (
            <View style={styles.readingContainer}>
              <Text style={styles.readingTitle}>Reading at {selectedReading.label}</Text>
              <View style={styles.readingGrid}>
                <View style={styles.readingItem}>
                  <View style={[styles.readingDot, { backgroundColor: '#e74c3c' }]} />
                  <Text style={styles.readingLabel}>Systolic</Text>
                  <Text style={styles.readingValue}>{selectedReading.systolic} mmHg</Text>
                </View>
                <View style={styles.readingItem}>
                  <View style={[styles.readingDot, { backgroundColor: '#3498db' }]} />
                  <Text style={styles.readingLabel}>Diastolic</Text>
                  <Text style={styles.readingValue}>{selectedReading.diastolic} mmHg</Text>
                </View>
                <View style={styles.readingItem}>
                  <View style={[styles.readingDot, { backgroundColor: '#2ecc71' }]} />
                  <Text style={styles.readingLabel}>Average</Text>
                  <Text style={styles.readingValue}>{selectedReading.average} mmHg</Text>
                </View>
              </View>
            </View>
          )}

          {/* Legend */}
          {chartData && (
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Legend</Text>
              <View style={styles.legendGrid}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#e74c3c' }]} />
                  <Text style={styles.legendText}>Systolic Pressure</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#3498db' }]} />
                  <Text style={styles.legendText}>Diastolic Pressure</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#2ecc71' }]} />
                  <Text style={styles.legendText}>Average Pressure</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 17,
    color: '#3498db',
    marginLeft: 4,
    fontWeight: '400',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 5, // Minimal horizontal padding
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'visible', // Allow content to overflow if needed
  },
  chartScrollContainer: {
    flex: 1,
  },
  chartScrollContent: {
    paddingHorizontal: 20, // More padding to ensure labels aren't cut off
    paddingLeft: 30, // Extra left padding
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  chart: {
    borderRadius: 12,
  },
  highlightLine: {
    position: 'absolute',
    top: 20,
    width: 2,
    pointerEvents: 'none',
    zIndex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  readingContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  readingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  readingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  readingItem: {
    alignItems: 'center',
    flex: 1,
  },
  readingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  readingLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
    textAlign: 'center',
  },
  readingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  legendContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  legendGrid: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
});