import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, paddingTop: 48 }}>

      <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ backgroundColor: colors.background }} className="flex-row items-center justify-between px-4 pt-4 pb-2">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.push('/profile/edit-parent')} className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 active:opacity-80">
              <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9fYvg7mNYN_HuqLrd17upuQW5WDUAgUnh6E2QM8dviMZDS0tlw4jPLOtXlu69BnN2PZoNQJweQVcHH918BF2ie7w17op7UeEU9X5s38gWB2-p5FOHJ1cG-Sa3iAzaihsowKY3L5k5KfDpqFF9DxxG_WZau2OOFVgi-NxNy_0zyjPUT7g2sqhdq0_VfZWZHzlGkogQE0TGCd5kAPjJgQCKbE3-BZKHdLZdZacS3lZhWQuaVfKA4is74Z3pPNuflZjymxMWmuPmqas" }}
                style={{ width: 40, height: 40 }}
                contentFit="cover"
                placeholder={colors.surfaceContainerHigh}
                transition={200}
              />
            </TouchableOpacity>
            <Text style={{ color: colors.text }} className="text-sm font-bold tracking-wide opacity-80">KREANOVA</Text>
          </View>
          <TouchableOpacity style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }} className="w-10 h-10 items-center justify-center rounded-full active:bg-white/20">
            <MaterialIcons name="notifications-none" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View className="px-4 mt-2 mb-6">
          <Text style={{ color: colors.text }} className="text-3xl font-bold tracking-tight leading-tight">
            Good Morning,{"\n"}Bunda Rahma 👋
          </Text>
        </View>

        {/* Child Profile Card */}
        <View className="px-4 mt-2">
          <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="w-full rounded-xl p-5 relative overflow-hidden">
            {/* Decorative Icon Background */}
            <View className="absolute top-0 right-0 p-5 opacity-10">
              <MaterialIcons name="eco" size={60} color={colors.primary} />
            </View>

            <TouchableOpacity onPress={() => router.push('/profile/edit-child')} className="flex-row items-center gap-4 mb-5 relative z-10 active:opacity-80">
              <View className="w-16 h-16 rounded-full overflow-hidden">
                <Image
                  source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPlXkKuOleVcp5VB4_fVYszN3GzM6CVhI9mq_Ufqa5cxnLAKEjZAqIzQFylNRxFXRyrDZ3KZ9fcDf6L6AzDNQhXhRo1JkCVA8Vwz-7Fp_jRQQtl4_dNuDJr_T7Pw8LHDtKp0rRNMkOvbvoeQ1pCm4T-7YC3ADQ7sUElKwMbtTszEW2JL3cdBHbwbtbFHB0hBfvo6L4mM1SUTrWv2sQxhWM_guoxTVs5huv4_M_FWRR9sIJut12TWxKgYFT2C_RLBuWAhByiZGKPRg" }}
                  style={{ width: 64, height: 64 }}
                  contentFit="cover"
                  placeholder={colors.surfaceContainerHigh}
                  transition={200}
                />
              </View>
              <View>
                <Text style={{ color: colors.onSurface }} className="text-xl font-bold">Arjun</Text>
                <View style={{ backgroundColor: colors.primaryContainer }} className="mt-1 flex-row items-center gap-1.5 px-3 py-1 rounded-full">
                  <MaterialIcons name="check-circle" size={14} color={colors.primary} />
                  <Text style={{ color: colors.onPrimaryContainer }} className="text-xs font-bold uppercase tracking-wider">Healthy Growth</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View className="flex-row gap-3 relative z-10">
              <View style={{ backgroundColor: colors.backgroundAlt }} className="flex-1 p-3 rounded-lg">
                <Text style={{ color: colors.textMuted }} className="text-xs mb-1">Height/Age</Text>
                <Text style={{ color: colors.text }} className="text-sm font-bold font-mono">-1.2 SD</Text>
              </View>
              <View style={{ backgroundColor: colors.backgroundAlt }} className="flex-1 p-3 rounded-lg">
                <Text style={{ color: colors.textMuted }} className="text-xs mb-1">Weight/Age</Text>
                <Text style={{ color: colors.text }} className="text-sm font-bold font-mono">-0.5 SD</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Today's Focus */}
        <View className="px-4 mt-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text style={{ color: colors.text }} className="text-lg font-bold">Today's Focus</Text>
            <Text className="text-xs font-medium text-primary">2 Pending</Text>
          </View>

          <View className="gap-3">
            {/* Task 1 */}
            <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center gap-4 p-4 rounded-xl">
              <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="w-10 h-10 items-center justify-center rounded-full">
                <MaterialIcons name="restaurant-menu" size={20} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text style={{ color: colors.text }} className="text-sm font-bold">Input Lunch Menu</Text>
                <Text style={{ color: colors.textMuted }} className="text-xs">Arjun • 12:30 PM</Text>
              </View>
              <TouchableOpacity style={{ backgroundColor: colors.primary }} className="h-9 px-5 items-center justify-center rounded-full active:opacity-90">
                <Text style={{ color: colors.textInverted }} className="text-sm font-bold">Log</Text>
              </TouchableOpacity>
            </View>

            {/* Task 2 (Completed) */}
            <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center gap-4 p-4 rounded-xl opacity-60">
              <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="w-10 h-10 items-center justify-center rounded-full">
                <MaterialIcons name="medication" size={20} color={colors.tertiary} />
              </View>
              <View className="flex-1">
                <Text style={{ color: colors.text }} className="text-sm font-bold line-through">PMT Consumption</Text>
                <Text style={{ color: colors.textMuted }} className="text-xs">Recorded at 9:00 AM</Text>
              </View>
              <View style={{ backgroundColor: colors.primaryContainer }} className="w-9 h-9 items-center justify-center rounded-full">
                <MaterialIcons name="check" size={20} color={colors.primary} />
              </View>
            </View>

            {/* Task 3 */}
            <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="flex-row items-center gap-4 p-4 rounded-xl">
              <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="w-10 h-10 items-center justify-center rounded-full">
                <MaterialIcons name="monitor-weight" size={20} color={colors.secondary} />
              </View>
              <View className="flex-1">
                <Text style={{ color: colors.text }} className="text-sm font-bold">Monthly Weigh-in</Text>
                <Text style={{ color: colors.textMuted }} className="text-xs">Due today</Text>
              </View>
              <TouchableOpacity style={{ backgroundColor: colors.primary }} className="h-9 px-5 items-center justify-center rounded-full active:opacity-90">
                <Text style={{ color: colors.textInverted }} className="text-sm font-bold">Log</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Nutrition This Week */}
        <View className="px-4 mt-8 pb-32">
          <View style={{ backgroundColor: colors.surfaceContainerHigh }} className="rounded-xl p-5">
            <View className="flex-row items-center justify-between mb-6">
              <Text style={{ color: colors.text }} className="text-lg font-bold">Nutrition This Week</Text>
              <TouchableOpacity className="flex-row items-center gap-1">
                <Text className="text-xs text-primary font-bold uppercase tracking-wider">Details</Text>
                <MaterialIcons name="chevron-right" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View className="gap-6">
              {/* Energy */}
              <View>
                <View className="flex-row justify-between items-end mb-2">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="bolt" size={16} color={colors.primary} />
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium">Energy</Text>
                  </View>
                  <Text style={{ color: colors.text }} className="text-sm font-bold">1200 <Text style={{ color: colors.textMuted }} className="text-xs font-normal">/ 1400 kcal</Text></Text>
                </View>
                <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="h-3 w-full rounded-full overflow-hidden">
                  <View style={{ backgroundColor: colors.primary }} className="h-full rounded-full w-[85%]" />
                </View>
              </View>

              {/* Protein */}
              <View>
                <View className="flex-row justify-between items-end mb-2">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="egg" size={16} color={colors.tertiary} />
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium">Protein</Text>
                  </View>
                  <Text style={{ color: colors.text }} className="text-sm font-bold">20 <Text style={{ color: colors.textMuted }} className="text-xs font-normal">/ 25 g</Text></Text>
                </View>
                <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="h-3 w-full rounded-full overflow-hidden">
                  <View style={{ backgroundColor: colors.tertiary }} className="h-full rounded-full w-[80%]" />
                </View>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
