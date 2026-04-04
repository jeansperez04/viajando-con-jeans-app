import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface ServiceItem {
  name: string;
  description: string;
  url: string;
  icon: string;
}

interface ServiceGroup {
  title: string;
  icon: string;
  color: string;
  items: ServiceItem[];
}

const SERVICES: ServiceGroup[] = [
  {
    title: "Cruceros",
    icon: "boat-outline",
    color: "#0fb3cc",
    items: [
      {
        name: "Icon of the Seas",
        description: "El crucero mas grande del mundo · Royal Caribbean",
        url: "https://secure.cruisingpower.com/iconoftheseas?id=eyJiIjoiNDYxMjYiLCJkIjoiMTQ1ODYwMSIsIm4iOiJqZWFucyBwZXJleiIsImUiOiJqZWFuc3BlcmV6MDRAZ21haWwuY29tIiwiYSI6IkFSQ0hFUiBUUkFWRUwgU0VSVklDRSBJTkMiLCJwIjoiNzg2NzYzNTAzNSIsIm0iOiJJIGFtIHBsZWFzZWQgdG8gcmV2ZWFsIHRoZSBuZXdlc3Qgc2hpcCBpbiB0aGUgUm95YWwgQ2FyaWJiZWFuIEZsZWV0LCBhbmQgaG9wZSB0aGlzIGlzIHRoZSBzdGFydCBvZiBjcmVhdGluZyBpY29uaWMgdmFjYXRpb25zIHRvZ2V0aGVyLiIsImMiOiJVU0QiLCJjYyI6IlVTQSIsImYiOiJNSUEifQ==",
        icon: "boat",
      },
      {
        name: "Crucero Norwegian",
        description: "Freestyle Cruising · Destinos increibles",
        url: "https://www.ncl.com/?insider=or0kr-jeans-perez",
        icon: "boat",
      },
      {
        name: "Cruceros Personalizados",
        description: "Disena tu crucero ideal a medida",
        url: "https://viajandoconjeans.com/cruceros-personalizados",
        icon: "options-outline",
      },
      {
        name: "Crucero Virgin Voyages",
        description: "Solo adultos · Experiencia premium",
        url: "https://www.virginvoyages.com/book/voyage-planner/find-a-voyage?cabins=1&currencyCode=USD&agentId=240959&agencyId=550&bookingChannel=FMLINK",
        icon: "boat",
      },
      {
        name: "Crucero Viking River",
        description: "Cruceros fluviales por Europa y mas",
        url: "https://www.vikingrivercruises.com/myagent/viajandoconjeans",
        icon: "water-outline",
      },
      {
        name: "Crucero AmaWaterways",
        description: "Cruceros fluviales de lujo · Experiencia unica",
        url: "https://www.amawaterways.com/agent/viajandoconjeanscom",
        icon: "water-outline",
      },
      {
        name: "Crucero Silversea",
        description: "Ultra lujo · Expediciones exclusivas por el mundo",
        url: "https://www.silversea.com/?insider=or0kr-jeans-perez",
        icon: "diamond-outline",
      },
    ],
  },
  {
    title: "Destinos Internacionales",
    icon: "globe-outline",
    color: "#f98a0e",
    items: [
      {
        name: "Europa",
        description: "Santorini, Paris, Roma y mas",
        url: "https://exoticca.com/us/europe?advisor_token=jeans-perez-0197665e-750b-7395-b77b-7d6a2eb1f71c",
        icon: "map-outline",
      },
      {
        name: "Latinoamerica",
        description: "Peru, Ecuador, Colombia, Argentina",
        url: "https://exoticca.com/us/america/south-america?advisor_token=jeans-perez-0197665e-750b-7395-b77b-7d6a2eb1f71c",
        icon: "map-outline",
      },
      {
        name: "Africa",
        description: "Safari, Marruecos, Egipto",
        url: "https://exoticca.com/us/africa?advisor_token=jeans-perez-0197665e-750b-7395-b77b-7d6a2eb1f71c",
        icon: "map-outline",
      },
      {
        name: "Japon",
        description: "Cultura, tradicion y modernidad",
        url: "https://exoticca.com/us/asia/far-east/japan?advisor_token=jeans-perez-0197665e-750b-7395-b77b-7d6a2eb1f71c",
        icon: "map-outline",
      },
      {
        name: "Asia",
        description: "Indonesia, Turquia, Tailandia",
        url: "https://exoticca.com/us/asia/southeast-asia?advisor_token=jeans-perez-0197665e-750b-7395-b77b-7d6a2eb1f71c",
        icon: "map-outline",
      },
    ],
  },
  {
    title: "Hoteles & Villas",
    icon: "bed-outline",
    color: "#ffc42b",
    items: [
      {
        name: "Hoteles a Precios VIP",
        description: "Tarifas secretas en los hoteles mas exclusivos del mundo",
        url: "https://viajandoconjeans.com/hoteles-descuentos",
        icon: "bed-outline",
      },
      {
        name: "Villas de Lujo",
        description: "Villas exclusivas en los destinos mas paradisiacos",
        url: "https://www.villasofdistinction.com/?insider=or0kr-jeans-perez",
        icon: "home-outline",
      },
      {
        name: "Resort for a Day Pass",
        description: "Acceso diario a resorts premium con todo incluido",
        url: "https://resortforaday.com/?Click=103430",
        icon: "sunny-outline",
      },
    ],
  },
  {
    title: "Actividades & Seguros",
    icon: "shield-checkmark-outline",
    color: "#a855f7",
    items: [
      {
        name: "Paquetes de Actividades",
        description: "Tours, aventuras y experiencias unicas",
        url: "https://www.viator.com/?pid=P00006875&uid=U00259634&mcid=58086&currency=USD",
        icon: "bicycle-outline",
      },
      {
        name: "Seguro de Viaje Tinleg",
        description: "Viaja protegido con cobertura completa",
        url: "https://30680.buy.tinleg.com/",
        icon: "shield-checkmark-outline",
      },
    ],
  },
];

