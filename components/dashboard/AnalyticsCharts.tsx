'use client';

import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

export function TrafficChart() {
    const data = [
        { date: 'Mon', visits: 2400 },
        { date: 'Tue', visits: 1398 },
        { date: 'Wed', visits: 9800 },
        { date: 'Thu', visits: 3908 },
        { date: 'Fri', visits: 4800 },
        { date: 'Sat', visits: 3800 },
        { date: 'Sun', visits: 4300 },
    ];

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#111457" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#111457" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="visits"
                        stroke="#111457"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorVisits)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function DeviceChart() {
    const data = [
        { name: 'Mobile', value: 400, color: '#111457' },
        { name: 'Desktop', value: 300, color: '#FF6600' },
        { name: 'Tablet', value: 300, color: '#F3F4F6' },
    ];

    return (
        <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                <div className="text-center">
                    <p className="text-2xl font-bold text-[#111457]">Total</p>
                    <p className="text-sm text-gray-500">Devices</p>
                </div>
            </div>
        </div>
    );
}
