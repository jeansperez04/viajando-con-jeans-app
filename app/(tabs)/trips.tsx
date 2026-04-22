import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
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

const STORAGE_KEY = "vcj_trips_v1";

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  notes: string;
  checklist: ChecklistItem[];
  createdAt: number;
}

const DEFAULT_CHECKLIST: Omit<ChecklistItem, "id">[] = [
  { text: "Pasaporte / documento de identidad", done: false },
  { text: "Reservacion de vuelos", done: false },
  { text: "Reservacion de hotel", done: false },
  { text: "Seguro de viaje", done: false },
  { text: "Cambio de moneda / tarjeta internacional", done: false },
  { text: "Ropa para el clima del destino", done: false },
  { text: "Medicamentos y botiquin", done: false },
  { text: "Adaptador de corriente", done: false },
  { text: "Descargar mapas sin conexion", done: false },
  { text: "Notificar al banco sobre el viaje", done: false },
];

async function loadTrips(): Promise<Trip[]> {
  try {
    const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveTrips(trips: Trip[]): Promise<void> {
  try {
    const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch {}
}

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function EmptyState({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 16 }}>
      <LinearGradient
        colors={HERO_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" }}
      >
        <Ionicons name="map-outline" size={40} color="#fff" />
      </LinearGradient>
      <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, textAlign: "center" }}>
        Planifica tu proximo viaje
      </Text>
      <Text style={{ fontSize: 15, color: colors.mutedForeground, textAlign: "center", lineHeight: 22 }}>
        Organiza destinos, fechas, viajeros y listas de equipaje. Todo guardado en tu dispositivo.
      </Text>
    </View>
  );
}

function TripCard({
  trip,
  colors,
  onPress,
  onDelete,
}: {
  trip: Trip;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
  onDelete: () => void;
}) {
  const done = trip.checklist.filter((i) => i.done).length;
  const total = trip.checklist.length;
  const pct = total > 0 ? done / total : 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: colors.card,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontSize: 17, fontWeight: "700", color: colors.foreground }}>{trip.destination}</Text>
          <Text style={{ fontSize: 13, color: colors.mutedForeground }}>
            {trip.startDate} — {trip.endDate}
          </Text>
          <Text style={{ fontSize: 13, color: colors.mutedForeground }}>
            {trip.travelers} viajero{trip.travelers !== 1 ? "s" : ""}
          </Text>
        </View>
        <Pressable onPress={onDelete} hitSlop={12} style={{ padding: 4 }}>
          <Ionicons name="trash-outline" size={20} color={colors.mutedForeground} />
        </Pressable>
      </View>
      <View style={{ marginTop: 12, gap: 4 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, color: colors.mutedForeground }}>Lista de equipaje</Text>
          <Text style={{ fontSize: 12, color: colors.mutedForeground }}>{done}/{total}</Text>
        </View>
        <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: "hidden" }}>
          <LinearGradient
            colors={HERO_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: "100%", width: `${pct * 100}%`, borderRadius: 3 }}
          />
        </View>
      </View>
    </Pressable>
  );
}

