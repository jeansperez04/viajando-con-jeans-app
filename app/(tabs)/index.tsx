import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const HERO_COLORS: [string, string, string, string] = ["#0d6e91", "#0fb3cc", "#4caf78", "#d4a96a"];

const WHY_US = [
  { icon: "map-outline", title: "Itinerarios Personalizados", desc: "Viajes a tu medida y presupuesto." },
  { icon: "shield-checkmark-outline", title: "Viaja con Seguridad", desc: "Asistencia 24/7 en todo el mundo." },
  { icon: "pricetag-outline", title: "Precios Competitivos", desc: "Las mejores tarifas con financiamiento." },
  { icon: "person-outline", title: "Soporte Dedicado", desc: "Tu asesor antes, durante y despues." },
];

const SERVICES = [
  { icon: "boat-outline", title: "Cruceros", desc: "Royal Caribbean, Norwegian, Virgin Voyages y mas.", color: "#0fb3cc" },
  { icon: "bed-outline", title: "Hoteles & Villas", desc: "Tarifas VIP en los hoteles mas exclusivos.", color: "#ffc42b" },
  { icon: "globe-outline", title: "Destinos Internacionales", desc: "Europa, Asia, Africa, Latinoamerica y mas.", color: "#f98a0e" },
  { icon: "bicycle-outline", title: "Actividades & Tours", desc: "Tours, aventuras y experiencias unicas.", color: "#a855f7" },
  { icon: "umbrella-outline", title: "Seguro de Viaje", desc: "Viaja protegido con cobertura completa.", color: "#4caf78" },
];

const TESTIMONIALS = [
  { text: "Una experiencia inolvidable. Cada detalle estuvo perfectamente cuidado, desde los vuelos hasta las excursiones.", name: "Maria Gonzalez", trip: "Maldivas · 2025" },
  { text: "Viajando con Jeans supero todas mis expectativas. El itinerario personalizado hizo que descubriera lugares increibles.", name: "Carlos Ruiz", trip: "Japon · 2025" },
  { text: "El safari fue magico. El equipo nos acompano en todo momento y la organizacion fue impecable.", name: "Ana Martinez", trip: "Safari Kenya · 2024" },
];

function ServiceCard({ icon, title, desc, color, onPress }: {
  icon: string;
  title: string;
  desc: string;
  color: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: pressed ? 0.85 : 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
      })}
    >
      <View style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: color + "18",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Ionicons name={icon as any} size={26} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "800", color: colors.foreground, marginBottom: 3 }}>
          {title}
        </Text>
        <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 18 }}>
          {desc}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

function WhyCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const colors = useColors();
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      gap: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 3,
    }}>
      <View style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: "#0d6e9118",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Ionicons name={icon as any} size={18} color="#0d6e91" />
      </View>
      <Text style={{ fontSize: 12, fontWeight: "800", color: colors.foreground, lineHeight: 16 }}>{title}</Text>
      <Text style={{ fontSize: 11, color: colors.mutedForeground, lineHeight: 15 }}>{desc}</Text>
    </View>
  );
}

