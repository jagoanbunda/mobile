import { useTheme } from '@/context/ThemeContext';
import { useUnreadNotificationCount } from '@/services/hooks/use-notifications';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface NotificationBellProps {
    size?: number;
    style?: 'filled' | 'outlined';
}

export function NotificationBell({ size = 24, style = 'outlined' }: NotificationBellProps) {
    const { colors, isDark } = useTheme();
    const { data: unreadCount = 0 } = useUnreadNotificationCount();

    const iconName = style === 'filled' ? 'notifications' : 'notifications-none';

    return (
        <TouchableOpacity
            onPress={() => router.push('/notifications')}
            style={{ 
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
            }}
            className="w-10 h-10 items-center justify-center rounded-full active:opacity-80 relative"
        >
            <MaterialIcons name={iconName} size={size} color={colors.primary} />
            
            {unreadCount > 0 && (
                <View
                    style={{ backgroundColor: colors.error }}
                    className="absolute -top-0.5 -right-0.5 min-w-5 h-5 rounded-full items-center justify-center px-1"
                >
                    <Text style={{ color: colors.onError }} className="text-xs font-bold">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

export default NotificationBell;
