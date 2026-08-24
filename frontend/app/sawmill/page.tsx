import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";

export default function SawmillTrackingPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 font-['Manrope']">
      <Sidebar />

      <div className="pl-64 flex flex-col min-h-screen">
        <Header title="Sawmill Tracking" />

        <main className="max-w-[1024px] w-full p-6 mx-auto inline-flex flex-col justify-start items-start gap-4">
          
          {/* STATS WIDGETS */}
          <div className="self-stretch pb-4 grid grid-cols-4 gap-4">
            <StatCard title="ACTIVE BATCHES" value="0" bgColor="bg-lime-100" iconColor="bg-lime-800" />
            <StatCard title="AVG. CUT TIME" value="0m" bgColor="bg-orange-100" iconColor="bg-yellow-800" />
            <StatCard title="COMPLETED TODAY" value="0" bgColor="bg-slate-100" iconColor="bg-stone-600" />
            <StatCard title="MAINTENANCE" value="0" bgColor="bg-rose-100" iconColor="bg-red-700" />
          </div>

          {/* TABLE ACTIONS & FILTERS */}
          <div className="self-stretch p-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex justify-between items-center shadow-sm">
            <div className="flex justify-start items-center gap-4">
              <div className="flex justify-start items-center gap-2">
                <div className="h-3 justify-center text-stone-700 text-xs font-semibold leading-3 tracking-tight">
                  Filter by Date:
                </div>
                <div className="px-3 py-1.5 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300 cursor-pointer">
                  <span className="text-stone-500 text-sm">mm / dd / yyyy</span>
                </div>
              </div>
              <div className="flex justify-start items-center gap-2">
                <div className="h-3 justify-center text-stone-700 text-xs font-semibold leading-3 tracking-tight">
                  Log Grade:
                </div>
                <select className="px-3 py-1.5 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300 text-stone-900 text-sm cursor-pointer">
                  <option>All Grades</option>
                  <option>Grade A</option>
                  <option>Grade B</option>
                </select>
              </div>
            </div>
            <div className="flex justify-start items-start gap-2">
              <button className="px-4 py-2 bg-red-50 hover:bg-red-100 transition-colors rounded-sm outline outline-1 outline-offset-[-1px] outline-red-200 flex justify-start items-center gap-2">
                <span className="text-stone-900 text-sm font-medium leading-5">Export PDF</span>
              </button>
              <button className="px-4 py-2 bg-lime-800 hover:bg-lime-900 transition-colors rounded-sm flex justify-start items-center gap-2">
                <span className="text-white text-sm font-bold leading-5">+ New Batch</span>
              </button>
            </div>
          </div>

          {/* TABLE AREA */}
          <div className="self-stretch bg-white rounded-lg shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start overflow-hidden">
            <div className="self-stretch flex flex-col justify-start items-start overflow-hidden">
              <div className="self-stretch bg-stone-100 border-b border-stone-300 inline-flex justify-start items-start">
                <div className="w-40 px-6 py-4"><div className="h-3 text-stone-700 text-xs font-semibold uppercase leading-3 tracking-wide">BATCH ID</div></div>
                <div className="w-56 px-6 py-4"><div className="h-3 text-stone-700 text-xs font-semibold uppercase leading-3 tracking-wide">LOG SPECIES</div></div>
                <div className="w-52 px-6 py-4"><div className="h-3 text-stone-700 text-xs font-semibold uppercase leading-3 tracking-wide">DIMENSIONS</div></div>
                <div className="w-36 px-6 py-4"><div className="h-3 text-stone-700 text-xs font-semibold uppercase leading-3 tracking-wide">OPERATOR</div></div>
                <div className="w-36 px-6 py-4"><div className="h-3 text-stone-700 text-xs font-semibold uppercase leading-3 tracking-wide">STATUS</div></div>
                <div className="flex-1 px-6 py-4 flex justify-end"><div className="h-3 text-stone-700 text-xs font-semibold uppercase leading-3 tracking-wide">ACTIONS</div></div>
              </div>
              
              <div className="self-stretch py-16 flex flex-col justify-center items-center bg-neutral-50/30">
                <div className="size-12 mb-3 bg-stone-200 rounded-full flex justify-center items-center">
                  <div className="size-6 bg-stone-400 rounded-sm" />
                </div>
                <div className="text-stone-500 text-sm font-medium">Belum ada data batch sawmill.</div>
                <div className="text-stone-400 text-xs mt-1">Klik "New Batch" untuk mulai mencatat.</div>
              </div>
            </div>

            <div className="self-stretch px-6 py-4 bg-stone-50 border-t border-stone-300 inline-flex justify-between items-center">
              <div className="inline-flex flex-col justify-start items-start">
                <div className="h-3 justify-center text-stone-500 text-xs font-medium leading-3 tracking-tight">Showing 0 of 0 batches</div>
              </div>
              <div className="flex justify-start items-center gap-2">
                <button className="px-3 py-1.5 text-stone-400 text-xs font-medium rounded-sm border border-stone-200" disabled>Previous</button>
                <button className="px-3 py-1.5 text-stone-400 text-xs font-medium rounded-sm border border-stone-200" disabled>Next</button>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="self-stretch pt-4 grid grid-cols-3 gap-6">
            <div className="col-span-2 px-4 pt-4 pb-6 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col gap-4 shadow-sm">
              <div className="inline-flex justify-between items-center w-full">
                <div className="text-stone-900 text-lg font-semibold leading-7">Production Output (Last 7 Days)</div>
                <div className="flex justify-start items-start gap-3">
                  <div className="flex justify-start items-center gap-1.5">
                    <div className="size-3 bg-lime-800 rounded-sm" />
                    <div className="text-stone-700 text-xs font-normal">High Quality</div>
                  </div>
                  <div className="flex justify-start items-center gap-1.5">
                    <div className="size-3 bg-yellow-800 rounded-sm" />
                    <div className="text-stone-700 text-xs font-normal">Standard</div>
                  </div>
                </div>
              </div>
              <div className="h-48 px-4 py-2 bg-stone-50 rounded-sm flex justify-around items-end gap-4 overflow-hidden border border-stone-200">
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
                <div className="flex-1 h-0 bg-lime-800/20 rounded-t-sm" />
              </div>
              <div className="px-4 flex justify-around items-start text-stone-500 text-[10px] font-medium">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start shadow-sm">
              <div className="pb-4 w-full border-b border-stone-100">
                <div className="text-stone-900 text-lg font-semibold leading-7">Process Alert</div>
              </div>
              <div className="w-full py-8 flex flex-col justify-center items-center gap-3">
                <div className="size-14 bg-lime-100 rounded-full inline-flex justify-center items-center mb-2">
                  <div className="size-6 bg-lime-600 rounded-full" />
                </div>
                <div className="text-center text-stone-900 text-sm font-bold">All Systems Normal</div>
                <div className="text-center text-stone-500 text-xs">Tidak ada jadwal maintenance mesin atau peringatan proses saat ini.</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}