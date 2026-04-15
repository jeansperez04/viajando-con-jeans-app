import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, useRouter } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

import { useColors } from "@/hooks/useColors";

const HERO_COLORS: [string, string, string, string] = ["#0d6e91", "#0fb3cc", "#4caf78", "#d4a96a"];

function RoundTabButton({
  label,
  icon,
  onPress,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  active?: boolean;
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

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Inicio</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <Icon sf={{ default: "magnifyingglass", selected: "magnifyingglass" }} />
        <Label>Buscar</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="services">
        <Icon sf={{ default: "calendar.badge.plus", selected: "calendar.badge.plus" }} />
        <Label>Reservar</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <Icon sf={{ default: "heart", selected: "heart.fill" }} />
        <Label>Favoritos</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
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
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
