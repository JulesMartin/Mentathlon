// eslint-disable-next-line import/no-unresolved
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Alarm,
  FlowWidget,
  MotivationWidgetConfig,
  TasksWidgetConfig,
  TodayPlanWidgetConfig,
  UserSettings,
  WeatherWidgetConfig,
} from '@/src/types/models';

const SETTINGS_KEY = '@settings';

function buildDefaultAlarm(): Alarm {
  return {
    id: 'default-alarm',
    timeHHMM: '07:00',
    daysOfWeek: [1, 2, 3, 4, 5],
    enabled: true,
    label: 'Réveil',
  };
}

function buildDefaultFlowWidgets(): FlowWidget[] {
  const weatherConfig: WeatherWidgetConfig = { city: 'Paris' };
  const tasksConfig: TasksWidgetConfig = {
    task1: 'Préparer le café',
    task2: 'S\'étirer 5 minutes',
    task3: 'Lister la priorité du jour',
  };
  const planConfig: TodayPlanWidgetConfig = { lines: ["Aujourd'hui :", '• ...', '• ...'] };
  const motivationConfig: MotivationWidgetConfig = { category: 'discipline' };

  return [
    { id: 'weather-widget', type: 'WEATHER', enabled: true, config: weatherConfig },
    { id: 'tasks-widget', type: 'TODAY_TASKS', enabled: true, config: tasksConfig },
    { id: 'today-plan-widget', type: 'TODAY_PLAN', enabled: true, config: planConfig },
    { id: 'motivation-widget', type: 'MOTIVATION', enabled: true, config: motivationConfig },
  ];
}

export function getDefaultSettings(): UserSettings {
  return {
    alarms: [buildDefaultAlarm()],
    unlockAction: {
      type: 'SLIDER',
      durationSeconds: 10,
      promptText: 'Maintiens le slider pour déverrouiller',
    },
    flowWidgets: buildDefaultFlowWidgets(),
    lastUnlockDate: '',
    lastAlarmFiredAt: null,
  };
}

export async function loadSettings(): Promise<UserSettings> {
  const defaultSettings = getDefaultSettings();
  const storedValue = await AsyncStorage.getItem(SETTINGS_KEY);

  if (!storedValue) {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  try {
    const parsedSettings = JSON.parse(storedValue) as Partial<UserSettings>;
    return {
      ...defaultSettings,
      ...parsedSettings,
      alarms: parsedSettings.alarms ?? defaultSettings.alarms,
      flowWidgets: parsedSettings.flowWidgets ?? defaultSettings.flowWidgets,
      unlockAction: parsedSettings.unlockAction ?? defaultSettings.unlockAction,
      lastUnlockDate: parsedSettings.lastUnlockDate ?? defaultSettings.lastUnlockDate,
      lastAlarmFiredAt: parsedSettings.lastAlarmFiredAt ?? defaultSettings.lastAlarmFiredAt,
    };
  } catch (error) {
    console.warn('Impossible de lire les paramètres, utilisation des valeurs par défaut', error);
    return defaultSettings;
  }
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function updateSettings(partial: Partial<UserSettings>): Promise<UserSettings> {
  const current = await loadSettings();
  const updated: UserSettings = {
    ...current,
    ...partial,
  };

  await saveSettings(updated);
  return updated;
}

export async function resetSettings(): Promise<UserSettings> {
  const defaults = getDefaultSettings();
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(defaults));
  return defaults;
}
