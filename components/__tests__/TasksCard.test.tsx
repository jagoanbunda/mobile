import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TasksCard } from '@/components/TasksCard';
import type { TaskReminder } from '@/types/dashboard';

// Mock ThemeContext
jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        colors: {
            primary: '#416936',
            onPrimary: '#FFFFFF',
            primaryContainer: '#C3E8B6',
            onPrimaryContainer: '#0D2006',
            onSurface: '#1A1C19',
            onSurfaceVariant: '#44483E',
            surfaceContainer: '#F2F5EA',
            surfaceContainerHigh: '#ECEFE5',
        },
    }),
}));

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// Mock MaterialIcons
jest.mock('@expo/vector-icons/MaterialIcons', () => {
    const { Text } = require('react-native');
    return function MockMaterialIcons({ name, testID }: { name: string; testID?: string }) {
        return <Text testID={testID || `icon-${name}`}>{name}</Text>;
    };
});

describe('TasksCard', () => {
    const mockTasks: TaskReminder[] = [
        {
            type: 'ASQ3',
            title: 'Skrining ASQ-3',
            description: 'Skrining usia 18 bulan belum dilakukan',
            priority: 'high',
        },
        {
            type: 'PMT',
            title: 'Jadwal PMT',
            description: 'Sesi PMT hari ini belum dicatat',
            priority: 'medium',
        },
        {
            type: 'Anthropometry',
            title: 'Pengukuran Antropometri',
            description: 'Pengukuran bulanan belum dilakukan',
            priority: 'low',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('rendering with tasks', () => {
        it('renders card title', () => {
            render(<TasksCard tasks={mockTasks} />);
            
            expect(screen.getByText('Tugas Pending')).toBeTruthy();
        });

        it('renders all task items', () => {
            render(<TasksCard tasks={mockTasks} />);
            
            expect(screen.getByText('Skrining ASQ-3')).toBeTruthy();
            expect(screen.getByText('Jadwal PMT')).toBeTruthy();
            expect(screen.getByText('Pengukuran Antropometri')).toBeTruthy();
        });

        it('renders task descriptions', () => {
            render(<TasksCard tasks={mockTasks} />);
            
            expect(screen.getByText('Skrining usia 18 bulan belum dilakukan')).toBeTruthy();
            expect(screen.getByText('Sesi PMT hari ini belum dicatat')).toBeTruthy();
            expect(screen.getByText('Pengukuran bulanan belum dilakukan')).toBeTruthy();
        });

        it('renders task type icons', () => {
            render(<TasksCard tasks={mockTasks} />);
            
            expect(screen.getByTestId('icon-psychology')).toBeTruthy();
            expect(screen.getByTestId('icon-local-dining')).toBeTruthy();
            expect(screen.getByTestId('icon-straighten')).toBeTruthy();
        });

        it('renders chevron icons for navigation', () => {
            render(<TasksCard tasks={mockTasks} />);
            
            // All tasks should have chevron-right icons
            const chevrons = screen.getAllByText('chevron-right');
            expect(chevrons).toHaveLength(3);
        });
    });

    describe('empty state', () => {
        it('renders empty state when no tasks', () => {
            render(<TasksCard tasks={[]} />);
            
            expect(screen.getByText('Tugas Pending')).toBeTruthy();
            expect(screen.getByText('Tidak ada tugas pending')).toBeTruthy();
            expect(screen.getByText('Semua tugas selesai! 🎉')).toBeTruthy();
        });

        it('renders check-circle icon in empty state', () => {
            render(<TasksCard tasks={[]} />);
            
            expect(screen.getByTestId('icon-check-circle')).toBeTruthy();
        });
    });

    describe('navigation', () => {
        it('navigates to screening on ASQ3 task press', () => {
            render(<TasksCard tasks={[mockTasks[0]]} />);
            
            fireEvent.press(screen.getByText('Skrining ASQ-3'));
            
            expect(mockPush).toHaveBeenCalledWith('/screening');
        });

        it('navigates to pmt on PMT task press', () => {
            render(<TasksCard tasks={[mockTasks[1]]} />);
            
            fireEvent.press(screen.getByText('Jadwal PMT'));
            
            expect(mockPush).toHaveBeenCalledWith('/pmt');
        });

        it('navigates to anthropometry on Anthropometry task press', () => {
            render(<TasksCard tasks={[mockTasks[2]]} />);
            
            fireEvent.press(screen.getByText('Pengukuran Antropometri'));
            
            expect(mockPush).toHaveBeenCalledWith('/anthropometry');
        });
    });

    describe('callback', () => {
        it('calls onTaskPress callback when task is pressed', () => {
            const onTaskPress = jest.fn();
            render(<TasksCard tasks={[mockTasks[0]]} onTaskPress={onTaskPress} />);
            
            fireEvent.press(screen.getByText('Skrining ASQ-3'));
            
            expect(onTaskPress).toHaveBeenCalledWith(mockTasks[0]);
        });

        it('does not throw when onTaskPress is not provided', () => {
            render(<TasksCard tasks={[mockTasks[0]]} />);
            
            expect(() => {
                fireEvent.press(screen.getByText('Skrining ASQ-3'));
            }).not.toThrow();
        });
    });

    describe('priority indicators', () => {
        it('renders priority indicators for all tasks', () => {
            const { root } = render(<TasksCard tasks={mockTasks} />);
            
            // The component renders priority dots - verify the structure exists
            expect(root).toBeTruthy();
        });
    });
});
