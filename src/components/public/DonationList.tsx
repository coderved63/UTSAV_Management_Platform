"use client";

import { Prisma } from "@prisma/client";
import { User, Calendar, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DonationListProps {
    donations: {
        id: string;
        donorName: string;
        amount: Prisma.Decimal;
        category: string | null;
        date: Date;
    }[];
}

export default function DonationList({ donations }: DonationListProps) {
    return (
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white h-full flex flex-col">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Recent Donations</CardTitle>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Devotee Contributions</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                        <Search className="w-4 h-4" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 px-6 pb-6">
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                        {donations.map((d) => (
                            <div
                                key={d.id}
                                className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-100"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-saffron-50 flex items-center justify-center text-saffron-600 font-black border border-saffron-100 shadow-sm group-hover:scale-110 transition-transform">
                                        {d.donorName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-saffron-600 transition-colors">
                                            {d.donorName}
                                        </h4>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Badge variant="secondary" className="bg-white text-[9px] font-black uppercase text-slate-500 border-slate-100 px-1.5 py-0 group-hover:bg-saffron-100 group-hover:text-saffron-700 group-hover:border-saffron-200 transition-colors">
                                                {d.category || "General"}
                                            </Badge>
                                            <span className="text-[10px] text-slate-400 font-bold flex items-center">
                                                <Calendar className="w-2.5 h-2.5 mr-1" />
                                                {new Date(d.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900 leading-none">
                                        ₹{Number(d.amount).toLocaleString("en-IN")}
                                    </p>
                                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Verified</span>
                                </div>
                            </div>
                        ))}

                        {donations.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                                    <User className="w-6 h-6 text-slate-300" />
                                </div>
                                <p className="text-sm text-slate-400 font-bold tracking-tight">NO DONATIONS RECORDED</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
