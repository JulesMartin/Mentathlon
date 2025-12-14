import { StyleSheet, Text } from 'react-native';

import { ScreenContainer } from '@/src/components/ScreenContainer';

export function AlarmConfigScreen() {
  return (
    <ScreenContainer
      title="Configuration de l'alarme"
      subtitle="Sélecteur d'heure, activation et jours de répétition"
    >
      <Text style={styles.paragraph}>
        Cette page accueillera le sélecteur d’heure, le toggle d’activation et les options de
        récurrence. Elle devra sauvegarder les paramètres dans le stockage local et planifier les
        notifications.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    color: '#e6edff',
    fontSize: 16,
    lineHeight: 22,
  },
});
