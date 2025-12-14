import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/src/components/ScreenContainer';

export function AlarmRingingScreen() {
  return (
    <ScreenContainer
      title="Réveil en cours"
      subtitle="Écran plein écran pour empêcher la fuite"
    >
      <View style={styles.block}>
        <Text style={styles.paragraph}>
          Lorsqu’une notification d’alarme est validée, cet écran prendra tout l’espace pour
          empêcher l’utilisateur de quitter avant d’avoir réalisé l’action de déverrouillage.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: 12,
  },
  paragraph: {
    color: '#e6edff',
    fontSize: 16,
    lineHeight: 22,
  },
});
