import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useActiveChild, useChildSummary } from '@/services/hooks/use-children';
import { useNutritionSummary } from '@/services/hooks/use-foods';
import { useGrowthChart } from '@/services/hooks/use-anthropometry';
import { getAvatarUrl } from '@/config/env';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Map nutritional status to display text
const getNutritionalStatusDisplay = (status: string | undefined): string => {
  if (!status) return 'Healthy Growth';
  const normalized = status.toLowerCase();
  if (normalized === 'normal' || normalized === 'gizi baik') return 'Healthy Growth';
  if (normalized === 'underweight' || normalized === 'gizi kurang') return 'Underweight';
  if (normalized === 'overweight' || normalized === 'gizi lebih') return 'Overweight';
  if (normalized === 'severely underweight' || normalized === 'gizi buruk') return 'Severely Underweight';
  return status; // Return original if no mapping found
};

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { data: activeChild, isLoading: isLoadingChild } = useActiveChild();
  const childId = activeChild?.id || 0;
  const { data: childSummary, isLoading: isLoadingSummary } = useChildSummary(childId);
  const { data: nutritionData, isLoading: isLoadingNutrition } = useNutritionSummary(childId, { period: 'week' });
  const { data: growthData, isLoading: isLoadingGrowth } = useGrowthChart(childId);

  const isLoading = isLoadingChild || isLoadingSummary || isLoadingNutrition || isLoadingGrowth;

  // Get latest measurement z-scores from growth chart data
  const latestMeasurement = growthData?.measurements?.length 
    ? growthData.measurements[growthData.measurements.length - 1] 
    : null;

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, paddingTop: 48 }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, paddingTop: 48 }}>

      <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ backgroundColor: colors.background }} className="flex-row items-center justify-between px-4 pt-4 pb-2">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.push('/profile/edit-parent')} className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 active:opacity-80">
              {getAvatarUrl(user?.avatar_url) ? (
                <Image
                  source={{ uri: getAvatarUrl(user?.avatar_url)! }}
                  style={{ width: 40, height: 40 }}
                  contentFit="cover"
                  placeholder={colors.surfaceContainerHigh}
                  transition={200}
                />
              ) : (
                <View style={{ width: 40, height: 40, backgroundColor: colors.surfaceContainerHigh }} className="items-center justify-center">
                  <MaterialIcons name="person" size={24} color={colors.onSurfaceVariant} />
                </View>
              )}
            </TouchableOpacity>
            <Text style={{ color: colors.text }} className="text-sm font-bold tracking-wide opacity-80">KREANOVA</Text>
          </View>
          <TouchableOpacity style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }} className="w-10 h-10 items-center justify-center rounded-full active:bg-white/20">
            <MaterialIcons name="notifications-none" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View className="px-4 mt-2 mb-6">
          <Text style={{ color: colors.text }} className="text-3xl font-bold tracking-tight leading-tight">
            Good Morning,{"\n"}{user?.name || 'Parent'} 👋
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
                {getAvatarUrl(activeChild?.avatar_url) ? (
                  <Image
                    source={{ uri: getAvatarUrl(activeChild?.avatar_url)! }}
                    style={{ width: 64, height: 64 }}
                    contentFit="cover"
                    placeholder={colors.surfaceContainerHigh}
                    transition={200}
                  />
                ) : (
                  <View style={{ width: 64, height: 64, backgroundColor: colors.surfaceContainerHighest }} className="items-center justify-center">
                    <MaterialIcons name="child-care" size={32} color={colors.onSurfaceVariant} />
                  </View>
                )}
              </View>
              <View>
                <Text style={{ color: colors.onSurface }} className="text-xl font-bold">{activeChild?.name || 'Child'}</Text>
                <View style={{ backgroundColor: colors.primaryContainer }} className="mt-1 flex-row items-center gap-1.5 px-3 py-1 rounded-full">
                  <MaterialIcons name="check-circle" size={14} color={colors.primary} />
                  <Text style={{ color: colors.onPrimaryContainer }} className="text-xs font-bold uppercase tracking-wider">
                    {getNutritionalStatusDisplay(childSummary?.latest_measurement?.nutritional_status)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View className="flex-row gap-3 relative z-10">
              <View style={{ backgroundColor: colors.backgroundAlt }} className="flex-1 p-3 rounded-lg">
                <Text style={{ color: colors.textMuted }} className="text-xs mb-1">Height/Age</Text>
                <Text style={{ color: colors.text }} className="text-sm font-bold font-mono">
                  {latestMeasurement ? `${latestMeasurement.height_for_age_zscore.toFixed(1)} SD` : 'No data'}
                </Text>
              </View>
              <View style={{ backgroundColor: colors.backgroundAlt }} className="flex-1 p-3 rounded-lg">
                <Text style={{ color: colors.textMuted }} className="text-xs mb-1">Weight/Age</Text>
                <Text style={{ color: colors.text }} className="text-sm font-bold font-mono">
                  {latestMeasurement ? `${latestMeasurement.weight_for_age_zscore.toFixed(1)} SD` : 'No data'}
                </Text>
              </View>
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
                  <Text style={{ color: colors.text }} className="text-sm font-bold">
                    {Math.round(nutritionData?.totals?.calories || 0)} <Text style={{ color: colors.textMuted }} className="text-xs font-normal">kcal</Text>
                  </Text>
                </View>
                <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="h-3 w-full rounded-full overflow-hidden">
                  <View 
                    style={{ 
                      backgroundColor: colors.primary,
                      width: `${Math.min(100, ((nutritionData?.totals?.calories || 0) / 10000) * 100)}%`
                    }} 
                    className="h-full rounded-full" 
                  />
                </View>
              </View>

              {/* Protein */}
              <View>
                <View className="flex-row justify-between items-end mb-2">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="egg" size={16} color={colors.tertiary} />
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm font-medium">Protein</Text>
                  </View>
                  <Text style={{ color: colors.text }} className="text-sm font-bold">
                    {Math.round(nutritionData?.totals?.protein || 0)} <Text style={{ color: colors.textMuted }} className="text-xs font-normal">g</Text>
                  </Text>
                </View>
                <View style={{ backgroundColor: colors.surfaceContainerHighest }} className="h-3 w-full rounded-full overflow-hidden">
                  <View 
                    style={{ 
                      backgroundColor: colors.tertiary,
                      width: `${Math.min(100, ((nutritionData?.totals?.protein || 0) / 200) * 100)}%`
                    }} 
                    className="h-full rounded-full" 
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