function ServiceCard({ item, accentColor }: { item: ServiceItem; accentColor: string }) {
  const colors = useColors();

  async function handlePress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(item.url);
  }

  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: colors.card,
        borderRadius: colors.radius,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
        opacity: pressed ? 0.88 : 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      })}
      onPress={handlePress}
    >
      <View style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: accentColor + "20",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Ionicons name={item.icon as any} size={20} color={accentColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground, marginBottom: 2 }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 12, color: colors.mutedForeground, lineHeight: 16 }}>
          {item.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

export default function ServicesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : insets.bottom;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 16,
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.foreground,
    },
    subtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginTop: 4,
    },
    section: {
      paddingHorizontal: 16,
      marginTop: 20,
    },
    groupHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
    groupTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.foreground,
    },
    contactCard: {
      margin: 16,
      marginTop: 24,
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      padding: 20,
      gap: 14,
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: "#fff",
      marginBottom: 4,
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    contactText: {
      fontSize: 14,
      color: "rgba(255,255,255,0.95)",
      fontWeight: "500",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reservar</Text>
        <Text style={styles.subtitle}>Todos nuestros servicios y destinos disponibles</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      >
        {SERVICES.map((group) => (
          <View key={group.title} style={styles.section}>
            <View style={styles.groupHeader}>
              <View style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                backgroundColor: group.color + "20",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Ionicons name={group.icon as any} size={16} color={group.color} />
              </View>
              <Text style={styles.groupTitle}>{group.title}</Text>
            </View>
            {group.items.map((item) => (
              <ServiceCard key={item.name} item={item} accentColor={group.color} />
            ))}
          </View>
        ))}

        {/* Contact card */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contactanos para reservar</Text>
          <Pressable
            style={({ pressed }) => [styles.contactRow, { opacity: pressed ? 0.8 : 1 }]}
            onPress={() => Linking.openURL("tel:+17867635035")}
          >
            <Ionicons name="call-outline" size={18} color="rgba(255,255,255,0.9)" />
            <Text style={styles.contactText}>+1 (786) 763-5035</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.contactRow, { opacity: pressed ? 0.8 : 1 }]}
            onPress={() => Linking.openURL("mailto:viajandoconjeans@gmail.com")}
          >
            <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.9)" />
            <Text style={styles.contactText}>viajandoconjeans@gmail.com</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.contactRow, { opacity: pressed ? 0.8 : 1 }]}
            onPress={() => Linking.openURL("https://viajandoconjeans.com")}
          >
            <Ionicons name="globe-outline" size={18} color="rgba(255,255,255,0.9)" />
            <Text style={styles.contactText}>viajandoconjeans.com</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