function TestimonialCard({ text, name, trip }: { text: string; name: string; trip: string }) {
  const colors = useColors();
  return (
    <View style={{
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 18,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    }}>
      <View style={{ flexDirection: "row", gap: 3, marginBottom: 10 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <Ionicons key={i} name="star" size={13} color="#ffc42b" />
        ))}
      </View>
      <Text style={{ fontSize: 14, color: colors.foreground, lineHeight: 21, marginBottom: 14, fontStyle: "italic" }}>
        "{text}"
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#0d6e91",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>{name[0]}</Text>
          </View>
          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground }}>{name}</Text>
        </View>
        <Text style={{ fontSize: 11, color: "#0fb3cc", fontWeight: "600" }}>{trip}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : insets.bottom;

  async function goReservar() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/services");
  }

  async function goBuscar() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)/explore");
  }

  async function goMisViajes() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)/trips");
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      >
        {/* HERO */}
        <LinearGradient
          colors={HERO_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 1 }}
          style={{ paddingTop: topPad + 20, paddingHorizontal: 20, paddingBottom: 32 }}
        >
          <Text style={{
            fontSize: 15,
            fontWeight: "600",
            color: "rgba(255,255,255,0.85)",
            marginBottom: 6,
            letterSpacing: 0.5,
          }}>
            Viajando con Jeans
          </Text>
          <Text style={{
            fontSize: 36,
            fontWeight: "900",
            color: "#fff",
            lineHeight: 42,
            marginBottom: 12,
          }}>
            Descubre{"\n"}el Mundo
          </Text>
          <Text style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.85)",
            lineHeight: 21,
            marginBottom: 28,
          }}>
            Viajes exclusivos disenados a tu medida. Experiencias unicas que transformaran tu forma de ver el mundo.
          </Text>

          {/* CTA Buttons */}
          <Pressable
            onPress={goReservar}
            style={({ pressed }) => ({
              backgroundColor: "#fff",
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
              marginBottom: 12,
              opacity: pressed ? 0.88 : 1,
            })}
          >
            <Ionicons name="calendar-outline" size={20} color="#0d6e91" />
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#0d6e91" }}>
              Solicitar Cotizacion
            </Text>
          </Pressable>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={goBuscar}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.22)",
                borderRadius: 12,
                paddingVertical: 13,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name="search-outline" size={17} color="#fff" />
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>Explorar</Text>
            </Pressable>
            <Pressable
              onPress={goMisViajes}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.22)",
                borderRadius: 12,
                paddingVertical: 13,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name="map-outline" size={17} color="#fff" />
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>Mis Viajes</Text>
            </Pressable>
          </View>
        </LinearGradient>

        {/* SERVICIOS */}
        <View style={{ paddingHorizontal: 16, marginTop: 28 }}>
          <Text style={{ fontSize: 20, fontWeight: "900", color: colors.foreground, marginBottom: 4 }}>
            Nuestros Servicios
          </Text>
          <Text style={{ fontSize: 13, color: colors.mutedForeground, marginBottom: 16, lineHeight: 19 }}>
            Toca cualquier servicio y solicita tu cotizacion
          </Text>
          {SERVICES.map((s) => (
            <ServiceCard
              key={s.title}
              icon={s.icon}
              title={s.title}
              desc={s.desc}
              color={s.color}
              onPress={goReservar}
            />
          ))}
        </View>

        {/* POR QUE ELEGIRNOS */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <LinearGradient
            colors={["#0d6e9112", "#0fb3cc10"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 18, padding: 18 }}
          >
            <Text style={{ fontSize: 20, fontWeight: "900", color: colors.foreground, marginBottom: 4 }}>
              Por que elegirnos
            </Text>
            <Text style={{ fontSize: 12, color: colors.mutedForeground, marginBottom: 16 }}>
              Servicios disenados para que tu viaje sea perfecto
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {WHY_US.map((item, i) => (
                <View key={i} style={{ width: "47.5%" }}>
                  <WhyCard icon={item.icon} title={item.title} desc={item.desc} />
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* TESTIMONIOS */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: "900", color: colors.foreground, marginBottom: 4 }}>
            Lo que dicen nuestros Viajeros
          </Text>
          <Text style={{ fontSize: 12, color: colors.mutedForeground, marginBottom: 16 }}>
            Experiencias reales de clientes satisfechos
          </Text>
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} text={t.text} name={t.name} trip={t.trip} />
          ))}
        </View>

        {/* CONTACTO */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <LinearGradient
            colors={["#0d6e91", "#e06b00"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 18, padding: 20 }}
          >
            <Text style={{ fontSize: 18, fontWeight: "900", color: "#fff", marginBottom: 4 }}>
              Planifica tu proximo Viaje
            </Text>
            <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 18, lineHeight: 19 }}>
              Contactanos y nuestro equipo te ayudara a hacerlo realidad.
            </Text>
            <View style={{ gap: 10 }}>
              {[
                { icon: "call", label: "+1 (786) 763-5035", url: "tel:+17867635035" },
                { icon: "mail", label: "viajandoconjeans@gmail.com", url: "mailto:viajandoconjeans@gmail.com" },
              ].map(item => (
                <Pressable
                  key={item.url}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    backgroundColor: "rgba(255,255,255,0.18)",
                    borderRadius: 12,
                    padding: 14,
                    opacity: pressed ? 0.8 : 1,
                  })}
                  onPress={() => Linking.openURL(item.url)}
                >
                  <Ionicons name={item.icon as any} size={18} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>{item.label}</Text>
                </Pressable>
              ))}
              <Pressable
                style={({ pressed }) => ({
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 4,
                  opacity: pressed ? 0.88 : 1,
                })}
                onPress={goReservar}
              >
                <Ionicons name="calendar-outline" size={18} color="#0d6e91" />
                <Text style={{ color: "#0d6e91", fontWeight: "800", fontSize: 15 }}>
                  Solicitar Cotizacion Ahora
                </Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}
