import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function ManagerDashboardPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 font-['Manrope']">
      {/* SIDEBAR KOMPONEN */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* HEADER KOMPONEN */}
        <Header title="Dashboard Overview" />

        <main className="max-w-[1200px] w-full p-6 mx-auto flex flex-col justify-start items-start gap-8">
          
          {/* TOP PRIMARY STATS (4 CARDS) */}
          <div className="w-full grid grid-cols-4 gap-6">
            {/* TOTAL LOGS */}
            <div className="p-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start shadow-sm h-36">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-start">
                  <div className="text-stone-700 text-xs font-semibold uppercase leading-3 tracking-wide">TOTAL LOGS</div>
                  <div className="w-6 h-5 bg-lime-800 rounded-sm" />
                </div>
                <div className="text-stone-900 text-2xl font-bold leading-8">0</div>
              </div>
              <div className="pt-4 flex justify-start items-center gap-1.5 w-full">
                <div className="w-3 h-1.5 bg-stone-300 rounded-sm" />
                <div className="text-stone-500 text-xs font-bold leading-4">0% Increase from last month</div>
              </div>
            </div>

            {/* TOTAL BOARDS */}
            <div className="p-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start shadow-sm h-36">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-start">
                  <div className="text-stone-700 text-xs font-semibold uppercase leading-3 tracking-wide">TOTAL BOARDS</div>
                  <div className="size-4 bg-yellow-800 rounded-sm" />
                </div>
                <div className="text-stone-900 text-2xl font-bold leading-8">0</div>
              </div>
              <div className="pt-4 flex justify-start items-center gap-1.5 w-full">
                <div className="size-2.5 bg-stone-300 rounded-sm" />
                <div className="text-stone-500 text-xs font-bold leading-4">Processing in Sawmill</div>
              </div>
            </div>

            {/* READY-TO-SELL */}
            <div className="p-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start shadow-sm h-36">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-start">
                  <div className="text-stone-700 text-xs font-semibold uppercase leading-3 tracking-wide">READY-TO-SELL</div>
                  <div className="size-5 bg-stone-600 rounded-sm" />
                </div>
                <div className="text-stone-900 text-2xl font-bold leading-8">0</div>
              </div>
              <div className="mt-4 px-2 py-1 bg-stone-100 rounded-md">
                <div className="text-stone-500 text-[10px] font-bold uppercase leading-4">DRY KILN QUALITY</div>
              </div>
            </div>

            {/* MONTHLY REVENUE (DARK GREEN) */}
            <div className="p-5 bg-lime-800 rounded-lg flex flex-col justify-between items-start shadow-md h-36">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-start">
                  <div className="text-yellow-50 text-xs font-semibold uppercase leading-3 tracking-wide">MONTHLY REVENUE</div>
                  <div className="w-5 h-4 bg-lime-200 rounded-sm" />
                </div>
                <div className="text-white text-2xl font-bold leading-8">$0</div>
              </div>
              <div className="pt-4 flex justify-start items-center gap-1.5 w-full">
                <div className="size-2.5 bg-lime-200 rounded-sm" />
                <div className="text-lime-200 text-xs font-bold leading-4">$0 vs Previous Month</div>
              </div>
            </div>
          </div>

          {/* SECONDARY STATS (4 CARDS - ORANGE) */}
          <div className="w-full grid grid-cols-4 gap-6">
            <div className="h-20 p-4 bg-orange-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex justify-start items-center gap-4 shadow-sm">
              <div className="size-10 bg-yellow-800/10 rounded-xl flex justify-center items-center">
                <div className="size-4 bg-yellow-800 rounded-sm" />
              </div>
              <div className="flex flex-col">
                <div className="text-stone-700 text-xs font-semibold uppercase leading-3 tracking-tight mb-1">ACTIVE KILNS</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-stone-900 text-lg font-bold leading-6">0</span>
                  <span className="text-stone-500 text-sm">/ 15</span>
                </div>
              </div>
            </div>

            <div className="h-20 p-4 bg-orange-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex justify-start items-center gap-4 shadow-sm">
              <div className="size-10 bg-lime-800/10 rounded-xl flex justify-center items-center">
                <div className="w-6 h-3 bg-lime-800 rounded-sm" />
              </div>
              <div className="flex flex-col">
                <div className="text-stone-700 text-xs font-semibold uppercase leading-3 tracking-tight mb-1">TOTAL CUSTOMERS</div>
                <div className="text-stone-900 text-lg font-bold leading-6">0</div>
              </div>
            </div>

            <div className="h-20 p-4 bg-orange-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex justify-start items-center gap-4 shadow-sm">
              <div className="size-10 bg-stone-600/10 rounded-xl flex justify-center items-center">
                <div className="size-5 bg-stone-600 rounded-sm" />
              </div>
              <div className="flex flex-col">
                <div className="text-stone-700 text-xs font-semibold uppercase leading-3 tracking-tight mb-1">TOTAL SALES</div>
                <div className="text-stone-900 text-lg font-bold leading-6">0</div>
              </div>
            </div>

            <div className="h-20 p-4 bg-orange-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex justify-start items-center gap-4 shadow-sm">
              <div className="size-10 bg-red-700/10 rounded-xl flex justify-center items-center">
                <div className="w-4 h-5 bg-red-700 rounded-sm" />
              </div>
              <div className="flex flex-col">
                <div className="text-stone-700 text-xs font-semibold uppercase leading-3 tracking-tight mb-1">PENDING VERIFICATION</div>
                <div className="text-stone-900 text-lg font-bold leading-6">0</div>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: TRENDS & ACTIVITY */}
          <div className="w-full grid grid-cols-3 gap-6">
            
            {/* PRODUCTION TRENDS CHART */}
            <div className="col-span-2 p-6 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-stone-900 text-lg font-semibold leading-6">Production Trends</div>
                  <div className="text-stone-500 text-sm font-normal">Kiln output vs. raw sawmill input</div>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <button className="px-3 py-1 rounded-md outline outline-1 outline-stone-300 text-stone-900 text-xs font-semibold hover:bg-stone-50">Week</button>
                  <button className="px-3 py-1 bg-lime-800 rounded-md text-white text-xs font-semibold shadow-sm">Month</button>
                  <button className="px-3 py-1 rounded-md outline outline-1 outline-stone-300 text-stone-900 text-xs font-semibold hover:bg-stone-50">Year</button>
                </div>
              </div>

              {/* EMPTY CHART BARS */}
              <div className="h-64 relative flex flex-col justify-between border-b border-stone-200">
                <div className="w-full border-t border-slate-100 flex items-start"><span className="text-slate-400 text-[10px] -mt-2.5 bg-white pr-2">100%</span></div>
                <div className="w-full border-t border-slate-100 flex items-start"><span className="text-slate-400 text-[10px] -mt-2.5 bg-white pr-2">75%</span></div>
                <div className="w-full border-t border-slate-100 flex items-start"><span className="text-slate-400 text-[10px] -mt-2.5 bg-white pr-2">50%</span></div>
                <div className="w-full border-t border-slate-100 flex items-start"><span className="text-slate-400 text-[10px] -mt-2.5 bg-white pr-2">25%</span></div>
                <div className="w-full flex items-start"><span className="text-slate-400 text-[10px] -mt-2.5 bg-white pr-2">0%</span></div>
              </div>

              <div className="pt-6 mt-4 border-t border-stone-300 flex justify-start items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="size-3 bg-lime-800 rounded-sm" />
                  <span className="text-stone-900 text-xs font-semibold tracking-tight">Dry Kiln (Final)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 bg-stone-200 rounded-sm" />
                  <span className="text-stone-900 text-xs font-semibold tracking-tight">Sawmill (Input)</span>
                </div>
              </div>
            </div>

            {/* REAL-TIME ACTIVITY */}
            <div className="col-span-1 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col shadow-sm">
              <div className="p-6 border-b border-stone-200">
                <div className="text-stone-900 text-lg font-semibold leading-6">Real-time Activity</div>
              </div>
              
              {/* EMPTY STATE */}
              <div className="flex-1 p-6 flex flex-col justify-center items-center min-h-[300px]">
                <div className="size-12 mb-3 bg-stone-100 rounded-full flex justify-center items-center">
                  <div className="size-6 bg-stone-300 rounded-sm" />
                </div>
                <div className="text-stone-500 text-sm font-medium">Belum ada aktivitas realtime.</div>
              </div>

              <button className="py-4 border-t border-stone-200 text-center text-lime-800 text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition-colors rounded-b-lg">
                VIEW ALL ACTIVITY
              </button>
            </div>
          </div>

          {/* BOTTOM SECTION: RECENT INVENTORY MOVEMENTS TABLE */}
          <div className="w-full bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col shadow-sm overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-stone-200 bg-white">
              <div>
                <div className="text-stone-900 text-lg font-semibold leading-6">Recent Inventory Movements</div>
                <div className="text-stone-500 text-sm font-normal mt-1">Live tracking of wood batches across facilities</div>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2 bg-lime-800 hover:bg-lime-900 transition-colors rounded-sm flex items-center gap-2 text-white text-sm font-bold shadow-sm">
                  <div className="size-3 bg-white rounded-sm" />
                  New Log Entry
                </button>
                <button className="px-5 py-2 outline outline-1 outline-offset-[-1px] outline-yellow-800 hover:bg-orange-50 transition-colors rounded-sm flex items-center gap-2 text-yellow-800 text-sm font-bold">
                  {/* Icon Placeholder */}
                  <div className="w-3.5 h-2 bg-yellow-800 rounded-sm" />
                  Filter
                </button>
              </div>
            </div>

            {/* TABLE HEADER */}
            <div className="w-full bg-orange-50 border-b border-stone-200 flex justify-start items-center px-6 py-4">
              <div className="w-1/6 text-stone-700 text-[10px] font-bold uppercase tracking-wide">BATCH ID</div>
              <div className="w-1/4 text-stone-700 text-[10px] font-bold uppercase tracking-wide">WOOD SPEC (L X W X T)</div>
              <div className="w-1/6 text-stone-700 text-[10px] font-bold uppercase tracking-wide">STAGE</div>
              <div className="w-1/6 text-stone-700 text-[10px] font-bold uppercase tracking-wide">MOISTURE</div>
              <div className="w-1/6 text-stone-700 text-[10px] font-bold uppercase tracking-wide">LAST UPDATE</div>
              <div className="w-1/12 text-right text-stone-700 text-[10px] font-bold uppercase tracking-wide">ACTIONS</div>
            </div>

            {/* TABLE BODY (EMPTY STATE) */}
            <div className="w-full py-16 flex flex-col justify-center items-center bg-neutral-50/30">
              <div className="size-12 mb-3 bg-stone-200 rounded-full flex justify-center items-center">
                <div className="size-6 bg-stone-400 rounded-sm" />
              </div>
              <div className="text-stone-500 text-sm font-medium">Belum ada pergerakan inventori.</div>
            </div>

            {/* TABLE FOOTER / PAGINATION (KOSONG) */}
            <div className="w-full px-6 py-4 border-t border-stone-200 flex justify-between items-center bg-stone-50">
              <div className="text-stone-500 text-xs font-medium tracking-tight">Showing 0 of 0 batches</div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-stone-400 text-xs font-bold rounded-sm border border-stone-200 bg-white" disabled>Prev</button>
                <button className="px-3 py-1.5 text-stone-400 text-xs font-bold rounded-sm border border-stone-200 bg-white" disabled>Next</button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}