import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import type { TaskReminder, TaskReminderType, TaskPriority } from '@/types/dashboard';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Route mapping for each task type
const taskRoutes: Record<TaskReminderType, string> = {
    ASQ3: '/screening',
    PMT: '/pmt',
    Anthropometry: '/anthropometry',
};

// Icon mapping for each task type
const taskIcons: Record<TaskReminderType, keyof typeof MaterialIcons.glyphMap> = {
    ASQ3: 'psychology',
    PMT: 'local-dining',
    Anthropometry: 'straighten',
};

// Priority indicator colors - softened for warm aesthetic
const priorityColors: Record<TaskPriority, string> = {
    high: '#E57373',    // Softer coral-red
    medium: '#FFB74D',  // Warm amber
    low: '#81C784',     // Soft sage green
};

// Indonesian strings
const strings = {
    cardTitle: 'Tugas Pending',
    emptyTitle: 'Tidak ada tugas pending',
    emptySubtitle: 'Semua tugas selesai! 🎉',
};

// Spring config for press feedback - snappy but not harsh
const SPRING_CONFIG = { damping: 15, stiffness: 300 };

interface TaskItemProps {
    task: TaskReminder;
    onPress: () => void;
    backgroundColor: string;
    colors: ReturnType<typeof useTheme>['colors'];
}

function TaskItem({ task, onPress, backgroundColor, colors }: TaskItemProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.97, SPRING_CONFIG);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, SPRING_CONFIG);
    };

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                animatedStyle,
                {
                    backgroundColor,
                    borderRadius: 12,
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    minHeight: 52, // Ensures >= 44px touch target with padding
                },
            ]}
        >
            {/* Priority Indicator */}
            <View
                style={{
                    backgroundColor: priorityColors[task.priority],
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginRight: 12,
                }}
            />

            {/* Task Icon */}
            <View
                style={{
                    backgroundColor: colors.primaryContainer,
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                }}
            >
                <MaterialIcons
                    name={taskIcons[task.type]}
                    size={22}
                    color={colors.onPrimaryContainer}
                />
            </View>

            {/* Task Text */}
            <View style={{ flex: 1 }}>
                <Text
                    style={{ color: colors.onSurface, fontWeight: '600', fontSize: 14 }}
                    numberOfLines={1}
                >
                    {task.title}
                </Text>
                <Text
                    style={{ color: colors.onSurfaceVariant, fontSize: 12, marginTop: 2 }}
                    numberOfLines={1}
                >
                    {task.description}
                </Text>
            </View>

            {/* Chevron */}
            <MaterialIcons
                name="chevron-right"
                size={20}
                color={colors.onSurfaceVariant}
            />
        </AnimatedPressable>
    );
}

export interface TasksCardProps {
    tasks: TaskReminder[];
    onTaskPress?: (task: TaskReminder) => void;
}

export function TasksCard({ tasks, onTaskPress }: TasksCardProps) {
    const { colors } = useTheme();
    const router = useRouter();

    const handleTaskPress = (task: TaskReminder) => {
        const route = taskRoutes[task.type];
        router.push(route as never);
        onTaskPress?.(task);
    };

    // Empty state
    if (tasks.length === 0) {
        return (
            <View
                style={{ backgroundColor: colors.surfaceContainerHigh }}
                className="rounded-2xl p-4"
            >
                <Text style={{ color: colors.onSurface }} className="font-bold text-base mb-4">
                    {strings.cardTitle}
                </Text>
                <View className="items-center py-6">
                    <MaterialIcons name="check-circle" size={48} color={colors.primary} />
                    <Text style={{ color: colors.onSurface }} className="font-medium text-base mt-3">
                        {strings.emptyTitle}
                    </Text>
                    <Text style={{ color: colors.onSurfaceVariant }} className="text-sm mt-1">
                        {strings.emptySubtitle}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View
            style={{ backgroundColor: colors.surfaceContainerHigh }}
            className="rounded-2xl p-4"
        >
            {/* Card Title */}
            <Text style={{ color: colors.onSurface }} className="font-bold text-base mb-3">
                {strings.cardTitle}
            </Text>

            {/* Task List */}
            <View className="gap-2">
                {tasks.map((task, index) => (
                    <TaskItem
                        key={`${task.type}-${index}`}
                        task={task}
                        onPress={() => handleTaskPress(task)}
                        backgroundColor={colors.surfaceContainer}
                        colors={colors}
                    />
                ))}
            </View>
        </View>
    );
}

export default TasksCard;
