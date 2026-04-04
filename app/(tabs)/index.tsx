import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

// ─── Data ────────────────────────────────────────────────────────────────────

const WHY_US = [
  { icon: "map-outline", title: "Itinerarios Personalizados", desc: "Viajes a tu medida y presupuesto." },
  { icon: "shield-checkmark-outline", title: "Viaja con Seguridad", desc: "Asistencia 24/7 en todo el mundo." },
  { icon: "pricetag-outline", title: "Precios Competitivos", desc: "Las mejores tarifas con financiamiento." },
  { icon: "person-outline", title: "Soporte Dedicado", desc: "Tu asesor antes, durante y despues." },
];

const TESTIMONIALS = [
  { text: "Una experiencia inolvidable. Cada detalle estuvo perfectamente cuidado, desde los vuelos hasta las excursiones.", name: "Maria Gonzalez", trip: "Maldivas · 2025" },
  { text: "Viajando con Jeans supero todas mis expectativas. El itinerario personalizado hizo que descubriera lugares increibles.", name: "Carlos Ruiz", trip: "Japon · 2025" },
  { text: "El safari fue magico. El equipo nos acompano en todo momento y la organizacion fue impecable.", name: "Ana Martinez", trip: "Safari Kenya · 2024" },
];

interface DestItem {
  name: string;
  description: string;
  url: string;
  image: string;
}

interface DestGroup {
  title: string;
  color: string;
  items: DestItem[];
}

