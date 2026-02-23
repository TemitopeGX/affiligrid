'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';

interface ChartData {
    date: string;
    clicks: number;
}

function fillMissingDays(data: ChartData[], period: number): ChartData[] {
    const result: ChartData[] = [];
    const dataMap = new Map<string, number>();

    data.forEach(item => {
        dataMap.set(item.date, item.clicks);
    });

    for (let i = period - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        result.push({
            date: dateStr,
            clicks: dataMap.get(dateStr) || 0,
        });
    }

    return result;
}

function formatTick(value: string, period: number): string {
    const d = new Date(value + 'T00:00:00');
    if (period <= 7) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[d.getDay()];
    }
    if (period <= 30) {
        return `${d.getDate()}`;
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
}

interface OverviewChartProps {
    data: ChartData[];
    period: number;
}

export default function OverviewChart({ data, period }: OverviewChartProps) {
    const [animationKey, setAnimationKey] = useState(0);
    const chartData = fillMissingDays(data, period);

    // Re-trigger animation when period or data changes
    useEffect(() => {
        setAnimationKey(prev => prev + 1);
    }, [period, data]);

    const maxClicks = Math.max(...chartData.map(d => d.clicks), 1);

    // Show only some ticks for longer periods
    const tickInterval = period <= 7 ? 0 : period <= 30 ? 3 : 9;

    return (
        <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" key={animationKey}>
                <AreaChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#111457" stopOpacity={0.08} />
                            <stop offset="100%" stopColor="#111457" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f3f4f6"
                    />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
                        dy={10}
                        interval={tickInterval}
                        tickFormatter={(value: string) => formatTick(value, period)}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 11 }}
                        allowDecimals={false}
                        domain={[0, maxClicks <= 1 ? 5 : 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #f3f4f6',
                            boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)',
                            fontSize: '13px',
                            padding: '10px 14px',
                        }}
                        labelFormatter={(value: any) => {
                            const d = new Date(value + 'T00:00:00');
                            return d.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                            });
                        }}
                        cursor={{ stroke: '#111457', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="#111457"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorClicks)"
                        name="Clicks"
                        isAnimationActive={true}
                        animationBegin={0}
                        animationDuration={1500}
                        animationEasing="ease-out"
                        dot={{ r: 0 }}
                        activeDot={{
                            r: 5,
                            fill: '#111457',
                            stroke: '#fff',
                            strokeWidth: 2,
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
