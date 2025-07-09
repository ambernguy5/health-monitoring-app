import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Config from '../config';

type SleepStage = 'N1' | 'N2' | 'N3' | 'REM' | 'Awake';

interface SleepDataEntry {
  time: string; // "230000"
  duration: number; // in seconds
  data: {
    stage: SleepStage;
    stage_confidence: number;
  };
}

interface SleepDataResponse {
  metadata: {
    username: string;
    healthDomain: string;
    date: string;
  };
  timeseries: SleepDataEntry[];
}

const screenWidth = Dimensions.get('window').width;

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

const stageColors: Record<SleepStage, string> = {
  N1: '#FFA07A',
  N2: '#87CEEB',
  N3: '#6A5ACD',
  REM: '#FF69B4',
  Awake: '#FFD700',
};

export default function SleepDurationChart() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `${Config.API_BASE_URL}/sleep/stages`;

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then((response: SleepDataResponse) => {
        if (!Array.isArray(response.timeseries)) throw new Error("Invalid timeseries format");

        // Aggregate duration by stage
        const stageDurations: Record<string, number> = {};

        response.timeseries.forEach(entry => {
          const stage = entry.data.stage;
          const durationMin = entry.duration / 60;
          if (!stageDurations[stage]) {
            stageDurations[stage] = 0;
          }
          stageDurations[stage] += durationMin;
        });

        const labels = Object.keys(stageDurations);
        const data = labels.map(stage => parseFloat(stageDurations[stage].toFixed(1)));

        setChartData({
          labels,
          datasets: [{ data }]
        });

        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading sleep data:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !chartData) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sleep Duration by Stage</Text>
      <BarChart
        data={chartData}
        width={screenWidth - 32}
        height={260}
        yAxisLabel=""
        yAxisSuffix=" min"
        fromZero
        showValuesOnTopOfBars
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#f0f0f0",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.6,
          propsForBackgroundLines: { strokeWidth: 0.5, stroke: "#ccc" }
        }}
        style={{
          marginVertical: 12,
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
