/*
const chartData = [
    { id: 0,  importance: 5, urgency: 5, duration: 2, score: 23, completionDuration: 72},
    { id: 1,  importance: 5, urgency: 5, duration: 2, score: 23, completionDuration: 85 },
    { id: 2,  importance: 5, urgency: 5, duration: 2, score: 23, completionDuration: 90 },
    { id: 3,  importance: 5, urgency: 5, duration: 2, score: 23, completionDuration: 78 },
    { id: 4,  importance: 5, urgency: 5, duration: 2, score: 23, completionDuration: 88 },
    { id: 5,  importance: 5, urgency: 5, duration: 2, score: 23, completionDuration: 95 },
    { id: 6,  importance: 5, urgency: 5, duration: 2, score: 23, completionDuration: 80 },
    { id: 7,  importance: 5, urgency: 5, duration: 2, score: 23, completionDuration: 92 },
    { id: 8,  importance: 5, urgency: 5, duration: 2, score: 23, completionDuration: 76 },
    { id: 9,  importance: 5, urgency: 5, duration: 2, score: 23, completionDuration: 89 },
    { id: 10, importance: 5, urgency: 5, duration: 2, score: 23, completionDuration: 84 }
]
*/
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Scatter, ScatterChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
    {
        "id": 0,
        "importance": 0,
        "urgency": 1,
        "duration": 1,
        "score": -1,
        "completionDuration": 104
    },
    {
        "id": 1,
        "importance": 3,
        "urgency": 2,
        "duration": 1,
        "score": 5,
        "completionDuration": 147
    },
    {
        "id": 2,
        "importance": 2,
        "urgency": 4,
        "duration": 0,
        "score": 8,
        "completionDuration": 186
    },
    {
        "id": 3,
        "importance": 1,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 119
    },
    {
        "id": 4,
        "importance": 2,
        "urgency": 5,
        "duration": 2,
        "score": 8,
        "completionDuration": 84
    },
    {
        "id": 5,
        "importance": 0,
        "urgency": 4,
        "duration": 1,
        "score": -1,
        "completionDuration": 125
    },
    {
        "id": 6,
        "importance": 0,
        "urgency": 1,
        "duration": 2,
        "score": -2,
        "completionDuration": 195
    },
    {
        "id": 7,
        "importance": 5,
        "urgency": 2,
        "duration": 1,
        "score": 9,
        "completionDuration": 81
    },
    {
        "id": 8,
        "importance": 2,
        "urgency": 5,
        "duration": 0,
        "score": 10,
        "completionDuration": 118
    },
    {
        "id": 9,
        "importance": 3,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 103
    },
    {
        "id": 10,
        "importance": 0,
        "urgency": 1,
        "duration": 3,
        "score": -3,
        "completionDuration": 105
    },
    {
        "id": 11,
        "importance": 5,
        "urgency": 1,
        "duration": 1,
        "score": 4,
        "completionDuration": 141
    },
    {
        "id": 12,
        "importance": 4,
        "urgency": 2,
        "duration": 0,
        "score": 8,
        "completionDuration": 115
    },
    {
        "id": 13,
        "importance": 0,
        "urgency": 3,
        "duration": 0,
        "score": 0,
        "completionDuration": 158
    },
    {
        "id": 14,
        "importance": 1,
        "urgency": 5,
        "duration": 1,
        "score": 4,
        "completionDuration": 120
    },
    {
        "id": 15,
        "importance": 5,
        "urgency": 1,
        "duration": 0,
        "score": 5,
        "completionDuration": 120
    },
    {
        "id": 16,
        "importance": 1,
        "urgency": 2,
        "duration": 1,
        "score": 1,
        "completionDuration": 119
    },
    {
        "id": 17,
        "importance": 5,
        "urgency": 4,
        "duration": 1,
        "score": 19,
        "completionDuration": 144
    },
    {
        "id": 18,
        "importance": 3,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 115
    },
    {
        "id": 19,
        "importance": 0,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 80
    },
    {
        "id": 20,
        "importance": 1,
        "urgency": 5,
        "duration": 2,
        "score": 3,
        "completionDuration": 122
    },
    {
        "id": 21,
        "importance": 4,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 147
    },
    {
        "id": 22,
        "importance": 2,
        "urgency": 1,
        "duration": 2,
        "score": 0,
        "completionDuration": 120
    },
    {
        "id": 23,
        "importance": 0,
        "urgency": 3,
        "duration": 1,
        "score": -1,
        "completionDuration": 80
    },
    {
        "id": 24,
        "importance": 0,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 105
    },
    {
        "id": 25,
        "importance": 1,
        "urgency": 1,
        "duration": 3,
        "score": -2,
        "completionDuration": 148
    },
    {
        "id": 26,
        "importance": 0,
        "urgency": 5,
        "duration": 1,
        "score": -1,
        "completionDuration": 61
    },
    {
        "id": 27,
        "importance": 2,
        "urgency": 5,
        "duration": 1,
        "score": 9,
        "completionDuration": 182
    },
    {
        "id": 28,
        "importance": 1,
        "urgency": 1,
        "duration": 0,
        "score": 1,
        "completionDuration": 117
    },
    {
        "id": 29,
        "importance": 0,
        "urgency": 3,
        "duration": 1,
        "score": -1,
        "completionDuration": 139
    },
    {
        "id": 30,
        "importance": 5,
        "urgency": 5,
        "duration": 1,
        "score": 24,
        "completionDuration": 75
    },
    {
        "id": 31,
        "importance": 3,
        "urgency": 3,
        "duration": 2,
        "score": 7,
        "completionDuration": 141
    },
    {
        "id": 32,
        "importance": 5,
        "urgency": 5,
        "duration": 2,
        "score": 23,
        "completionDuration": 163
    },
    {
        "id": 33,
        "importance": 3,
        "urgency": 2,
        "duration": 1,
        "score": 5,
        "completionDuration": 164
    },
    {
        "id": 34,
        "importance": 4,
        "urgency": 4,
        "duration": 2,
        "score": 14,
        "completionDuration": 159
    },
    {
        "id": 35,
        "importance": 5,
        "urgency": 2,
        "duration": 0,
        "score": 10,
        "completionDuration": 173
    },
    {
        "id": 36,
        "importance": 3,
        "urgency": 3,
        "duration": 3,
        "score": 6,
        "completionDuration": 169
    },
    {
        "id": 37,
        "importance": 0,
        "urgency": 4,
        "duration": 0,
        "score": 0,
        "completionDuration": 200
    },
    {
        "id": 38,
        "importance": 4,
        "urgency": 2,
        "duration": 2,
        "score": 6,
        "completionDuration": 125
    },
    {
        "id": 39,
        "importance": 0,
        "urgency": 5,
        "duration": 2,
        "score": -2,
        "completionDuration": 75
    },
    {
        "id": 40,
        "importance": 1,
        "urgency": 3,
        "duration": 2,
        "score": 1,
        "completionDuration": 168
    },
    {
        "id": 41,
        "importance": 5,
        "urgency": 1,
        "duration": 3,
        "score": 2,
        "completionDuration": 53
    },
    {
        "id": 42,
        "importance": 1,
        "urgency": 3,
        "duration": 0,
        "score": 3,
        "completionDuration": 190
    },
    {
        "id": 43,
        "importance": 0,
        "urgency": 4,
        "duration": 2,
        "score": -2,
        "completionDuration": 186
    },
    {
        "id": 44,
        "importance": 1,
        "urgency": 3,
        "duration": 2,
        "score": 1,
        "completionDuration": 182
    },
    {
        "id": 45,
        "importance": 0,
        "urgency": 4,
        "duration": 2,
        "score": -2,
        "completionDuration": 198
    },
    {
        "id": 46,
        "importance": 5,
        "urgency": 3,
        "duration": 3,
        "score": 12,
        "completionDuration": 79
    },
    {
        "id": 47,
        "importance": 0,
        "urgency": 5,
        "duration": 0,
        "score": 0,
        "completionDuration": 144
    },
    {
        "id": 48,
        "importance": 3,
        "urgency": 2,
        "duration": 3,
        "score": 3,
        "completionDuration": 188
    },
    {
        "id": 49,
        "importance": 2,
        "urgency": 4,
        "duration": 1,
        "score": 7,
        "completionDuration": 54
    },
    {
        "id": 50,
        "importance": 1,
        "urgency": 3,
        "duration": 3,
        "score": 0,
        "completionDuration": 180
    },
    {
        "id": 51,
        "importance": 5,
        "urgency": 4,
        "duration": 2,
        "score": 18,
        "completionDuration": 197
    },
    {
        "id": 52,
        "importance": 0,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 190
    },
    {
        "id": 53,
        "importance": 2,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 193
    },
    {
        "id": 54,
        "importance": 4,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 57
    },
    {
        "id": 55,
        "importance": 2,
        "urgency": 1,
        "duration": 0,
        "score": 2,
        "completionDuration": 111
    },
    {
        "id": 56,
        "importance": 3,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 69
    },
    {
        "id": 57,
        "importance": 0,
        "urgency": 4,
        "duration": 1,
        "score": -1,
        "completionDuration": 71
    },
    {
        "id": 58,
        "importance": 5,
        "urgency": 2,
        "duration": 3,
        "score": 7,
        "completionDuration": 80
    },
    {
        "id": 59,
        "importance": 1,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 177
    },
    {
        "id": 60,
        "importance": 1,
        "urgency": 3,
        "duration": 3,
        "score": 0,
        "completionDuration": 95
    },
    {
        "id": 61,
        "importance": 4,
        "urgency": 2,
        "duration": 2,
        "score": 6,
        "completionDuration": 64
    },
    {
        "id": 62,
        "importance": 4,
        "urgency": 4,
        "duration": 3,
        "score": 13,
        "completionDuration": 185
    },
    {
        "id": 63,
        "importance": 0,
        "urgency": 1,
        "duration": 0,
        "score": 0,
        "completionDuration": 139
    },
    {
        "id": 64,
        "importance": 1,
        "urgency": 1,
        "duration": 3,
        "score": -2,
        "completionDuration": 166
    },
    {
        "id": 65,
        "importance": 0,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 76
    },
    {
        "id": 66,
        "importance": 4,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 55
    },
    {
        "id": 67,
        "importance": 4,
        "urgency": 1,
        "duration": 2,
        "score": 2,
        "completionDuration": 185
    },
    {
        "id": 68,
        "importance": 1,
        "urgency": 2,
        "duration": 1,
        "score": 1,
        "completionDuration": 102
    },
    {
        "id": 69,
        "importance": 5,
        "urgency": 1,
        "duration": 3,
        "score": 2,
        "completionDuration": 57
    },
    {
        "id": 70,
        "importance": 5,
        "urgency": 3,
        "duration": 3,
        "score": 12,
        "completionDuration": 104
    },
    {
        "id": 71,
        "importance": 4,
        "urgency": 5,
        "duration": 1,
        "score": 19,
        "completionDuration": 95
    },
    {
        "id": 72,
        "importance": 2,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 57
    },
    {
        "id": 73,
        "importance": 0,
        "urgency": 3,
        "duration": 1,
        "score": -1,
        "completionDuration": 118
    },
    {
        "id": 74,
        "importance": 5,
        "urgency": 4,
        "duration": 3,
        "score": 17,
        "completionDuration": 131
    },
    {
        "id": 75,
        "importance": 1,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 120
    },
    {
        "id": 76,
        "importance": 1,
        "urgency": 3,
        "duration": 2,
        "score": 1,
        "completionDuration": 75
    },
    {
        "id": 77,
        "importance": 5,
        "urgency": 1,
        "duration": 0,
        "score": 5,
        "completionDuration": 132
    },
    {
        "id": 78,
        "importance": 4,
        "urgency": 2,
        "duration": 0,
        "score": 8,
        "completionDuration": 172
    },
    {
        "id": 79,
        "importance": 2,
        "urgency": 3,
        "duration": 2,
        "score": 4,
        "completionDuration": 74
    },
    {
        "id": 80,
        "importance": 4,
        "urgency": 3,
        "duration": 3,
        "score": 9,
        "completionDuration": 52
    },
    {
        "id": 81,
        "importance": 2,
        "urgency": 2,
        "duration": 2,
        "score": 2,
        "completionDuration": 141
    },
    {
        "id": 82,
        "importance": 4,
        "urgency": 1,
        "duration": 0,
        "score": 4,
        "completionDuration": 70
    },
    {
        "id": 83,
        "importance": 4,
        "urgency": 4,
        "duration": 1,
        "score": 15,
        "completionDuration": 122
    },
    {
        "id": 84,
        "importance": 5,
        "urgency": 3,
        "duration": 0,
        "score": 15,
        "completionDuration": 175
    },
    {
        "id": 85,
        "importance": 1,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 150
    },
    {
        "id": 86,
        "importance": 1,
        "urgency": 5,
        "duration": 0,
        "score": 5,
        "completionDuration": 124
    },
    {
        "id": 87,
        "importance": 4,
        "urgency": 3,
        "duration": 1,
        "score": 11,
        "completionDuration": 78
    },
    {
        "id": 88,
        "importance": 0,
        "urgency": 2,
        "duration": 0,
        "score": 0,
        "completionDuration": 52
    },
    {
        "id": 89,
        "importance": 1,
        "urgency": 5,
        "duration": 3,
        "score": 2,
        "completionDuration": 116
    },
    {
        "id": 90,
        "importance": 2,
        "urgency": 2,
        "duration": 1,
        "score": 3,
        "completionDuration": 192
    },
    {
        "id": 91,
        "importance": 4,
        "urgency": 1,
        "duration": 1,
        "score": 3,
        "completionDuration": 68
    },
    {
        "id": 92,
        "importance": 0,
        "urgency": 5,
        "duration": 1,
        "score": -1,
        "completionDuration": 81
    },
    {
        "id": 93,
        "importance": 1,
        "urgency": 2,
        "duration": 0,
        "score": 2,
        "completionDuration": 157
    },
    {
        "id": 94,
        "importance": 3,
        "urgency": 5,
        "duration": 2,
        "score": 13,
        "completionDuration": 142
    },
    {
        "id": 95,
        "importance": 2,
        "urgency": 3,
        "duration": 2,
        "score": 4,
        "completionDuration": 197
    },
    {
        "id": 96,
        "importance": 2,
        "urgency": 3,
        "duration": 1,
        "score": 5,
        "completionDuration": 192
    },
    {
        "id": 97,
        "importance": 1,
        "urgency": 2,
        "duration": 0,
        "score": 2,
        "completionDuration": 153
    },
    {
        "id": 98,
        "importance": 4,
        "urgency": 1,
        "duration": 2,
        "score": 2,
        "completionDuration": 171
    },
    {
        "id": 99,
        "importance": 5,
        "urgency": 5,
        "duration": 3,
        "score": 22,
        "completionDuration": 90
    },
    {
        "id": 100,
        "importance": 1,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 171
    },
    {
        "id": 101,
        "importance": 2,
        "urgency": 2,
        "duration": 2,
        "score": 2,
        "completionDuration": 100
    },
    {
        "id": 102,
        "importance": 3,
        "urgency": 1,
        "duration": 0,
        "score": 3,
        "completionDuration": 116
    },
    {
        "id": 103,
        "importance": 0,
        "urgency": 1,
        "duration": 2,
        "score": -2,
        "completionDuration": 171
    },
    {
        "id": 104,
        "importance": 5,
        "urgency": 5,
        "duration": 3,
        "score": 22,
        "completionDuration": 173
    },
    {
        "id": 105,
        "importance": 2,
        "urgency": 3,
        "duration": 2,
        "score": 4,
        "completionDuration": 89
    },
    {
        "id": 106,
        "importance": 3,
        "urgency": 5,
        "duration": 1,
        "score": 14,
        "completionDuration": 193
    },
    {
        "id": 107,
        "importance": 3,
        "urgency": 1,
        "duration": 3,
        "score": 0,
        "completionDuration": 138
    },
    {
        "id": 108,
        "importance": 5,
        "urgency": 3,
        "duration": 0,
        "score": 15,
        "completionDuration": 102
    },
    {
        "id": 109,
        "importance": 4,
        "urgency": 2,
        "duration": 0,
        "score": 8,
        "completionDuration": 57
    },
    {
        "id": 110,
        "importance": 0,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 110
    },
    {
        "id": 111,
        "importance": 1,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 66
    },
    {
        "id": 112,
        "importance": 4,
        "urgency": 3,
        "duration": 3,
        "score": 9,
        "completionDuration": 67
    },
    {
        "id": 113,
        "importance": 0,
        "urgency": 2,
        "duration": 3,
        "score": -3,
        "completionDuration": 53
    },
    {
        "id": 114,
        "importance": 4,
        "urgency": 3,
        "duration": 0,
        "score": 12,
        "completionDuration": 62
    },
    {
        "id": 115,
        "importance": 5,
        "urgency": 3,
        "duration": 1,
        "score": 14,
        "completionDuration": 95
    },
    {
        "id": 116,
        "importance": 5,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 102
    },
    {
        "id": 117,
        "importance": 2,
        "urgency": 1,
        "duration": 2,
        "score": 0,
        "completionDuration": 185
    },
    {
        "id": 118,
        "importance": 1,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 121
    },
    {
        "id": 119,
        "importance": 5,
        "urgency": 2,
        "duration": 2,
        "score": 8,
        "completionDuration": 184
    },
    {
        "id": 120,
        "importance": 4,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 143
    },
    {
        "id": 121,
        "importance": 4,
        "urgency": 1,
        "duration": 1,
        "score": 3,
        "completionDuration": 168
    },
    {
        "id": 122,
        "importance": 2,
        "urgency": 5,
        "duration": 0,
        "score": 10,
        "completionDuration": 143
    },
    {
        "id": 123,
        "importance": 4,
        "urgency": 2,
        "duration": 3,
        "score": 5,
        "completionDuration": 122
    },
    {
        "id": 124,
        "importance": 0,
        "urgency": 5,
        "duration": 1,
        "score": -1,
        "completionDuration": 195
    },
    {
        "id": 125,
        "importance": 0,
        "urgency": 2,
        "duration": 2,
        "score": -2,
        "completionDuration": 106
    },
    {
        "id": 126,
        "importance": 0,
        "urgency": 2,
        "duration": 3,
        "score": -3,
        "completionDuration": 193
    },
    {
        "id": 127,
        "importance": 4,
        "urgency": 5,
        "duration": 0,
        "score": 20,
        "completionDuration": 76
    },
    {
        "id": 128,
        "importance": 3,
        "urgency": 5,
        "duration": 1,
        "score": 14,
        "completionDuration": 75
    },
    {
        "id": 129,
        "importance": 4,
        "urgency": 4,
        "duration": 2,
        "score": 14,
        "completionDuration": 197
    },
    {
        "id": 130,
        "importance": 5,
        "urgency": 2,
        "duration": 3,
        "score": 7,
        "completionDuration": 51
    },
    {
        "id": 131,
        "importance": 3,
        "urgency": 2,
        "duration": 1,
        "score": 5,
        "completionDuration": 100
    },
    {
        "id": 132,
        "importance": 3,
        "urgency": 1,
        "duration": 0,
        "score": 3,
        "completionDuration": 79
    },
    {
        "id": 133,
        "importance": 3,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 98
    },
    {
        "id": 134,
        "importance": 3,
        "urgency": 5,
        "duration": 0,
        "score": 15,
        "completionDuration": 89
    },
    {
        "id": 135,
        "importance": 5,
        "urgency": 1,
        "duration": 3,
        "score": 2,
        "completionDuration": 101
    },
    {
        "id": 136,
        "importance": 5,
        "urgency": 2,
        "duration": 3,
        "score": 7,
        "completionDuration": 50
    },
    {
        "id": 137,
        "importance": 3,
        "urgency": 3,
        "duration": 2,
        "score": 7,
        "completionDuration": 54
    },
    {
        "id": 138,
        "importance": 0,
        "urgency": 1,
        "duration": 3,
        "score": -3,
        "completionDuration": 170
    },
    {
        "id": 139,
        "importance": 0,
        "urgency": 1,
        "duration": 1,
        "score": -1,
        "completionDuration": 72
    },
    {
        "id": 140,
        "importance": 0,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 134
    },
    {
        "id": 141,
        "importance": 1,
        "urgency": 2,
        "duration": 1,
        "score": 1,
        "completionDuration": 111
    },
    {
        "id": 142,
        "importance": 0,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 145
    },
    {
        "id": 143,
        "importance": 5,
        "urgency": 3,
        "duration": 1,
        "score": 14,
        "completionDuration": 136
    },
    {
        "id": 144,
        "importance": 0,
        "urgency": 1,
        "duration": 0,
        "score": 0,
        "completionDuration": 56
    },
    {
        "id": 145,
        "importance": 0,
        "urgency": 2,
        "duration": 1,
        "score": -1,
        "completionDuration": 192
    },
    {
        "id": 146,
        "importance": 4,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 63
    },
    {
        "id": 147,
        "importance": 3,
        "urgency": 3,
        "duration": 3,
        "score": 6,
        "completionDuration": 199
    },
    {
        "id": 148,
        "importance": 4,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 66
    },
    {
        "id": 149,
        "importance": 2,
        "urgency": 5,
        "duration": 1,
        "score": 9,
        "completionDuration": 140
    },
    {
        "id": 150,
        "importance": 5,
        "urgency": 4,
        "duration": 2,
        "score": 18,
        "completionDuration": 182
    },
    {
        "id": 151,
        "importance": 3,
        "urgency": 1,
        "duration": 3,
        "score": 0,
        "completionDuration": 191
    },
    {
        "id": 152,
        "importance": 5,
        "urgency": 5,
        "duration": 0,
        "score": 25,
        "completionDuration": 184
    },
    {
        "id": 153,
        "importance": 3,
        "urgency": 3,
        "duration": 0,
        "score": 9,
        "completionDuration": 157
    },
    {
        "id": 154,
        "importance": 1,
        "urgency": 1,
        "duration": 2,
        "score": -1,
        "completionDuration": 158
    },
    {
        "id": 155,
        "importance": 3,
        "urgency": 2,
        "duration": 1,
        "score": 5,
        "completionDuration": 120
    },
    {
        "id": 156,
        "importance": 1,
        "urgency": 3,
        "duration": 2,
        "score": 1,
        "completionDuration": 108
    },
    {
        "id": 157,
        "importance": 1,
        "urgency": 3,
        "duration": 3,
        "score": 0,
        "completionDuration": 78
    },
    {
        "id": 158,
        "importance": 2,
        "urgency": 2,
        "duration": 3,
        "score": 1,
        "completionDuration": 198
    },
    {
        "id": 159,
        "importance": 5,
        "urgency": 2,
        "duration": 0,
        "score": 10,
        "completionDuration": 51
    },
    {
        "id": 160,
        "importance": 1,
        "urgency": 5,
        "duration": 1,
        "score": 4,
        "completionDuration": 88
    },
    {
        "id": 161,
        "importance": 2,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 91
    },
    {
        "id": 162,
        "importance": 5,
        "urgency": 3,
        "duration": 0,
        "score": 15,
        "completionDuration": 55
    },
    {
        "id": 163,
        "importance": 1,
        "urgency": 4,
        "duration": 3,
        "score": 1,
        "completionDuration": 69
    },
    {
        "id": 164,
        "importance": 0,
        "urgency": 2,
        "duration": 0,
        "score": 0,
        "completionDuration": 196
    },
    {
        "id": 165,
        "importance": 2,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 174
    },
    {
        "id": 166,
        "importance": 0,
        "urgency": 1,
        "duration": 2,
        "score": -2,
        "completionDuration": 79
    },
    {
        "id": 167,
        "importance": 4,
        "urgency": 5,
        "duration": 2,
        "score": 18,
        "completionDuration": 164
    },
    {
        "id": 168,
        "importance": 4,
        "urgency": 4,
        "duration": 2,
        "score": 14,
        "completionDuration": 169
    },
    {
        "id": 169,
        "importance": 5,
        "urgency": 5,
        "duration": 0,
        "score": 25,
        "completionDuration": 101
    },
    {
        "id": 170,
        "importance": 3,
        "urgency": 2,
        "duration": 3,
        "score": 3,
        "completionDuration": 96
    },
    {
        "id": 171,
        "importance": 3,
        "urgency": 4,
        "duration": 0,
        "score": 12,
        "completionDuration": 114
    },
    {
        "id": 172,
        "importance": 1,
        "urgency": 1,
        "duration": 1,
        "score": 0,
        "completionDuration": 129
    },
    {
        "id": 173,
        "importance": 1,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 113
    },
    {
        "id": 174,
        "importance": 3,
        "urgency": 2,
        "duration": 3,
        "score": 3,
        "completionDuration": 144
    },
    {
        "id": 175,
        "importance": 2,
        "urgency": 4,
        "duration": 1,
        "score": 7,
        "completionDuration": 160
    },
    {
        "id": 176,
        "importance": 5,
        "urgency": 2,
        "duration": 0,
        "score": 10,
        "completionDuration": 122
    },
    {
        "id": 177,
        "importance": 0,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 156
    },
    {
        "id": 178,
        "importance": 5,
        "urgency": 3,
        "duration": 0,
        "score": 15,
        "completionDuration": 70
    },
    {
        "id": 179,
        "importance": 5,
        "urgency": 5,
        "duration": 1,
        "score": 24,
        "completionDuration": 59
    },
    {
        "id": 180,
        "importance": 1,
        "urgency": 2,
        "duration": 0,
        "score": 2,
        "completionDuration": 170
    },
    {
        "id": 181,
        "importance": 1,
        "urgency": 4,
        "duration": 1,
        "score": 3,
        "completionDuration": 92
    },
    {
        "id": 182,
        "importance": 3,
        "urgency": 5,
        "duration": 2,
        "score": 13,
        "completionDuration": 180
    },
    {
        "id": 183,
        "importance": 4,
        "urgency": 2,
        "duration": 2,
        "score": 6,
        "completionDuration": 140
    },
    {
        "id": 184,
        "importance": 3,
        "urgency": 4,
        "duration": 3,
        "score": 9,
        "completionDuration": 197
    },
    {
        "id": 185,
        "importance": 3,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 180
    },
    {
        "id": 186,
        "importance": 2,
        "urgency": 2,
        "duration": 3,
        "score": 1,
        "completionDuration": 65
    },
    {
        "id": 187,
        "importance": 1,
        "urgency": 4,
        "duration": 3,
        "score": 1,
        "completionDuration": 136
    },
    {
        "id": 188,
        "importance": 5,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 115
    },
    {
        "id": 189,
        "importance": 0,
        "urgency": 2,
        "duration": 1,
        "score": -1,
        "completionDuration": 132
    },
    {
        "id": 190,
        "importance": 2,
        "urgency": 3,
        "duration": 1,
        "score": 5,
        "completionDuration": 194
    },
    {
        "id": 191,
        "importance": 3,
        "urgency": 4,
        "duration": 2,
        "score": 10,
        "completionDuration": 56
    },
    {
        "id": 192,
        "importance": 1,
        "urgency": 5,
        "duration": 3,
        "score": 2,
        "completionDuration": 119
    },
    {
        "id": 193,
        "importance": 0,
        "urgency": 5,
        "duration": 1,
        "score": -1,
        "completionDuration": 193
    },
    {
        "id": 194,
        "importance": 3,
        "urgency": 5,
        "duration": 3,
        "score": 12,
        "completionDuration": 72
    },
    {
        "id": 195,
        "importance": 3,
        "urgency": 1,
        "duration": 1,
        "score": 2,
        "completionDuration": 95
    },
    {
        "id": 196,
        "importance": 0,
        "urgency": 3,
        "duration": 1,
        "score": -1,
        "completionDuration": 77
    },
    {
        "id": 197,
        "importance": 5,
        "urgency": 1,
        "duration": 2,
        "score": 3,
        "completionDuration": 137
    },
    {
        "id": 198,
        "importance": 4,
        "urgency": 2,
        "duration": 0,
        "score": 8,
        "completionDuration": 182
    },
    {
        "id": 199,
        "importance": 2,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 67
    },
    {
        "id": 200,
        "importance": 4,
        "urgency": 3,
        "duration": 0,
        "score": 12,
        "completionDuration": 64
    },
    {
        "id": 201,
        "importance": 3,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 72
    },
    {
        "id": 202,
        "importance": 2,
        "urgency": 5,
        "duration": 0,
        "score": 10,
        "completionDuration": 88
    },
    {
        "id": 203,
        "importance": 0,
        "urgency": 3,
        "duration": 3,
        "score": -3,
        "completionDuration": 75
    },
    {
        "id": 204,
        "importance": 1,
        "urgency": 5,
        "duration": 1,
        "score": 4,
        "completionDuration": 193
    },
    {
        "id": 205,
        "importance": 5,
        "urgency": 5,
        "duration": 2,
        "score": 23,
        "completionDuration": 147
    },
    {
        "id": 206,
        "importance": 3,
        "urgency": 5,
        "duration": 3,
        "score": 12,
        "completionDuration": 107
    },
    {
        "id": 207,
        "importance": 0,
        "urgency": 1,
        "duration": 2,
        "score": -2,
        "completionDuration": 122
    },
    {
        "id": 208,
        "importance": 2,
        "urgency": 2,
        "duration": 1,
        "score": 3,
        "completionDuration": 177
    },
    {
        "id": 209,
        "importance": 1,
        "urgency": 4,
        "duration": 2,
        "score": 2,
        "completionDuration": 139
    },
    {
        "id": 210,
        "importance": 5,
        "urgency": 4,
        "duration": 2,
        "score": 18,
        "completionDuration": 162
    },
    {
        "id": 211,
        "importance": 1,
        "urgency": 2,
        "duration": 1,
        "score": 1,
        "completionDuration": 168
    },
    {
        "id": 212,
        "importance": 5,
        "urgency": 5,
        "duration": 1,
        "score": 24,
        "completionDuration": 199
    },
    {
        "id": 213,
        "importance": 5,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 178
    },
    {
        "id": 214,
        "importance": 3,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 95
    },
    {
        "id": 215,
        "importance": 1,
        "urgency": 5,
        "duration": 0,
        "score": 5,
        "completionDuration": 80
    },
    {
        "id": 216,
        "importance": 3,
        "urgency": 5,
        "duration": 2,
        "score": 13,
        "completionDuration": 171
    },
    {
        "id": 217,
        "importance": 3,
        "urgency": 3,
        "duration": 3,
        "score": 6,
        "completionDuration": 170
    },
    {
        "id": 218,
        "importance": 0,
        "urgency": 4,
        "duration": 3,
        "score": -3,
        "completionDuration": 64
    },
    {
        "id": 219,
        "importance": 2,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 58
    },
    {
        "id": 220,
        "importance": 2,
        "urgency": 3,
        "duration": 3,
        "score": 3,
        "completionDuration": 167
    },
    {
        "id": 221,
        "importance": 2,
        "urgency": 1,
        "duration": 1,
        "score": 1,
        "completionDuration": 192
    },
    {
        "id": 222,
        "importance": 1,
        "urgency": 2,
        "duration": 3,
        "score": -1,
        "completionDuration": 61
    },
    {
        "id": 223,
        "importance": 1,
        "urgency": 1,
        "duration": 2,
        "score": -1,
        "completionDuration": 52
    },
    {
        "id": 224,
        "importance": 0,
        "urgency": 3,
        "duration": 0,
        "score": 0,
        "completionDuration": 103
    },
    {
        "id": 225,
        "importance": 1,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 149
    },
    {
        "id": 226,
        "importance": 4,
        "urgency": 5,
        "duration": 3,
        "score": 17,
        "completionDuration": 104
    },
    {
        "id": 227,
        "importance": 5,
        "urgency": 5,
        "duration": 1,
        "score": 24,
        "completionDuration": 91
    },
    {
        "id": 228,
        "importance": 1,
        "urgency": 4,
        "duration": 3,
        "score": 1,
        "completionDuration": 87
    },
    {
        "id": 229,
        "importance": 3,
        "urgency": 1,
        "duration": 2,
        "score": 1,
        "completionDuration": 153
    },
    {
        "id": 230,
        "importance": 0,
        "urgency": 5,
        "duration": 2,
        "score": -2,
        "completionDuration": 65
    },
    {
        "id": 231,
        "importance": 3,
        "urgency": 2,
        "duration": 2,
        "score": 4,
        "completionDuration": 167
    },
    {
        "id": 232,
        "importance": 2,
        "urgency": 3,
        "duration": 1,
        "score": 5,
        "completionDuration": 113
    },
    {
        "id": 233,
        "importance": 4,
        "urgency": 2,
        "duration": 3,
        "score": 5,
        "completionDuration": 114
    },
    {
        "id": 234,
        "importance": 4,
        "urgency": 4,
        "duration": 1,
        "score": 15,
        "completionDuration": 126
    },
    {
        "id": 235,
        "importance": 4,
        "urgency": 2,
        "duration": 0,
        "score": 8,
        "completionDuration": 120
    },
    {
        "id": 236,
        "importance": 3,
        "urgency": 5,
        "duration": 3,
        "score": 12,
        "completionDuration": 70
    },
    {
        "id": 237,
        "importance": 2,
        "urgency": 2,
        "duration": 1,
        "score": 3,
        "completionDuration": 107
    },
    {
        "id": 238,
        "importance": 0,
        "urgency": 3,
        "duration": 2,
        "score": -2,
        "completionDuration": 120
    },
    {
        "id": 239,
        "importance": 5,
        "urgency": 1,
        "duration": 0,
        "score": 5,
        "completionDuration": 51
    },
    {
        "id": 240,
        "importance": 5,
        "urgency": 1,
        "duration": 3,
        "score": 2,
        "completionDuration": 189
    },
    {
        "id": 241,
        "importance": 4,
        "urgency": 5,
        "duration": 3,
        "score": 17,
        "completionDuration": 65
    },
    {
        "id": 242,
        "importance": 0,
        "urgency": 2,
        "duration": 1,
        "score": -1,
        "completionDuration": 70
    },
    {
        "id": 243,
        "importance": 1,
        "urgency": 3,
        "duration": 0,
        "score": 3,
        "completionDuration": 109
    },
    {
        "id": 244,
        "importance": 0,
        "urgency": 3,
        "duration": 1,
        "score": -1,
        "completionDuration": 168
    },
    {
        "id": 245,
        "importance": 3,
        "urgency": 3,
        "duration": 0,
        "score": 9,
        "completionDuration": 112
    },
    {
        "id": 246,
        "importance": 1,
        "urgency": 5,
        "duration": 3,
        "score": 2,
        "completionDuration": 68
    },
    {
        "id": 247,
        "importance": 3,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 109
    },
    {
        "id": 248,
        "importance": 2,
        "urgency": 1,
        "duration": 3,
        "score": -1,
        "completionDuration": 119
    },
    {
        "id": 249,
        "importance": 4,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 177
    },
    {
        "id": 250,
        "importance": 5,
        "urgency": 5,
        "duration": 2,
        "score": 23,
        "completionDuration": 167
    },
    {
        "id": 251,
        "importance": 4,
        "urgency": 2,
        "duration": 1,
        "score": 7,
        "completionDuration": 58
    },
    {
        "id": 252,
        "importance": 5,
        "urgency": 2,
        "duration": 2,
        "score": 8,
        "completionDuration": 112
    },
    {
        "id": 253,
        "importance": 0,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 194
    },
    {
        "id": 254,
        "importance": 1,
        "urgency": 1,
        "duration": 0,
        "score": 1,
        "completionDuration": 83
    },
    {
        "id": 255,
        "importance": 4,
        "urgency": 5,
        "duration": 2,
        "score": 18,
        "completionDuration": 54
    },
    {
        "id": 256,
        "importance": 4,
        "urgency": 5,
        "duration": 2,
        "score": 18,
        "completionDuration": 146
    },
    {
        "id": 257,
        "importance": 1,
        "urgency": 3,
        "duration": 3,
        "score": 0,
        "completionDuration": 93
    },
    {
        "id": 258,
        "importance": 3,
        "urgency": 4,
        "duration": 3,
        "score": 9,
        "completionDuration": 137
    },
    {
        "id": 259,
        "importance": 3,
        "urgency": 1,
        "duration": 3,
        "score": 0,
        "completionDuration": 166
    },
    {
        "id": 260,
        "importance": 4,
        "urgency": 3,
        "duration": 2,
        "score": 10,
        "completionDuration": 66
    },
    {
        "id": 261,
        "importance": 4,
        "urgency": 2,
        "duration": 3,
        "score": 5,
        "completionDuration": 58
    },
    {
        "id": 262,
        "importance": 1,
        "urgency": 3,
        "duration": 1,
        "score": 2,
        "completionDuration": 180
    },
    {
        "id": 263,
        "importance": 5,
        "urgency": 3,
        "duration": 3,
        "score": 12,
        "completionDuration": 84
    },
    {
        "id": 264,
        "importance": 3,
        "urgency": 3,
        "duration": 0,
        "score": 9,
        "completionDuration": 63
    },
    {
        "id": 265,
        "importance": 4,
        "urgency": 4,
        "duration": 0,
        "score": 16,
        "completionDuration": 120
    },
    {
        "id": 266,
        "importance": 0,
        "urgency": 5,
        "duration": 0,
        "score": 0,
        "completionDuration": 102
    },
    {
        "id": 267,
        "importance": 4,
        "urgency": 1,
        "duration": 1,
        "score": 3,
        "completionDuration": 163
    },
    {
        "id": 268,
        "importance": 2,
        "urgency": 4,
        "duration": 2,
        "score": 6,
        "completionDuration": 112
    },
    {
        "id": 269,
        "importance": 4,
        "urgency": 4,
        "duration": 0,
        "score": 16,
        "completionDuration": 68
    },
    {
        "id": 270,
        "importance": 1,
        "urgency": 4,
        "duration": 2,
        "score": 2,
        "completionDuration": 175
    },
    {
        "id": 271,
        "importance": 1,
        "urgency": 3,
        "duration": 1,
        "score": 2,
        "completionDuration": 168
    },
    {
        "id": 272,
        "importance": 5,
        "urgency": 3,
        "duration": 1,
        "score": 14,
        "completionDuration": 52
    },
    {
        "id": 273,
        "importance": 5,
        "urgency": 5,
        "duration": 2,
        "score": 23,
        "completionDuration": 59
    },
    {
        "id": 274,
        "importance": 5,
        "urgency": 4,
        "duration": 0,
        "score": 20,
        "completionDuration": 66
    },
    {
        "id": 275,
        "importance": 5,
        "urgency": 1,
        "duration": 1,
        "score": 4,
        "completionDuration": 66
    },
    {
        "id": 276,
        "importance": 0,
        "urgency": 4,
        "duration": 2,
        "score": -2,
        "completionDuration": 192
    },
    {
        "id": 277,
        "importance": 5,
        "urgency": 3,
        "duration": 0,
        "score": 15,
        "completionDuration": 163
    },
    {
        "id": 278,
        "importance": 2,
        "urgency": 3,
        "duration": 1,
        "score": 5,
        "completionDuration": 165
    },
    {
        "id": 279,
        "importance": 5,
        "urgency": 2,
        "duration": 0,
        "score": 10,
        "completionDuration": 172
    },
    {
        "id": 280,
        "importance": 0,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 50
    },
    {
        "id": 281,
        "importance": 5,
        "urgency": 4,
        "duration": 2,
        "score": 18,
        "completionDuration": 97
    },
    {
        "id": 282,
        "importance": 2,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 167
    },
    {
        "id": 283,
        "importance": 5,
        "urgency": 2,
        "duration": 2,
        "score": 8,
        "completionDuration": 168
    },
    {
        "id": 284,
        "importance": 0,
        "urgency": 5,
        "duration": 0,
        "score": 0,
        "completionDuration": 126
    },
    {
        "id": 285,
        "importance": 5,
        "urgency": 5,
        "duration": 3,
        "score": 22,
        "completionDuration": 173
    },
    {
        "id": 286,
        "importance": 5,
        "urgency": 1,
        "duration": 1,
        "score": 4,
        "completionDuration": 97
    },
    {
        "id": 287,
        "importance": 1,
        "urgency": 3,
        "duration": 3,
        "score": 0,
        "completionDuration": 56
    },
    {
        "id": 288,
        "importance": 3,
        "urgency": 1,
        "duration": 0,
        "score": 3,
        "completionDuration": 179
    },
    {
        "id": 289,
        "importance": 2,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 65
    },
    {
        "id": 290,
        "importance": 1,
        "urgency": 5,
        "duration": 1,
        "score": 4,
        "completionDuration": 151
    },
    {
        "id": 291,
        "importance": 3,
        "urgency": 5,
        "duration": 1,
        "score": 14,
        "completionDuration": 54
    },
    {
        "id": 292,
        "importance": 4,
        "urgency": 5,
        "duration": 1,
        "score": 19,
        "completionDuration": 55
    },
    {
        "id": 293,
        "importance": 2,
        "urgency": 3,
        "duration": 3,
        "score": 3,
        "completionDuration": 142
    },
    {
        "id": 294,
        "importance": 5,
        "urgency": 1,
        "duration": 3,
        "score": 2,
        "completionDuration": 129
    },
    {
        "id": 295,
        "importance": 0,
        "urgency": 3,
        "duration": 0,
        "score": 0,
        "completionDuration": 54
    },
    {
        "id": 296,
        "importance": 3,
        "urgency": 3,
        "duration": 3,
        "score": 6,
        "completionDuration": 59
    },
    {
        "id": 297,
        "importance": 5,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 155
    },
    {
        "id": 298,
        "importance": 5,
        "urgency": 1,
        "duration": 3,
        "score": 2,
        "completionDuration": 164
    },
    {
        "id": 299,
        "importance": 5,
        "urgency": 3,
        "duration": 1,
        "score": 14,
        "completionDuration": 93
    },
    {
        "id": 300,
        "importance": 5,
        "urgency": 2,
        "duration": 0,
        "score": 10,
        "completionDuration": 82
    },
    {
        "id": 301,
        "importance": 2,
        "urgency": 1,
        "duration": 2,
        "score": 0,
        "completionDuration": 57
    },
    {
        "id": 302,
        "importance": 5,
        "urgency": 1,
        "duration": 2,
        "score": 3,
        "completionDuration": 134
    },
    {
        "id": 303,
        "importance": 1,
        "urgency": 4,
        "duration": 0,
        "score": 4,
        "completionDuration": 54
    },
    {
        "id": 304,
        "importance": 2,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 185
    },
    {
        "id": 305,
        "importance": 4,
        "urgency": 3,
        "duration": 1,
        "score": 11,
        "completionDuration": 193
    },
    {
        "id": 306,
        "importance": 0,
        "urgency": 2,
        "duration": 3,
        "score": -3,
        "completionDuration": 129
    },
    {
        "id": 307,
        "importance": 5,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 62
    },
    {
        "id": 308,
        "importance": 2,
        "urgency": 4,
        "duration": 1,
        "score": 7,
        "completionDuration": 153
    },
    {
        "id": 309,
        "importance": 5,
        "urgency": 2,
        "duration": 3,
        "score": 7,
        "completionDuration": 128
    },
    {
        "id": 310,
        "importance": 5,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 136
    },
    {
        "id": 311,
        "importance": 2,
        "urgency": 5,
        "duration": 0,
        "score": 10,
        "completionDuration": 73
    },
    {
        "id": 312,
        "importance": 3,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 187
    },
    {
        "id": 313,
        "importance": 0,
        "urgency": 4,
        "duration": 2,
        "score": -2,
        "completionDuration": 167
    },
    {
        "id": 314,
        "importance": 2,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 181
    },
    {
        "id": 315,
        "importance": 2,
        "urgency": 4,
        "duration": 0,
        "score": 8,
        "completionDuration": 200
    },
    {
        "id": 316,
        "importance": 5,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 99
    },
    {
        "id": 317,
        "importance": 4,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 172
    },
    {
        "id": 318,
        "importance": 5,
        "urgency": 4,
        "duration": 1,
        "score": 19,
        "completionDuration": 152
    },
    {
        "id": 319,
        "importance": 0,
        "urgency": 3,
        "duration": 1,
        "score": -1,
        "completionDuration": 105
    },
    {
        "id": 320,
        "importance": 3,
        "urgency": 4,
        "duration": 3,
        "score": 9,
        "completionDuration": 155
    },
    {
        "id": 321,
        "importance": 1,
        "urgency": 3,
        "duration": 0,
        "score": 3,
        "completionDuration": 55
    },
    {
        "id": 322,
        "importance": 4,
        "urgency": 5,
        "duration": 3,
        "score": 17,
        "completionDuration": 184
    },
    {
        "id": 323,
        "importance": 3,
        "urgency": 1,
        "duration": 2,
        "score": 1,
        "completionDuration": 167
    },
    {
        "id": 324,
        "importance": 5,
        "urgency": 3,
        "duration": 0,
        "score": 15,
        "completionDuration": 114
    },
    {
        "id": 325,
        "importance": 5,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 76
    },
    {
        "id": 326,
        "importance": 1,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 181
    },
    {
        "id": 327,
        "importance": 4,
        "urgency": 3,
        "duration": 0,
        "score": 12,
        "completionDuration": 55
    },
    {
        "id": 328,
        "importance": 4,
        "urgency": 5,
        "duration": 2,
        "score": 18,
        "completionDuration": 169
    },
    {
        "id": 329,
        "importance": 3,
        "urgency": 5,
        "duration": 2,
        "score": 13,
        "completionDuration": 155
    },
    {
        "id": 330,
        "importance": 2,
        "urgency": 4,
        "duration": 3,
        "score": 5,
        "completionDuration": 194
    },
    {
        "id": 331,
        "importance": 4,
        "urgency": 2,
        "duration": 1,
        "score": 7,
        "completionDuration": 194
    },
    {
        "id": 332,
        "importance": 5,
        "urgency": 1,
        "duration": 1,
        "score": 4,
        "completionDuration": 75
    },
    {
        "id": 333,
        "importance": 4,
        "urgency": 1,
        "duration": 3,
        "score": 1,
        "completionDuration": 66
    },
    {
        "id": 334,
        "importance": 5,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 139
    },
    {
        "id": 335,
        "importance": 4,
        "urgency": 2,
        "duration": 3,
        "score": 5,
        "completionDuration": 119
    },
    {
        "id": 336,
        "importance": 2,
        "urgency": 2,
        "duration": 1,
        "score": 3,
        "completionDuration": 166
    },
    {
        "id": 337,
        "importance": 2,
        "urgency": 3,
        "duration": 1,
        "score": 5,
        "completionDuration": 109
    },
    {
        "id": 338,
        "importance": 0,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 113
    },
    {
        "id": 339,
        "importance": 3,
        "urgency": 3,
        "duration": 2,
        "score": 7,
        "completionDuration": 93
    },
    {
        "id": 340,
        "importance": 4,
        "urgency": 5,
        "duration": 0,
        "score": 20,
        "completionDuration": 104
    },
    {
        "id": 341,
        "importance": 4,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 142
    },
    {
        "id": 342,
        "importance": 2,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 63
    },
    {
        "id": 343,
        "importance": 3,
        "urgency": 4,
        "duration": 0,
        "score": 12,
        "completionDuration": 58
    },
    {
        "id": 344,
        "importance": 2,
        "urgency": 4,
        "duration": 2,
        "score": 6,
        "completionDuration": 67
    },
    {
        "id": 345,
        "importance": 3,
        "urgency": 4,
        "duration": 2,
        "score": 10,
        "completionDuration": 94
    },
    {
        "id": 346,
        "importance": 3,
        "urgency": 2,
        "duration": 0,
        "score": 6,
        "completionDuration": 107
    },
    {
        "id": 347,
        "importance": 3,
        "urgency": 2,
        "duration": 0,
        "score": 6,
        "completionDuration": 67
    },
    {
        "id": 348,
        "importance": 3,
        "urgency": 4,
        "duration": 3,
        "score": 9,
        "completionDuration": 166
    },
    {
        "id": 349,
        "importance": 0,
        "urgency": 5,
        "duration": 0,
        "score": 0,
        "completionDuration": 122
    },
    {
        "id": 350,
        "importance": 0,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 192
    },
    {
        "id": 351,
        "importance": 1,
        "urgency": 4,
        "duration": 3,
        "score": 1,
        "completionDuration": 183
    },
    {
        "id": 352,
        "importance": 4,
        "urgency": 4,
        "duration": 1,
        "score": 15,
        "completionDuration": 100
    },
    {
        "id": 353,
        "importance": 3,
        "urgency": 3,
        "duration": 0,
        "score": 9,
        "completionDuration": 144
    },
    {
        "id": 354,
        "importance": 0,
        "urgency": 3,
        "duration": 1,
        "score": -1,
        "completionDuration": 82
    },
    {
        "id": 355,
        "importance": 5,
        "urgency": 5,
        "duration": 0,
        "score": 25,
        "completionDuration": 148
    },
    {
        "id": 356,
        "importance": 5,
        "urgency": 1,
        "duration": 0,
        "score": 5,
        "completionDuration": 92
    },
    {
        "id": 357,
        "importance": 2,
        "urgency": 5,
        "duration": 0,
        "score": 10,
        "completionDuration": 97
    },
    {
        "id": 358,
        "importance": 1,
        "urgency": 4,
        "duration": 3,
        "score": 1,
        "completionDuration": 140
    },
    {
        "id": 359,
        "importance": 5,
        "urgency": 5,
        "duration": 0,
        "score": 25,
        "completionDuration": 75
    },
    {
        "id": 360,
        "importance": 4,
        "urgency": 5,
        "duration": 1,
        "score": 19,
        "completionDuration": 135
    },
    {
        "id": 361,
        "importance": 1,
        "urgency": 4,
        "duration": 0,
        "score": 4,
        "completionDuration": 114
    },
    {
        "id": 362,
        "importance": 3,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 81
    },
    {
        "id": 363,
        "importance": 5,
        "urgency": 4,
        "duration": 3,
        "score": 17,
        "completionDuration": 188
    },
    {
        "id": 364,
        "importance": 3,
        "urgency": 3,
        "duration": 1,
        "score": 8,
        "completionDuration": 147
    },
    {
        "id": 365,
        "importance": 5,
        "urgency": 4,
        "duration": 0,
        "score": 20,
        "completionDuration": 147
    },
    {
        "id": 366,
        "importance": 0,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 73
    },
    {
        "id": 367,
        "importance": 0,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 192
    },
    {
        "id": 368,
        "importance": 3,
        "urgency": 1,
        "duration": 2,
        "score": 1,
        "completionDuration": 112
    },
    {
        "id": 369,
        "importance": 1,
        "urgency": 3,
        "duration": 2,
        "score": 1,
        "completionDuration": 166
    },
    {
        "id": 370,
        "importance": 2,
        "urgency": 4,
        "duration": 0,
        "score": 8,
        "completionDuration": 57
    },
    {
        "id": 371,
        "importance": 0,
        "urgency": 3,
        "duration": 1,
        "score": -1,
        "completionDuration": 190
    },
    {
        "id": 372,
        "importance": 3,
        "urgency": 2,
        "duration": 0,
        "score": 6,
        "completionDuration": 84
    },
    {
        "id": 373,
        "importance": 3,
        "urgency": 2,
        "duration": 2,
        "score": 4,
        "completionDuration": 131
    },
    {
        "id": 374,
        "importance": 4,
        "urgency": 1,
        "duration": 2,
        "score": 2,
        "completionDuration": 61
    },
    {
        "id": 375,
        "importance": 3,
        "urgency": 1,
        "duration": 0,
        "score": 3,
        "completionDuration": 113
    },
    {
        "id": 376,
        "importance": 4,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 107
    },
    {
        "id": 377,
        "importance": 2,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 53
    },
    {
        "id": 378,
        "importance": 3,
        "urgency": 2,
        "duration": 2,
        "score": 4,
        "completionDuration": 96
    },
    {
        "id": 379,
        "importance": 0,
        "urgency": 1,
        "duration": 1,
        "score": -1,
        "completionDuration": 130
    },
    {
        "id": 380,
        "importance": 2,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 116
    },
    {
        "id": 381,
        "importance": 2,
        "urgency": 1,
        "duration": 2,
        "score": 0,
        "completionDuration": 181
    },
    {
        "id": 382,
        "importance": 1,
        "urgency": 1,
        "duration": 1,
        "score": 0,
        "completionDuration": 120
    },
    {
        "id": 383,
        "importance": 5,
        "urgency": 5,
        "duration": 2,
        "score": 23,
        "completionDuration": 141
    },
    {
        "id": 384,
        "importance": 1,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 147
    },
    {
        "id": 385,
        "importance": 4,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 132
    },
    {
        "id": 386,
        "importance": 1,
        "urgency": 4,
        "duration": 2,
        "score": 2,
        "completionDuration": 180
    },
    {
        "id": 387,
        "importance": 3,
        "urgency": 3,
        "duration": 0,
        "score": 9,
        "completionDuration": 55
    },
    {
        "id": 388,
        "importance": 5,
        "urgency": 5,
        "duration": 2,
        "score": 23,
        "completionDuration": 81
    },
    {
        "id": 389,
        "importance": 0,
        "urgency": 5,
        "duration": 3,
        "score": -3,
        "completionDuration": 138
    },
    {
        "id": 390,
        "importance": 4,
        "urgency": 5,
        "duration": 1,
        "score": 19,
        "completionDuration": 66
    },
    {
        "id": 391,
        "importance": 5,
        "urgency": 5,
        "duration": 1,
        "score": 24,
        "completionDuration": 189
    },
    {
        "id": 392,
        "importance": 1,
        "urgency": 5,
        "duration": 1,
        "score": 4,
        "completionDuration": 188
    },
    {
        "id": 393,
        "importance": 5,
        "urgency": 3,
        "duration": 1,
        "score": 14,
        "completionDuration": 192
    },
    {
        "id": 394,
        "importance": 3,
        "urgency": 2,
        "duration": 1,
        "score": 5,
        "completionDuration": 150
    },
    {
        "id": 395,
        "importance": 0,
        "urgency": 4,
        "duration": 0,
        "score": 0,
        "completionDuration": 80
    },
    {
        "id": 396,
        "importance": 0,
        "urgency": 4,
        "duration": 1,
        "score": -1,
        "completionDuration": 74
    },
    {
        "id": 397,
        "importance": 5,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 77
    },
    {
        "id": 398,
        "importance": 3,
        "urgency": 2,
        "duration": 1,
        "score": 5,
        "completionDuration": 119
    },
    {
        "id": 399,
        "importance": 5,
        "urgency": 2,
        "duration": 3,
        "score": 7,
        "completionDuration": 80
    },
    {
        "id": 400,
        "importance": 3,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 154
    },
    {
        "id": 401,
        "importance": 0,
        "urgency": 3,
        "duration": 1,
        "score": -1,
        "completionDuration": 186
    },
    {
        "id": 402,
        "importance": 0,
        "urgency": 4,
        "duration": 3,
        "score": -3,
        "completionDuration": 164
    },
    {
        "id": 403,
        "importance": 3,
        "urgency": 5,
        "duration": 3,
        "score": 12,
        "completionDuration": 137
    },
    {
        "id": 404,
        "importance": 1,
        "urgency": 3,
        "duration": 1,
        "score": 2,
        "completionDuration": 171
    },
    {
        "id": 405,
        "importance": 4,
        "urgency": 2,
        "duration": 0,
        "score": 8,
        "completionDuration": 162
    },
    {
        "id": 406,
        "importance": 1,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 167
    },
    {
        "id": 407,
        "importance": 3,
        "urgency": 5,
        "duration": 3,
        "score": 12,
        "completionDuration": 120
    },
    {
        "id": 408,
        "importance": 1,
        "urgency": 2,
        "duration": 1,
        "score": 1,
        "completionDuration": 128
    },
    {
        "id": 409,
        "importance": 3,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 138
    },
    {
        "id": 410,
        "importance": 4,
        "urgency": 3,
        "duration": 3,
        "score": 9,
        "completionDuration": 148
    },
    {
        "id": 411,
        "importance": 1,
        "urgency": 2,
        "duration": 2,
        "score": 0,
        "completionDuration": 185
    },
    {
        "id": 412,
        "importance": 5,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 62
    },
    {
        "id": 413,
        "importance": 4,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 161
    },
    {
        "id": 414,
        "importance": 3,
        "urgency": 5,
        "duration": 0,
        "score": 15,
        "completionDuration": 172
    },
    {
        "id": 415,
        "importance": 3,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 94
    },
    {
        "id": 416,
        "importance": 2,
        "urgency": 4,
        "duration": 1,
        "score": 7,
        "completionDuration": 185
    },
    {
        "id": 417,
        "importance": 4,
        "urgency": 4,
        "duration": 1,
        "score": 15,
        "completionDuration": 119
    },
    {
        "id": 418,
        "importance": 5,
        "urgency": 3,
        "duration": 1,
        "score": 14,
        "completionDuration": 199
    },
    {
        "id": 419,
        "importance": 2,
        "urgency": 2,
        "duration": 1,
        "score": 3,
        "completionDuration": 154
    },
    {
        "id": 420,
        "importance": 2,
        "urgency": 5,
        "duration": 3,
        "score": 7,
        "completionDuration": 123
    },
    {
        "id": 421,
        "importance": 3,
        "urgency": 2,
        "duration": 2,
        "score": 4,
        "completionDuration": 71
    },
    {
        "id": 422,
        "importance": 4,
        "urgency": 3,
        "duration": 2,
        "score": 10,
        "completionDuration": 156
    },
    {
        "id": 423,
        "importance": 1,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 139
    },
    {
        "id": 424,
        "importance": 4,
        "urgency": 1,
        "duration": 2,
        "score": 2,
        "completionDuration": 51
    },
    {
        "id": 425,
        "importance": 4,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 54
    },
    {
        "id": 426,
        "importance": 2,
        "urgency": 3,
        "duration": 1,
        "score": 5,
        "completionDuration": 81
    },
    {
        "id": 427,
        "importance": 0,
        "urgency": 4,
        "duration": 0,
        "score": 0,
        "completionDuration": 59
    },
    {
        "id": 428,
        "importance": 2,
        "urgency": 3,
        "duration": 3,
        "score": 3,
        "completionDuration": 161
    },
    {
        "id": 429,
        "importance": 1,
        "urgency": 1,
        "duration": 2,
        "score": -1,
        "completionDuration": 74
    },
    {
        "id": 430,
        "importance": 3,
        "urgency": 3,
        "duration": 0,
        "score": 9,
        "completionDuration": 128
    },
    {
        "id": 431,
        "importance": 4,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 120
    },
    {
        "id": 432,
        "importance": 3,
        "urgency": 3,
        "duration": 3,
        "score": 6,
        "completionDuration": 164
    },
    {
        "id": 433,
        "importance": 1,
        "urgency": 2,
        "duration": 2,
        "score": 0,
        "completionDuration": 98
    },
    {
        "id": 434,
        "importance": 3,
        "urgency": 5,
        "duration": 2,
        "score": 13,
        "completionDuration": 140
    },
    {
        "id": 435,
        "importance": 2,
        "urgency": 5,
        "duration": 3,
        "score": 7,
        "completionDuration": 161
    },
    {
        "id": 436,
        "importance": 4,
        "urgency": 4,
        "duration": 3,
        "score": 13,
        "completionDuration": 169
    },
    {
        "id": 437,
        "importance": 1,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 82
    },
    {
        "id": 438,
        "importance": 2,
        "urgency": 4,
        "duration": 1,
        "score": 7,
        "completionDuration": 164
    },
    {
        "id": 439,
        "importance": 3,
        "urgency": 1,
        "duration": 1,
        "score": 2,
        "completionDuration": 199
    },
    {
        "id": 440,
        "importance": 5,
        "urgency": 2,
        "duration": 1,
        "score": 9,
        "completionDuration": 133
    },
    {
        "id": 441,
        "importance": 4,
        "urgency": 5,
        "duration": 1,
        "score": 19,
        "completionDuration": 54
    },
    {
        "id": 442,
        "importance": 5,
        "urgency": 1,
        "duration": 2,
        "score": 3,
        "completionDuration": 180
    },
    {
        "id": 443,
        "importance": 1,
        "urgency": 5,
        "duration": 1,
        "score": 4,
        "completionDuration": 131
    },
    {
        "id": 444,
        "importance": 4,
        "urgency": 5,
        "duration": 2,
        "score": 18,
        "completionDuration": 198
    },
    {
        "id": 445,
        "importance": 4,
        "urgency": 2,
        "duration": 0,
        "score": 8,
        "completionDuration": 160
    },
    {
        "id": 446,
        "importance": 4,
        "urgency": 3,
        "duration": 3,
        "score": 9,
        "completionDuration": 116
    },
    {
        "id": 447,
        "importance": 2,
        "urgency": 2,
        "duration": 0,
        "score": 4,
        "completionDuration": 179
    },
    {
        "id": 448,
        "importance": 4,
        "urgency": 5,
        "duration": 0,
        "score": 20,
        "completionDuration": 102
    },
    {
        "id": 449,
        "importance": 1,
        "urgency": 4,
        "duration": 3,
        "score": 1,
        "completionDuration": 149
    },
    {
        "id": 450,
        "importance": 3,
        "urgency": 1,
        "duration": 3,
        "score": 0,
        "completionDuration": 182
    },
    {
        "id": 451,
        "importance": 3,
        "urgency": 3,
        "duration": 3,
        "score": 6,
        "completionDuration": 171
    },
    {
        "id": 452,
        "importance": 4,
        "urgency": 2,
        "duration": 2,
        "score": 6,
        "completionDuration": 171
    },
    {
        "id": 453,
        "importance": 4,
        "urgency": 4,
        "duration": 1,
        "score": 15,
        "completionDuration": 105
    },
    {
        "id": 454,
        "importance": 3,
        "urgency": 5,
        "duration": 0,
        "score": 15,
        "completionDuration": 84
    },
    {
        "id": 455,
        "importance": 4,
        "urgency": 4,
        "duration": 0,
        "score": 16,
        "completionDuration": 137
    },
    {
        "id": 456,
        "importance": 5,
        "urgency": 3,
        "duration": 3,
        "score": 12,
        "completionDuration": 156
    },
    {
        "id": 457,
        "importance": 2,
        "urgency": 2,
        "duration": 0,
        "score": 4,
        "completionDuration": 136
    },
    {
        "id": 458,
        "importance": 0,
        "urgency": 2,
        "duration": 1,
        "score": -1,
        "completionDuration": 94
    },
    {
        "id": 459,
        "importance": 5,
        "urgency": 3,
        "duration": 3,
        "score": 12,
        "completionDuration": 94
    },
    {
        "id": 460,
        "importance": 4,
        "urgency": 5,
        "duration": 2,
        "score": 18,
        "completionDuration": 71
    },
    {
        "id": 461,
        "importance": 1,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 151
    },
    {
        "id": 462,
        "importance": 0,
        "urgency": 5,
        "duration": 2,
        "score": -2,
        "completionDuration": 176
    },
    {
        "id": 463,
        "importance": 5,
        "urgency": 4,
        "duration": 0,
        "score": 20,
        "completionDuration": 99
    },
    {
        "id": 464,
        "importance": 5,
        "urgency": 5,
        "duration": 0,
        "score": 25,
        "completionDuration": 54
    },
    {
        "id": 465,
        "importance": 3,
        "urgency": 2,
        "duration": 3,
        "score": 3,
        "completionDuration": 96
    },
    {
        "id": 466,
        "importance": 3,
        "urgency": 5,
        "duration": 2,
        "score": 13,
        "completionDuration": 113
    },
    {
        "id": 467,
        "importance": 3,
        "urgency": 5,
        "duration": 3,
        "score": 12,
        "completionDuration": 91
    },
    {
        "id": 468,
        "importance": 1,
        "urgency": 3,
        "duration": 1,
        "score": 2,
        "completionDuration": 89
    },
    {
        "id": 469,
        "importance": 1,
        "urgency": 4,
        "duration": 2,
        "score": 2,
        "completionDuration": 72
    },
    {
        "id": 470,
        "importance": 1,
        "urgency": 2,
        "duration": 3,
        "score": -1,
        "completionDuration": 178
    },
    {
        "id": 471,
        "importance": 5,
        "urgency": 3,
        "duration": 3,
        "score": 12,
        "completionDuration": 144
    },
    {
        "id": 472,
        "importance": 5,
        "urgency": 4,
        "duration": 3,
        "score": 17,
        "completionDuration": 126
    },
    {
        "id": 473,
        "importance": 2,
        "urgency": 2,
        "duration": 1,
        "score": 3,
        "completionDuration": 157
    },
    {
        "id": 474,
        "importance": 4,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 130
    },
    {
        "id": 475,
        "importance": 2,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 161
    },
    {
        "id": 476,
        "importance": 2,
        "urgency": 3,
        "duration": 1,
        "score": 5,
        "completionDuration": 124
    },
    {
        "id": 477,
        "importance": 0,
        "urgency": 2,
        "duration": 2,
        "score": -2,
        "completionDuration": 138
    },
    {
        "id": 478,
        "importance": 2,
        "urgency": 4,
        "duration": 0,
        "score": 8,
        "completionDuration": 126
    },
    {
        "id": 479,
        "importance": 5,
        "urgency": 1,
        "duration": 0,
        "score": 5,
        "completionDuration": 53
    },
    {
        "id": 480,
        "importance": 0,
        "urgency": 3,
        "duration": 3,
        "score": -3,
        "completionDuration": 138
    },
    {
        "id": 481,
        "importance": 2,
        "urgency": 1,
        "duration": 2,
        "score": 0,
        "completionDuration": 99
    },
    {
        "id": 482,
        "importance": 4,
        "urgency": 3,
        "duration": 0,
        "score": 12,
        "completionDuration": 78
    },
    {
        "id": 483,
        "importance": 2,
        "urgency": 4,
        "duration": 3,
        "score": 5,
        "completionDuration": 105
    },
    {
        "id": 484,
        "importance": 4,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 135
    },
    {
        "id": 485,
        "importance": 0,
        "urgency": 3,
        "duration": 0,
        "score": 0,
        "completionDuration": 158
    },
    {
        "id": 486,
        "importance": 2,
        "urgency": 2,
        "duration": 3,
        "score": 1,
        "completionDuration": 148
    },
    {
        "id": 487,
        "importance": 4,
        "urgency": 2,
        "duration": 2,
        "score": 6,
        "completionDuration": 119
    },
    {
        "id": 488,
        "importance": 0,
        "urgency": 3,
        "duration": 2,
        "score": -2,
        "completionDuration": 112
    },
    {
        "id": 489,
        "importance": 2,
        "urgency": 4,
        "duration": 2,
        "score": 6,
        "completionDuration": 140
    },
    {
        "id": 490,
        "importance": 4,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 52
    },
    {
        "id": 491,
        "importance": 0,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 54
    },
    {
        "id": 492,
        "importance": 2,
        "urgency": 3,
        "duration": 0,
        "score": 6,
        "completionDuration": 183
    },
    {
        "id": 493,
        "importance": 1,
        "urgency": 3,
        "duration": 0,
        "score": 3,
        "completionDuration": 92
    },
    {
        "id": 494,
        "importance": 1,
        "urgency": 2,
        "duration": 1,
        "score": 1,
        "completionDuration": 70
    },
    {
        "id": 495,
        "importance": 1,
        "urgency": 3,
        "duration": 0,
        "score": 3,
        "completionDuration": 147
    },
    {
        "id": 496,
        "importance": 3,
        "urgency": 3,
        "duration": 0,
        "score": 9,
        "completionDuration": 160
    },
    {
        "id": 497,
        "importance": 4,
        "urgency": 2,
        "duration": 3,
        "score": 5,
        "completionDuration": 179
    },
    {
        "id": 498,
        "importance": 2,
        "urgency": 5,
        "duration": 1,
        "score": 9,
        "completionDuration": 191
    },
    {
        "id": 499,
        "importance": 0,
        "urgency": 2,
        "duration": 1,
        "score": -1,
        "completionDuration": 177
    },
    {
        "id": 500,
        "importance": 1,
        "urgency": 3,
        "duration": 1,
        "score": 2,
        "completionDuration": 65
    },
    {
        "id": 501,
        "importance": 5,
        "urgency": 5,
        "duration": 3,
        "score": 22,
        "completionDuration": 194
    },
    {
        "id": 502,
        "importance": 1,
        "urgency": 3,
        "duration": 2,
        "score": 1,
        "completionDuration": 123
    },
    {
        "id": 503,
        "importance": 3,
        "urgency": 5,
        "duration": 2,
        "score": 13,
        "completionDuration": 92
    },
    {
        "id": 504,
        "importance": 3,
        "urgency": 1,
        "duration": 1,
        "score": 2,
        "completionDuration": 179
    },
    {
        "id": 505,
        "importance": 3,
        "urgency": 1,
        "duration": 3,
        "score": 0,
        "completionDuration": 199
    },
    {
        "id": 506,
        "importance": 5,
        "urgency": 4,
        "duration": 3,
        "score": 17,
        "completionDuration": 76
    },
    {
        "id": 507,
        "importance": 0,
        "urgency": 3,
        "duration": 0,
        "score": 0,
        "completionDuration": 183
    },
    {
        "id": 508,
        "importance": 5,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 145
    },
    {
        "id": 509,
        "importance": 3,
        "urgency": 3,
        "duration": 3,
        "score": 6,
        "completionDuration": 120
    },
    {
        "id": 510,
        "importance": 4,
        "urgency": 2,
        "duration": 3,
        "score": 5,
        "completionDuration": 195
    },
    {
        "id": 511,
        "importance": 4,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 191
    },
    {
        "id": 512,
        "importance": 3,
        "urgency": 2,
        "duration": 1,
        "score": 5,
        "completionDuration": 112
    },
    {
        "id": 513,
        "importance": 0,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 161
    },
    {
        "id": 514,
        "importance": 4,
        "urgency": 5,
        "duration": 2,
        "score": 18,
        "completionDuration": 182
    },
    {
        "id": 515,
        "importance": 5,
        "urgency": 4,
        "duration": 0,
        "score": 20,
        "completionDuration": 108
    },
    {
        "id": 516,
        "importance": 1,
        "urgency": 2,
        "duration": 0,
        "score": 2,
        "completionDuration": 130
    },
    {
        "id": 517,
        "importance": 4,
        "urgency": 3,
        "duration": 2,
        "score": 10,
        "completionDuration": 89
    },
    {
        "id": 518,
        "importance": 0,
        "urgency": 5,
        "duration": 0,
        "score": 0,
        "completionDuration": 115
    },
    {
        "id": 519,
        "importance": 5,
        "urgency": 1,
        "duration": 1,
        "score": 4,
        "completionDuration": 175
    },
    {
        "id": 520,
        "importance": 2,
        "urgency": 5,
        "duration": 1,
        "score": 9,
        "completionDuration": 63
    },
    {
        "id": 521,
        "importance": 5,
        "urgency": 4,
        "duration": 0,
        "score": 20,
        "completionDuration": 103
    },
    {
        "id": 522,
        "importance": 0,
        "urgency": 3,
        "duration": 3,
        "score": -3,
        "completionDuration": 70
    },
    {
        "id": 523,
        "importance": 1,
        "urgency": 4,
        "duration": 2,
        "score": 2,
        "completionDuration": 99
    },
    {
        "id": 524,
        "importance": 3,
        "urgency": 2,
        "duration": 2,
        "score": 4,
        "completionDuration": 198
    },
    {
        "id": 525,
        "importance": 5,
        "urgency": 2,
        "duration": 0,
        "score": 10,
        "completionDuration": 174
    },
    {
        "id": 526,
        "importance": 4,
        "urgency": 3,
        "duration": 0,
        "score": 12,
        "completionDuration": 199
    },
    {
        "id": 527,
        "importance": 0,
        "urgency": 5,
        "duration": 0,
        "score": 0,
        "completionDuration": 50
    },
    {
        "id": 528,
        "importance": 5,
        "urgency": 2,
        "duration": 2,
        "score": 8,
        "completionDuration": 144
    },
    {
        "id": 529,
        "importance": 5,
        "urgency": 1,
        "duration": 1,
        "score": 4,
        "completionDuration": 187
    },
    {
        "id": 530,
        "importance": 1,
        "urgency": 2,
        "duration": 2,
        "score": 0,
        "completionDuration": 128
    },
    {
        "id": 531,
        "importance": 2,
        "urgency": 4,
        "duration": 1,
        "score": 7,
        "completionDuration": 153
    },
    {
        "id": 532,
        "importance": 5,
        "urgency": 4,
        "duration": 3,
        "score": 17,
        "completionDuration": 153
    },
    {
        "id": 533,
        "importance": 2,
        "urgency": 4,
        "duration": 3,
        "score": 5,
        "completionDuration": 99
    },
    {
        "id": 534,
        "importance": 0,
        "urgency": 1,
        "duration": 1,
        "score": -1,
        "completionDuration": 147
    },
    {
        "id": 535,
        "importance": 1,
        "urgency": 3,
        "duration": 3,
        "score": 0,
        "completionDuration": 142
    },
    {
        "id": 536,
        "importance": 5,
        "urgency": 2,
        "duration": 3,
        "score": 7,
        "completionDuration": 153
    },
    {
        "id": 537,
        "importance": 4,
        "urgency": 1,
        "duration": 1,
        "score": 3,
        "completionDuration": 127
    },
    {
        "id": 538,
        "importance": 4,
        "urgency": 1,
        "duration": 0,
        "score": 4,
        "completionDuration": 164
    },
    {
        "id": 539,
        "importance": 3,
        "urgency": 2,
        "duration": 0,
        "score": 6,
        "completionDuration": 175
    },
    {
        "id": 540,
        "importance": 3,
        "urgency": 1,
        "duration": 3,
        "score": 0,
        "completionDuration": 131
    },
    {
        "id": 541,
        "importance": 3,
        "urgency": 5,
        "duration": 1,
        "score": 14,
        "completionDuration": 118
    },
    {
        "id": 542,
        "importance": 1,
        "urgency": 1,
        "duration": 3,
        "score": -2,
        "completionDuration": 112
    },
    {
        "id": 543,
        "importance": 5,
        "urgency": 2,
        "duration": 2,
        "score": 8,
        "completionDuration": 144
    },
    {
        "id": 544,
        "importance": 3,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 154
    },
    {
        "id": 545,
        "importance": 3,
        "urgency": 4,
        "duration": 2,
        "score": 10,
        "completionDuration": 99
    },
    {
        "id": 546,
        "importance": 2,
        "urgency": 4,
        "duration": 2,
        "score": 6,
        "completionDuration": 159
    },
    {
        "id": 547,
        "importance": 5,
        "urgency": 4,
        "duration": 3,
        "score": 17,
        "completionDuration": 73
    },
    {
        "id": 548,
        "importance": 4,
        "urgency": 5,
        "duration": 0,
        "score": 20,
        "completionDuration": 181
    },
    {
        "id": 549,
        "importance": 0,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 51
    },
    {
        "id": 550,
        "importance": 2,
        "urgency": 1,
        "duration": 1,
        "score": 1,
        "completionDuration": 193
    },
    {
        "id": 551,
        "importance": 4,
        "urgency": 2,
        "duration": 1,
        "score": 7,
        "completionDuration": 63
    },
    {
        "id": 552,
        "importance": 5,
        "urgency": 2,
        "duration": 3,
        "score": 7,
        "completionDuration": 180
    },
    {
        "id": 553,
        "importance": 4,
        "urgency": 3,
        "duration": 2,
        "score": 10,
        "completionDuration": 145
    },
    {
        "id": 554,
        "importance": 4,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 126
    },
    {
        "id": 555,
        "importance": 4,
        "urgency": 2,
        "duration": 1,
        "score": 7,
        "completionDuration": 163
    },
    {
        "id": 556,
        "importance": 2,
        "urgency": 5,
        "duration": 2,
        "score": 8,
        "completionDuration": 190
    },
    {
        "id": 557,
        "importance": 0,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 150
    },
    {
        "id": 558,
        "importance": 3,
        "urgency": 3,
        "duration": 3,
        "score": 6,
        "completionDuration": 92
    },
    {
        "id": 559,
        "importance": 5,
        "urgency": 3,
        "duration": 2,
        "score": 13,
        "completionDuration": 156
    },
    {
        "id": 560,
        "importance": 0,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 69
    },
    {
        "id": 561,
        "importance": 1,
        "urgency": 4,
        "duration": 2,
        "score": 2,
        "completionDuration": 94
    },
    {
        "id": 562,
        "importance": 3,
        "urgency": 1,
        "duration": 2,
        "score": 1,
        "completionDuration": 67
    },
    {
        "id": 563,
        "importance": 2,
        "urgency": 5,
        "duration": 1,
        "score": 9,
        "completionDuration": 182
    },
    {
        "id": 564,
        "importance": 2,
        "urgency": 4,
        "duration": 3,
        "score": 5,
        "completionDuration": 188
    },
    {
        "id": 565,
        "importance": 4,
        "urgency": 5,
        "duration": 3,
        "score": 17,
        "completionDuration": 66
    },
    {
        "id": 566,
        "importance": 1,
        "urgency": 2,
        "duration": 0,
        "score": 2,
        "completionDuration": 163
    },
    {
        "id": 567,
        "importance": 2,
        "urgency": 1,
        "duration": 3,
        "score": -1,
        "completionDuration": 136
    },
    {
        "id": 568,
        "importance": 3,
        "urgency": 5,
        "duration": 2,
        "score": 13,
        "completionDuration": 148
    },
    {
        "id": 569,
        "importance": 2,
        "urgency": 1,
        "duration": 3,
        "score": -1,
        "completionDuration": 55
    },
    {
        "id": 570,
        "importance": 4,
        "urgency": 5,
        "duration": 0,
        "score": 20,
        "completionDuration": 186
    },
    {
        "id": 571,
        "importance": 1,
        "urgency": 2,
        "duration": 2,
        "score": 0,
        "completionDuration": 108
    },
    {
        "id": 572,
        "importance": 3,
        "urgency": 3,
        "duration": 3,
        "score": 6,
        "completionDuration": 150
    },
    {
        "id": 573,
        "importance": 0,
        "urgency": 1,
        "duration": 0,
        "score": 0,
        "completionDuration": 198
    },
    {
        "id": 574,
        "importance": 2,
        "urgency": 2,
        "duration": 1,
        "score": 3,
        "completionDuration": 104
    },
    {
        "id": 575,
        "importance": 0,
        "urgency": 4,
        "duration": 1,
        "score": -1,
        "completionDuration": 64
    },
    {
        "id": 576,
        "importance": 1,
        "urgency": 1,
        "duration": 2,
        "score": -1,
        "completionDuration": 134
    },
    {
        "id": 577,
        "importance": 3,
        "urgency": 5,
        "duration": 2,
        "score": 13,
        "completionDuration": 191
    },
    {
        "id": 578,
        "importance": 4,
        "urgency": 5,
        "duration": 1,
        "score": 19,
        "completionDuration": 186
    },
    {
        "id": 579,
        "importance": 0,
        "urgency": 5,
        "duration": 2,
        "score": -2,
        "completionDuration": 116
    },
    {
        "id": 580,
        "importance": 0,
        "urgency": 4,
        "duration": 2,
        "score": -2,
        "completionDuration": 74
    },
    {
        "id": 581,
        "importance": 5,
        "urgency": 4,
        "duration": 1,
        "score": 19,
        "completionDuration": 129
    },
    {
        "id": 582,
        "importance": 0,
        "urgency": 2,
        "duration": 2,
        "score": -2,
        "completionDuration": 149
    },
    {
        "id": 583,
        "importance": 0,
        "urgency": 5,
        "duration": 1,
        "score": -1,
        "completionDuration": 194
    },
    {
        "id": 584,
        "importance": 5,
        "urgency": 1,
        "duration": 0,
        "score": 5,
        "completionDuration": 136
    },
    {
        "id": 585,
        "importance": 2,
        "urgency": 3,
        "duration": 1,
        "score": 5,
        "completionDuration": 114
    },
    {
        "id": 586,
        "importance": 4,
        "urgency": 2,
        "duration": 2,
        "score": 6,
        "completionDuration": 71
    },
    {
        "id": 587,
        "importance": 0,
        "urgency": 3,
        "duration": 0,
        "score": 0,
        "completionDuration": 133
    },
    {
        "id": 588,
        "importance": 4,
        "urgency": 5,
        "duration": 3,
        "score": 17,
        "completionDuration": 162
    },
    {
        "id": 589,
        "importance": 1,
        "urgency": 5,
        "duration": 2,
        "score": 3,
        "completionDuration": 93
    },
    {
        "id": 590,
        "importance": 5,
        "urgency": 3,
        "duration": 3,
        "score": 12,
        "completionDuration": 161
    },
    {
        "id": 591,
        "importance": 2,
        "urgency": 5,
        "duration": 2,
        "score": 8,
        "completionDuration": 135
    },
    {
        "id": 592,
        "importance": 1,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 149
    },
    {
        "id": 593,
        "importance": 0,
        "urgency": 5,
        "duration": 3,
        "score": -3,
        "completionDuration": 76
    },
    {
        "id": 594,
        "importance": 0,
        "urgency": 5,
        "duration": 1,
        "score": -1,
        "completionDuration": 171
    },
    {
        "id": 595,
        "importance": 4,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 196
    },
    {
        "id": 596,
        "importance": 4,
        "urgency": 2,
        "duration": 1,
        "score": 7,
        "completionDuration": 177
    },
    {
        "id": 597,
        "importance": 4,
        "urgency": 3,
        "duration": 0,
        "score": 12,
        "completionDuration": 118
    },
    {
        "id": 598,
        "importance": 2,
        "urgency": 5,
        "duration": 3,
        "score": 7,
        "completionDuration": 78
    },
    {
        "id": 599,
        "importance": 1,
        "urgency": 2,
        "duration": 0,
        "score": 2,
        "completionDuration": 66
    },
    {
        "id": 600,
        "importance": 1,
        "urgency": 1,
        "duration": 0,
        "score": 1,
        "completionDuration": 95
    },
    {
        "id": 601,
        "importance": 3,
        "urgency": 3,
        "duration": 2,
        "score": 7,
        "completionDuration": 191
    },
    {
        "id": 602,
        "importance": 1,
        "urgency": 5,
        "duration": 3,
        "score": 2,
        "completionDuration": 175
    },
    {
        "id": 603,
        "importance": 1,
        "urgency": 2,
        "duration": 3,
        "score": -1,
        "completionDuration": 89
    },
    {
        "id": 604,
        "importance": 3,
        "urgency": 4,
        "duration": 1,
        "score": 11,
        "completionDuration": 101
    },
    {
        "id": 605,
        "importance": 3,
        "urgency": 4,
        "duration": 2,
        "score": 10,
        "completionDuration": 87
    },
    {
        "id": 606,
        "importance": 0,
        "urgency": 3,
        "duration": 1,
        "score": -1,
        "completionDuration": 189
    },
    {
        "id": 607,
        "importance": 0,
        "urgency": 3,
        "duration": 2,
        "score": -2,
        "completionDuration": 185
    },
    {
        "id": 608,
        "importance": 5,
        "urgency": 2,
        "duration": 3,
        "score": 7,
        "completionDuration": 64
    },
    {
        "id": 609,
        "importance": 0,
        "urgency": 4,
        "duration": 0,
        "score": 0,
        "completionDuration": 197
    },
    {
        "id": 610,
        "importance": 2,
        "urgency": 2,
        "duration": 2,
        "score": 2,
        "completionDuration": 52
    },
    {
        "id": 611,
        "importance": 5,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 171
    },
    {
        "id": 612,
        "importance": 5,
        "urgency": 4,
        "duration": 0,
        "score": 20,
        "completionDuration": 72
    },
    {
        "id": 613,
        "importance": 0,
        "urgency": 5,
        "duration": 2,
        "score": -2,
        "completionDuration": 110
    },
    {
        "id": 614,
        "importance": 0,
        "urgency": 1,
        "duration": 3,
        "score": -3,
        "completionDuration": 95
    },
    {
        "id": 615,
        "importance": 3,
        "urgency": 3,
        "duration": 2,
        "score": 7,
        "completionDuration": 72
    },
    {
        "id": 616,
        "importance": 5,
        "urgency": 5,
        "duration": 0,
        "score": 25,
        "completionDuration": 134
    },
    {
        "id": 617,
        "importance": 3,
        "urgency": 4,
        "duration": 0,
        "score": 12,
        "completionDuration": 149
    },
    {
        "id": 618,
        "importance": 4,
        "urgency": 1,
        "duration": 3,
        "score": 1,
        "completionDuration": 137
    },
    {
        "id": 619,
        "importance": 5,
        "urgency": 1,
        "duration": 3,
        "score": 2,
        "completionDuration": 130
    },
    {
        "id": 620,
        "importance": 2,
        "urgency": 3,
        "duration": 1,
        "score": 5,
        "completionDuration": 108
    },
    {
        "id": 621,
        "importance": 2,
        "urgency": 4,
        "duration": 3,
        "score": 5,
        "completionDuration": 168
    },
    {
        "id": 622,
        "importance": 4,
        "urgency": 4,
        "duration": 2,
        "score": 14,
        "completionDuration": 139
    },
    {
        "id": 623,
        "importance": 4,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 92
    },
    {
        "id": 624,
        "importance": 3,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 120
    },
    {
        "id": 625,
        "importance": 2,
        "urgency": 1,
        "duration": 3,
        "score": -1,
        "completionDuration": 94
    },
    {
        "id": 626,
        "importance": 3,
        "urgency": 5,
        "duration": 0,
        "score": 15,
        "completionDuration": 175
    },
    {
        "id": 627,
        "importance": 4,
        "urgency": 5,
        "duration": 1,
        "score": 19,
        "completionDuration": 60
    },
    {
        "id": 628,
        "importance": 3,
        "urgency": 3,
        "duration": 0,
        "score": 9,
        "completionDuration": 143
    },
    {
        "id": 629,
        "importance": 0,
        "urgency": 2,
        "duration": 0,
        "score": 0,
        "completionDuration": 55
    },
    {
        "id": 630,
        "importance": 3,
        "urgency": 3,
        "duration": 3,
        "score": 6,
        "completionDuration": 99
    },
    {
        "id": 631,
        "importance": 0,
        "urgency": 5,
        "duration": 2,
        "score": -2,
        "completionDuration": 86
    },
    {
        "id": 632,
        "importance": 4,
        "urgency": 3,
        "duration": 0,
        "score": 12,
        "completionDuration": 157
    },
    {
        "id": 633,
        "importance": 5,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 109
    },
    {
        "id": 634,
        "importance": 1,
        "urgency": 3,
        "duration": 0,
        "score": 3,
        "completionDuration": 101
    },
    {
        "id": 635,
        "importance": 1,
        "urgency": 3,
        "duration": 1,
        "score": 2,
        "completionDuration": 60
    },
    {
        "id": 636,
        "importance": 2,
        "urgency": 4,
        "duration": 1,
        "score": 7,
        "completionDuration": 73
    },
    {
        "id": 637,
        "importance": 4,
        "urgency": 4,
        "duration": 2,
        "score": 14,
        "completionDuration": 140
    },
    {
        "id": 638,
        "importance": 0,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 114
    },
    {
        "id": 639,
        "importance": 4,
        "urgency": 3,
        "duration": 2,
        "score": 10,
        "completionDuration": 93
    },
    {
        "id": 640,
        "importance": 2,
        "urgency": 5,
        "duration": 3,
        "score": 7,
        "completionDuration": 88
    },
    {
        "id": 641,
        "importance": 1,
        "urgency": 3,
        "duration": 1,
        "score": 2,
        "completionDuration": 120
    },
    {
        "id": 642,
        "importance": 2,
        "urgency": 5,
        "duration": 0,
        "score": 10,
        "completionDuration": 140
    },
    {
        "id": 643,
        "importance": 2,
        "urgency": 1,
        "duration": 2,
        "score": 0,
        "completionDuration": 56
    },
    {
        "id": 644,
        "importance": 0,
        "urgency": 5,
        "duration": 3,
        "score": -3,
        "completionDuration": 184
    },
    {
        "id": 645,
        "importance": 5,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 125
    },
    {
        "id": 646,
        "importance": 3,
        "urgency": 5,
        "duration": 0,
        "score": 15,
        "completionDuration": 53
    },
    {
        "id": 647,
        "importance": 4,
        "urgency": 4,
        "duration": 2,
        "score": 14,
        "completionDuration": 181
    },
    {
        "id": 648,
        "importance": 0,
        "urgency": 5,
        "duration": 0,
        "score": 0,
        "completionDuration": 165
    },
    {
        "id": 649,
        "importance": 4,
        "urgency": 4,
        "duration": 1,
        "score": 15,
        "completionDuration": 120
    },
    {
        "id": 650,
        "importance": 3,
        "urgency": 2,
        "duration": 3,
        "score": 3,
        "completionDuration": 183
    },
    {
        "id": 651,
        "importance": 1,
        "urgency": 5,
        "duration": 1,
        "score": 4,
        "completionDuration": 85
    },
    {
        "id": 652,
        "importance": 0,
        "urgency": 5,
        "duration": 0,
        "score": 0,
        "completionDuration": 115
    },
    {
        "id": 653,
        "importance": 3,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 173
    },
    {
        "id": 654,
        "importance": 0,
        "urgency": 2,
        "duration": 1,
        "score": -1,
        "completionDuration": 146
    },
    {
        "id": 655,
        "importance": 4,
        "urgency": 5,
        "duration": 2,
        "score": 18,
        "completionDuration": 145
    },
    {
        "id": 656,
        "importance": 1,
        "urgency": 1,
        "duration": 0,
        "score": 1,
        "completionDuration": 174
    },
    {
        "id": 657,
        "importance": 0,
        "urgency": 5,
        "duration": 1,
        "score": -1,
        "completionDuration": 173
    },
    {
        "id": 658,
        "importance": 4,
        "urgency": 5,
        "duration": 1,
        "score": 19,
        "completionDuration": 121
    },
    {
        "id": 659,
        "importance": 4,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 82
    },
    {
        "id": 660,
        "importance": 5,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 127
    },
    {
        "id": 661,
        "importance": 3,
        "urgency": 3,
        "duration": 0,
        "score": 9,
        "completionDuration": 186
    },
    {
        "id": 662,
        "importance": 4,
        "urgency": 3,
        "duration": 3,
        "score": 9,
        "completionDuration": 171
    },
    {
        "id": 663,
        "importance": 3,
        "urgency": 4,
        "duration": 2,
        "score": 10,
        "completionDuration": 116
    },
    {
        "id": 664,
        "importance": 0,
        "urgency": 5,
        "duration": 0,
        "score": 0,
        "completionDuration": 179
    },
    {
        "id": 665,
        "importance": 3,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 150
    },
    {
        "id": 666,
        "importance": 1,
        "urgency": 4,
        "duration": 1,
        "score": 3,
        "completionDuration": 72
    },
    {
        "id": 667,
        "importance": 2,
        "urgency": 5,
        "duration": 1,
        "score": 9,
        "completionDuration": 105
    },
    {
        "id": 668,
        "importance": 5,
        "urgency": 5,
        "duration": 2,
        "score": 23,
        "completionDuration": 174
    },
    {
        "id": 669,
        "importance": 2,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 134
    },
    {
        "id": 670,
        "importance": 2,
        "urgency": 2,
        "duration": 3,
        "score": 1,
        "completionDuration": 97
    },
    {
        "id": 671,
        "importance": 0,
        "urgency": 3,
        "duration": 3,
        "score": -3,
        "completionDuration": 95
    },
    {
        "id": 672,
        "importance": 1,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 133
    },
    {
        "id": 673,
        "importance": 3,
        "urgency": 1,
        "duration": 3,
        "score": 0,
        "completionDuration": 173
    },
    {
        "id": 674,
        "importance": 2,
        "urgency": 5,
        "duration": 0,
        "score": 10,
        "completionDuration": 105
    },
    {
        "id": 675,
        "importance": 3,
        "urgency": 1,
        "duration": 0,
        "score": 3,
        "completionDuration": 119
    },
    {
        "id": 676,
        "importance": 5,
        "urgency": 3,
        "duration": 1,
        "score": 14,
        "completionDuration": 141
    },
    {
        "id": 677,
        "importance": 4,
        "urgency": 1,
        "duration": 2,
        "score": 2,
        "completionDuration": 62
    },
    {
        "id": 678,
        "importance": 3,
        "urgency": 1,
        "duration": 1,
        "score": 2,
        "completionDuration": 183
    },
    {
        "id": 679,
        "importance": 2,
        "urgency": 4,
        "duration": 1,
        "score": 7,
        "completionDuration": 130
    },
    {
        "id": 680,
        "importance": 5,
        "urgency": 2,
        "duration": 0,
        "score": 10,
        "completionDuration": 149
    },
    {
        "id": 681,
        "importance": 0,
        "urgency": 5,
        "duration": 3,
        "score": -3,
        "completionDuration": 82
    },
    {
        "id": 682,
        "importance": 0,
        "urgency": 4,
        "duration": 0,
        "score": 0,
        "completionDuration": 164
    },
    {
        "id": 683,
        "importance": 4,
        "urgency": 4,
        "duration": 3,
        "score": 13,
        "completionDuration": 69
    },
    {
        "id": 684,
        "importance": 3,
        "urgency": 2,
        "duration": 3,
        "score": 3,
        "completionDuration": 162
    },
    {
        "id": 685,
        "importance": 2,
        "urgency": 2,
        "duration": 3,
        "score": 1,
        "completionDuration": 108
    },
    {
        "id": 686,
        "importance": 3,
        "urgency": 5,
        "duration": 1,
        "score": 14,
        "completionDuration": 199
    },
    {
        "id": 687,
        "importance": 1,
        "urgency": 3,
        "duration": 3,
        "score": 0,
        "completionDuration": 156
    },
    {
        "id": 688,
        "importance": 4,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 120
    },
    {
        "id": 689,
        "importance": 0,
        "urgency": 4,
        "duration": 2,
        "score": -2,
        "completionDuration": 186
    },
    {
        "id": 690,
        "importance": 5,
        "urgency": 2,
        "duration": 0,
        "score": 10,
        "completionDuration": 92
    },
    {
        "id": 691,
        "importance": 4,
        "urgency": 1,
        "duration": 3,
        "score": 1,
        "completionDuration": 143
    },
    {
        "id": 692,
        "importance": 4,
        "urgency": 1,
        "duration": 1,
        "score": 3,
        "completionDuration": 152
    },
    {
        "id": 693,
        "importance": 2,
        "urgency": 3,
        "duration": 3,
        "score": 3,
        "completionDuration": 156
    },
    {
        "id": 694,
        "importance": 4,
        "urgency": 4,
        "duration": 2,
        "score": 14,
        "completionDuration": 143
    },
    {
        "id": 695,
        "importance": 5,
        "urgency": 4,
        "duration": 2,
        "score": 18,
        "completionDuration": 55
    },
    {
        "id": 696,
        "importance": 1,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 194
    },
    {
        "id": 697,
        "importance": 1,
        "urgency": 3,
        "duration": 2,
        "score": 1,
        "completionDuration": 50
    },
    {
        "id": 698,
        "importance": 4,
        "urgency": 2,
        "duration": 0,
        "score": 8,
        "completionDuration": 101
    },
    {
        "id": 699,
        "importance": 2,
        "urgency": 2,
        "duration": 1,
        "score": 3,
        "completionDuration": 75
    },
    {
        "id": 700,
        "importance": 4,
        "urgency": 3,
        "duration": 2,
        "score": 10,
        "completionDuration": 143
    },
    {
        "id": 701,
        "importance": 4,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 168
    },
    {
        "id": 702,
        "importance": 3,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 158
    },
    {
        "id": 703,
        "importance": 0,
        "urgency": 3,
        "duration": 0,
        "score": 0,
        "completionDuration": 68
    },
    {
        "id": 704,
        "importance": 1,
        "urgency": 4,
        "duration": 1,
        "score": 3,
        "completionDuration": 65
    },
    {
        "id": 705,
        "importance": 5,
        "urgency": 2,
        "duration": 3,
        "score": 7,
        "completionDuration": 103
    },
    {
        "id": 706,
        "importance": 2,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 91
    },
    {
        "id": 707,
        "importance": 2,
        "urgency": 4,
        "duration": 2,
        "score": 6,
        "completionDuration": 62
    },
    {
        "id": 708,
        "importance": 0,
        "urgency": 4,
        "duration": 2,
        "score": -2,
        "completionDuration": 107
    },
    {
        "id": 709,
        "importance": 1,
        "urgency": 4,
        "duration": 0,
        "score": 4,
        "completionDuration": 83
    },
    {
        "id": 710,
        "importance": 2,
        "urgency": 2,
        "duration": 0,
        "score": 4,
        "completionDuration": 164
    },
    {
        "id": 711,
        "importance": 2,
        "urgency": 5,
        "duration": 1,
        "score": 9,
        "completionDuration": 94
    },
    {
        "id": 712,
        "importance": 5,
        "urgency": 2,
        "duration": 2,
        "score": 8,
        "completionDuration": 148
    },
    {
        "id": 713,
        "importance": 1,
        "urgency": 2,
        "duration": 0,
        "score": 2,
        "completionDuration": 102
    },
    {
        "id": 714,
        "importance": 4,
        "urgency": 5,
        "duration": 2,
        "score": 18,
        "completionDuration": 147
    },
    {
        "id": 715,
        "importance": 5,
        "urgency": 2,
        "duration": 1,
        "score": 9,
        "completionDuration": 193
    },
    {
        "id": 716,
        "importance": 2,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 85
    },
    {
        "id": 717,
        "importance": 4,
        "urgency": 4,
        "duration": 2,
        "score": 14,
        "completionDuration": 113
    },
    {
        "id": 718,
        "importance": 1,
        "urgency": 3,
        "duration": 0,
        "score": 3,
        "completionDuration": 108
    },
    {
        "id": 719,
        "importance": 4,
        "urgency": 1,
        "duration": 1,
        "score": 3,
        "completionDuration": 50
    },
    {
        "id": 720,
        "importance": 2,
        "urgency": 5,
        "duration": 0,
        "score": 10,
        "completionDuration": 106
    },
    {
        "id": 721,
        "importance": 0,
        "urgency": 1,
        "duration": 3,
        "score": -3,
        "completionDuration": 151
    },
    {
        "id": 722,
        "importance": 3,
        "urgency": 1,
        "duration": 0,
        "score": 3,
        "completionDuration": 91
    },
    {
        "id": 723,
        "importance": 2,
        "urgency": 2,
        "duration": 2,
        "score": 2,
        "completionDuration": 65
    },
    {
        "id": 724,
        "importance": 1,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 190
    },
    {
        "id": 725,
        "importance": 1,
        "urgency": 3,
        "duration": 2,
        "score": 1,
        "completionDuration": 134
    },
    {
        "id": 726,
        "importance": 2,
        "urgency": 3,
        "duration": 1,
        "score": 5,
        "completionDuration": 128
    },
    {
        "id": 727,
        "importance": 0,
        "urgency": 3,
        "duration": 0,
        "score": 0,
        "completionDuration": 195
    },
    {
        "id": 728,
        "importance": 0,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 139
    },
    {
        "id": 729,
        "importance": 2,
        "urgency": 1,
        "duration": 0,
        "score": 2,
        "completionDuration": 152
    },
    {
        "id": 730,
        "importance": 2,
        "urgency": 1,
        "duration": 0,
        "score": 2,
        "completionDuration": 148
    },
    {
        "id": 731,
        "importance": 1,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 73
    },
    {
        "id": 732,
        "importance": 0,
        "urgency": 3,
        "duration": 3,
        "score": -3,
        "completionDuration": 75
    },
    {
        "id": 733,
        "importance": 3,
        "urgency": 3,
        "duration": 1,
        "score": 8,
        "completionDuration": 170
    },
    {
        "id": 734,
        "importance": 5,
        "urgency": 2,
        "duration": 3,
        "score": 7,
        "completionDuration": 173
    },
    {
        "id": 735,
        "importance": 0,
        "urgency": 3,
        "duration": 2,
        "score": -2,
        "completionDuration": 113
    },
    {
        "id": 736,
        "importance": 2,
        "urgency": 4,
        "duration": 0,
        "score": 8,
        "completionDuration": 197
    },
    {
        "id": 737,
        "importance": 1,
        "urgency": 3,
        "duration": 0,
        "score": 3,
        "completionDuration": 195
    },
    {
        "id": 738,
        "importance": 5,
        "urgency": 3,
        "duration": 1,
        "score": 14,
        "completionDuration": 186
    },
    {
        "id": 739,
        "importance": 5,
        "urgency": 4,
        "duration": 3,
        "score": 17,
        "completionDuration": 119
    },
    {
        "id": 740,
        "importance": 0,
        "urgency": 4,
        "duration": 1,
        "score": -1,
        "completionDuration": 157
    },
    {
        "id": 741,
        "importance": 4,
        "urgency": 3,
        "duration": 0,
        "score": 12,
        "completionDuration": 126
    },
    {
        "id": 742,
        "importance": 3,
        "urgency": 4,
        "duration": 3,
        "score": 9,
        "completionDuration": 77
    },
    {
        "id": 743,
        "importance": 5,
        "urgency": 2,
        "duration": 1,
        "score": 9,
        "completionDuration": 119
    },
    {
        "id": 744,
        "importance": 4,
        "urgency": 5,
        "duration": 1,
        "score": 19,
        "completionDuration": 129
    },
    {
        "id": 745,
        "importance": 4,
        "urgency": 5,
        "duration": 0,
        "score": 20,
        "completionDuration": 165
    },
    {
        "id": 746,
        "importance": 0,
        "urgency": 4,
        "duration": 2,
        "score": -2,
        "completionDuration": 56
    },
    {
        "id": 747,
        "importance": 2,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 89
    },
    {
        "id": 748,
        "importance": 4,
        "urgency": 3,
        "duration": 3,
        "score": 9,
        "completionDuration": 157
    },
    {
        "id": 749,
        "importance": 1,
        "urgency": 1,
        "duration": 1,
        "score": 0,
        "completionDuration": 98
    },
    {
        "id": 750,
        "importance": 5,
        "urgency": 3,
        "duration": 3,
        "score": 12,
        "completionDuration": 194
    },
    {
        "id": 751,
        "importance": 5,
        "urgency": 5,
        "duration": 2,
        "score": 23,
        "completionDuration": 61
    },
    {
        "id": 752,
        "importance": 4,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 71
    },
    {
        "id": 753,
        "importance": 3,
        "urgency": 2,
        "duration": 1,
        "score": 5,
        "completionDuration": 177
    },
    {
        "id": 754,
        "importance": 3,
        "urgency": 4,
        "duration": 3,
        "score": 9,
        "completionDuration": 111
    },
    {
        "id": 755,
        "importance": 3,
        "urgency": 4,
        "duration": 1,
        "score": 11,
        "completionDuration": 183
    },
    {
        "id": 756,
        "importance": 2,
        "urgency": 5,
        "duration": 0,
        "score": 10,
        "completionDuration": 114
    },
    {
        "id": 757,
        "importance": 2,
        "urgency": 4,
        "duration": 1,
        "score": 7,
        "completionDuration": 141
    },
    {
        "id": 758,
        "importance": 1,
        "urgency": 1,
        "duration": 1,
        "score": 0,
        "completionDuration": 139
    },
    {
        "id": 759,
        "importance": 1,
        "urgency": 1,
        "duration": 3,
        "score": -2,
        "completionDuration": 180
    },
    {
        "id": 760,
        "importance": 4,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 165
    },
    {
        "id": 761,
        "importance": 3,
        "urgency": 1,
        "duration": 2,
        "score": 1,
        "completionDuration": 96
    },
    {
        "id": 762,
        "importance": 3,
        "urgency": 2,
        "duration": 3,
        "score": 3,
        "completionDuration": 162
    },
    {
        "id": 763,
        "importance": 0,
        "urgency": 2,
        "duration": 1,
        "score": -1,
        "completionDuration": 197
    },
    {
        "id": 764,
        "importance": 1,
        "urgency": 3,
        "duration": 2,
        "score": 1,
        "completionDuration": 120
    },
    {
        "id": 765,
        "importance": 1,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 99
    },
    {
        "id": 766,
        "importance": 4,
        "urgency": 3,
        "duration": 3,
        "score": 9,
        "completionDuration": 72
    },
    {
        "id": 767,
        "importance": 5,
        "urgency": 3,
        "duration": 2,
        "score": 13,
        "completionDuration": 137
    },
    {
        "id": 768,
        "importance": 0,
        "urgency": 3,
        "duration": 1,
        "score": -1,
        "completionDuration": 56
    },
    {
        "id": 769,
        "importance": 0,
        "urgency": 4,
        "duration": 0,
        "score": 0,
        "completionDuration": 143
    },
    {
        "id": 770,
        "importance": 4,
        "urgency": 5,
        "duration": 1,
        "score": 19,
        "completionDuration": 179
    },
    {
        "id": 771,
        "importance": 0,
        "urgency": 1,
        "duration": 1,
        "score": -1,
        "completionDuration": 128
    },
    {
        "id": 772,
        "importance": 1,
        "urgency": 5,
        "duration": 0,
        "score": 5,
        "completionDuration": 80
    },
    {
        "id": 773,
        "importance": 1,
        "urgency": 5,
        "duration": 2,
        "score": 3,
        "completionDuration": 53
    },
    {
        "id": 774,
        "importance": 3,
        "urgency": 4,
        "duration": 0,
        "score": 12,
        "completionDuration": 120
    },
    {
        "id": 775,
        "importance": 4,
        "urgency": 3,
        "duration": 2,
        "score": 10,
        "completionDuration": 176
    },
    {
        "id": 776,
        "importance": 3,
        "urgency": 5,
        "duration": 3,
        "score": 12,
        "completionDuration": 114
    },
    {
        "id": 777,
        "importance": 4,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 117
    },
    {
        "id": 778,
        "importance": 1,
        "urgency": 2,
        "duration": 2,
        "score": 0,
        "completionDuration": 102
    },
    {
        "id": 779,
        "importance": 4,
        "urgency": 1,
        "duration": 0,
        "score": 4,
        "completionDuration": 134
    },
    {
        "id": 780,
        "importance": 1,
        "urgency": 4,
        "duration": 0,
        "score": 4,
        "completionDuration": 67
    },
    {
        "id": 781,
        "importance": 3,
        "urgency": 1,
        "duration": 1,
        "score": 2,
        "completionDuration": 170
    },
    {
        "id": 782,
        "importance": 4,
        "urgency": 3,
        "duration": 1,
        "score": 11,
        "completionDuration": 150
    },
    {
        "id": 783,
        "importance": 4,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 130
    },
    {
        "id": 784,
        "importance": 0,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 65
    },
    {
        "id": 785,
        "importance": 1,
        "urgency": 2,
        "duration": 3,
        "score": -1,
        "completionDuration": 85
    },
    {
        "id": 786,
        "importance": 3,
        "urgency": 5,
        "duration": 1,
        "score": 14,
        "completionDuration": 198
    },
    {
        "id": 787,
        "importance": 0,
        "urgency": 2,
        "duration": 0,
        "score": 0,
        "completionDuration": 194
    },
    {
        "id": 788,
        "importance": 0,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 191
    },
    {
        "id": 789,
        "importance": 0,
        "urgency": 5,
        "duration": 0,
        "score": 0,
        "completionDuration": 61
    },
    {
        "id": 790,
        "importance": 5,
        "urgency": 3,
        "duration": 3,
        "score": 12,
        "completionDuration": 196
    },
    {
        "id": 791,
        "importance": 2,
        "urgency": 1,
        "duration": 3,
        "score": -1,
        "completionDuration": 195
    },
    {
        "id": 792,
        "importance": 5,
        "urgency": 5,
        "duration": 3,
        "score": 22,
        "completionDuration": 121
    },
    {
        "id": 793,
        "importance": 1,
        "urgency": 2,
        "duration": 0,
        "score": 2,
        "completionDuration": 181
    },
    {
        "id": 794,
        "importance": 2,
        "urgency": 5,
        "duration": 2,
        "score": 8,
        "completionDuration": 168
    },
    {
        "id": 795,
        "importance": 2,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 81
    },
    {
        "id": 796,
        "importance": 1,
        "urgency": 1,
        "duration": 3,
        "score": -2,
        "completionDuration": 174
    },
    {
        "id": 797,
        "importance": 5,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 199
    },
    {
        "id": 798,
        "importance": 5,
        "urgency": 4,
        "duration": 1,
        "score": 19,
        "completionDuration": 117
    },
    {
        "id": 799,
        "importance": 3,
        "urgency": 4,
        "duration": 1,
        "score": 11,
        "completionDuration": 73
    },
    {
        "id": 800,
        "importance": 1,
        "urgency": 4,
        "duration": 0,
        "score": 4,
        "completionDuration": 191
    },
    {
        "id": 801,
        "importance": 4,
        "urgency": 4,
        "duration": 2,
        "score": 14,
        "completionDuration": 154
    },
    {
        "id": 802,
        "importance": 5,
        "urgency": 1,
        "duration": 3,
        "score": 2,
        "completionDuration": 145
    },
    {
        "id": 803,
        "importance": 5,
        "urgency": 5,
        "duration": 1,
        "score": 24,
        "completionDuration": 147
    },
    {
        "id": 804,
        "importance": 1,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 121
    },
    {
        "id": 805,
        "importance": 5,
        "urgency": 5,
        "duration": 2,
        "score": 23,
        "completionDuration": 150
    },
    {
        "id": 806,
        "importance": 1,
        "urgency": 3,
        "duration": 3,
        "score": 0,
        "completionDuration": 65
    },
    {
        "id": 807,
        "importance": 5,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 63
    },
    {
        "id": 808,
        "importance": 4,
        "urgency": 3,
        "duration": 0,
        "score": 12,
        "completionDuration": 112
    },
    {
        "id": 809,
        "importance": 3,
        "urgency": 4,
        "duration": 2,
        "score": 10,
        "completionDuration": 135
    },
    {
        "id": 810,
        "importance": 2,
        "urgency": 4,
        "duration": 0,
        "score": 8,
        "completionDuration": 124
    },
    {
        "id": 811,
        "importance": 1,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 183
    },
    {
        "id": 812,
        "importance": 5,
        "urgency": 3,
        "duration": 3,
        "score": 12,
        "completionDuration": 167
    },
    {
        "id": 813,
        "importance": 4,
        "urgency": 4,
        "duration": 3,
        "score": 13,
        "completionDuration": 188
    },
    {
        "id": 814,
        "importance": 5,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 167
    },
    {
        "id": 815,
        "importance": 1,
        "urgency": 2,
        "duration": 0,
        "score": 2,
        "completionDuration": 85
    },
    {
        "id": 816,
        "importance": 4,
        "urgency": 5,
        "duration": 1,
        "score": 19,
        "completionDuration": 94
    },
    {
        "id": 817,
        "importance": 2,
        "urgency": 2,
        "duration": 3,
        "score": 1,
        "completionDuration": 112
    },
    {
        "id": 818,
        "importance": 5,
        "urgency": 5,
        "duration": 2,
        "score": 23,
        "completionDuration": 94
    },
    {
        "id": 819,
        "importance": 1,
        "urgency": 4,
        "duration": 1,
        "score": 3,
        "completionDuration": 178
    },
    {
        "id": 820,
        "importance": 2,
        "urgency": 5,
        "duration": 2,
        "score": 8,
        "completionDuration": 66
    },
    {
        "id": 821,
        "importance": 3,
        "urgency": 5,
        "duration": 0,
        "score": 15,
        "completionDuration": 90
    },
    {
        "id": 822,
        "importance": 0,
        "urgency": 2,
        "duration": 1,
        "score": -1,
        "completionDuration": 76
    },
    {
        "id": 823,
        "importance": 4,
        "urgency": 5,
        "duration": 3,
        "score": 17,
        "completionDuration": 163
    },
    {
        "id": 824,
        "importance": 3,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 72
    },
    {
        "id": 825,
        "importance": 4,
        "urgency": 2,
        "duration": 3,
        "score": 5,
        "completionDuration": 180
    },
    {
        "id": 826,
        "importance": 3,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 128
    },
    {
        "id": 827,
        "importance": 2,
        "urgency": 4,
        "duration": 0,
        "score": 8,
        "completionDuration": 162
    },
    {
        "id": 828,
        "importance": 1,
        "urgency": 2,
        "duration": 3,
        "score": -1,
        "completionDuration": 114
    },
    {
        "id": 829,
        "importance": 2,
        "urgency": 3,
        "duration": 3,
        "score": 3,
        "completionDuration": 179
    },
    {
        "id": 830,
        "importance": 5,
        "urgency": 5,
        "duration": 1,
        "score": 24,
        "completionDuration": 135
    },
    {
        "id": 831,
        "importance": 0,
        "urgency": 4,
        "duration": 0,
        "score": 0,
        "completionDuration": 52
    },
    {
        "id": 832,
        "importance": 5,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 194
    },
    {
        "id": 833,
        "importance": 5,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 93
    },
    {
        "id": 834,
        "importance": 1,
        "urgency": 2,
        "duration": 0,
        "score": 2,
        "completionDuration": 85
    },
    {
        "id": 835,
        "importance": 2,
        "urgency": 3,
        "duration": 3,
        "score": 3,
        "completionDuration": 81
    },
    {
        "id": 836,
        "importance": 3,
        "urgency": 1,
        "duration": 2,
        "score": 1,
        "completionDuration": 103
    },
    {
        "id": 837,
        "importance": 3,
        "urgency": 5,
        "duration": 1,
        "score": 14,
        "completionDuration": 177
    },
    {
        "id": 838,
        "importance": 5,
        "urgency": 4,
        "duration": 0,
        "score": 20,
        "completionDuration": 170
    },
    {
        "id": 839,
        "importance": 4,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 152
    },
    {
        "id": 840,
        "importance": 1,
        "urgency": 1,
        "duration": 0,
        "score": 1,
        "completionDuration": 83
    },
    {
        "id": 841,
        "importance": 2,
        "urgency": 2,
        "duration": 0,
        "score": 4,
        "completionDuration": 102
    },
    {
        "id": 842,
        "importance": 0,
        "urgency": 3,
        "duration": 3,
        "score": -3,
        "completionDuration": 135
    },
    {
        "id": 843,
        "importance": 1,
        "urgency": 5,
        "duration": 1,
        "score": 4,
        "completionDuration": 94
    },
    {
        "id": 844,
        "importance": 1,
        "urgency": 2,
        "duration": 1,
        "score": 1,
        "completionDuration": 183
    },
    {
        "id": 845,
        "importance": 5,
        "urgency": 3,
        "duration": 1,
        "score": 14,
        "completionDuration": 154
    },
    {
        "id": 846,
        "importance": 2,
        "urgency": 5,
        "duration": 2,
        "score": 8,
        "completionDuration": 104
    },
    {
        "id": 847,
        "importance": 0,
        "urgency": 4,
        "duration": 0,
        "score": 0,
        "completionDuration": 57
    },
    {
        "id": 848,
        "importance": 4,
        "urgency": 1,
        "duration": 3,
        "score": 1,
        "completionDuration": 172
    },
    {
        "id": 849,
        "importance": 4,
        "urgency": 5,
        "duration": 1,
        "score": 19,
        "completionDuration": 78
    },
    {
        "id": 850,
        "importance": 0,
        "urgency": 1,
        "duration": 2,
        "score": -2,
        "completionDuration": 144
    },
    {
        "id": 851,
        "importance": 5,
        "urgency": 3,
        "duration": 1,
        "score": 14,
        "completionDuration": 97
    },
    {
        "id": 852,
        "importance": 5,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 158
    },
    {
        "id": 853,
        "importance": 0,
        "urgency": 1,
        "duration": 0,
        "score": 0,
        "completionDuration": 198
    },
    {
        "id": 854,
        "importance": 4,
        "urgency": 4,
        "duration": 1,
        "score": 15,
        "completionDuration": 174
    },
    {
        "id": 855,
        "importance": 5,
        "urgency": 5,
        "duration": 3,
        "score": 22,
        "completionDuration": 77
    },
    {
        "id": 856,
        "importance": 5,
        "urgency": 1,
        "duration": 3,
        "score": 2,
        "completionDuration": 80
    },
    {
        "id": 857,
        "importance": 3,
        "urgency": 4,
        "duration": 1,
        "score": 11,
        "completionDuration": 78
    },
    {
        "id": 858,
        "importance": 1,
        "urgency": 5,
        "duration": 1,
        "score": 4,
        "completionDuration": 144
    },
    {
        "id": 859,
        "importance": 2,
        "urgency": 3,
        "duration": 0,
        "score": 6,
        "completionDuration": 53
    },
    {
        "id": 860,
        "importance": 2,
        "urgency": 1,
        "duration": 0,
        "score": 2,
        "completionDuration": 198
    },
    {
        "id": 861,
        "importance": 4,
        "urgency": 2,
        "duration": 0,
        "score": 8,
        "completionDuration": 53
    },
    {
        "id": 862,
        "importance": 5,
        "urgency": 4,
        "duration": 1,
        "score": 19,
        "completionDuration": 73
    },
    {
        "id": 863,
        "importance": 3,
        "urgency": 3,
        "duration": 0,
        "score": 9,
        "completionDuration": 192
    },
    {
        "id": 864,
        "importance": 0,
        "urgency": 2,
        "duration": 3,
        "score": -3,
        "completionDuration": 112
    },
    {
        "id": 865,
        "importance": 4,
        "urgency": 3,
        "duration": 1,
        "score": 11,
        "completionDuration": 119
    },
    {
        "id": 866,
        "importance": 4,
        "urgency": 3,
        "duration": 0,
        "score": 12,
        "completionDuration": 77
    },
    {
        "id": 867,
        "importance": 1,
        "urgency": 3,
        "duration": 1,
        "score": 2,
        "completionDuration": 117
    },
    {
        "id": 868,
        "importance": 4,
        "urgency": 5,
        "duration": 0,
        "score": 20,
        "completionDuration": 196
    },
    {
        "id": 869,
        "importance": 5,
        "urgency": 5,
        "duration": 3,
        "score": 22,
        "completionDuration": 64
    },
    {
        "id": 870,
        "importance": 4,
        "urgency": 3,
        "duration": 3,
        "score": 9,
        "completionDuration": 176
    },
    {
        "id": 871,
        "importance": 4,
        "urgency": 3,
        "duration": 1,
        "score": 11,
        "completionDuration": 168
    },
    {
        "id": 872,
        "importance": 3,
        "urgency": 5,
        "duration": 0,
        "score": 15,
        "completionDuration": 106
    },
    {
        "id": 873,
        "importance": 0,
        "urgency": 2,
        "duration": 3,
        "score": -3,
        "completionDuration": 174
    },
    {
        "id": 874,
        "importance": 0,
        "urgency": 5,
        "duration": 1,
        "score": -1,
        "completionDuration": 76
    },
    {
        "id": 875,
        "importance": 2,
        "urgency": 1,
        "duration": 3,
        "score": -1,
        "completionDuration": 69
    },
    {
        "id": 876,
        "importance": 2,
        "urgency": 2,
        "duration": 2,
        "score": 2,
        "completionDuration": 176
    },
    {
        "id": 877,
        "importance": 5,
        "urgency": 1,
        "duration": 0,
        "score": 5,
        "completionDuration": 109
    },
    {
        "id": 878,
        "importance": 1,
        "urgency": 2,
        "duration": 2,
        "score": 0,
        "completionDuration": 89
    },
    {
        "id": 879,
        "importance": 2,
        "urgency": 2,
        "duration": 1,
        "score": 3,
        "completionDuration": 155
    },
    {
        "id": 880,
        "importance": 3,
        "urgency": 2,
        "duration": 0,
        "score": 6,
        "completionDuration": 66
    },
    {
        "id": 881,
        "importance": 2,
        "urgency": 2,
        "duration": 2,
        "score": 2,
        "completionDuration": 200
    },
    {
        "id": 882,
        "importance": 3,
        "urgency": 3,
        "duration": 0,
        "score": 9,
        "completionDuration": 187
    },
    {
        "id": 883,
        "importance": 0,
        "urgency": 5,
        "duration": 2,
        "score": -2,
        "completionDuration": 119
    },
    {
        "id": 884,
        "importance": 5,
        "urgency": 2,
        "duration": 2,
        "score": 8,
        "completionDuration": 142
    },
    {
        "id": 885,
        "importance": 2,
        "urgency": 2,
        "duration": 2,
        "score": 2,
        "completionDuration": 194
    },
    {
        "id": 886,
        "importance": 3,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 74
    },
    {
        "id": 887,
        "importance": 3,
        "urgency": 2,
        "duration": 1,
        "score": 5,
        "completionDuration": 109
    },
    {
        "id": 888,
        "importance": 0,
        "urgency": 4,
        "duration": 3,
        "score": -3,
        "completionDuration": 100
    },
    {
        "id": 889,
        "importance": 2,
        "urgency": 2,
        "duration": 1,
        "score": 3,
        "completionDuration": 182
    },
    {
        "id": 890,
        "importance": 5,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 71
    },
    {
        "id": 891,
        "importance": 4,
        "urgency": 5,
        "duration": 3,
        "score": 17,
        "completionDuration": 133
    },
    {
        "id": 892,
        "importance": 5,
        "urgency": 4,
        "duration": 2,
        "score": 18,
        "completionDuration": 89
    },
    {
        "id": 893,
        "importance": 5,
        "urgency": 3,
        "duration": 1,
        "score": 14,
        "completionDuration": 190
    },
    {
        "id": 894,
        "importance": 3,
        "urgency": 1,
        "duration": 3,
        "score": 0,
        "completionDuration": 57
    },
    {
        "id": 895,
        "importance": 0,
        "urgency": 3,
        "duration": 2,
        "score": -2,
        "completionDuration": 58
    },
    {
        "id": 896,
        "importance": 1,
        "urgency": 3,
        "duration": 1,
        "score": 2,
        "completionDuration": 154
    },
    {
        "id": 897,
        "importance": 5,
        "urgency": 4,
        "duration": 0,
        "score": 20,
        "completionDuration": 60
    },
    {
        "id": 898,
        "importance": 2,
        "urgency": 5,
        "duration": 1,
        "score": 9,
        "completionDuration": 160
    },
    {
        "id": 899,
        "importance": 5,
        "urgency": 2,
        "duration": 1,
        "score": 9,
        "completionDuration": 126
    },
    {
        "id": 900,
        "importance": 0,
        "urgency": 2,
        "duration": 2,
        "score": -2,
        "completionDuration": 151
    },
    {
        "id": 901,
        "importance": 5,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 188
    },
    {
        "id": 902,
        "importance": 0,
        "urgency": 1,
        "duration": 2,
        "score": -2,
        "completionDuration": 82
    },
    {
        "id": 903,
        "importance": 4,
        "urgency": 1,
        "duration": 3,
        "score": 1,
        "completionDuration": 152
    },
    {
        "id": 904,
        "importance": 1,
        "urgency": 3,
        "duration": 3,
        "score": 0,
        "completionDuration": 200
    },
    {
        "id": 905,
        "importance": 3,
        "urgency": 3,
        "duration": 3,
        "score": 6,
        "completionDuration": 99
    },
    {
        "id": 906,
        "importance": 1,
        "urgency": 5,
        "duration": 1,
        "score": 4,
        "completionDuration": 107
    },
    {
        "id": 907,
        "importance": 1,
        "urgency": 5,
        "duration": 3,
        "score": 2,
        "completionDuration": 102
    },
    {
        "id": 908,
        "importance": 0,
        "urgency": 1,
        "duration": 0,
        "score": 0,
        "completionDuration": 158
    },
    {
        "id": 909,
        "importance": 0,
        "urgency": 3,
        "duration": 2,
        "score": -2,
        "completionDuration": 123
    },
    {
        "id": 910,
        "importance": 4,
        "urgency": 3,
        "duration": 0,
        "score": 12,
        "completionDuration": 141
    },
    {
        "id": 911,
        "importance": 2,
        "urgency": 2,
        "duration": 3,
        "score": 1,
        "completionDuration": 151
    },
    {
        "id": 912,
        "importance": 5,
        "urgency": 5,
        "duration": 1,
        "score": 24,
        "completionDuration": 150
    },
    {
        "id": 913,
        "importance": 1,
        "urgency": 5,
        "duration": 0,
        "score": 5,
        "completionDuration": 132
    },
    {
        "id": 914,
        "importance": 0,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 105
    },
    {
        "id": 915,
        "importance": 5,
        "urgency": 4,
        "duration": 2,
        "score": 18,
        "completionDuration": 159
    },
    {
        "id": 916,
        "importance": 1,
        "urgency": 2,
        "duration": 0,
        "score": 2,
        "completionDuration": 122
    },
    {
        "id": 917,
        "importance": 2,
        "urgency": 4,
        "duration": 1,
        "score": 7,
        "completionDuration": 177
    },
    {
        "id": 918,
        "importance": 5,
        "urgency": 2,
        "duration": 2,
        "score": 8,
        "completionDuration": 97
    },
    {
        "id": 919,
        "importance": 2,
        "urgency": 1,
        "duration": 0,
        "score": 2,
        "completionDuration": 65
    },
    {
        "id": 920,
        "importance": 4,
        "urgency": 4,
        "duration": 3,
        "score": 13,
        "completionDuration": 138
    },
    {
        "id": 921,
        "importance": 5,
        "urgency": 2,
        "duration": 2,
        "score": 8,
        "completionDuration": 145
    },
    {
        "id": 922,
        "importance": 4,
        "urgency": 2,
        "duration": 0,
        "score": 8,
        "completionDuration": 77
    },
    {
        "id": 923,
        "importance": 1,
        "urgency": 4,
        "duration": 2,
        "score": 2,
        "completionDuration": 197
    },
    {
        "id": 924,
        "importance": 2,
        "urgency": 1,
        "duration": 0,
        "score": 2,
        "completionDuration": 113
    },
    {
        "id": 925,
        "importance": 1,
        "urgency": 2,
        "duration": 2,
        "score": 0,
        "completionDuration": 101
    },
    {
        "id": 926,
        "importance": 4,
        "urgency": 2,
        "duration": 1,
        "score": 7,
        "completionDuration": 149
    },
    {
        "id": 927,
        "importance": 2,
        "urgency": 3,
        "duration": 3,
        "score": 3,
        "completionDuration": 105
    },
    {
        "id": 928,
        "importance": 1,
        "urgency": 1,
        "duration": 1,
        "score": 0,
        "completionDuration": 147
    },
    {
        "id": 929,
        "importance": 5,
        "urgency": 2,
        "duration": 3,
        "score": 7,
        "completionDuration": 61
    },
    {
        "id": 930,
        "importance": 5,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 77
    },
    {
        "id": 931,
        "importance": 3,
        "urgency": 4,
        "duration": 2,
        "score": 10,
        "completionDuration": 157
    },
    {
        "id": 932,
        "importance": 2,
        "urgency": 4,
        "duration": 0,
        "score": 8,
        "completionDuration": 81
    },
    {
        "id": 933,
        "importance": 3,
        "urgency": 2,
        "duration": 3,
        "score": 3,
        "completionDuration": 134
    },
    {
        "id": 934,
        "importance": 3,
        "urgency": 2,
        "duration": 2,
        "score": 4,
        "completionDuration": 171
    },
    {
        "id": 935,
        "importance": 1,
        "urgency": 4,
        "duration": 2,
        "score": 2,
        "completionDuration": 113
    },
    {
        "id": 936,
        "importance": 4,
        "urgency": 4,
        "duration": 2,
        "score": 14,
        "completionDuration": 108
    },
    {
        "id": 937,
        "importance": 2,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 89
    },
    {
        "id": 938,
        "importance": 4,
        "urgency": 2,
        "duration": 2,
        "score": 6,
        "completionDuration": 182
    },
    {
        "id": 939,
        "importance": 3,
        "urgency": 4,
        "duration": 3,
        "score": 9,
        "completionDuration": 156
    },
    {
        "id": 940,
        "importance": 0,
        "urgency": 4,
        "duration": 3,
        "score": -3,
        "completionDuration": 143
    },
    {
        "id": 941,
        "importance": 3,
        "urgency": 3,
        "duration": 2,
        "score": 7,
        "completionDuration": 181
    },
    {
        "id": 942,
        "importance": 2,
        "urgency": 5,
        "duration": 1,
        "score": 9,
        "completionDuration": 65
    },
    {
        "id": 943,
        "importance": 0,
        "urgency": 1,
        "duration": 1,
        "score": -1,
        "completionDuration": 163
    },
    {
        "id": 944,
        "importance": 2,
        "urgency": 2,
        "duration": 0,
        "score": 4,
        "completionDuration": 179
    },
    {
        "id": 945,
        "importance": 4,
        "urgency": 5,
        "duration": 3,
        "score": 17,
        "completionDuration": 187
    },
    {
        "id": 946,
        "importance": 4,
        "urgency": 3,
        "duration": 3,
        "score": 9,
        "completionDuration": 117
    },
    {
        "id": 947,
        "importance": 1,
        "urgency": 1,
        "duration": 1,
        "score": 0,
        "completionDuration": 75
    },
    {
        "id": 948,
        "importance": 3,
        "urgency": 4,
        "duration": 0,
        "score": 12,
        "completionDuration": 97
    },
    {
        "id": 949,
        "importance": 3,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 128
    },
    {
        "id": 950,
        "importance": 1,
        "urgency": 4,
        "duration": 3,
        "score": 1,
        "completionDuration": 61
    },
    {
        "id": 951,
        "importance": 1,
        "urgency": 4,
        "duration": 3,
        "score": 1,
        "completionDuration": 189
    },
    {
        "id": 952,
        "importance": 2,
        "urgency": 2,
        "duration": 1,
        "score": 3,
        "completionDuration": 65
    },
    {
        "id": 953,
        "importance": 0,
        "urgency": 0,
        "duration": 3,
        "score": -3,
        "completionDuration": 82
    },
    {
        "id": 954,
        "importance": 0,
        "urgency": 3,
        "duration": 1,
        "score": -1,
        "completionDuration": 74
    },
    {
        "id": 955,
        "importance": 4,
        "urgency": 1,
        "duration": 3,
        "score": 1,
        "completionDuration": 122
    },
    {
        "id": 956,
        "importance": 1,
        "urgency": 3,
        "duration": 1,
        "score": 2,
        "completionDuration": 112
    },
    {
        "id": 957,
        "importance": 5,
        "urgency": 2,
        "duration": 2,
        "score": 8,
        "completionDuration": 186
    },
    {
        "id": 958,
        "importance": 1,
        "urgency": 1,
        "duration": 3,
        "score": -2,
        "completionDuration": 126
    },
    {
        "id": 959,
        "importance": 2,
        "urgency": 5,
        "duration": 3,
        "score": 7,
        "completionDuration": 114
    },
    {
        "id": 960,
        "importance": 4,
        "urgency": 1,
        "duration": 1,
        "score": 3,
        "completionDuration": 169
    },
    {
        "id": 961,
        "importance": 3,
        "urgency": 2,
        "duration": 3,
        "score": 3,
        "completionDuration": 126
    },
    {
        "id": 962,
        "importance": 1,
        "urgency": 4,
        "duration": 1,
        "score": 3,
        "completionDuration": 87
    },
    {
        "id": 963,
        "importance": 4,
        "urgency": 2,
        "duration": 2,
        "score": 6,
        "completionDuration": 190
    },
    {
        "id": 964,
        "importance": 2,
        "urgency": 2,
        "duration": 2,
        "score": 2,
        "completionDuration": 119
    },
    {
        "id": 965,
        "importance": 5,
        "urgency": 3,
        "duration": 3,
        "score": 12,
        "completionDuration": 194
    },
    {
        "id": 966,
        "importance": 1,
        "urgency": 1,
        "duration": 3,
        "score": -2,
        "completionDuration": 124
    },
    {
        "id": 967,
        "importance": 5,
        "urgency": 1,
        "duration": 1,
        "score": 4,
        "completionDuration": 81
    },
    {
        "id": 968,
        "importance": 2,
        "urgency": 4,
        "duration": 3,
        "score": 5,
        "completionDuration": 89
    },
    {
        "id": 969,
        "importance": 1,
        "urgency": 1,
        "duration": 1,
        "score": 0,
        "completionDuration": 195
    },
    {
        "id": 970,
        "importance": 2,
        "urgency": 0,
        "duration": 0,
        "score": 0,
        "completionDuration": 118
    },
    {
        "id": 971,
        "importance": 2,
        "urgency": 2,
        "duration": 3,
        "score": 1,
        "completionDuration": 115
    },
    {
        "id": 972,
        "importance": 2,
        "urgency": 2,
        "duration": 3,
        "score": 1,
        "completionDuration": 100
    },
    {
        "id": 973,
        "importance": 3,
        "urgency": 2,
        "duration": 1,
        "score": 5,
        "completionDuration": 106
    },
    {
        "id": 974,
        "importance": 1,
        "urgency": 3,
        "duration": 1,
        "score": 2,
        "completionDuration": 131
    },
    {
        "id": 975,
        "importance": 5,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 57
    },
    {
        "id": 976,
        "importance": 0,
        "urgency": 2,
        "duration": 2,
        "score": -2,
        "completionDuration": 117
    },
    {
        "id": 977,
        "importance": 5,
        "urgency": 3,
        "duration": 1,
        "score": 14,
        "completionDuration": 93
    },
    {
        "id": 978,
        "importance": 1,
        "urgency": 4,
        "duration": 1,
        "score": 3,
        "completionDuration": 119
    },
    {
        "id": 979,
        "importance": 4,
        "urgency": 2,
        "duration": 2,
        "score": 6,
        "completionDuration": 140
    },
    {
        "id": 980,
        "importance": 0,
        "urgency": 4,
        "duration": 3,
        "score": -3,
        "completionDuration": 131
    },
    {
        "id": 981,
        "importance": 3,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 146
    },
    {
        "id": 982,
        "importance": 3,
        "urgency": 1,
        "duration": 2,
        "score": 1,
        "completionDuration": 56
    },
    {
        "id": 983,
        "importance": 4,
        "urgency": 2,
        "duration": 3,
        "score": 5,
        "completionDuration": 200
    },
    {
        "id": 984,
        "importance": 2,
        "urgency": 4,
        "duration": 1,
        "score": 7,
        "completionDuration": 69
    },
    {
        "id": 985,
        "importance": 0,
        "urgency": 4,
        "duration": 0,
        "score": 0,
        "completionDuration": 127
    },
    {
        "id": 986,
        "importance": 3,
        "urgency": 2,
        "duration": 2,
        "score": 4,
        "completionDuration": 77
    },
    {
        "id": 987,
        "importance": 1,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 151
    },
    {
        "id": 988,
        "importance": 5,
        "urgency": 5,
        "duration": 0,
        "score": 25,
        "completionDuration": 69
    },
    {
        "id": 989,
        "importance": 3,
        "urgency": 4,
        "duration": 2,
        "score": 10,
        "completionDuration": 120
    },
    {
        "id": 990,
        "importance": 1,
        "urgency": 1,
        "duration": 0,
        "score": 1,
        "completionDuration": 55
    },
    {
        "id": 991,
        "importance": 5,
        "urgency": 4,
        "duration": 0,
        "score": 20,
        "completionDuration": 83
    },
    {
        "id": 992,
        "importance": 0,
        "urgency": 1,
        "duration": 0,
        "score": 0,
        "completionDuration": 101
    },
    {
        "id": 993,
        "importance": 5,
        "urgency": 2,
        "duration": 2,
        "score": 8,
        "completionDuration": 186
    },
    {
        "id": 994,
        "importance": 4,
        "urgency": 4,
        "duration": 1,
        "score": 15,
        "completionDuration": 115
    },
    {
        "id": 995,
        "importance": 2,
        "urgency": 1,
        "duration": 0,
        "score": 2,
        "completionDuration": 166
    },
    {
        "id": 996,
        "importance": 4,
        "urgency": 0,
        "duration": 1,
        "score": -1,
        "completionDuration": 54
    },
    {
        "id": 997,
        "importance": 1,
        "urgency": 3,
        "duration": 2,
        "score": 1,
        "completionDuration": 200
    },
    {
        "id": 998,
        "importance": 0,
        "urgency": 3,
        "duration": 2,
        "score": -2,
        "completionDuration": 74
    },
    {
        "id": 999,
        "importance": 4,
        "urgency": 0,
        "duration": 2,
        "score": -2,
        "completionDuration": 157
    }
]

