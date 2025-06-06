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

// Color mapping for consistent styling
export const getHabitColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, border: string, text: string }> = {
        red: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-500' },
        orange: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500' },
        amber: { bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-500' },
        yellow: { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-500' },
        lime: { bg: 'bg-lime-500', border: 'border-lime-500', text: 'text-lime-500' },
        green: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-500' },
        emerald: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-500' },
        teal: { bg: 'bg-teal-500', border: 'border-teal-500', text: 'text-teal-500' },
        cyan: { bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-500' },
        sky: { bg: 'bg-sky-500', border: 'border-sky-500', text: 'text-sky-500' },
        blue: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-500' },
        indigo: { bg: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-500' },
        violet: { bg: 'bg-violet-500', border: 'border-violet-500', text: 'text-violet-500' },
        purple: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-500' },
        fuchsia: { bg: 'bg-fuchsia-500', border: 'border-fuchsia-500', text: 'text-fuchsia-500' },
        pink: { bg: 'bg-pink-500', border: 'border-pink-500', text: 'text-pink-500' },
        rose: { bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-rose-500' },
        gray: { bg: 'bg-gray-500', border: 'border-gray-500', text: 'text-gray-500' },
        slate: { bg: 'bg-slate-500', border: 'border-slate-500', text: 'text-slate-500' },
        zinc: { bg: 'bg-zinc-500', border: 'border-zinc-500', text: 'text-zinc-500' },
    }
    return colorMap[color] || colorMap.blue
}