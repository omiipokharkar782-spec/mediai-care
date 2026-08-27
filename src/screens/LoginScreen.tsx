import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Button, Card, Input, SegmentedControl, Text } from '../components';
import { requestOtp, verifyOtp } from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { colors, motion, spacing } from '../theme';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type Method = 'otp' | 'password';

export function LoginScreen({ route, navigation }: Props) {
  const { role } = route.params;
  const dispatch = useAppDispatch();
  const { status, error, otpRequestId } = useAppSelector((s) => s.auth);
  const [method, setMethod] = useState<Method>('otp');
  const [phone, setPhone] = useState('+91 98220 11234');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const sending = status === 'requesting-otp';
  const verifying = status === 'verifying';

  return (
    <View style={styles.root}>
      <Button label="Back" variant="ghost" fullWidth={false} onPress={() => navigation.goBack()} />
      <Text variant="h1">{role === 'doctor' ? 'Doctor sign in' : role === 'admin' ? 'Admin sign in' : 'Patient sign in'}</Text>
      <Text tone="secondary">Secured with OTP and role-based access control.</Text>

      <SegmentedControl<Method>
        value={method}
        onChange={setMethod}
        options={[
          { value: 'otp', label: 'OTP' },
          { value: 'password', label: 'Password' },
        ]}
      />

      <Card style={styles.card}>
        {method === 'otp' ? (
          <Animated.View
            entering={FadeIn.duration(motion.duration.fast)}
            exiting={FadeOut.duration(motion.duration.instant)}
            style={styles.form}
          >
            <Input label="Mobile number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            {otpRequestId ? (
              <Input
                label="6-digit OTP"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="123456"
              />
            ) : null}
            {error ? (
              <Text variant="caption" tone="danger">
                {error}
              </Text>
            ) : null}
            <Button
              label={otpRequestId ? (verifying ? 'Verifying…' : 'Verify & continue') : sending ? 'Sending…' : 'Send OTP'}
              disabled={sending || verifying}
              onPress={() => {
                if (otpRequestId) dispatch(verifyOtp({ code, role }));
                else dispatch(requestOtp(phone));
              }}
            />
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(motion.duration.fast)} style={styles.form}>
            <Input label="Registered email or phone" value={phone} onChangeText={setPhone} />
            <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            {error ? (
              <Text variant="caption" tone="danger">
                {error}
              </Text>
            ) : null}
            <Button
              label={verifying ? 'Signing in…' : 'Sign in'}
              disabled={verifying}
              onPress={() => dispatch(verifyOtp({ code: '123456', role }))}
            />
          </Animated.View>
        )}
      </Card>

      <Text variant="caption" tone="tertiary" align="center">
        Demo build: any 6-digit OTP is accepted.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.muted, padding: spacing.lg, gap: spacing.md, justifyContent: 'center' },
  card: { gap: spacing.base },
  form: { gap: spacing.base },
});
