import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function StockReportsPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 font-['Manrope']">
      {/* SIDEBAR KOMPONEN */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* HEADER KOMPONEN */}
        <Header title="Stock Reports" />

        <main className="max-w-[1024px] w-full p-6 mx-auto flex flex-col justify-start items-start gap-8">
          
          {/* TOP SECTION: TITLE & ACTIONS */}
          <div className="w-full flex justify-between items-end">
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="flex justify-start items-center gap-2">
                <div className="size-3 bg-stone-900 rounded-sm" />
                <div className="text-stone-900 text-xs font-semibold uppercase leading-3 tracking-wider">
                  INVENTORY MANAGEMENT
                </div>
              </div>
              <div className="text-stone-900 text-3xl font-bold leading-10">
                Finished Teak Inventory
              </div>
            </div>
            <div className="flex justify-start items-center gap-3">
              <button className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 transition-colors rounded-sm flex justify-start items-center gap-2">
                {/* Icon Filter Placeholder */}
                <div className="w-3.5 h-2.5 bg-stone-700 rounded-sm" />
                <span className="text-stone-700 text-sm font-normal leading-5">Filter</span>
              </button>
              <button className="px-5 py-2.5 bg-white hover:bg-stone-50 transition-colors rounded-sm shadow-sm flex justify-start items-center gap-2">
                {/* Icon Export Placeholder */}
                <div className="size-3.5 bg-stone-900 rounded-sm" />
                <span className="text-stone-900 text-sm font-normal leading-5">Export to CSV</span>
              </button>
            </div>
          </div>

          {/* STATS GRID (KOSONG) */}
          <div className="w-full grid grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-2 shadow-sm">
              <div className="text-stone-700 text-xs font-semibold leading-3 tracking-tight">TOTAL READY STOCK</div>
              <div className="flex items-baseline gap-2 mt-1">
                <div className="text-stone-900 text-2xl font-semibold leading-8">0.0</div>
                <div className="text-stone-500 text-xs font-semibold leading-3 tracking-tight">m³</div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-2 shadow-sm">
              <div className="text-stone-700 text-xs font-semibold leading-3 tracking-tight">GRADE A RATIO</div>
              <div className="flex items-baseline gap-2 mt-1">
                <div className="text-yellow-800 text-2xl font-semibold leading-8">0%</div>
                <div className="text-stone-500 text-xs font-semibold leading-3 tracking-tight">of total</div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-2 shadow-sm">
              <div className="text-stone-700 text-xs font-semibold leading-3 tracking-tight">AVG. MOISTURE</div>
              <div className="flex items-baseline gap-2 mt-1">
                <div className="text-stone-900 text-2xl font-semibold leading-8">0.0%</div>
                <div className="text-stone-500 text-xs font-semibold leading-3 tracking-tight">Stable</div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-2 shadow-sm">
              <div className="text-stone-700 text-xs font-semibold leading-3 tracking-tight">WAREHOUSE LOAD</div>
              <div className="flex items-baseline gap-2 mt-1">
                <div className="text-stone-600 text-2xl font-semibold leading-8">0%</div>
                <div className="text-stone-500 text-xs font-semibold leading-3 tracking-tight">Capacity</div>
              </div>
            </div>
          </div>

          {/* INVENTORY TABLE AREA */}
          <div className="w-full bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col overflow-hidden shadow-sm">
            {/* TABLE HEADER */}
            <div className="w-full bg-stone-200 border-b border-stone-300 flex justify-start items-start">
              <div className="w-36 px-6 py-5">
                <div className="text-stone-700 text-xs font-bold uppercase leading-3 tracking-tight">BATCH ID</div>
              </div>
              <div className="w-28 px-6 py-5">
                <div className="text-stone-700 text-xs font-bold uppercase leading-3 tracking-tight">GRADE</div>
              </div>
              <div className="w-52 px-6 py-5">
                <div className="text-stone-700 text-xs font-bold uppercase leading-3 tracking-tight">DIMENSIONS (T X W X L)</div>
              </div>
              <div className="w-32 px-6 py-5 text-right">
                <div className="text-stone-700 text-xs font-bold uppercase leading-3 tracking-tight">TOTAL VOLUME</div>
              </div>
              <div className="w-44 px-6 py-5">
                <div className="text-stone-700 text-xs font-bold uppercase leading-3 tracking-tight">WAREHOUSE LOCATION</div>
              </div>
              <div className="w-28 px-6 py-5">
                <div className="text-stone-700 text-xs font-bold uppercase leading-3 tracking-tight">MOISTURE</div>
              </div>
              <div className="flex-1 px-6 py-5 text-center">
                <div className="text-stone-700 text-xs font-bold uppercase leading-3 tracking-tight">ACTION</div>
              </div>
            </div>

            {/* TABLE BODY (EMPTY STATE) */}
            <div className="w-full py-16 flex flex-col justify-center items-center bg-neutral-50/30">
              <div className="size-12 mb-3 bg-stone-200 rounded-full flex justify-center items-center">
                <div className="size-6 bg-stone-400 rounded-sm" />
              </div>
              <div className="text-stone-500 text-sm font-medium">Belum ada stok kayu jadi.</div>
              <div className="text-stone-400 text-xs mt-1">Selesaikan proses Dry Kiln untuk memindahkan data ke sini.</div>
            </div>

            {/* PAGINATION (KOSONG) */}
            <div className="w-full px-6 py-4 border-t border-stone-300 flex justify-between items-center">
              <div className="text-stone-700 text-xs font-medium tracking-tight">
                Showing 0 of 0 batches
              </div>
              <div className="flex justify-start items-center gap-2">
                <button className="px-3 py-1.5 text-stone-400 text-xs font-medium rounded-sm border border-stone-200" disabled>Previous</button>
                <button className="px-3 py-1.5 text-stone-400 text-xs font-medium rounded-sm border border-stone-200" disabled>Next</button>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: HIGHLIGHT & QUALITY CONTROL */}
          <div className="w-full grid grid-cols-3 gap-6">
            
            {/* STOCK HIGHLIGHT (KOSONG) */}
            <div className="col-span-2 h-64 relative rounded-lg overflow-hidden bg-stone-200 flex flex-col justify-center items-center shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
              <div className="absolute inset-0 p-6 z-20 flex flex-col justify-end items-start">
                <div className="text-yellow-50 text-xs font-bold uppercase tracking-tight mb-2">
                  STOCK HIGHLIGHT
                </div>
                <div className="text-white text-xl font-semibold mb-2">
                  No Highlight Available
                </div>
                <div className="w-full max-w-lg text-white/80 text-sm font-normal">
                  Saat ini belum ada batch unggulan yang tersedia di dalam inventori.
                </div>
              </div>
            </div>

            {/* QUALITY CONTROL WIDGET (KOSONG) */}
            <div className="col-span-1 p-6 relative bg-lime-700 rounded-lg flex flex-col justify-between items-start overflow-hidden shadow-sm">
              <div className="flex flex-col justify-start items-start gap-2 z-10">
                <div className="text-yellow-50 text-xl font-semibold leading-7">
                  Quality Control
                </div>
                <div className="opacity-90 text-yellow-50 text-sm font-normal leading-5">
                  Menunggu inspeksi dan pengujian *moisture* untuk batch baru yang akan masuk.
                </div>
              </div>
              <div className="w-full pt-4 mt-8 border-t border-white/20 flex justify-between items-center z-10">
                <div className="text-yellow-50 text-xs font-bold tracking-tight">
                  LAST INSPECTION
                </div>
                <div className="text-yellow-50 text-xs font-bold tracking-tight">
                  -
                </div>
              </div>
              {/* Decorative Background Element */}
              <div className="w-36 h-32 absolute -right-10 -bottom-10 rotate-12 opacity-10 bg-yellow-50 z-0" />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}