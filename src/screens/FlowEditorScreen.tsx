import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/src/components/ScreenContainer';

export function FlowEditorScreen() {
  return (
    <ScreenContainer
      title="Éditeur du flow"
      subtitle="Ordre, activation et contenu des widgets"
    >
      <View style={styles.block}>
        <Text style={styles.paragraph}>
          Ici on proposera les contrôles pour réordonner les widgets, activer/désactiver et
          configurer leur contenu (ville météo, tâches, agenda manuel, type de motivation). Les
          modifications seront sauvegardées dans le stockage local.
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
