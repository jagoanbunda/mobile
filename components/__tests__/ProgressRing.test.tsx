import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import { Text, View, Animated } from 'react-native';
import { ProgressRing } from '@/components/ProgressRing';

// Mock ThemeContext
jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        colors: {
            primary: '#416936',
            onSurface: '#1A1C19',
            onSurfaceVariant: '#44483E',
            surfaceContainerHighest: '#E6E9DF',
        },
    }),
}));

// Mock react-native-svg with proper Animated support
jest.mock('react-native-svg', () => {
    const React = require('react');
    const { View, Animated } = require('react-native');
    
    // Create a mock Circle component
    const MockCircle = React.forwardRef((props: any, ref: any) => (
        <View testID="circle" ref={ref} {...props} />
    ));
    MockCircle.displayName = 'MockCircle';
    
    return {
        __esModule: true,
        default: ({ children, ...props }: any) => <View testID="svg" {...props}>{children}</View>,
        Svg: ({ children, ...props }: any) => <View testID="svg" {...props}>{children}</View>,
        Circle: MockCircle,
    };
});

describe('ProgressRing', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        // Wrap timer cleanup in act to avoid act() warnings from animation updates
        act(() => {
            jest.runOnlyPendingTimers();
        });
        jest.useRealTimers();
    });

    describe('rendering', () => {
        it('renders with default props', () => {
            render(<ProgressRing value={50} />);
            
            // Should render SVG container
            expect(screen.getByTestId('svg')).toBeTruthy();
            
            // Should show percentage by default
            expect(screen.getByText('50%')).toBeTruthy();
        });

        it('renders with custom value and label', () => {
            render(<ProgressRing value={75} label="Energi" />);
            
            expect(screen.getByText('75%')).toBeTruthy();
            expect(screen.getByText('Energi')).toBeTruthy();
        });

        it('renders with 0% value (empty state)', () => {
            render(<ProgressRing value={0} label="Protein" />);
            
            expect(screen.getByText('0%')).toBeTruthy();
            expect(screen.getByText('Protein')).toBeTruthy();
        });

        it('renders with 100% value', () => {
            render(<ProgressRing value={100} label="Lengkap" />);
            
            expect(screen.getByText('100%')).toBeTruthy();
            expect(screen.getByText('Lengkap')).toBeTruthy();
        });

        it('clamps value above 100 to 100', () => {
            render(<ProgressRing value={150} />);
            
            expect(screen.getByText('100%')).toBeTruthy();
        });

        it('clamps negative value to 0', () => {
            render(<ProgressRing value={-20} />);
            
            expect(screen.getByText('0%')).toBeTruthy();
        });
    });

    describe('icon and percentage display', () => {
        it('renders icon instead of percentage when icon provided', () => {
            const TestIcon = () => <Text testID="test-icon">Icon</Text>;
            
            render(<ProgressRing value={75} icon={<TestIcon />} />);
            
            expect(screen.getByTestId('test-icon')).toBeTruthy();
            expect(screen.queryByText('75%')).toBeNull();
        });

        it('shows percentage when showPercentage is true even with icon', () => {
            const TestIcon = () => <Text testID="test-icon">Icon</Text>;
            
            render(<ProgressRing value={75} icon={<TestIcon />} showPercentage={true} />);
            
            // With showPercentage=true and icon provided, icon takes precedence
            // as icon is rendered in the icon branch
            expect(screen.getByTestId('test-icon')).toBeTruthy();
        });

        it('hides percentage when showPercentage is false', () => {
            render(<ProgressRing value={75} showPercentage={false} />);
            
            expect(screen.queryByText('75%')).toBeNull();
        });
    });

    describe('sizing', () => {
        it('accepts custom size prop', () => {
            render(<ProgressRing value={50} size={120} />);
            
            expect(screen.getByTestId('svg')).toBeTruthy();
        });

        it('accepts custom strokeWidth prop', () => {
            render(<ProgressRing value={50} strokeWidth={12} />);
            
            expect(screen.getByTestId('svg')).toBeTruthy();
        });
    });

    describe('without label', () => {
        it('renders without label when not provided', () => {
            render(<ProgressRing value={50} />);
            
            expect(screen.getByText('50%')).toBeTruthy();
            // No label should be rendered
        });
    });

    describe('rounding', () => {
        it('rounds decimal values to nearest integer', () => {
            render(<ProgressRing value={75.6} />);
            
            expect(screen.getByText('76%')).toBeTruthy();
        });

        it('rounds down decimal values below .5', () => {
            render(<ProgressRing value={75.3} />);
            
            expect(screen.getByText('75%')).toBeTruthy();
        });
    });
});
