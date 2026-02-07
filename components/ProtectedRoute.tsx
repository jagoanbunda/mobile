import React, { ReactNode, useEffect, useRef, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { NetworkErrorScreen } from '@/components/NetworkErrorScreen';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Auth guard wrapper that verifies authentication on mount.
 * Shows loading indicator while verifying, redirects to login if not authenticated.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { verifyAuth, isVerifying, isAuthenticated, isLoading, verifyError, retryVerification } = useAuth();
  const { colors } = useTheme();
  const hasVerified = useRef(false);
  const verifyAuthRef = useRef(verifyAuth);
  const isCheckingRef = useRef(false);

   // Update ref on each render to always have latest verifyAuth function
   verifyAuthRef.current = verifyAuth;

   const handleRetry = useCallback(async () => {
     hasVerified.current = false;
     isCheckingRef.current = false;
     await retryVerification();
   }, [retryVerification]);

  // Show error screen if verification failed with network error
  if (verifyError && !isVerifying) {
    return (
      <NetworkErrorScreen 
        onRetry={handleRetry}
        isRetrying={isVerifying}
      />
    );
  }

   useEffect(() => {
     // Only verify once per mount, and only after initial loading is done
     // verifyAuth is intentionally excluded from dependencies to prevent re-verification loops
     // when auth state changes. We use verifyAuthRef to access the latest function.
     if (!isLoading && !hasVerified.current && !isCheckingRef.current) {
       hasVerified.current = true;
       isCheckingRef.current = true;
       
       const checkAuth = async () => {
         try {
           const isValid = await verifyAuthRef.current();
           if (!isValid) {
             router.replace('/auth/login');
           }
         } finally {
           isCheckingRef.current = false;
         }
       };
       
       checkAuth();
     }
   }, [isLoading]);

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
