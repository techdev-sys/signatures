import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../../context/AuthContext';
import { colors, radius, spacing } from '../../../theme/theme';

type Mode = 'sign-in' | 'sign-up';

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] =
    useState<Mode>('sign-in');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] =
    useState(false);

  const isSignUp = mode === 'sign-up';

  const submit = async () => {
    if (
      !email.trim() ||
      !password ||
      (isSignUp && !fullName.trim())
    ) {
      Alert.alert(
        'Missing details',
        'Please complete the required fields.',
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        'Password too short',
        'Use at least 8 characters.',
      );
      return;
    }

    try {
      setSubmitting(true);

      if (isSignUp) {
        const result = await signUp({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          password,
        });

        if (result.requiresEmailConfirmation) {
          Alert.alert(
            'Confirm your email',
            'Check your email, confirm your account, then return here to log in.',
          );
          setMode('sign-in');
        }
      } else {
        await signIn(email.trim(), password);
      }
    } catch (error) {
      Alert.alert(
        isSignUp ? 'Sign up failed' : 'Login failed',
        error instanceof Error
          ? error.message
          : 'Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.brandIcon}>
            <Ionicons
              name="restaurant"
              size={29}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.eyebrow}>
            SIGNATURES
          </Text>

          <Text style={styles.title}>
            {isSignUp
              ? 'Create your account'
              : 'Welcome back'}
          </Text>

          <Text style={styles.description}>
            {isSignUp
              ? 'Save your orders and follow every delivery from the kitchen to your door.'
              : 'Log in to order food and see your live delivery progress.'}
          </Text>

          <View style={styles.form}>
            {isSignUp && (
              <>
                <Field
                  label="Full name"
                  icon="person-outline"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Your full name"
                  autoCapitalize="words"
                />

                <Field
                  label="Phone (optional)"
                  icon="call-outline"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+263 ..."
                  keyboardType="phone-pad"
                />
              </>
            )}

            <Field
              label="Email"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Field
              label="Password"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              autoCapitalize="none"
              secureTextEntry
            />

            <Pressable
              style={[
                styles.primaryButton,
                submitting && styles.buttonDisabled,
              ]}
              disabled={submitting}
              onPress={() => void submit()}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>
                    {isSignUp
                      ? 'Create account'
                      : 'Log in'}
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={19}
                    color="#FFFFFF"
                  />
                </>
              )}
            </Pressable>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchPrompt}>
              {isSignUp
                ? 'Already have an account?'
                : 'New to Signatures?'}
            </Text>

            <Pressable
              onPress={() =>
                setMode(
                  isSignUp ? 'sign-in' : 'sign-up',
                )
              }
            >
              <Text style={styles.switchAction}>
                {isSignUp ? 'Log in' : 'Sign up'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  icon,
  ...inputProps
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <View style={styles.field}>
        <Ionicons
          name={icon}
          size={19}
          color={colors.textSecondary}
        />

        <TextInput
          {...inputProps}
          style={styles.input}
          placeholderTextColor="#A0A0A6"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 50,
    paddingBottom: 35,
    justifyContent: 'center',
  },
  brandIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    marginTop: 24,
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  title: {
    marginTop: 8,
    color: colors.text,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '900',
  },
  description: {
    marginTop: 10,
    maxWidth: 350,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  form: {
    marginTop: 30,
    gap: 15,
  },
  fieldBlock: {
    gap: 7,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  field: {
    height: 56,
    paddingHorizontal: 15,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
  primaryButton: {
    height: 58,
    marginTop: 6,
    borderRadius: radius.xl,
    backgroundColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  switchRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  switchPrompt: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  switchAction: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
});
