import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const HERO_COLORS: [string, string, string, string] = ["#0d6e91", "#0fb3cc", "#4caf78", "#d4a96a"];

const TIPOS_VIAJE = [
  { id: "crucero", label: "Crucero", icon: "boat-outline" },
  { id: "hotel", label: "Hotel", icon: "bed-outline" },
  { id: "internacional", label: "Internacional", icon: "globe-outline" },
  { id: "actividad", label: "Actividad", icon: "bicycle-outline" },
];

const PRESUPUESTOS = [
  { id: "1000-3000", label: "$1,000 - $3,000" },
  { id: "3000-6000", label: "$3,000 - $6,000" },
  { id: "6000-10000", label: "$6,000 - $10,000" },
  { id: "10000+", label: "$10,000+" },
];

function SectionLabel({ label }: { label: string }) {
  const colors = useColors();
  return (
    <Text style={{ fontSize: 13, fontWeight: "700", color: colors.mutedForeground, marginBottom: 8, marginTop: 20, textTransform: "uppercase", letterSpacing: 0.5 }}>
      {label}
    </Text>
  );
}

function NativeInput({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  multiline,
  numberOfLines,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "phone-pad" | "email-address" | "numeric";
  multiline?: boolean;
  numberOfLines?: number;
}) {
  const colors = useColors();
  return (
    <TextInput
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: colors.foreground,
        ...(multiline ? { minHeight: 90, textAlignVertical: "top" } : {}),
      }}
      placeholder={placeholder}
      placeholderTextColor={colors.mutedForeground}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType ?? "default"}
      multiline={multiline}
      numberOfLines={numberOfLines}
      autoCorrect={false}
    />
  );
}

