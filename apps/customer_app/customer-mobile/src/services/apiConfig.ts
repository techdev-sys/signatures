import {
  NativeModules,
  Platform,
} from 'react-native';

const configuredApiUrl =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

const metroScriptUrl =
  NativeModules.SourceCode?.scriptURL as
    | string
    | undefined;

const metroHost = metroScriptUrl?.match(
  /^[a-z]+:\/\/([^/:]+)/i,
)?.[1];

export const API_URL =
  configuredApiUrl ??
  (Platform.OS === 'web'
    ? 'http://localhost:4000/api'
    : `http://${metroHost ?? '192.168.1.7'}:4000/api`);
