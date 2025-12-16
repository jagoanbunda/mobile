import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-dark pt-12">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-2 bg-background-dark/95">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.push('/profile/edit-parent')} className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 active:opacity-80">
              <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9fYvg7mNYN_HuqLrd17upuQW5WDUAgUnh6E2QM8dviMZDS0tlw4jPLOtXlu69BnN2PZoNQJweQVcHH918BF2ie7w17op7UeEU9X5s38gWB2-p5FOHJ1cG-Sa3iAzaihsowKY3L5k5KfDpqFF9DxxG_WZau2OOFVgi-NxNy_0zyjPUT7g2sqhdq0_VfZWZHzlGkogQE0TGCd5kAPjJgQCKbE3-BZKHdLZdZacS3lZhWQuaVfKA4is74Z3pPNuflZjymxMWmuPmqas" }}
                className="w-full h-full"
                contentFit="cover"
              />
            </TouchableOpacity>
            <Text className="text-sm font-bold tracking-wide opacity-80 text-white">KREANOVA</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20">
            <MaterialIcons name="notifications-none" size={24} color="#FAC638" />
          </TouchableOpacity>
        </View>

        <View className="px-4 mt-2 mb-6">
          <Text className="text-3xl font-bold tracking-tight text-white leading-tight">
            Good Morning,{"\n"}Sarah 👋
          </Text>
        </View>

        {/* Child Profile Card */}
        <View className="px-4 mt-2">
          <View className="w-full bg-[#2c2616] rounded-xl p-5 shadow-sm border border-[#6a5a2f] relative overflow-hidden">
            {/* Decorative Icon Background */}
            <View className="absolute top-0 right-0 p-5 opacity-10">
              <MaterialIcons name="eco" size={60} color="#FAC638" />
            </View>

            <TouchableOpacity onPress={() => router.push('/profile/edit-child')} className="flex-row items-center gap-4 mb-5 relative z-10 active:opacity-80">
              <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                <Image
                  source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPlXkKuOleVcp5VB4_fVYszN3GzM6CVhI9mq_Ufqa5cxnLAKEjZAqIzQFylNRxFXRyrDZ3KZ9fcDf6L6AzDNQhXhRo1JkCVA8Vwz-7Fp_jRQQtl4_dNuDJr_T7Pw8LHDtKp0rRNMkOvbvoeQ1pCm4T-7YC3ADQ7sUElKwMbtTszEW2JL3cdBHbwbtbFHB0hBfvo6L4mM1SUTrWv2sQxhWM_guoxTVs5huv4_M_FWRR9sIJut12TWxKgYFT2C_RLBuWAhByiZGKPRg" }}
                  className="w-full h-full"
                  contentFit="cover"
                />
              </View>
              <View>
                <Text className="text-xl font-bold text-white">Arjun</Text>
                <View className="mt-1 flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20">
                  <MaterialIcons name="check-circle" size={14} color="#FBBF24" />
                  <Text className="text-xs font-bold uppercase tracking-wider text-yellow-400">Healthy Growth</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View className="flex-row gap-3 relative z-10">
              <View className="flex-1 bg-background-dark p-3 rounded-lg">
                <Text className="text-xs text-[#ccbc8e] mb-1">Height/Age</Text>
                <Text className="text-sm font-bold font-mono text-white">-1.2 SD</Text>
              </View>
              <View className="flex-1 bg-background-dark p-3 rounded-lg">
                <Text className="text-xs text-[#ccbc8e] mb-1">Weight/Age</Text>
                <Text className="text-sm font-bold font-mono text-white">-0.5 SD</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Today's Focus */}
        <View className="px-4 mt-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-white">Today's Focus</Text>
            <Text className="text-xs font-medium text-primary">2 Pending</Text>
          </View>

          <View className="gap-3">
            {/* Task 1 */}
            <View className="flex-row items-center gap-4 bg-[#2c2616] p-4 rounded-xl border border-[#6a5a2f] shadow-sm">
              <View className="w-10 h-10 items-center justify-center rounded-full bg-orange-500/20">
                <MaterialIcons name="restaurant-menu" size={20} color="#FB923C" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-white">Input Lunch Menu</Text>
                <Text className="text-xs text-[#ccbc8e]">Arjun • 12:30 PM</Text>
              </View>
              <TouchableOpacity className="h-9 px-5 bg-primary items-center justify-center rounded-full active:opacity-90">
                <Text className="text-background-dark text-sm font-bold">Log</Text>
              </TouchableOpacity>
            </View>

            {/* Task 2 (Completed) */}
            <View className="flex-row items-center gap-4 bg-[#2c2616] p-4 rounded-xl border border-[#6a5a2f] shadow-sm opacity-60">
              <View className="w-10 h-10 items-center justify-center rounded-full bg-blue-500/20">
                <MaterialIcons name="medication" size={20} color="#60A5FA" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-white line-through decoration-[#ccbc8e]">PMT Consumption</Text>
                <Text className="text-xs text-[#ccbc8e]">Recorded at 9:00 AM</Text>
              </View>
              <View className="w-9 h-9 items-center justify-center rounded-full bg-yellow-500/20">
                <MaterialIcons name="check" size={20} color="#FAC638" />
              </View>
            </View>

            {/* Task 3 */}
            <View className="flex-row items-center gap-4 bg-[#2c2616] p-4 rounded-xl border border-[#6a5a2f] shadow-sm">
              <View className="w-10 h-10 items-center justify-center rounded-full bg-purple-500/20">
                <MaterialIcons name="monitor-weight" size={20} color="#C084FC" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-white">Monthly Weigh-in</Text>
                <Text className="text-xs text-[#ccbc8e]">Due today</Text>
              </View>
              <TouchableOpacity className="h-9 px-5 bg-primary items-center justify-center rounded-full active:opacity-90">
                <Text className="text-background-dark text-sm font-bold">Log</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Nutrition This Week */}
        <View className="px-4 mt-8 pb-32">
          <View className="bg-[#2c2616] rounded-xl p-5 border border-[#6a5a2f] shadow-md">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-bold text-white">Nutrition This Week</Text>
              <TouchableOpacity className="flex-row items-center gap-1">
                <Text className="text-xs text-primary font-bold uppercase tracking-wider">Details</Text>
                <MaterialIcons name="chevron-right" size={16} color="#FAC638" />
              </TouchableOpacity>
            </View>

            <View className="gap-6">
              {/* Energy */}
              <View>
                <View className="flex-row justify-between items-end mb-2">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="bolt" size={16} color="#F59E0B" />
                    <Text className="text-sm font-medium text-[#ccbc8e]">Energy</Text>
                  </View>
                  <Text className="text-sm font-bold text-white">1200 <Text className="text-[#ccbc8e] text-xs font-normal">/ 1400 kcal</Text></Text>
                </View>
                <View className="h-3 w-full bg-[#6a5a2f]/50 rounded-full overflow-hidden">
                  <View className="h-full bg-primary rounded-full w-[85%]" />
                </View>
              </View>

              {/* Protein */}
              <View>
                <View className="flex-row justify-between items-end mb-2">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="egg" size={16} color="#60A5FA" />
                    <Text className="text-sm font-medium text-[#ccbc8e]">Protein</Text>
                  </View>
                  <Text className="text-sm font-bold text-white">20 <Text className="text-[#ccbc8e] text-xs font-normal">/ 25 g</Text></Text>
                </View>
                <View className="h-3 w-full bg-[#6a5a2f]/50 rounded-full overflow-hidden">
                  <View className="h-full bg-blue-400 rounded-full w-[80%]" />
                </View>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