const DESTINATIONS: DestGroup[] = [
  {
    title: "Cruceros",
    color: "#0fb3cc",
    items: [

      {
        name: "Icon of the Seas",
        description: "El crucero mas grande del mundo · Royal Caribbean",
        url: "https://secure.cruisingpower.com/iconoftheseas?id=eyJiIjoiNDYxMjYiLCJkIjoiMTQ1ODYwMSIsIm4iOiJqZWFucyBwZXJleiIsImUiOiJqZWFuc3BlcmV6MDRAZ21haWwuY29tIiwiYSI6IkFSQ0hFUiBUUkFWRUwgU0VSVklDRSBJTkMiLCJwIjoiNzg2NzYzNTAzNSIsIm0iOiJJIGFtIHBsZWFzZWQgdG8gcmV2ZWFsIHRoZSBuZXdlc3Qgc2hpcCBpbiB0aGUgUm95YWwgQ2FyaWJiZWFuIEZsZWV0LCBhbmQgaG9wZSB0aGlzIGlzIHRoZSBzdGFydCBvZiBjcmVhdGluZyBpY29uaWMgdmFjYXRpb25zIHRvZ2V0aGVyLiIsImMiOiJVU0QiLCJjYyI6IlVTQSIsImYiOiJNSUEifQ==",
        image: "https://viajandoconjeans.com/assets/dest-icon-of-the-seas-DqWDMbws.jpg",
      },
      {
        name: "Crucero Norwegian",
        description: "Freestyle Cruising · Destinos increibles",
        url: "https://www.ncl.com/?insider=or0kr-jeans-perez",
        image: "https://viajandoconjeans.com/assets/dest-norwegian-DSO2Dj4y.jpg",
      },
      {
        name: "Cruceros Personalizados",
        description: "Disena tu crucero ideal a medida",
        url: "https://viajandoconjeans.com/cruceros-personalizados",
        image: "https://viajandoconjeans.com/assets/dest-custom-cruise-DAUlLZ8M.jpg",
      },
      {
        name: "Crucero Virgin Voyages",
        description: "Solo adultos · Experiencia premium",
        url: "https://www.virginvoyages.com/book/voyage-planner/find-a-voyage?cabins=1&currencyCode=USD&agentId=240959&agencyId=550&bookingChannel=FMLINK",
        image: "https://viajandoconjeans.com/assets/dest-cruise-WVtxUT-x.jpg",
      },
      {
        name: "Crucero Viking River",
        description: "Cruceros fluviales por Europa y mas",
        url: "https://www.vikingrivercruises.com/myagent/viajandoconjeans",
        image: "https://viajandoconjeans.com/assets/dest-viking-BmsEh4cG.jpg",
      },
      {
        name: "Crucero AmaWaterways",
        description: "Cruceros fluviales de lujo · Experiencia unica",
        url: "https://www.amawaterways.com/agent/viajandoconjeanscom",
        image: "https://viajandoconjeans.com/assets/dest-amawaterways-0Z5J2jKQ.jpg",
      },
      {
        name: "Crucero Silversea",
        description: "Ultra lujo · Expediciones exclusivas",
        url: "https://www.silversea.com/?insider=or0kr-jeans-perez",
        image: "https://viajandoconjeans.com/assets/dest-silversea-Cng1mZ0f.jpg",
      },
    ],
  },
  {
    title: "Hoteles & Villas",
    color: "#ffc42b",
    items: [
      {
        name: "Hoteles a Precios VIP",
        description: "Tarifas secretas en los hoteles mas exclusivos",
        url: "https://viajandoconjeans.com/hoteles-descuentos",
        image: "https://viajandoconjeans.com/assets/dest-hotels-discount-BpQl8aOo.jpg",
      },
      {
        name: "Villas de Lujo",
        description: "Villas exclusivas en los destinos mas paradisiacos",
        url: "https://www.villasofdistinction.com/?insider=or0kr-jeans-perez",
        image: "https://viajandoconjeans.com/assets/dest-villas-luxury-5zN8iXra.jpg",
      },
      {
        name: "Resort for a Day Pass",
        description: "Acceso diario a resorts premium con todo incluido",
        url: "https://resortforaday.com/?Click=103430",
        image: "https://viajandoconjeans.com/assets/dest-caribbean-C4iLJVC4.jpg",
      },
    ],
  },
  {
    title: "Destinos Internacionales",
    color: "#f98a0e",
    items: [
      {
        name: "Europa",
        description: "Santorini, Paris, Roma y mas",
        url: "https://exoticca.com/us/europe?advisor_token=jeans-perez-0197665e-750b-7395-b77b-7d6a2eb1f71c",
        image: "https://viajandoconjeans.com/assets/dest-europe-RLJjdQjm.jpg",
      },
      {
        name: "Latinoamerica",
        description: "Peru, Ecuador, Colombia, Argentina",
        url: "https://exoticca.com/us/america/south-america?advisor_token=jeans-perez-0197665e-750b-7395-b77b-7d6a2eb1f71c",
        image: "https://viajandoconjeans.com/assets/dest-latam-uoIBc3-q.jpg",
      },
      {
        name: "Africa",
        description: "Safari, Marruecos, Egipto",
        url: "https://exoticca.com/us/africa?advisor_token=jeans-perez-0197665e-750b-7395-b77b-7d6a2eb1f71c",
        image: "https://viajandoconjeans.com/assets/dest-africa-suRavuHa.jpg",
      },
      {
        name: "Japon",
        description: "Cultura, tradicion y modernidad",
        url: "https://exoticca.com/us/asia/far-east/japan?advisor_token=jeans-perez-0197665e-750b-7395-b77b-7d6a2eb1f71c",
        image: "https://viajandoconjeans.com/assets/dest-japan-CCn3LnVA.jpg",
      },
      {
        name: "Asia",
        description: "Indonesia, Turquia, Tailandia",
        url: "https://exoticca.com/us/asia/southeast-asia?advisor_token=jeans-perez-0197665e-750b-7395-b77b-7d6a2eb1f71c",
        image: "https://viajandoconjeans.com/assets/dest-asia-9SISTDwg.jpg",
      },
    ],
  },
  {
    title: "Actividades & Seguros",
    color: "#a855f7",
    items: [
      {
        name: "Paquetes de Actividades",
        description: "Tours, aventuras y experiencias unicas",
        url: "https://www.viator.com/?pid=P00006875&uid=U00259634&mcid=58086&currency=USD",
        image: "https://viajandoconjeans.com/assets/dest-activities-CRBxsT-l.jpg",
      },
      {
        name: "Seguro de Viaje Tinleg",
        description: "Viaja protegido con cobertura completa",
        url: "https://30680.buy.tinleg.com/",
        image: "https://viajandoconjeans.com/assets/dest-insurance-tz6Z1u3K.jpg",
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function QuickAction({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => ({ alignItems: "center", gap: 5, opacity: pressed ? 0.75 : 1, flex: 1 })}
      onPress={onPress}
    >
      <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" }}>
        <Ionicons name={icon as any} size={24} color="#fff" />
      </View>
      <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: "600", textAlign: "center" }}>{label}</Text>
    </Pressable>
  );
}

function DestCard({ item, accentColor }: { item: DestItem; accentColor: string }) {
  const colors = useColors();

  async function handlePress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(item.url);
  }

  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: colors.card,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
        opacity: pressed ? 0.93 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
      onPress={handlePress}
    >
      {/* Image */}
      <View style={{ height: 180, backgroundColor: colors.muted }}>
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.55)"]}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80 }}
        />
      </View>

      {/* Content */}
      <View style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "800", color: colors.foreground, marginBottom: 3 }}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 12, color: colors.mutedForeground, lineHeight: 17 }}>
            {item.description}
          </Text>
        </View>
        <View style={{ backgroundColor: accentColor, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>Reservar</Text>
          <Ionicons name="arrow-forward" size={13} color="#fff" />
        </View>
      </View>
    </Pressable>
  );
}

function WhyCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const colors = useColors();
  return (
    <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 14, gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 }}>
      <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: colors.primary + "15", alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={icon as any} size={18} color={colors.primary} />
      </View>
      <Text style={{ fontSize: 12, fontWeight: "800", color: colors.foreground, lineHeight: 16 }}>{title}</Text>
      <Text style={{ fontSize: 11, color: colors.mutedForeground, lineHeight: 15 }}>{desc}</Text>
    </View>
  );
}

