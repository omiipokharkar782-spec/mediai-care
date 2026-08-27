import { useEffect, useState } from 'react';
import { motion } from '../theme';
import { Text } from './Text';

interface Props {
  value: number;
  suffix?: string;
  variant?: 'numeric' | 'h1' | 'h2';
}

// Count-up number animation (0 -> value) on mount, per the dashboard motion spec.
export function CountUp({ value, suffix = '', variant = 'numeric' }: Props) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = motion.duration.count;
    const start = Date.now();
    const timer = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <Text variant={variant}>
      {display.toLocaleString('en-IN')}
      {suffix}
    </Text>
  );
}
