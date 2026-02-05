import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
    useAnimatedProps, 
    useSharedValue, 
    withSpring, 
    withDelay 
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ActivityRingsProps {
    data: {
        calories: { percentage: number };
        protein: { percentage: number };
        carbs: { percentage: number };
    } | null;
}

interface RingConfig {
    key: 'calories' | 'protein' | 'carbs';
    radius: number;
    stroke: number;
    color: string;
    trackColor: string;
}

const RINGS: RingConfig[] = [
    { key: 'calories', radius: 80, stroke: 8, color: '#FF5722', trackColor: 'rgba(255,87,34,0.2)' },
    { key: 'protein', radius: 56, stroke: 6, color: '#8BC34A', trackColor: 'rgba(139,195,74,0.2)' },
    { key: 'carbs', radius: 36, stroke: 4, color: '#FFC107', trackColor: 'rgba(255,193,7,0.2)' },
];

const SPRING_CONFIG = { damping: 15, stiffness: 80 };

interface RingProps {
    config: RingConfig;
    percentage: number;
    index: number;
}

const Ring = ({ config, percentage, index }: RingProps) => {
    const progress = useSharedValue(0);
    const circumference = 2 * Math.PI * config.radius;

    useEffect(() => {
        // Normalize percentage to 0-1 range and clamp
        const target = Math.min(Math.max(percentage / 100, 0), 1);
        // Stagger animations based on index
        progress.value = withDelay(index * 100, withSpring(target, SPRING_CONFIG));
    }, [percentage, index]);

    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: circumference * (1 - progress.value),
        };
    });

    return (
        <>
            {/* Track Ring */}
            <Circle
                cx={90}
                cy={90}
                r={config.radius}
                stroke={config.trackColor}
                strokeWidth={config.stroke}
                fill="none"
                strokeLinecap="round"
            />
            {/* Progress Ring */}
            <AnimatedCircle
                cx={90}
                cy={90}
                r={config.radius}
                stroke={config.color}
                strokeWidth={config.stroke}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animatedProps={animatedProps}
                rotation="-90"
                origin="90, 90"
            />
        </>
    );
};

export function ActivityRings({ data }: ActivityRingsProps) {
    const getPercentage = (key: string) => {
        if (!data) return 0;
        // @ts-ignore - we know key exists on data
        return data[key]?.percentage || 0;
    };

    return (
        <View style={styles.container}>
            <Svg width={180} height={180} viewBox="0 0 180 180">
                {RINGS.map((ring, index) => (
                    <Ring 
                        key={ring.key} 
                        config={ring} 
                        percentage={getPercentage(ring.key)}
                        index={index}
                    />
                ))}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
