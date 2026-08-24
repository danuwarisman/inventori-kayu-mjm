import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 font-['Manrope']">
      {/* SIDEBAR KOMPONEN */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* HEADER KOMPONEN */}
        <Header title="Dashboard" />

        <main className="max-w-[1024px] w-full p-6 mx-auto flex flex-col justify-start items-start gap-6">
          
          {/* TOP STATS WIDGETS */}
          <div className="w-full grid grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start shadow-sm h-36">
              <div className="w-full pb-2 flex justify-between items-start">
                <div className="text-stone-700 text-[10px] font-semibold uppercase leading-3 tracking-wider">
                  TOTAL TEAK STOCK
                </div>
                <div className="p-1.5 bg-lime-100 rounded-md">
                  <div className="size-4 bg-lime-800 rounded-sm" />
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1.5">
                <div className="flex items-end gap-1">
                  <div className="text-stone-900 text-3xl font-bold leading-none">0</div>
                  <div className="text-stone-500 text-sm font-medium mb-1">m³</div>
                </div>
                <div className="inline-flex justify-start items-center gap-1.5">
                  <div className="w-2.5 h-1.5 bg-stone-300 rounded-sm" />
                  <div className="text-stone-500 text-[10px] font-semibold tracking-tight">
                    0% from last month
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start shadow-sm h-36">
              <div className="w-full pb-2 flex justify-between items-start">
                <div className="text-stone-700 text-[10px] font-semibold uppercase leading-3 tracking-wider">
                  IN SAWMILL
                </div>
                <div className="p-1.5 bg-stone-100 rounded-md">
                  <div className="size-4 bg-lime-700 rounded-sm" />
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-2">
                <div className="flex items-end gap-1">
                  <div className="text-stone-900 text-3xl font-bold leading-none">0</div>
                  <div className="text-stone-500 text-sm font-medium mb-1">Logs</div>
                </div>
                <div className="px-2 py-0.5 rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300">
                  <div className="text-stone-500 text-[9px] font-bold uppercase">
                    ACTIVE PROCESSING
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start shadow-sm h-36">
              <div className="w-full pb-2 flex justify-between items-start">
                <div className="text-stone-700 text-[10px] font-semibold uppercase leading-3 tracking-wider">
                  PRA-DRY KILN
                </div>
                <div className="p-1.5 bg-orange-100 rounded-md">
                  <div className="size-4 bg-yellow-800 rounded-sm" />
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-2">
                <div className="flex items-end gap-1">
                  <div className="text-stone-900 text-3xl font-bold leading-none">0</div>
                  <div className="text-stone-500 text-sm font-medium mb-1">m³</div>
                </div>
                <div className="px-2 py-0.5 bg-stone-200 rounded-sm">
                  <div className="text-stone-600 text-[9px] font-bold uppercase">
                    MOISTURE: 0%
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start shadow-sm h-36">
              <div className="w-full pb-2 flex justify-between items-start">
                <div className="text-stone-700 text-[10px] font-semibold uppercase leading-3 tracking-wider">
                  DRY KILN (FINAL)
                </div>
                <div className="p-1.5 bg-lime-100 rounded-md">
                  <div className="size-4 bg-stone-600 rounded-sm" />
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-2">
                <div className="flex items-end gap-1">
                  <div className="text-stone-900 text-3xl font-bold leading-none">0</div>
                  <div className="text-stone-500 text-sm font-medium mb-1">m³</div>
                </div>
                <div className="px-2 py-0.5 bg-stone-100 rounded-sm">
                  <div className="text-stone-500 text-[9px] font-bold uppercase">
                    STABLE & READY
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: RECENT ACTIVITY & QUICK ENTRY */}
          <div className="w-full grid grid-cols-3 gap-6">
            {/* RECENT ACTIVITY */}
            <div className="col-span-2 px-6 pt-5 pb-6 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col shadow-sm h-[320px]">
              <div className="w-full flex justify-between items-center mb-4">
                <div className="text-stone-900 text-lg font-semibold">
                  Recent Activity
                </div>
                <button className="text-lime-800 text-xs font-semibold hover:underline">
                  View All Movement
                </button>
              </div>
              
              {/* TABLE HEADER */}
              <div className="w-full pb-2 border-b border-stone-200 flex justify-between items-center">
                <div className="w-1/4 text-stone-500 text-[10px] font-semibold tracking-tight">BATCH ID</div>
                <div className="w-2/4 text-stone-500 text-[10px] font-semibold tracking-tight">DESCRIPTION</div>
                <div className="w-1/4 text-stone-500 text-[10px] font-semibold tracking-tight">STAGE</div>
                <div className="w-1/4 text-right text-stone-500 text-[10px] font-semibold tracking-tight">TIMESTAMP</div>
              </div>

              {/* EMPTY STATE */}
              <div className="w-full h-full flex flex-col justify-center items-center opacity-70">
                <div className="size-10 mb-2 bg-stone-100 rounded-full flex justify-center items-center">
                  <div className="size-4 bg-stone-300 rounded-sm" />
                </div>
                <div className="text-stone-500 text-sm font-medium">Belum ada aktivitas.</div>
                <div className="text-stone-400 text-xs mt-1">Data perpindahan log akan muncul di sini.</div>
              </div>
            </div>

            {/* QUICK ENTRY & STOCK HEALTH */}
            <div className="col-span-1 flex flex-col gap-6">
              {/* QUICK ENTRY */}
              <div className="px-5 py-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col gap-4 shadow-sm">
                <div className="text-stone-900 text-lg font-semibold">
                  Quick Entry
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-700 text-xs font-semibold tracking-tight">Log Diameter (cm)</label>
                    <input 
                      type="number" 
                      placeholder="0.0" 
                      className="w-full h-9 px-3 outline outline-1 outline-stone-300 rounded-sm text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-700 text-xs font-semibold tracking-tight">Wood Source</label>
                    <select className="w-full h-9 px-3 outline outline-1 outline-stone-300 rounded-sm text-sm text-stone-500 bg-white">
                      <option value="">Select Source...</option>
                    </select>
                  </div>
                  <button className="w-full h-9 mt-1 bg-lime-800 hover:bg-lime-900 transition-colors text-white text-sm font-bold rounded-sm flex justify-center items-center gap-2">
                    <div className="size-3 bg-white rounded-sm" />
                    Register New Log
                  </button>
                </div>
              </div>

              {/* STOCK HEALTH */}
              <div className="p-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col gap-2 shadow-sm">
                <div className="text-stone-900 text-lg font-semibold">Stock Health</div>
                <div className="pt-1 flex justify-between items-center">
                  <div className="text-stone-700 text-xs font-medium tracking-tight">Kiln Utilization</div>
                  <div className="text-stone-400 text-sm font-semibold">0%</div>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-xl overflow-hidden">
                  <div className="w-0 h-full bg-lime-800 rounded-xl" />
                </div>
                <button className="pt-2 flex justify-start items-center gap-1.5 text-stone-400 hover:text-stone-600 transition-colors">
                  <span className="text-xs font-bold tracking-tight">Optimize Dry Schedule</span>
                  <div className="size-2 bg-stone-400 rounded-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: VOLUME PROGRESSION & STORAGE MAP */}
          <div className="w-full grid grid-cols-3 gap-6">
            {/* VOLUME PROGRESSION */}
            <div className="col-span-2 p-6 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col gap-4 shadow-sm">
              <div className="text-stone-900 text-lg font-semibold">Volume Progression</div>
              
              {/* EMPTY BARS */}
              <div className="h-40 px-2 flex justify-center items-end gap-3 border-b border-stone-200">
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
              </div>
              <div className="text-stone-500 text-xs font-medium tracking-tight text-center mt-2">
                Belum ada data throughput mingguan.
              </div>
            </div>

            {/* STORAGE MAP */}
            <div className="col-span-1 p-6 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-4 shadow-sm">
              <div className="text-stone-900 text-lg font-semibold">Storage Map</div>
              <div className="text-stone-500 text-xs font-normal leading-5">
                Kapasitas gudang saat ini masih kosong. Data mapping akan muncul setelah log pertama didaftarkan.
              </div>
              <div className="flex justify-start items-start gap-2 mt-2">
                <div className="size-10 bg-stone-100 rounded-sm outline outline-1 outline-stone-200 flex justify-center items-center text-stone-400 font-bold">A</div>
                <div className="size-10 bg-stone-100 rounded-sm outline outline-1 outline-stone-200 flex justify-center items-center text-stone-400 font-bold">B</div>
                <div className="size-10 bg-stone-100 rounded-sm outline outline-1 outline-stone-200 flex justify-center items-center text-stone-400 font-bold">C</div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}