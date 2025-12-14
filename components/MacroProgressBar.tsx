import { View, Text } from 'react-native';

interface MacroProgressBarProps {
  label: string;
  current: number;
  goal: number;
  color: string;
  unit?: string;
}

export default function MacroProgressBar({ label, current, goal, color, unit = 'g' }: MacroProgressBarProps) {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-1">
        <Text className="text-sm font-medium text-gray-700">{label}</Text>
        <Text className="text-sm font-medium text-gray-700">
          {Math.round(current)} / {Math.round(goal)} {unit}
        </Text>
      </View>
      <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

