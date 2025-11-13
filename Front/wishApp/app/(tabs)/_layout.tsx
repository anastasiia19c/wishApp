import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <LinearGradient
            colors={["#FF4DA6", "#A64DFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />),
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
          headerShown: true,
          headerTitle: 'Mes Réservations',
          title: '',
          headerBackground: () => (
            <LinearGradient
              colors={["#FF4DA6", "#A64DFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          ),
          headerTitleStyle: {
            color: "white", fontSize: 25, fontWeight: 'bold'
          }, 
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) => (<View style={{ backgroundColor: focused ? "white" : "transparent", borderRadius: 50, padding: focused ? 10 : 0,}}>
            <MaterialCommunityIcons name="gift" size={focused ? 50 : 35} color={"#000000ff"}/></View>),
        }}
      />
      <Tabs.Screen
        name="wishList/index"
        options={{
          headerShown: true,
          headerTitle: 'Mes Wishlists',
          title: '',
          headerBackground: () => (
            <LinearGradient
              colors={["#FF4DA6", "#A64DFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          ),
          headerTitleStyle: {
            color: "white", fontSize: 25, fontWeight: 'bold'
          },  
          headerTitleAlign: "center",
          tabBarIcon: ({focused }) => (<View style={{ backgroundColor: focused ? "white" : "transparent", borderRadius: 50, padding: focused ? 10 : 0,}}>
            <MaterialCommunityIcons name="clipboard-check" size={focused ? 50 : 35} color={"#000000ff"}/></View>),
        }}
      />
      <Tabs.Screen
        name="account/index"
        options={{
          headerShown: true,
          headerTitle: 'Mon Profil',
          title: '',
          headerTitleStyle: {
            color: "#B266FF", fontSize: 25, fontWeight: 'bold'
          },  
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) => (<View style={{ backgroundColor: focused ? "white" : "transparent", borderRadius: 50, padding: focused ? 10 : 0,}}>
            <MaterialCommunityIcons name="account" size={focused ? 50 : 35} color={"#000000ff"}/></View>),
        }}
      />
    </Tabs>
  );
}
