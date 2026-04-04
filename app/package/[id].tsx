import { Ionicons } from "@expo/vector-icons";
import { getGetPackageQueryKey, useGetPackage } from "@workspace/api-client-react";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-CO")} COP`;
}

export default function PackageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const numId = Number(id);
  const { data: pkg, isLoading, isError, refetch } = useGetPackage(numId, {
    query: {
      enabled: !!numId,
      queryKey: getGetPackageQueryKey(numId),
    },
  });

  const bottomPad = isWeb ? 34 : insets.bottom;

  async function handleShare() {
    if (!pkg) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const includes = pkg.includes.map((i) => `  • ${i}`).join("\n");
    const message = `
VIAJANDO CON JEANS
------------------------------
${pkg.name}
Destino: ${pkg.destination}
Duracion: ${pkg.duration}
Precio: ${formatPrice(pkg.price)}${pkg.originalPrice ? ` (antes ${formatPrice(pkg.originalPrice)})` : ""}
${pkg.departureDate ? `Salida: ${pkg.departureDate}` : ""}
${pkg.maxPeople ? `Cupos: ${pkg.maxPeople} personas` : ""}

INCLUYE:
${includes}

${pkg.description}

------------------------------
Reserva en: viajandoconjeans.com
    `.trim();

    if (Platform.OS === "web") {
      Alert.alert("Informacion del paquete", message);
    } else {
      await Share.share({
        title: `Paquete: ${pkg.name}`,
        message,
      });
    }
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    backButton: {
      position: "absolute",
      top: (isWeb ? 67 : insets.top) + 12,
      left: 16,
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.45)",
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: "100%",
      height: 280,
      backgroundColor: colors.muted,
    },
    imagePlaceholder: {
      width: "100%",
      height: 280,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    body: {
      padding: 20,
    },
    badgeRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 12,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "700",
    },
    name: {
      fontSize: 26,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 6,
    },
    destination: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginBottom: 16,
    },
    destinationText: {
      fontSize: 15,
      color: colors.mutedForeground,
    },
    priceBlock: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    priceLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 6,
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 10,
    },
    price: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.primary,
    },
    originalPrice: {
      fontSize: 16,
      color: colors.mutedForeground,
      textDecorationLine: "line-through",
    },
    infoRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },
    infoChip: {
      flex: 1,
      backgroundColor: colors.muted,
      borderRadius: colors.radius - 4,
      padding: 12,
      alignItems: "center",
      gap: 4,
    },
    infoChipValue: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.foreground,
      textAlign: "center",
    },
    infoChipLabel: {
      fontSize: 11,
      color: colors.mutedForeground,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 12,
    },
    includeItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    includeText: {
      fontSize: 14,
      color: colors.foreground,
      flex: 1,
      lineHeight: 20,
    },
    description: {
      fontSize: 15,
      color: colors.mutedForeground,
      lineHeight: 22,
      marginBottom: 24,
    },
    shareBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 16,
      marginTop: 10,
    },
    shareBtnText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#fff",
    },
    errorContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      padding: 24,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Ionicons name="airplane" size={48} color={colors.primary} />
        <Text style={{ color: colors.mutedForeground, marginTop: 12, fontSize: 15 }}>
          Cargando paquete...
        </Text>
      </View>
    );
  }

  if (isError || !pkg) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="cloud-offline-outline" size={56} color={colors.mutedForeground} />
        <Text style={{ fontSize: 17, fontWeight: "700", color: colors.foreground }}>
          No se pudo cargar
        </Text>
        <Text style={{ color: colors.mutedForeground, textAlign: "center" }}>
          Hubo un error al cargar este paquete.
        </Text>
        <Pressable
          style={{ backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 }}
          onPress={() => refetch()}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  const hasDiscount = pkg.originalPrice != null && pkg.originalPrice > pkg.price;

  return (
    <View style={styles.container}>
      <Pressable
        testID="button-back"
        style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.7 : 1 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 20 }}
      >
        {pkg.imageUrl ? (
          <Image source={{ uri: pkg.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="airplane" size={64} color={colors.mutedForeground} />
          </View>
        )}

        <View style={styles.body}>
          <View style={styles.badgeRow}>
            {pkg.featured && (
              <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                <Text style={[styles.badgeText, { color: colors.accentForeground }]}>Destacado</Text>
              </View>
            )}
            <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.badgeText, { color: "#fff" }]}>{pkg.category}</Text>
            </View>
            {!pkg.available && (
              <View style={[styles.badge, { backgroundColor: colors.destructive }]}>
                <Text style={[styles.badgeText, { color: "#fff" }]}>No disponible</Text>
              </View>
            )}
          </View>

          <Text style={styles.name}>{pkg.name}</Text>
          <View style={styles.destination}>
            <Ionicons name="location-outline" size={16} color={colors.mutedForeground} />
            <Text style={styles.destinationText}>{pkg.destination}</Text>
          </View>

          {/* Price */}
          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>Precio por persona</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(pkg.price)}</Text>
              {hasDiscount && (
                <Text style={styles.originalPrice}>{formatPrice(pkg.originalPrice!)}</Text>
              )}
            </View>
          </View>

          {/* Info chips */}
          <View style={styles.infoRow}>
            <View style={styles.infoChip}>
              <Ionicons name="time-outline" size={18} color={colors.primary} />
              <Text style={styles.infoChipValue}>{pkg.duration}</Text>
              <Text style={styles.infoChipLabel}>Duracion</Text>
            </View>
            {pkg.maxPeople && (
              <View style={styles.infoChip}>
                <Ionicons name="people-outline" size={18} color={colors.primary} />
                <Text style={styles.infoChipValue}>{pkg.maxPeople}</Text>
                <Text style={styles.infoChipLabel}>Max personas</Text>
              </View>
            )}
            {pkg.departureDate && (
              <View style={styles.infoChip}>
                <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                <Text style={styles.infoChipValue}>{pkg.departureDate}</Text>
                <Text style={styles.infoChipLabel}>Salida</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Descripcion</Text>
          <Text style={styles.description}>{pkg.description}</Text>

          {/* Includes */}
          <Text style={styles.sectionTitle}>Que incluye</Text>
          <View style={{ marginBottom: 24 }}>
            {pkg.includes.map((item, i) => (
              <View key={i} style={styles.includeItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.secondary} />
                <Text style={styles.includeText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Share / Download */}
          <Pressable
            testID="button-share"
            style={({ pressed }) => [styles.shareBtn, { opacity: pressed ? 0.85 : 1 }]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={20} color="#fff" />
            <Text style={styles.shareBtnText}>Descargar / Compartir informacion</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
