import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: () => string;
    strokeWidth?: number;
  }[];
  legend?: string[];
}

export default function BloodPressureScreen() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://192.168.86.100:8000/timeseries";

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(timeseries => {
        if (!Array.isArray(timeseries)) throw new Error("Invalid data format");

        const labels = timeseries.map((entry, i) => (i % 300 === 0 ? entry.time : ""));
        const systolic = timeseries.map(entry => entry.data?.systolic ?? 0);
        const diastolic = timeseries.map(entry => entry.data?.diastolic ?? 0);
        const average = timeseries.map(entry => entry.data?.average ?? 0);

        setChartData({
          labels,
          datasets: [
            { data: systolic, color: () => 'darkslateblue', strokeWidth: 2 },
            { data: diastolic, color: () => 'cornflowerblue', strokeWidth: 2 },
            { data: average, color: () => 'mediumpurple', strokeWidth: 2 }
          ],
          legend: ['Systolic', 'Diastolic', 'Average']
        });

        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !chartData) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Blood Pressure Over Time</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={280}
        yAxisSuffix=" mmHg"
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#f0f0f0",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: "1",
            strokeWidth: "1",
            stroke: "#444"
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 8
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 40, alignItems: 'center', paddingBottom: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 }
});
