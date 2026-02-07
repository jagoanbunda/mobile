import { ProfileHeaderSkeleton, CardSkeleton, ChartSkeleton, StatCardSkeleton } from '@/components/Skeleton';
import { ProgressRingSection } from '@/components/ProgressRingSection';
import { TasksCard } from '@/components/TasksCard';
import { TipsCarousel } from '@/components/TipsCarousel';
import { WeeklyTrend } from '@/components/WeeklyTrend';
import { ChildDropdown } from '@/components/ChildDropdown';
import { getAvatarUrl } from '@/config/env';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { useDashboard } from '@/services/hooks/use-dashboard';
import { getTimeBasedGreeting } from '@/utils/greeting';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { data: activeChild, children: allChildren, isLoading: isLoadingChild } = useActiveChild();
  const childId = activeChild?.id || 0;

  // Dashboard data hook
  const { data: dashboardData, isLoading: isLoadingDashboard } = useDashboard(childId);

  const isLoading = isLoadingDashboard || isLoadingChild;

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, paddingTop: 48 }}>
        <View className="px-4 pt-4 pb-6 gap-6">
          <ProfileHeaderSkeleton />
          <CardSkeleton />
          <ChartSkeleton />
          <View className="flex-row gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
          </View>
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
            <Text style={{ color: colors.text }} className="text-sm font-bold tracking-wide opacity-80">JagoanBunda</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <ChildDropdown avatarSize={36} />
            <TouchableOpacity style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }} className="w-10 h-10 items-center justify-center rounded-full active:bg-white/20">
              <MaterialIcons name="notifications-none" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 mt-2 mb-6">
          <Text style={{ color: colors.text }} className="text-3xl font-bold tracking-tight leading-tight">
            {getTimeBasedGreeting()},{"\n"}{user?.name || 'Bunda'} 👋
          </Text>
        </View>

        {/* Progress Rings (includes action buttons) */}
        <View className="px-4 mb-6">
          <ProgressRingSection
            data={dashboardData?.progressRings || null}
            isLoading={isLoadingDashboard}
          />
        </View>

        {/* Weekly Trend */}
        {childId > 0 && (
          <View className="px-4 mb-6">
            <WeeklyTrend childId={childId} />
          </View>
        )}

        {/* Tasks Card */}
        <View className="px-4 mb-6">
          <TasksCard tasks={dashboardData?.tasks || []} />
        </View>

        {/* Tips Carousel */}
        <View className="px-4 mb-24">
          <TipsCarousel tips={dashboardData?.tips || []} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
