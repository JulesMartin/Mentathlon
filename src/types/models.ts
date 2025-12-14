export type UnlockActionType = 'SLIDER' | 'TEXT';

export interface UnlockActionConfig {
  type: UnlockActionType;
  durationSeconds: number;
  promptText?: string;
}

export type FlowWidgetType = 'WEATHER' | 'TODAY_TASKS' | 'TODAY_PLAN' | 'MOTIVATION';

interface FlowWidgetBase<T extends FlowWidgetType, C> {
  id: string;
  type: T;
  enabled: boolean;
  config: C;
}

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

export type WeatherFlowWidget = FlowWidgetBase<'WEATHER', WeatherWidgetConfig>;
export type TasksFlowWidget = FlowWidgetBase<'TODAY_TASKS', TasksWidgetConfig>;
export type TodayPlanFlowWidget = FlowWidgetBase<'TODAY_PLAN', TodayPlanWidgetConfig>;
export type MotivationFlowWidget = FlowWidgetBase<'MOTIVATION', MotivationWidgetConfig>;

export type FlowWidget =
  | WeatherFlowWidget
  | TasksFlowWidget
  | TodayPlanFlowWidget
  | MotivationFlowWidget;

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
