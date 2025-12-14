import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/src/components/ScreenContainer';

export function LockScreen() {
  return (
    <ScreenContainer
      title="Déverrouillage obligatoire"
      subtitle="Action slider ou texte imposée"
    >
      <View style={styles.block}>
        <Text style={styles.paragraph}>
          Après la sonnerie, l’utilisateur devra compléter une action pour débloquer l’app. La
          logique exacte (slider 10 sec ou texte à recopier) sera branchée ici au fil des étapes.
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
