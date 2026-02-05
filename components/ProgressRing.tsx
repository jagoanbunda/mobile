import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ProgressRingProps {
    /** Progress value from 0-100 */
    value: number;
    /** Ring diameter in pixels (default: 80) */
    size?: number;
    /** Stroke width in pixels (default: 8) */
    strokeWidth?: number;
    /** Progress arc color (default: primary) */
    color?: string;
    /** Track background color (default: surfaceContainerHighest) */
    trackColor?: string;
    /** Label text below the ring (e.g., "Energi") */
    label?: string;
    /** Optional icon to display in center */
    icon?: React.ReactNode;
    /** Show percentage in center (default: false if icon provided) */
    showPercentage?: boolean;
}

/**
 * Animated circular progress ring visualization.
 * 
 * Uses SVG stroke-dasharray/stroke-dashoffset technique for progress arc.
 * Animates from 0% to target value on mount using React Native Animated API.
 */
export function ProgressRing({
    value,
    size = 80,
    strokeWidth = 8,
    color,
    trackColor,
    label,
    icon,
    showPercentage,
}: ProgressRingProps) {
    const { colors } = useTheme();
    
    // Calculate SVG dimensions
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;
    
    // Clamp value between 0-100
    const clampedValue = Math.max(0, Math.min(100, value));
    
    // Animation ref
    const animatedValue = useRef(new Animated.Value(0)).current;
    
    // Derive colors from theme
    const progressColor = color ?? colors.primary;
    const backgroundTrackColor = trackColor ?? colors.surfaceContainerHighest;
    
    // Determine what to show in center
    const shouldShowPercentage = showPercentage ?? !icon;
    
    useEffect(() => {
        // Animate from 0 to target value
        Animated.timing(animatedValue, {
            toValue: clampedValue,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false, // stroke-dashoffset can't use native driver
        }).start();
    }, [clampedValue, animatedValue]);
    
    // Interpolate animated value to stroke-dashoffset
    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0],
    });

    return (
        <View style={styles.container}>
            {/* SVG Ring */}
            <View style={{ width: size, height: size }}>
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background Track */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={backgroundTrackColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress Arc */}
                    <AnimatedCircle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={progressColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        rotation="-90"
                        origin={`${center}, ${center}`}
                    />
                </Svg>
                
                {/* Center Content */}
                <View style={[styles.centerContent, { width: size, height: size }]}>
                    {icon ? (
                        icon
                    ) : shouldShowPercentage ? (
                        <Text 
                            style={[
                                styles.percentageText,
                                { 
                                    color: colors.onSurface,
                                    fontSize: size * 0.2,
                                }
                            ]}
                        >
                            {Math.round(clampedValue)}%
                        </Text>
                    ) : null}
                </View>
            </View>
            
            {/* Label Below Ring */}
            {label && (
                <Text 
                    style={[
                        styles.label,
                        { color: colors.onSurfaceVariant }
                    ]}
                >
                    {label}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    centerContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentageText: {
        fontWeight: '700',
    },
    label: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: '500',
    },
});

export default ProgressRing;
