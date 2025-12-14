export type UnlockActionType = 'SLIDER' | 'TEXT';

export interface UnlockActionConfig {
  type: UnlockActionType;
  durationSeconds: number;
  promptText?: string;
}

export type FlowWidgetType = 'WEATHER' | 'TODAY_TASKS' | 'TODAY_PLAN' | 'MOTIVATION';

export interface WeatherWidgetConfig {
  city: string;
}

export interface TasksWidgetConfig {
  task1: string;
  task2: string;
  task3: string;
}

export interface TodayPlanWidgetConfig {
  lines: string[];
}

export interface MotivationWidgetConfig {
  category: 'calme' | 'focus' | 'discipline';
}

export type FlowWidgetConfig =
  | WeatherWidgetConfig
  | TasksWidgetConfig
  | TodayPlanWidgetConfig
  | MotivationWidgetConfig;

export interface FlowWidget {
  id: string;
  type: FlowWidgetType;
  enabled: boolean;
  config: FlowWidgetConfig;
}

export interface Alarm {
  id: string;
  timeHHMM: string;
  daysOfWeek: number[];
  enabled: boolean;
  label?: string;
}

export interface UserSettings {
  alarms: Alarm[];
  unlockAction: UnlockActionConfig;
  flowWidgets: FlowWidget[];
  lastUnlockDate: string;
  lastAlarmFiredAt: number | null;
}
