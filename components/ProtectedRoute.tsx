import React, { useCallback, ReactNode } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Auth guard wrapper that verifies authentication on every screen focus.
 * Shows loading indicator while verifying, redirects to login if not authenticated.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { verifyAuth, isVerifying, isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const checkAuth = async () => {
        const isValid = await verifyAuth();
        if (isMounted && !isValid) {
          router.replace('/auth/login');
        }
      };

      // Only verify if not in initial loading state
      if (!isLoading) {
        checkAuth();
      }

      return () => {
        isMounted = false;
      };
    }, [verifyAuth, isLoading])
  );

  // Show loading during initial auth load or verification
  if (isLoading || isVerifying) {
    return (
      <View
        style={{ backgroundColor: colors.surface }}
        className="flex-1 items-center justify-center"
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Don't render children if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <View
        style={{ backgroundColor: colors.surface }}
        className="flex-1 items-center justify-center"
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
