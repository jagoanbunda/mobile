import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Antropometri',
          tabBarIcon: ({ color }) => <MaterialIcons name="show-chart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="input"
        options={{
          title: 'Meals',
          tabBarIcon: ({ color }) => <MaterialIcons name="restaurant" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pmt"
        options={{
          title: 'PMT',
          tabBarIcon: ({ color }) => <MaterialIcons name="fact-check" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

