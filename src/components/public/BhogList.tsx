import { Soup } from "lucide-react";

interface BhogListProps {
    bhogList: {
        id: string;
        name: string;
        quantity: string;
        sponsorName: string | null;
        status: string;
    }[];
}

export default function BhogList({ bhogList }: BhogListProps) {
    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 font-display tracking-tight">Bhog Sponsorships</h3>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[400px] scrollbar-hide">
                {bhogList.map((b) => (
                    <div key={b.id} className="p-3 rounded-xl bg-gray-50/50 border border-gray-50 flex items-center justify-between group hover:bg-white hover:shadow-sm hover:border-orange-100 transition-all">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-100 group-hover:bg-orange-50 transition-colors">
                                <Soup className="w-4 h-4 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{b.name}</p>
                                <p className="text-[10px] text-gray-500 font-medium">Quantity: {b.quantity}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            {b.sponsorName ? (
                                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                                    {b.sponsorName}
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Not Sponsored
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {bhogList.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-sm text-gray-400">No items listed.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
