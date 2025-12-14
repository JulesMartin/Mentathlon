import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import { Alarm } from '../types/models';

const NOTIFICATION_MAP_KEY = '@alarm-notification-map';

type AlarmNotificationMap = Record<string, string[]>;

function parseTime(timeHHMM: string): { hour: number; minute: number } {
  const [hourStr, minuteStr] = timeHHMM.split(':');
  const hour = Number.parseInt(hourStr, 10);
  const minute = Number.parseInt(minuteStr, 10);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new Error(`Heure d'alarme invalide : ${timeHHMM}`);
  }

  return { hour, minute };
}

function convertToExpoWeekday(day: number): number {
  const normalized = ((day % 7) + 7) % 7; // assure une valeur positive
  return normalized === 0 ? 1 : normalized + 1; // Expo : 1 = dimanche, 2 = lundi ...
}

async function loadNotificationMap(): Promise<AlarmNotificationMap> {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATION_MAP_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as AlarmNotificationMap;
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }

    return {};
  } catch (error) {
    console.warn('Impossible de lire la map des notifications, réinitialisation.', error);
    return {};
  }
}

async function saveNotificationMap(map: AlarmNotificationMap): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATION_MAP_KEY, JSON.stringify(map));
}

export async function configureNotificationHandler(): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function cancelAlarm(alarmId: string): Promise<void> {
  const map = await loadNotificationMap();
  const existing = map[alarmId] ?? [];

  await Promise.all(existing.map((id) => Notifications.cancelScheduledNotificationAsync(id)));

  delete map[alarmId];
  await saveNotificationMap(map);
}

async function scheduleForDays(
  alarm: Alarm,
  hour: number,
  minute: number,
  map: AlarmNotificationMap,
): Promise<string[]> {
  const identifiers: string[] = [];

  if (!alarm.daysOfWeek || alarm.daysOfWeek.length === 0) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: alarm.label ?? 'Réveil',
        body: `Alarme programmée à ${alarm.timeHHMM}`,
      },
      trigger: { hour, minute, repeats: true },
    });
    identifiers.push(id);
    return identifiers;
  }

  for (const day of alarm.daysOfWeek) {
    const weekday = convertToExpoWeekday(day);
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: alarm.label ?? 'Réveil',
        body: `Alarme programmée à ${alarm.timeHHMM}`,
      },
      trigger: { weekday, hour, minute, repeats: true },
    });
    identifiers.push(id);
  }

  map[alarm.id] = identifiers;
  await saveNotificationMap(map);
  return identifiers;
}

export async function scheduleAlarm(alarm: Alarm): Promise<string[] | null> {
  if (!alarm.enabled) {
    await cancelAlarm(alarm.id);
    return null;
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    console.warn('Permissions notifications refusées : impossible de planifier l\'alarme');
    return null;
  }

  await configureNotificationHandler();

  const { hour, minute } = parseTime(alarm.timeHHMM);
  const map = await loadNotificationMap();

  await cancelAlarm(alarm.id);

  try {
    const identifiers = await scheduleForDays(alarm, hour, minute, map);
    map[alarm.id] = identifiers;
    await saveNotificationMap(map);
    return identifiers;
  } catch (error) {
    console.error('Erreur lors de la programmation de l\'alarme', error);
    return null;
  }
}

export async function cancelAllAlarms(): Promise<void> {
  const map = await loadNotificationMap();
  const allIds = Object.values(map).flat();

  await Promise.all(allIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
  await saveNotificationMap({});
}
