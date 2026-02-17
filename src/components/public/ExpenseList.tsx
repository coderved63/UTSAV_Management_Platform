"use client";

import { Prisma } from "@prisma/client";
import { Receipt, Calendar, CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExpenseListProps {
    expenses: {
        id: string;
        title: string;
        amount: Prisma.Decimal;
        category: string;
        createdAt: Date;
    }[];
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
    return (
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white h-full flex flex-col">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Approved Expenses</CardTitle>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Audited Vendor Payments</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 px-6 pb-6">
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                        {expenses.map((e) => (
                            <div
                                key={e.id}
                                className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-100"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 font-black border border-rose-100 shadow-sm transition-transform">
                                        <Receipt className="w-5 h-5" />
                                    </div>
                                    <div className="max-w-[140px] md:max-w-[180px]">
                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors truncate">
                                            {e.title}
                                        </h4>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Badge variant="secondary" className="bg-white text-[9px] font-black uppercase text-slate-500 border-slate-100 px-1.5 py-0 group-hover:bg-rose-100 group-hover:text-rose-700 group-hover:border-rose-200 transition-colors">
                                                {e.category}
                                            </Badge>
                                            <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                                                <CheckCircle className="w-2.5 h-2.5 mr-1" />
                                                Audited
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-rose-600 leading-none mb-1">
                                        -₹{Number(e.amount).toLocaleString("en-IN")}
                                    </p>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                        {new Date(e.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {expenses.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                                    <Receipt className="w-6 h-6 text-slate-300" />
                                </div>
                                <p className="text-sm text-slate-400 font-bold tracking-tight">NO EXPENSES APPROVED YET</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
