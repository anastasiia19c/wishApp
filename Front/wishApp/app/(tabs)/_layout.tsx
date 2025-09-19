import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="gift/index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="gift" size={35} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wishList/index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="clipboard-check" size={35} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account/index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={35} color={color}/>,
        }}
      />
    </Tabs>
  );
}
