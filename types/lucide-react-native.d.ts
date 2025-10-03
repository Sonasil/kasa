import type { ColorValue } from 'react-native';
import type { NumberProp } from 'react-native-svg';

declare module 'lucide-react-native' {
  interface LucideProps {
    color?: ColorValue;
    strokeWidth?: NumberProp;
  }
}
