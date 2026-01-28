import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
    const { isAuthenticated, isLoading } = useAuth();

    // While checking auth state, render nothing (splash screen is visible)
    if (isLoading) {
        return null;
    }

    // Redirect based on auth state
    return <Redirect href={isAuthenticated ? '/(tabs)' : '/auth/login'} />;
}
