import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/src/components/ScreenContainer';

export function MorningFlowScreen() {
  return (
    <ScreenContainer
      title="Morning Flow"
      subtitle="Liste scrollable des widgets"
    >
      <View style={styles.block}>
        <Text style={styles.paragraph}>
          Cette vue affichera les widgets configurés dans l’ordre choisi : météo, tâches du jour,
          agenda manuel et motivation. Chaque carte sera alimentée par les données stockées
          localement ou via un appel API pour la météo.
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
