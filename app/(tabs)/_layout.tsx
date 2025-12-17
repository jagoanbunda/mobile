import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabConfig = {
  name: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const tabs: TabConfig[] = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'input', title: 'Meals', icon: 'restaurant' },
  { name: 'progress', title: 'Antropometri', icon: 'show-chart' },
  { name: 'screening', title: 'ASQ-3', icon: 'psychology' },
  { name: 'pmt', title: 'PMT', icon: 'fact-check' },
];

function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingBottom: insets.bottom + 8 }}
      className="absolute bottom-0 left-0 right-0 px-4 pt-2"
    >
      <View
        style={{ backgroundColor: colors.surfaceContainerHigh }}
        className="flex-row items-center justify-between rounded-full px-2 py-2 shadow-lg"
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;

          const tabConfig = tabs.find(t => t.name === route.name);
          const iconName = tabConfig?.icon ?? 'circle';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={{
                backgroundColor: isFocused ? colors.primaryContainer : 'transparent',
              }}
              className={`flex-row items-center justify-center gap-1.5 px-4 py-2.5 rounded-full ${isFocused ? '' : ''}`}
            >
              <MaterialIcons
                name={iconName}
                size={20}
                color={isFocused ? colors.onPrimaryContainer : colors.onSurfaceVariant}
              />
              {isFocused && (
                <Text
                  style={{ color: colors.onPrimaryContainer }}
                  className="text-xs font-bold"
                >
                  {label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
          }}
        />
      ))}
    </Tabs>
  );
}
