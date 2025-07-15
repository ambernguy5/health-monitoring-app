// app/utils/sleepCycleUtils.ts
import Config from "../config";

// Types for sleep data
export interface SleepDataPoint {
  time: string; // Time in HHMMSS format
  duration: number; // duration in seconds
  data: {
    stage: 'N1' | 'N2' | 'N3' | 'REM' | 'AWAKE';
    stage_confidence: number; // 0-1 confidence score
  };
}

export interface ProcessedSleepData {
  timestamp: Date;
  stage: 'N1' | 'N2' | 'N3' | 'REM' | 'AWAKE';
  stageValue: number; // Numeric value for graphing
  duration: number; // duration in seconds
  confidence: number; // stage confidence
}

// Sleep stage to numeric mapping for visualization
const STAGE_VALUES = {
  'AWAKE': 5,
  'REM': 4,
  'N1': 3,
  'N2': 2,
  'N3': 1
} as const;

// Data processing functions
export class SleepDataProcessor {
  static parseTime(timeStr: string, baseDate?: Date): Date {
    const hours = parseInt(timeStr.slice(0, 2), 10);
    const minutes = parseInt(timeStr.slice(2, 4), 10);
    const seconds = parseInt(timeStr.slice(4, 6), 10);
    
    const date = baseDate ? new Date(baseDate) : new Date();
    date.setHours(hours, minutes, seconds, 0);
    
    return date;
  }

  static processSleepData(rawData: SleepDataPoint[], baseDate?: Date): ProcessedSleepData[] {
    return rawData.map(point => ({
      timestamp: this.parseTime(point.time, baseDate),
      stage: point.data.stage,
      stageValue: STAGE_VALUES[point.data.stage],
      duration: point.duration,
      confidence: point.data.stage_confidence
    }));
  }

  static calculateSleepMetrics(data: ProcessedSleepData[]) {
    const totalSleepSeconds = data.reduce((sum, point) => sum + point.duration, 0);
    const stageDistribution = data.reduce((acc, point) => {
      acc[point.stage] = (acc[point.stage] || 0) + point.duration;
      return acc;
    }, {} as Record<string, number>);

    const avgConfidence = data.reduce((sum, point) => sum + point.confidence, 0) / data.length;

    return {
      totalSleep: Math.round(totalSleepSeconds / 60), // Convert to minutes
      stageDistribution: Object.entries(stageDistribution).reduce((acc, [stage, seconds]) => {
        acc[stage] = Math.round(seconds / 60); // Convert to minutes
        return acc;
      }, {} as Record<string, number>),
      sleepEfficiency: totalSleepSeconds > 0 ? (totalSleepSeconds / (totalSleepSeconds + (stageDistribution['AWAKE'] || 0))) * 100 : 0,
      averageConfidence: avgConfidence
    };
  }
}

// API service
export class SleepApiService {
  static async fetchSleepData(endpoint: string): Promise<SleepDataPoint[]> {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sleep data:', error);
      throw error;
    }
  }
}

// Main utility function for fetching and processing sleep data
export const fetchSleepDataAndProcess = async (
  setChartData: (data: any) => void,
  setSleepMetrics: (metrics: any) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const API_URL = `${Config.API_BASE_URL}/sleep/timeseries`;
    const rawData = await SleepApiService.fetchSleepData(API_URL);
    const processedData = SleepDataProcessor.processSleepData(rawData);
    const metrics = SleepDataProcessor.calculateSleepMetrics(processedData);
    
    setChartData(processedData);
    setSleepMetrics(metrics);
  } catch (error) {
    console.error('Error fetching sleep data:', error);
  } finally {
    setLoading(false);
  }
};