import { Platform } from 'react-native';

export default {
  background: '#000000',
  primary: '#4bd4e6',
  secondary: '#c7ea03',
  danger: '#ff4444',
  text: '#ffffff',
  secondaryText: '#aaaaaa',
  fontFamily: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};
