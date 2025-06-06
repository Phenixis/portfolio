// Habit Tracker Types and Constants
import { dynamicIconImports } from 'lucide-react/dynamic'

// Frequency options for habits
export const HABIT_FREQUENCIES = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
} as const;

export type HabitFrequency = typeof HABIT_FREQUENCIES[keyof typeof HABIT_FREQUENCIES];

// Predefined color set for habits (following common UI color schemes)
export const HABIT_COLORS = {
    RED: 'red',
    ORANGE: 'orange',
    AMBER: 'amber',
    YELLOW: 'yellow',
    LIME: 'lime',
    GREEN: 'green',
    EMERALD: 'emerald',
    TEAL: 'teal',
    CYAN: 'cyan',
    SKY: 'sky',
    BLUE: 'blue',
    INDIGO: 'indigo',
    VIOLET: 'violet',
    PURPLE: 'purple',
    FUCHSIA: 'fuchsia',
    PINK: 'pink',
    ROSE: 'rose',
    GRAY: 'gray',
    SLATE: 'slate',
    ZINC: 'zinc'
} as const;

export type HabitColor = typeof HABIT_COLORS[keyof typeof HABIT_COLORS];

// Comprehensive Lucide icons for habits
export const HABIT_ICONS : (keyof typeof dynamicIconImports)[] = [
    // Achievement & Goals
    'star',
    'trophy',
    'award',
    'medal',
    'target',
    'check',
    'check-circle',
    'flag',
    'bookmark',
    'sparkles',
    
    // Health & Fitness
    'activity',
    'dumbbell',
    'heart',
    'heart-pulse',
    'bike',
    'footprints',
    'apple',
    'carrot',
    'pill',
    'stethoscope',
    'thermometer',
    'weight',
    'timer',
    'circle-dot',
    
    // Time & Schedule
    'clock',
    'calendar',
    'alarm-clock',
    'watch',
    'sunrise',
    'sunset',
    'sun',
    'moon',
    'clock-3',
    'clock-9',
    
    // Learning & Education
    'book',
    'book-open',
    'graduation-cap',
    'brain',
    'lightbulb',
    'pencil',
    'edit',
    'file-text',
    'notebook-pen',
    'library',
    'microscope',
    'calculator',
    
    // Creativity & Arts
    'brush',
    'palette',
    'camera',
    'music',
    'mic',
    'guitar',
    'piano',
    'paintbrush',
    'scissors',
    'image',
    'video',
    'film',
    
    // Technology & Work
    'laptop',
    'computer',
    'smartphone',
    'headphones',
    'wifi',
    'code',
    'database',
    'settings',
    'monitor',
    'keyboard',
    
    // Social & Communication
    'users',
    'user-plus',
    'heart-handshake',
    'phone',
    'message-circle',
    'mail',
    'smile',
    'laugh',
    'thumbs-up',
    'handshake',
    
    // Home & Lifestyle
    'home',
    'bed',
    'utensils',
    'coffee',
    'cup-soda',
    'wine',
    'pizza',
    'cooking-pot',
    'refrigerator',
    'washing-machine',
    'car',
    'key',
    
    // Nature & Environment
    'leaf',
    'tree-deciduous',
    'flower',
    'flower-2',
    'mountain',
    'sun-snow',
    'cloud-rain',
    'droplet',
    'sprout',
    'trees',
    'globe',
    
    // Finance & Money
    'dollar-sign',
    'piggy-bank',
    'coins',
    'credit-card',
    'wallet',
    'trending-up',
    'bar-chart',
    'receipt',
    
    // Travel & Adventure
    'plane',
    'train',
    'ship',
    'compass',
    'map',
    'luggage',
    'tent',
    'backpack',
    
    // Energy & Motivation
    'zap',
    'flame',
    'battery',
    'arrow-up',
    'rocket',
    'battery-charging',
    
    // Mindfulness & Wellness
    'wind',
    'waves',
    'feather',
    'eye',
    'infinity',
    'circle',
    
    // Tools & Utilities
    'wrench',
    'hammer',
    'pocket-knife',
    'ruler',
    'paperclip',
    'bolt',
    'folder'
] as const;

export type HabitIcon = typeof HABIT_ICONS[number];

// Helper type for habit with calculated streak information
export interface HabitWithStreak {
    id: number;
    user_id: string;
    title: string;
    description: string | null;
    color: HabitColor;
    icon: HabitIcon;
    frequency: HabitFrequency;
    target_count: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    current_streak: number;
    longest_streak: number;
    completion_rate: number; // Percentage of completion for the current period
    last_completed: Date | null;
}

// Type for habit statistics
export interface HabitStats {
    total_completions: number;
    current_streak: number;
    longest_streak: number;
    completion_rate: number;
    average_per_period: number;
    best_month: {
        month: string;
        completions: number;
    } | null;
}

// Utility functions for frequency calculations
export const getFrequencyDays = (frequency: HabitFrequency): number => {
    switch (frequency) {
        case HABIT_FREQUENCIES.DAILY:
            return 1;
        case HABIT_FREQUENCIES.WEEKLY:
            return 7;
        case HABIT_FREQUENCIES.MONTHLY:
            return 30; // Approximate
        case HABIT_FREQUENCIES.YEARLY:
            return 365;
        default:
            return 1;
    }
};

export const getFrequencyLabel = (frequency: HabitFrequency): string => {
    switch (frequency) {
        case HABIT_FREQUENCIES.DAILY:
            return 'Daily';
        case HABIT_FREQUENCIES.WEEKLY:
            return 'Weekly';
        case HABIT_FREQUENCIES.MONTHLY:
            return 'Monthly';
        case HABIT_FREQUENCIES.YEARLY:
            return 'Yearly';
        default:
            return 'Daily';
    }
};

// Type for habit entry with date formatting
export interface HabitEntryWithFormatted {
    id: number;
    habit_id: number;
    user_id: string;
    date: Date;
    count: number;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
    formatted_date: string;
}