function TestimonialCard({ text, name, trip }: { text: string; name: string; trip: string }) {
  const colors = useColors();
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 18, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
      <View style={{ flexDirection: "row", gap: 3, marginBottom: 10 }}>
        {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={13} color="#ffc42b" />)}
      </View>
      <Text style={{ fontSize: 14, color: colors.foreground, lineHeight: 21, marginBottom: 14, fontStyle: "italic" }}>"{text}"</Text>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>{name[0]}</Text>
          </View>
          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground }}>{name}</Text>
        </View>
        <Text style={{ fontSize: 11, color: colors.secondary, fontWeight: "600" }}>{trip}</Text>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

const WA_URL =
  "https://wa.me/17867635035?text=Hola%2C%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20paquetes%20de%20viaje.";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : insets.bottom;

  // Scroll refs
  const scrollRef = React.useRef<ScrollView>(null);
  const sectionYRef = React.useRef<Record<string, number>>({});

  function scrollTo(title: string) {
    const y = sectionYRef.current[title];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: y - 10, animated: true });
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      >

        {/* ── HERO ── */}
        <LinearGradient
          colors={["#0d6e91", "#0fb3cc", "#4caf78", "#d4a96a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 1 }}
          style={{ paddingTop: topPad + 20, paddingHorizontal: 20, paddingBottom: 30 }}
        >
          <Text style={{ fontSize: 28, fontWeight: "900", color: "#fff", letterSpacing: 0.5, marginBottom: 6, textShadowColor: "rgba(0,0,0,0.25)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>
            Viajando con Jeans
          </Text>
          <Text style={{ fontSize: 36, fontWeight: "900", color: "#fff", lineHeight: 42, marginBottom: 10 }}>
            Descubre{"\n"}el Mundo
          </Text>
          <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 21, marginBottom: 28 }}>
            Viajes exclusivos disenados a tu medida. Experiencias unicas que transformaran tu forma de ver el mundo.
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <QuickAction icon="bed-outline"      label="Hoteles"      onPress={() => scrollTo("Hoteles & Villas")} />
            <QuickAction icon="boat-outline"     label="Cruceros"     onPress={() => scrollTo("Cruceros")} />
            <QuickAction icon="bicycle-outline"  label="Actividades"  onPress={() => scrollTo("Actividades & Seguros")} />
            <QuickAction icon="map-outline"      label="Europa"       onPress={() => scrollTo("Destinos Internacionales")} />
          </View>
        </LinearGradient>

        {/* ── GRUPOS DE DESTINOS ── */}
        {DESTINATIONS.map(group => (
          <View
            key={group.title}
            style={{ paddingHorizontal: 16, marginTop: 28 }}
            onLayout={e => { sectionYRef.current[group.title] = e.nativeEvent.layout.y; }}
          >
            {/* Group header */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <View style={{ width: 4, height: 22, borderRadius: 2, backgroundColor: group.color }} />
              <Text style={{ fontSize: 20, fontWeight: "900", color: colors.foreground }}>{group.title}</Text>
            </View>

            {group.items.map(item => (
              <DestCard key={item.name} item={item} accentColor={group.color} />
            ))}
          </View>
        ))}

        {/* ── POR QUE ELEGIRNOS ── */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <LinearGradient
            colors={[colors.primary + "12", colors.secondary + "10"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: 18, padding: 18 }}
          >
            <Text style={{ fontSize: 20, fontWeight: "900", color: colors.foreground, marginBottom: 4 }}>Por que elegirnos</Text>
            <Text style={{ fontSize: 12, color: colors.mutedForeground, marginBottom: 16 }}>Servicios disenados para que tu viaje sea perfecto</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {WHY_US.map((item, i) => (
                <View key={i} style={{ width: "47.5%" }}>
                  <WhyCard icon={item.icon} title={item.title} desc={item.desc} />
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* ── TESTIMONIOS ── */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: "900", color: colors.foreground, marginBottom: 4 }}>Lo que dicen nuestros Viajeros</Text>
          <Text style={{ fontSize: 12, color: colors.mutedForeground, marginBottom: 16 }}>Experiencias reales de clientes satisfechos</Text>
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} text={t.text} name={t.name} trip={t.trip} />)}
        </View>

        {/* ── CONTACTO ── */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <LinearGradient
            colors={[colors.primary, "#e06b00"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ borderRadius: 18, padding: 20 }}
          >
            <Text style={{ fontSize: 18, fontWeight: "900", color: "#fff", marginBottom: 4 }}>Planifica tu proximo Viaje</Text>
            <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 18, lineHeight: 19 }}>
              Contactanos y nuestro equipo te ayudara a hacerlo realidad.
            </Text>
            <View style={{ gap: 10 }}>
              {[
                { icon: "call", label: "+1 (786) 763-5035", url: "tel:+17867635035" },
                { icon: "mail", label: "viajandoconjeans@gmail.com", url: "mailto:viajandoconjeans@gmail.com" },
                { icon: "globe", label: "viajandoconjeans.com", url: "https://viajandoconjeans.com" },
              ].map(item => (
                <Pressable
                  key={item.url}
                  style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 12, padding: 14, opacity: pressed ? 0.8 : 1 })}
                  onPress={() => Linking.openURL(item.url)}
                >
                  <Ionicons name={item.icon as any} size={18} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </LinearGradient>
        </View>

      </ScrollView>
    </View>
  );
}
