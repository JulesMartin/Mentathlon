Plan Codex — MVP “Wake Lock Flow” 0) Règles du MVP (à respecter)

Android-first (Expo gère mieux certains comportements ; iOS sera une V1.5).

Pas de backend.

1 seule action obligatoire (ex : slider 10 sec OU écrire une phrase).

“Téléphone bloqué” = soft lock dans l’app (plein écran, pas de dismiss).

Data en local : AsyncStorage.

Notifs : expo-notifications.

1. Setup projet + structure

Créer projet Expo TS.

Installer dépendances :

expo-notifications

@react-native-async-storage/async-storage

@react-navigation/native

@react-navigation/native-stack

react-native-screens react-native-safe-area-context

(option) expo-keep-awake (garder écran réveillé pendant l’alarme)

(option) expo-haptics (vibration)

Mettre en place navigation :

SetupScreen (onboarding minimal)

AlarmConfigScreen

AlarmRingingScreen (quand ça sonne)

LockScreen (action obligatoire)

MorningFlowScreen (scroll d’écrans)

FlowEditorScreen (choix ordre des écrans)

Créer dossiers :

src/screens

src/components

src/services

src/storage

src/types

src/utils

2. Modèles de données (Typescript)

Créer src/types/models.ts :

Alarm : id, timeHHMM, daysOfWeek[], enabled, label

UnlockActionConfig : type ("SLIDER" | "TEXT"), durationSeconds, promptText

FlowWidgetType : "WEATHER" | "TODAY_TASKS" | "TODAY_PLAN" | "MOTIVATION"

FlowWidget : id, type, enabled, config (selon type)

UserSettings :

alarms[]

unlockAction

flowWidgets[] (ordre)

lastUnlockDate (YYYY-MM-DD)

lastAlarmFiredAt (timestamp)

3. Storage layer (AsyncStorage)

Créer src/storage/storage.ts :

clés :

@settings

fonctions :

loadSettings(): Promise<UserSettings>

saveSettings(settings)

updateSettings(partial)

resetSettings()

inclure getDefaultSettings() (1 alarme par défaut, 4 widgets activés, action slider 10 sec).

4. Service notifications (alarme)

Créer src/services/notifications.ts :

Demander permissions notifications au lancement.

Configurer handler notifications (foreground/background).

Fonction scheduleAlarm(alarm: Alarm) :

annule les notifs existantes liées à cet alarm (stocker notificationId par alarmId si besoin)

schedule à heure précise (daily / weekdays).

Fonction cancelAlarm(alarmId).

⚠️ Important MVP :

Pour la V1, autoriser 1 alarme (simple).

Utiliser expo-notifications schedule trigger (daily à HH:MM).

Quand notif est reçue → ouvrir AlarmRingingScreen.

5. Déclenchement “ringing” (ouvrir l’écran alarme)

Créer logique dans App.tsx :

écouter :

Notifications.addNotificationReceivedListener

Notifications.addNotificationResponseReceivedListener

quand notif est reçue/cliquée :

set un “state global” alarmActive = true

naviguer vers AlarmRingingScreen

Créer un petit store global simple :

src/services/alarmState.ts (ou Context React)

alarmActive: boolean

setAlarmActive

markAlarmFired(timestamp)

markUnlocked(date)

6. AlarmRingingScreen (son + plein écran)

UI :

titre “Réveil”

label alarme

bouton “Commencer” (pas de stop direct)

Comportement :

activer keep-awake (si dispo)

vibration régulière via expo-haptics (boucle simple + stop à unmount)

son : pour MVP, utiliser un son local simple (si tu veux ajouter, expo-av).

Bouton “Commencer” → navigate LockScreen

(Option : empêcher back navigation ici aussi.)

7. LockScreen = action obligatoire

Objectif : impossible d’aller au flow sans validation.

A) Empêcher le “retour”

Utiliser navigation.addListener("beforeRemove", e => e.preventDefault())

(Android) gérer BackHandler si nécessaire.

B) Implémenter 1 action (MVP)

Choisir une action simple :

Option recommandée (la plus stable) : Slider + timer

Un slider à maintenir / glisser jusqu’au bout

Une fois au bout, lancer un timer de X secondes à tenir (ou juste “glisser complet”)

Quand validé : unlock().

Alternative : TEXT

champ texte : “Écris : JE ME LÈVE”

vérifier égalité → unlock.

C) Unlock

markUnlocked(today)

alarmActive = false

navigate MorningFlowScreen

8. MorningFlowScreen (scroll widgets)

Récupérer flowWidgets depuis settings (ordre).

Afficher un FlatList vertical avec sections.

Chaque widget est un composant :

WeatherCard

TasksCard

TodayPlanCard

MotivationCard

Tout doit marcher offline sauf météo.

Widget WEATHER (simple)

Pour V1 :

soit mock (“12°C, nuageux”)

soit appel API météo très simple (OpenWeather) basé sur ville fixe dans settings.

Stocker la ville (string) dans config.

Cacher la complexité : 1 fonction getWeather(city).

Widget TASKS (manuel)

3 champs texte configurables (task1, task2, task3)

édition dans FlowEditorScreen ou dans le widget (bouton edit).

Widget TODAY PLAN (agenda manuel)

2–5 lignes “Aujourd’hui : …”

pas de sync Google en V1.

Widget MOTIVATION

soit statique (liste de phrases)

soit IA plus tard.

V1 : random depuis une liste locale.

9. FlowEditorScreen (configuration)

Objectif : l’utilisateur choisit l’ordre + active/désactive + contenu.

Liste de widgets (draggable si facile, sinon boutons “monter/descendre”)

Toggle enabled

Pour chaque widget : bouton “Configurer”

Weather : ville

Tasks : 3 tasks

TodayPlan : texte multi-lignes

Motivation : choisir “calme / focus / discipline” (juste une catégorie)

Tout est sauvegardé dans AsyncStorage.

10. AlarmConfigScreen (une seule alarme)

Sélecteur d’heure (time picker)

Toggle enabled

Jours de la semaine (optionnel V1.1)

Bouton “Enregistrer” :

save settings

schedule notifications

11. Finitions indispensables (sinon app “cassée”)

Écran “Test alarm in 1 minute” (debug mode) pour vérifier le flow rapidement.

“Failsafe” :

si l’app s’ouvre et alarmActive=true → forcer AlarmRingingScreen

si alarmActive=true et l’utilisateur tente d’aller ailleurs → forcer lock

Gestion du son/vibration stop propre à l’unmount.

Logs minimal.

12. Checklist build (Expo)

config app.json :

permissions notifications

Android: usesPermissions si nécessaire

test sur device réel (Android) pour notifs.

build EAS (si prévu).

Définition du Done (MVP)

L’utilisateur configure une alarme à HH:MM

À l’heure → notification → ouvre app → écran réveil → lock obligatoire

Action validée → unlock → flow scroll widgets

Settings persistants

Pas de crash, pas de back escape
