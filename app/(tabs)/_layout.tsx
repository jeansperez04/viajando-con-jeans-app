import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

import { useColors } from "@/hooks/useColors";

const HERO_COLORS: [string, string, string, string] = ["#0d6e91", "#0fb3cc", "#4caf78", "#d4a96a"];

const isIOS = Platform.OS === "ios";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isIPad: boolean = Platform.OS === "ios" ? !!((Platform as any).isPad) : false;
const isWeb = Platform.OS === "web";

function RoundTabButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <LinearGradient
        colors={HERO_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#0fb3cc",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.45,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        {icon}
      </LinearGradient>
      <Text style={{ fontSize: 10, color: "#0d6e91", fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}

function IPadTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0d6e91",
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          height: 60,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={isDark ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 6,
        },
      }}
    >
      <Tabs.Screen
        name="services"
        options={{
          title: "Reservar",
          tabBarIcon: ({ color, size }) =>
            isIOS
              ? <SymbolView name="calendar.badge.plus" tintColor={color} size={size} />
              : <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size, focused }) =>
            isIOS
              ? <SymbolView name={focused ? "house.fill" : "house"} tintColor={color} size={size} />
              : <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color, size }) =>
            isIOS
              ? <SymbolView name="magnifyingglass" tintColor={color} size={size} />
              : <Ionicons name="search-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Mis Viajes",
          tabBarIcon: ({ color, size, focused }) =>
            isIOS
              ? <SymbolView name={focused ? "map.fill" : "map"} tintColor={color} size={size} />
              : <Ionicons name={focused ? "map" : "map-outline"} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size, focused }) =>
            isIOS
              ? <SymbolView name={focused ? "heart.fill" : "heart"} tintColor={color} size={size} />
              : <Ionicons name={focused ? "heart" : "heart-outline"} size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

function PhoneTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={100} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="services"
        options={{
          title: "Reservar",
          tabBarButton: () => (
            <RoundTabButton
              label="Reservar"
              icon={
                isIOS
                  ? <SymbolView name="calendar.badge.plus" tintColor="#fff" size={22} />
                  : <Ionicons name="calendar" size={22} color="#fff" />
              }
              onPress={() => router.push("/(tabs)/services")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarButton: () => (
            <RoundTabButton
              label="Inicio"
              icon={
                isIOS
                  ? <SymbolView name="house.fill" tintColor="#fff" size={22} />
                  : <Ionicons name="home" size={22} color="#fff" />
              }
              onPress={() => router.push("/(tabs)/")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Buscar",
          tabBarButton: () => (
            <RoundTabButton
              label="Buscar"
              icon={
                isIOS
                  ? <SymbolView name="magnifyingglass" tintColor="#fff" size={22} />
                  : <Ionicons name="search" size={22} color="#fff" />
              }
              onPress={() => router.push("/(tabs)/explore")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Mis Viajes",
          tabBarButton: () => (
            <RoundTabButton
              label="Mis Viajes"
              icon={
                isIOS
                  ? <SymbolView name="map.fill" tintColor="#fff" size={20} />
                  : <Ionicons name="map" size={22} color="#fff" />
              }
              onPress={() => router.push("/(tabs)/trips")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarButton: () => (
            <RoundTabButton
              label="Favoritos"
              icon={
                isIOS
                  ? <SymbolView name="heart.fill" tintColor="#fff" size={22} />
                  : <Ionicons name="heart" size={22} color="#fff" />
              }
              onPress={() => router.push("/(tabs)/favorites")}
            />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isIPad) {
    return <IPadTabLayout />;
  }
  return <PhoneTabLayout />;
}
