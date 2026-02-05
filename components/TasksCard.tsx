import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import type { TaskReminder, TaskReminderType, TaskPriority } from '@/types/dashboard';

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

// Priority indicator colors
const priorityColors: Record<TaskPriority, string> = {
    high: '#F44336',
    medium: '#FF9800',
    low: '#4CAF50',
};

// Indonesian strings
const strings = {
    cardTitle: 'Tugas Pending',
    emptyTitle: 'Tidak ada tugas pending',
    emptySubtitle: 'Semua tugas selesai! 🎉',
};

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
                    <TouchableOpacity
                        key={`${task.type}-${index}`}
                        onPress={() => handleTaskPress(task)}
                        activeOpacity={0.7}
                        style={{ backgroundColor: colors.surfaceContainer }}
                        className="rounded-xl p-3 flex-row items-center"
                    >
                        {/* Priority Indicator */}
                        <View
                            style={{ backgroundColor: priorityColors[task.priority] }}
                            className="w-2 h-2 rounded-full mr-3"
                        />

                        {/* Task Icon */}
                        <View
                            style={{ backgroundColor: colors.primaryContainer }}
                            className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                        >
                            <MaterialIcons
                                name={taskIcons[task.type]}
                                size={22}
                                color={colors.onPrimaryContainer}
                            />
                        </View>

                        {/* Task Text */}
                        <View className="flex-1">
                            <Text
                                style={{ color: colors.onSurface }}
                                className="font-semibold text-sm"
                                numberOfLines={1}
                            >
                                {task.title}
                            </Text>
                            <Text
                                style={{ color: colors.onSurfaceVariant }}
                                className="text-xs mt-0.5"
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
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

export default TasksCard;
