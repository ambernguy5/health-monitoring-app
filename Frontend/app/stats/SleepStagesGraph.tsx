import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Config from '../config';


//fetches from /sleep/stages

type SleepStageEntry = {   //#data type definition##
  stage: 'Awake' | 'REM' | 'Core' | 'DEEP';
  start: string; // ISO timestamp
  end: string;   // ISO timestamp
};

const screenWidth = Dimensions.get("window").width; //visualizations 

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: () => string;
    strokeWidth?: number;
  }[];
  legend?: string[];
}

export default function SleepStagesScreen() {  //logic
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `${Config.API_BASE_URL}/sleep/stages`; //API call 

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then((timeseries: SleepStageEntry[]) => {
        if (!Array.isArray(timeseries)) throw new Error("Invalid data format");

        const stagesMap = {  
          Awake: 0,
          REM: 1,
          Core: 2,
          DEEP: 3
        };

        const labels = timeseries.map((entry, i) =>
          i % 2 === 0
            ? new Date(entry.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : ""
        );

        const stageValues = timeseries.map(entry => stagesMap[entry.stage]);

        setChartData({
          labels,
          datasets: [
            { data: stageValues, color: () => 'mediumslateblue', strokeWidth: 2 }
          ],
          legend: ['Sleep Stage']
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
      <Text style={styles.title}>Sleep Stages Over Time</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={280}
        yAxisSuffix=""
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