function TripDetailModal({
  trip,
  colors,
  visible,
  onClose,
  onUpdate,
}: {
  trip: Trip;
  colors: ReturnType<typeof useColors>;
  visible: boolean;
  onClose: () => void;
  onUpdate: (t: Trip) => void;
}) {
  const [notes, setNotes] = useState(trip.notes);
  const [newItem, setNewItem] = useState("");
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setNotes(trip.notes);
  }, [trip.id]);

  function toggleItem(id: string) {
    Haptics.selectionAsync();
    onUpdate({
      ...trip,
      notes,
      checklist: trip.checklist.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    });
  }

  function addItem() {
    if (!newItem.trim()) return;
    Haptics.selectionAsync();
    onUpdate({
      ...trip,
      notes,
      checklist: [...trip.checklist, { id: uuid(), text: newItem.trim(), done: false }],
    });
    setNewItem("");
  }

  function removeItem(id: string) {
    onUpdate({ ...trip, notes, checklist: trip.checklist.filter((i) => i.id !== id) });
  }

  function saveNotes() {
    onUpdate({ ...trip, notes });
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: insets.top + 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, flex: 1 }} numberOfLines={1}>
            {trip.destination}
          </Text>
          <Pressable onPress={() => { saveNotes(); onClose(); }} style={{ paddingLeft: 16 }}>
            <Text style={{ fontSize: 16, color: "#0d6e91", fontWeight: "600" }}>Listo</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: insets.bottom + 32 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.mutedForeground, textTransform: "uppercase", letterSpacing: 0.8 }}>
              Notas del viaje
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              onBlur={saveNotes}
              placeholder="Agrega notas, ideas o recordatorios..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 14,
                fontSize: 15,
                color: colors.foreground,
                minHeight: 100,
                textAlignVertical: "top",
              }}
            />
          </View>

          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.mutedForeground, textTransform: "uppercase", letterSpacing: 0.8 }}>
              Lista de equipaje ({trip.checklist.filter((i) => i.done).length}/{trip.checklist.length})
            </Text>
            {trip.checklist.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => toggleItem(item.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: colors.card,
                  borderRadius: 10,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: item.done ? "#4caf78" : colors.border,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: item.done ? "#4caf78" : colors.border,
                    backgroundColor: item.done ? "#4caf78" : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.done && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: item.done ? colors.mutedForeground : colors.foreground,
                    textDecorationLine: item.done ? "line-through" : "none",
                  }}
                >
                  {item.text}
                </Text>
                <Pressable onPress={() => removeItem(item.id)} hitSlop={10}>
                  <Ionicons name="close" size={16} color={colors.mutedForeground} />
                </Pressable>
              </Pressable>
            ))}

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput
                value={newItem}
                onChangeText={setNewItem}
                placeholder="Agregar elemento..."
                placeholderTextColor={colors.mutedForeground}
                style={{
                  flex: 1,
                  backgroundColor: colors.card,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  fontSize: 15,
                  color: colors.foreground,
                }}
                onSubmitEditing={addItem}
                returnKeyType="done"
              />
              <Pressable
                onPress={addItem}
                style={{
                  backgroundColor: "#0d6e91",
                  borderRadius: 10,
                  width: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="add" size={22} color="#fff" />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function NewTripModal({
  colors,
  visible,
  onClose,
  onCreate,
}: {
  colors: ReturnType<typeof useColors>;
  visible: boolean;
  onClose: () => void;
  onCreate: (t: Trip) => void;
}) {
  const insets = useSafeAreaInsets();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(2);

  function reset() {
    setDestination("");
    setStartDate("");
    setEndDate("");
    setTravelers(2);
  }

  function handleCreate() {
    if (!destination.trim()) {
      Alert.alert("Destino requerido", "Por favor ingresa el destino del viaje.");
      return;
    }
    const trip: Trip = {
      id: uuid(),
      destination: destination.trim(),
      startDate: startDate || "Por definir",
      endDate: endDate || "Por definir",
      travelers,
      notes: "",
      checklist: DEFAULT_CHECKLIST.map((i) => ({ ...i, id: uuid() })),
      createdAt: Date.now(),
    };
    onCreate(trip);
    reset();
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: insets.top + 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Pressable onPress={() => { reset(); onClose(); }}>
            <Text style={{ fontSize: 16, color: colors.mutedForeground }}>Cancelar</Text>
          </Pressable>
          <Text style={{ fontSize: 17, fontWeight: "700", color: colors.foreground }}>Nuevo Viaje</Text>
          <Pressable onPress={handleCreate}>
            <Text style={{ fontSize: 16, color: "#0d6e91", fontWeight: "700" }}>Crear</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: insets.bottom + 32 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.mutedForeground }}>Destino</Text>
            <TextInput
              value={destination}
              onChangeText={setDestination}
              placeholder="Ej: Cancun, Paris, Maldivas..."
              placeholderTextColor={colors.mutedForeground}
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: colors.foreground,
              }}
            />
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.mutedForeground }}>Fecha de salida</Text>
              <TextInput
                value={startDate}
                onChangeText={setStartDate}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={colors.mutedForeground}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: colors.foreground,
                }}
              />
            </View>
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.mutedForeground }}>Fecha de regreso</Text>
              <TextInput
                value={endDate}
                onChangeText={setEndDate}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={colors.mutedForeground}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: colors.foreground,
                }}
              />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.mutedForeground }}>Viajeros</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 4,
                alignSelf: "flex-start",
              }}
            >
              <Pressable
                onPress={() => setTravelers(Math.max(1, travelers - 1))}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: travelers > 1 ? "#0d6e91" : colors.border,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="remove" size={20} color="#fff" />
              </Pressable>
              <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, paddingHorizontal: 24 }}>
                {travelers}
              </Text>
              <Pressable
                onPress={() => setTravelers(Math.min(20, travelers + 1))}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: "#0d6e91",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </Pressable>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#e8f8f0",
              borderRadius: 12,
              padding: 14,
              flexDirection: "row",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#4caf78" style={{ marginTop: 1 }} />
            <Text style={{ flex: 1, fontSize: 13, color: "#2d7a4f", lineHeight: 20 }}>
              Se creara automaticamente una lista de equipaje con 10 elementos esenciales para tu viaje.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function TripsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : insets.bottom;

  const [trips, setTrips] = useState<Trip[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useEffect(() => {
    loadTrips().then(setTrips);
  }, []);

  async function handleCreate(trip: Trip) {
    const next = [trip, ...trips];
    setTrips(next);
    await saveTrips(next);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async function handleUpdate(updated: Trip) {
    const next = trips.map((t) => (t.id === updated.id ? updated : t));
    setTrips(next);
    setSelectedTrip(updated);
    await saveTrips(next);
  }

  async function handleDelete(id: string) {
    Alert.alert("Eliminar viaje", "Esta accion no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          const next = trips.filter((t) => t.id !== id);
          setTrips(next);
          await saveTrips(next);
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={HERO_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: topPad + 16, paddingBottom: 24, paddingHorizontal: 20 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>Mis Viajes</Text>
            <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
              {trips.length === 0 ? "Organiza tu proximo aventura" : `${trips.length} viaje${trips.length !== 1 ? "s" : ""} planificado${trips.length !== 1 ? "s" : ""}`}
            </Text>
          </View>
          <Pressable
            onPress={() => setShowNew(true)}
            style={({ pressed }) => ({
              backgroundColor: "rgba(255,255,255,0.25)",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>Nuevo</Text>
          </Pressable>
        </View>
      </LinearGradient>

      {trips.length === 0 ? (
        <EmptyState colors={colors} />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: bottomPad + 16 }}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              colors={colors}
              onPress={() => setSelectedTrip(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}

      <NewTripModal
        colors={colors}
        visible={showNew}
        onClose={() => setShowNew(false)}
        onCreate={handleCreate}
      />

      {selectedTrip && (
        <TripDetailModal
          trip={selectedTrip}
          colors={colors}
          visible={!!selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onUpdate={handleUpdate}
        />
      )}
    </View>
  );
}
