"use client";

import { Prisma } from "@prisma/client";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FinancialChartsProps {
    totalDonations: Prisma.Decimal;
    totalExpenses: Prisma.Decimal;
    expenses: {
        category: string;
        amount: Prisma.Decimal;
    }[];
}

const COLORS = ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#6366F1", "#EC4899", "#F43F5E"];

export default function FinancialCharts({ totalDonations, totalExpenses, expenses }: FinancialChartsProps) {
    // Prep Bar Data
    const summaryData = [
        { name: "Inflow", amount: Number(totalDonations), color: "#10B981" },
        { name: "Outflow", amount: Number(totalExpenses), color: "#EF4444" },
    ];

    // Prep Pie Data (Group by category)
    const categoryMap: Record<string, number> = {};
    expenses.forEach((e) => {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
    });

    const pieData = Object.keys(categoryMap).map((cat) => ({
        name: cat,
        value: categoryMap[cat],
    }));

    const formatCurrency = (value: number) =>
        `₹${(value / 1000).toFixed(0)}k`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Comparison Bar Chart */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Cash Flow Dynamics</CardTitle>
                    <p className="text-sm text-slate-500 font-medium">Comparison of collections vs spending</p>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={summaryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 600 }}
                                    tickFormatter={formatCurrency}
                                />
                                <Tooltip
                                    cursor={{ fill: "#F8FAFC", radius: 8 }}
                                    contentStyle={{
                                        borderRadius: "16px",
                                        border: "none",
                                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                                        padding: "12px"
                                    }}
                                    formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Amount"]}
                                />
                                <Bar dataKey="amount" radius={[12, 12, 0, 0]} barSize={40}>
                                    {summaryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Expense Breakdown Pie Chart */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Spending Allocation</CardTitle>
                    <p className="text-sm text-slate-500 font-medium">Where the Organization resources are assigned</p>
                </CardHeader>
                <CardContent className="pt-6">
                    {pieData.length > 0 ? (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "16px",
                                            border: "none",
                                            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                                            padding: "12px"
                                        }}
                                        formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Amount"]}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        align="center"
                                        iconType="circle"
                                        iconSize={8}
                                        formatter={(value) => <span className="text-xs font-bold text-slate-500 ml-1">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-2xl">
                            <p className="text-sm text-slate-400 font-bold tracking-tight">NO FINANCIAL RECORDS FOUND</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