const chartConfig = {
    completionDuration: {
        label: "Completion Duration",
        color: "#2563eb",
    },
} satisfies ChartConfig

export default function Component() {
    // Aggregate data by score and calculate average completion duration
    const aggregatedData = data.reduce((acc: { score: number; totalCompletionDuration: number; count: number; averageCompletionDuration: number; }[], item: { score: number; completionDuration: number; }) => {
        const existing = acc.find((entry) => entry.score === item.score);
        if (existing) {
            existing.totalCompletionDuration += item.completionDuration;
            existing.count += 1;
            existing.averageCompletionDuration = existing.totalCompletionDuration / existing.count;
        } else {
            acc.push({
                score: item.score,
                totalCompletionDuration: item.completionDuration,
                count: 1,
                averageCompletionDuration: item.completionDuration,
            });
        }
        return acc;
    }, []);

    const chartData = aggregatedData.map(({ score, averageCompletionDuration }) => ({
        score,
        completionDuration: averageCompletionDuration,
    }));

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ScatterChart data={chartData}>
                <CartesianGrid strokeDasharray="6 6" />
                <YAxis type="number" dataKey="score" name="Score" />
                <XAxis type="number" dataKey="completionDuration" name="Completion Time (h)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Scatter dataKey="score" fill="var(--color-completionDuration)" />
            </ScatterChart>
        </ChartContainer>
    );
}
