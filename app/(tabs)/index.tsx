import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useActiveChild } from '@/services/hooks/use-children';
import { useDashboard } from '@/services/hooks/use-dashboard';
import { getAvatarUrl } from '@/config/env';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChildSwitcher } from '@/components/ChildSwitcher';
import { QuickActions } from '@/components/QuickActions';
import { ProgressRingSection } from '@/components/ProgressRingSection';
import { WeeklyTrend } from '@/components/WeeklyTrend';
import { TasksCard } from '@/components/TasksCard';
import { TipsCarousel } from '@/components/TipsCarousel';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { data: activeChild, children: allChildren, isLoading: isLoadingChild } = useActiveChild();
  const childId = activeChild?.id || 0;

  // Dashboard data hook
  const { data: dashboardData, isLoading: isLoadingDashboard } = useDashboard(childId);

  // Child switching state
  const [selectedChildId, setSelectedChildId] = useState<number>(0);

  // Update selected when active child changes
  useEffect(() => {
    if (activeChild?.id) setSelectedChildId(activeChild.id);
  }, [activeChild?.id]);

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

        {/* Child Switcher */}
        <View className="px-4 mb-4">
          <ChildSwitcher
            childProfiles={(allChildren || []).slice(0, 3).map(c => ({
              id: c.id,
              name: c.name,
              age_in_months: c.age?.months || 0,
            }))}
            activeChildId={selectedChildId}
            onChildSelect={setSelectedChildId}
            isLoading={isLoadingChild}
          />
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <QuickActions isPmtEnrolled={false} />
        </View>

        {/* Progress Rings */}
        <View className="px-4 mb-6">
          <ProgressRingSection
            data={dashboardData?.progressRings || null}
            isLoading={isLoadingDashboard}
          />
        </View>

        {/* Weekly Trend */}
        {dashboardData?.weeklyTrend && (
          <View className="px-4 mb-6">
            <WeeklyTrend data={dashboardData.weeklyTrend} />
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
