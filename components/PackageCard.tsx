import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

interface TravelPackage {
  id: number;
  name: string;
  destination: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  duration: string;
  category: string;
  imageUrl?: string | null;
  includes: string[];
  featured: boolean;
  available: boolean;
  departureDate?: string | null;
  maxPeople?: number | null;
}

interface PackageCardProps {
  pkg: TravelPackage;
  compact?: boolean;
}

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  }
  if (price >= 1000) {
    return `$${Math.round(price / 1000)}K`;
  }
  return `$${price.toLocaleString()}`;
}

export function PackageCard({ pkg, compact = false }: PackageCardProps) {
  const colors = useColors();
  const router = useRouter();

  const hasDiscount =
    pkg.originalPrice != null && pkg.originalPrice > pkg.price;
  const discountPct = hasDiscount
    ? Math.round(((pkg.originalPrice! - pkg.price) / pkg.originalPrice!) * 100)
    : 0;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      overflow: "hidden",
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    image: {
      width: "100%",
      height: compact ? 140 : 200,
      backgroundColor: colors.muted,
    },
    imagePlaceholder: {
      width: "100%",
      height: compact ? 140 : 200,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeRow: {
      position: "absolute",
      top: 12,
      left: 12,
      right: 12,
      flexDirection: "row",
      gap: 6,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: "700" as const,
    },
    featuredBadge: {
      backgroundColor: colors.accent,
    },
    categoryBadge: {
      backgroundColor: "rgba(0,0,0,0.55)",
    },
    discountBadge: {
      backgroundColor: colors.destructive,
    },
    content: {
      padding: 14,
    },
    name: {
      fontSize: compact ? 15 : 17,
      fontWeight: "700" as const,
      color: colors.foreground,
      marginBottom: 4,
    },
    destination: {
      fontSize: 13,
      color: colors.mutedForeground,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    destinationText: {
      fontSize: 13,
      color: colors.mutedForeground,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    priceBlock: {},
    priceRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 6,
    },
    price: {
      fontSize: 20,
      fontWeight: "800" as const,
      color: colors.primary,
    },
    originalPrice: {
      fontSize: 13,
      color: colors.mutedForeground,
      textDecorationLine: "line-through",
    },
    duration: {
      fontSize: 12,
      color: colors.mutedForeground,
      marginTop: 2,
    },
    arrow: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <Pressable
      testID={`package-card-${pkg.id}`}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
      onPress={() => router.push(`/package/${pkg.id}`)}
    >
      {pkg.imageUrl ? (
        <Image
          source={{ uri: pkg.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="airplane" size={40} color={colors.mutedForeground} />
        </View>
      )}

      <View style={styles.badgeRow}>
        {pkg.featured && (
          <View style={[styles.badge, styles.featuredBadge]}>
            <Text style={[styles.badgeText, { color: colors.accentForeground }]}>
              Destacado
            </Text>
          </View>
        )}
        {hasDiscount && (
          <View style={[styles.badge, styles.discountBadge]}>
            <Text style={[styles.badgeText, { color: "#fff" }]}>
              -{discountPct}%
            </Text>
          </View>
        )}
        <View style={[styles.badge, styles.categoryBadge]}>
          <Text style={[styles.badgeText, { color: "#fff" }]}>
            {pkg.category}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {pkg.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 10 }}>
          <Ionicons name="location-outline" size={13} color={colors.mutedForeground} />
          <Text style={styles.destinationText}>{pkg.destination}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.priceBlock}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(pkg.price)}</Text>
              {hasDiscount && (
                <Text style={styles.originalPrice}>
                  {formatPrice(pkg.originalPrice!)}
                </Text>
              )}
            </View>
            <Text style={styles.duration}>{pkg.duration}</Text>
          </View>
          <View style={styles.arrow}>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function PackageSkeleton() {
  const colors = useColors();
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: colors.radius,
        overflow: "hidden",
        marginBottom: 16,
      }}
    >
      <View style={{ height: 180, backgroundColor: colors.muted }} />
      <View style={{ padding: 14, gap: 8 }}>
        <View style={{ height: 18, width: "70%", backgroundColor: colors.muted, borderRadius: 6 }} />
        <View style={{ height: 13, width: "45%", backgroundColor: colors.muted, borderRadius: 6 }} />
        <View style={{ height: 22, width: "35%", backgroundColor: colors.muted, borderRadius: 6, marginTop: 4 }} />
      </View>
    </View>
  );
}
