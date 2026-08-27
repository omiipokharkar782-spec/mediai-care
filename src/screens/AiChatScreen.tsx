import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components';
import { askAssistant, pushUserMessage, seedChat, setListening } from '../store/slices/aiSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { quickPrompts } from '../mock/data';
import { colors, motion, radius, spacing, typeStyle } from '../theme';

export function AiChatScreen() {
  const dispatch = useAppDispatch();
  const { messages, assistantTyping, listening } = useAppSelector((s) => s.ai);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const pulse = useSharedValue(0);

  useEffect(() => {
    dispatch(seedChat());
  }, [dispatch]);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: motion.duration.loop, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [pulse]);

  const micStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * (listening ? 0.18 : 0.06) }],
    opacity: 0.8 + pulse.value * 0.2,
  }));

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    dispatch(pushUserMessage(value));
    dispatch(askAssistant(value));
    setDraft('');
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text variant="h1">AI Health Assistant</Text>
          <Text tone="secondary">Guidance only — always confirm with your doctor.</Text>
        </View>

        <ScrollView ref={scrollRef} contentContainerStyle={styles.thread} showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <Animated.View
              key={message.id}
              entering={FadeInUp.duration(motion.duration.fast)}
              style={[styles.bubble, message.author === 'user' ? styles.userBubble : styles.aiBubble]}
            >
              <Text tone={message.author === 'user' ? 'inverse' : 'primary'}>{message.text}</Text>
            </Animated.View>
          ))}
          {assistantTyping ? (
            <Animated.View entering={FadeIn} style={[styles.bubble, styles.aiBubble, styles.typing]}>
              <TypingDots />
            </Animated.View>
          ) : null}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {quickPrompts.map((prompt, index) => (
            <Animated.View key={prompt} entering={FadeIn.delay(index * motion.stagger.chips)}>
              <Pressable accessibilityRole="button" onPress={() => send(prompt)} style={styles.chip}>
                <Text variant="caption" tone="brand">
                  {prompt}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask about reports, medicines, appointments…"
            placeholderTextColor={colors.text.tertiary}
            style={[typeStyle('body'), styles.input]}
            onSubmitEditing={() => send(draft)}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tap to speak"
            onPress={() => dispatch(setListening(!listening))}
            onLongPress={() => send('Explain my last lipid profile')}
          >
            <Animated.View style={[styles.mic, micStyle, listening && styles.micActive]}>
              <Ionicons name={listening ? 'stop' : 'mic'} size={20} color={colors.text.inverse} />
            </Animated.View>
          </Pressable>
        </View>
        {listening ? <Waveform /> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TypingDots() {
  return (
    <View style={styles.dots}>
      {[0, 1, 2].map((i) => (
        <Dot key={i} index={i} />
      ))}
    </View>
  );
}

function Dot({ index }: { index: number }) {
  const bounce = useSharedValue(0);
  useEffect(() => {
    bounce.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
  }, [bounce]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: -4 * bounce.value }], opacity: 0.4 + bounce.value * 0.6 }));
  return <Animated.View style={[styles.dot, style, { marginLeft: index === 0 ? 0 : 4 }]} />;
}

function Waveform() {
  return (
    <View style={styles.waveform}>
      {Array.from({ length: 18 }).map((_, i) => (
        <Bar key={i} index={i} />
      ))}
    </View>
  );
}

function Bar({ index }: { index: number }) {
  const amplitude = useSharedValue(0.3);
  useEffect(() => {
    amplitude.value = withRepeat(withTiming(1, { duration: 350 + index * 40 }), -1, true);
  }, [amplitude, index]);
  const style = useAnimatedStyle(() => ({ height: 6 + amplitude.value * 28 }));
  return <Animated.View style={[styles.bar, style]} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface.muted },
  header: { padding: spacing.lg, gap: 2 },
  thread: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.md },
  bubble: { maxWidth: '85%', padding: spacing.md, borderRadius: radius.lg },
  aiBubble: { backgroundColor: colors.surface.base, alignSelf: 'flex-start', borderTopLeftRadius: radius.xs },
  userBubble: { backgroundColor: colors.primary.blue, alignSelf: 'flex-end', borderTopRightRadius: radius.xs },
  typing: { paddingVertical: spacing.base },
  dots: { flexDirection: 'row', alignItems: 'flex-end', height: 12 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.text.tertiary },
  chips: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary.blue,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.pastel.sky,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.base,
    paddingBottom: 96,
    backgroundColor: colors.surface.base,
    borderTopWidth: 1,
    borderTopColor: colors.surface.border,
  },
  input: { flex: 1, color: colors.text.primary },
  mic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micActive: { backgroundColor: colors.status.danger },
  waveform: {
    position: 'absolute',
    bottom: 150,
    left: spacing.lg,
    right: spacing.lg,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bar: { width: 4, borderRadius: 2, backgroundColor: colors.secondary.teal },
});
