import { Ionicons } from "@expo/vector-icons";
import { useListCategories, useListPackages } from "@workspace/api-client-react";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PackageCard, PackageSkeleton } from "@/components/PackageCard";
import { useColors } from "@/hooks/useColors";

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : insets.bottom;

  const categories = useListCategories();
  const packages = useListPackages(
    selectedCategory ? { category: selectedCategory } : {}
  );

  const filtered = (packages.data ?? []).filter((pkg) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      pkg.name.toLowerCase().includes(q) ||
      pkg.destination.toLowerCase().includes(q) ||
      pkg.category.toLowerCase().includes(q)
    );
  });

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 16,
      paddingHorizontal: 20,
      paddingBottom: 14,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 14,
    },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.foreground,
      padding: 0,
    },
    categoriesRow: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      borderWidth: 1.5,
    },
    chipText: {
      fontSize: 13,
      fontWeight: "600",
    },
    list: {
      padding: 16,
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: 60,
      gap: 12,
    },
    emptyText: {
      fontSize: 16,
      color: colors.mutedForeground,
      textAlign: "center",
    },
    countText: {
      fontSize: 13,
      color: colors.mutedForeground,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 4,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar Destinos</Text>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
          <TextInput
            testID="input-search"
            style={styles.searchInput}
            placeholder="Buscar destinos..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable testID="button-clear-search" onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
      >
        <Pressable
          testID="chip-all"
          style={[
            styles.chip,
            {
              backgroundColor: selectedCategory === null ? colors.primary : colors.card,
              borderColor: selectedCategory === null ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[
            styles.chipText,
            { color: selectedCategory === null ? "#fff" : colors.foreground },
          ]}>
            Todos
          </Text>
        </Pressable>
        {categories.data?.map((cat) => (
          <Pressable
            testID={`chip-${cat.slug}`}
            key={cat.id}
            style={[
              styles.chip,
              {
                backgroundColor: selectedCategory === cat.name ? colors.primary : colors.card,
                borderColor: selectedCategory === cat.name ? colors.primary : colors.border,
              },
            ]}
            onPress={() =>
              setSelectedCategory(selectedCategory === cat.name ? null : cat.name)
            }
          >
            <Text style={[
              styles.chipText,
              { color: selectedCategory === cat.name ? "#fff" : colors.foreground },
            ]}>
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {packages.isLoading ? (
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(i) => String(i)}
          contentContainerStyle={styles.list}
          renderItem={() => <PackageSkeleton />}
          scrollEnabled={false}
        />
      ) : packages.isError ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.mutedForeground} />
          <Text style={styles.emptyText}>Error cargando paquetes</Text>
          <Pressable onPress={() => packages.refetch()}>
            <Text style={{ color: colors.primary, fontWeight: "600" }}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <Text style={styles.countText}>
            {filtered.length} {filtered.length === 1 ? "paquete" : "paquetes"} encontrados
          </Text>
          <FlatList
            testID="list-packages"
            data={filtered}
            keyExtractor={(p) => String(p.id)}
            contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 80 }]}
            renderItem={({ item }) => <PackageCard pkg={item} />}
            scrollEnabled={!!filtered.length}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color={colors.mutedForeground} />
                <Text style={styles.emptyText}>
                  No hay paquetes que coincidan{"\n"}con tu busqueda
                </Text>
              </View>
            }
          />
        </>
      )}
    </View>
  );
}