function SelectChip({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon?: string;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primary + "15" : colors.card,
        opacity: pressed ? 0.8 : 1,
        marginBottom: 8,
        marginRight: 8,
      })}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={16}
          color={selected ? colors.primary : colors.mutedForeground}
        />
      )}
      <Text style={{
        fontSize: 14,
        fontWeight: "600",
        color: selected ? colors.primary : colors.foreground,
      }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function ReservarScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const isIOS = Platform.OS === "ios";

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : insets.bottom;

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [tipoViaje, setTipoViaje] = useState("");
  const [destino, setDestino] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [fechaRegreso, setFechaRegreso] = useState("");
  const [adultos, setAdultos] = useState("2");
  const [ninos, setNinos] = useState("0");
  const [presupuesto, setPresupuesto] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [enviado, setEnviado] = useState(false);

  function cambiarAdultos(delta: number) {
    const n = Math.max(1, parseInt(adultos || "1") + delta);
    setAdultos(String(n));
  }

  function cambiarNinos(delta: number) {
    const n = Math.max(0, parseInt(ninos || "0") + delta);
    setNinos(String(n));
  }

  async function handleEnviar() {
    if (!nombre.trim() || !telefono.trim() || !tipoViaje) {
      Alert.alert("Campos requeridos", "Por favor completa tu nombre, telefono y tipo de viaje.");
      return;
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const tipo = TIPOS_VIAJE.find((t) => t.id === tipoViaje)?.label ?? tipoViaje;
    const pres = PRESUPUESTOS.find((p) => p.id === presupuesto)?.label ?? presupuesto;

    const msg = [
      "Hola, quiero solicitar una cotizacion de viaje:",
      "",
      `Nombre: ${nombre}`,
      `Telefono: ${telefono}`,
      email ? `Email: ${email}` : null,
      "",
      `Tipo de viaje: ${tipo}`,
      destino ? `Destino: ${destino}` : null,
      fechaSalida ? `Fecha de salida: ${fechaSalida}` : null,
      fechaRegreso ? `Fecha de regreso: ${fechaRegreso}` : null,
      "",
      `Adultos: ${adultos}`,
      `Ninos: ${ninos}`,
      pres ? `Presupuesto: ${pres}` : null,
      comentarios ? `\nComentarios: ${comentarios}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/17867635035?text=${encodeURIComponent(msg)}`;
    Linking.openURL(url);
    setEnviado(true);
  }

  function handleReset() {
    setNombre(""); setTelefono(""); setEmail(""); setTipoViaje("");
    setDestino(""); setFechaSalida(""); setFechaRegreso("");
    setAdultos("2"); setNinos("0"); setPresupuesto(""); setComentarios("");
    setEnviado(false);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={isIOS ? "padding" : undefined}
      keyboardVerticalOffset={isIOS ? 0 : 0}
    >
      {/* Header */}
      <LinearGradient
        colors={HERO_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: topPad + 16,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: "900", color: "#fff" }}>Reservar</Text>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
          Completa el formulario y te contactamos
        </Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 100 }}
      >
        {enviado ? (
          <View style={{ alignItems: "center", paddingVertical: 40, gap: 16 }}>
            <View style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: "#4caf7820",
              alignItems: "center", justifyContent: "center",
            }}>
              <Ionicons name="checkmark-circle" size={48} color="#4caf78" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "800", color: colors.foreground, textAlign: "center" }}>
              Solicitud enviada
            </Text>
            <Text style={{ fontSize: 15, color: colors.mutedForeground, textAlign: "center", lineHeight: 22 }}>
              Tu solicitud fue enviada por WhatsApp. Un agente te contactara pronto.
            </Text>
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => ({
                marginTop: 10,
                paddingHorizontal: 28,
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: colors.primary,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                Nueva solicitud
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Datos personales */}
            <SectionLabel label="Tus datos" />
            <NativeInput placeholder="Nombre completo" value={nombre} onChangeText={setNombre} />
            <View style={{ height: 10 }} />
            <NativeInput placeholder="Telefono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
            <View style={{ height: 10 }} />
            <NativeInput placeholder="Email (opcional)" value={email} onChangeText={setEmail} keyboardType="email-address" />

            {/* Tipo de viaje */}
            <SectionLabel label="Tipo de viaje" />
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {TIPOS_VIAJE.map((t) => (
                <SelectChip
                  key={t.id}
                  label={t.label}
                  icon={t.icon}
                  selected={tipoViaje === t.id}
                  onPress={() => setTipoViaje(t.id)}
                />
              ))}
            </View>

            {/* Destino */}
            <SectionLabel label="Destino" />
            <NativeInput placeholder="Ej: Caribe, Europa, Japon..." value={destino} onChangeText={setDestino} />

            {/* Fechas */}
            <SectionLabel label="Fechas" />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: colors.mutedForeground, marginBottom: 6 }}>Salida</Text>
                <NativeInput placeholder="MM/DD/AAAA" value={fechaSalida} onChangeText={setFechaSalida} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: colors.mutedForeground, marginBottom: 6 }}>Regreso</Text>
                <NativeInput placeholder="MM/DD/AAAA" value={fechaRegreso} onChangeText={setFechaRegreso} />
              </View>
            </View>

            {/* Pasajeros */}
            <SectionLabel label="Pasajeros" />
            <View style={{ flexDirection: "row", gap: 10 }}>
              {[
                { label: "Adultos", value: adultos, onChange: cambiarAdultos },
                { label: "Ninos", value: ninos, onChange: cambiarNinos },
              ].map(({ label, value, onChange }) => (
                <View key={label} style={{
                  flex: 1,
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 14,
                  alignItems: "center",
                }}>
                  <Text style={{ fontSize: 12, color: colors.mutedForeground, marginBottom: 8 }}>{label}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                    <Pressable
                      onPress={() => onChange(-1)}
                      style={({ pressed }) => ({
                        width: 32, height: 32, borderRadius: 16,
                        backgroundColor: colors.primary + "20",
                        alignItems: "center", justifyContent: "center",
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Ionicons name="remove" size={18} color={colors.primary} />
                    </Pressable>
                    <Text style={{ fontSize: 22, fontWeight: "800", color: colors.foreground, minWidth: 24, textAlign: "center" }}>
                      {value}
                    </Text>
                    <Pressable
                      onPress={() => onChange(1)}
                      style={({ pressed }) => ({
                        width: 32, height: 32, borderRadius: 16,
                        backgroundColor: colors.primary + "20",
                        alignItems: "center", justifyContent: "center",
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Ionicons name="add" size={18} color={colors.primary} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            {/* Presupuesto */}
            <SectionLabel label="Presupuesto por persona" />
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {PRESUPUESTOS.map((p) => (
                <SelectChip
                  key={p.id}
                  label={p.label}
                  selected={presupuesto === p.id}
                  onPress={() => setPresupuesto(p.id)}
                />
              ))}
            </View>

            {/* Comentarios */}
            <SectionLabel label="Comentarios adicionales" />
            <NativeInput
              placeholder="Preferencias especiales, preguntas o detalles adicionales..."
              value={comentarios}
              onChangeText={setComentarios}
              multiline
              numberOfLines={4}
            />

            {/* Boton enviar */}
            <Pressable
              onPress={handleEnviar}
              style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1, marginTop: 28 })}
            >
              <LinearGradient
                colors={HERO_COLORS}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 14,
                  paddingVertical: 16,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Ionicons name="logo-whatsapp" size={22} color="#fff" />
                <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff" }}>
                  Enviar solicitud por WhatsApp
                </Text>
              </LinearGradient>
            </Pressable>

            {/* Contacto directo */}
            <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
              <Pressable
                onPress={() => Linking.openURL("tel:+17867635035")}
                style={({ pressed }) => ({
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Ionicons name="call-outline" size={18} color={colors.primary} />
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>Llamar</Text>
              </Pressable>
              <Pressable
                onPress={() => Linking.openURL("mailto:viajandoconjeans@gmail.com")}
                style={({ pressed }) => ({
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Ionicons name="mail-outline" size={18} color={colors.primary} />
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>Email</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
