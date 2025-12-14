import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { ScreenContainer } from '@/src/components/ScreenContainer';

export function SetupScreen() {
  return (
    <ScreenContainer
      title="Onboarding minimal"
      subtitle="Point de départ pour le flow réveil"
    >
      <Text style={styles.paragraph}>
        Ce premier écran servira à guider l’utilisateur pour configurer son alarme et le flow
        matinal. Navigue ensuite vers les écrans dédiés pour continuer la configuration.
      </Text>

      <View style={styles.links}>
        <Link href="/alarm-config" style={styles.link}>
          Aller à la configuration de l’alarme
        </Link>
        <Link href="/flow-editor" style={styles.link}>
          Ouvrir l’éditeur du Morning Flow
        </Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    color: '#e6edff',
    fontSize: 16,
    lineHeight: 22,
  },
  links: {
    gap: 12,
  },
  link: {
    color: '#8fd3ff',
    fontSize: 16,
    fontWeight: '600',
  },
});
