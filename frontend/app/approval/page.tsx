import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function ApprovalPipelinePage() {
  return (
    <div className="relative min-h-screen bg-slate-50 font-['Manrope']">
      {/* SIDEBAR KOMPONEN */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* HEADER KOMPONEN */}
        <Header title="Approval Pipeline" />

        <main className="max-w-[1280px] w-full p-6 mx-auto flex flex-col justify-start items-start gap-8">
          
          {/* URGENT ALERT */}
          <div className="w-full p-6 bg-lime-800 rounded-lg shadow-sm outline outline-1 outline-lime-700 flex justify-between items-center">
            <div className="flex justify-start items-center gap-4">
              <div className="p-3 bg-lime-700 rounded-xl flex justify-center items-center">
                {/* Alert Icon Placeholder */}
                <div className="w-1 h-4 bg-yellow-50 rounded-sm" />
              </div>
              <div className="flex flex-col justify-start items-start">
                <div className="text-white text-base font-semibold leading-6">
                  0 Critical Approvals Pending
                </div>
                <div className="text-white/90 text-sm font-normal leading-5">
                  Saat ini tidak ada batch bernilai tinggi yang membutuhkan verifikasi segera.
                </div>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-white hover:bg-stone-100 transition-colors rounded-sm flex justify-center items-center">
              <span className="text-lime-800 text-sm font-bold leading-5">View All Urgent</span>
            </button>
          </div>

          {/* QUEUE STATS */}
          <div className="w-full grid grid-cols-3 gap-6">
            <div className="h-24 p-5 bg-white rounded-sm outline outline-1 outline-stone-300 flex justify-start items-center gap-4 shadow-sm">
              <div className="size-12 bg-stone-100 rounded-sm flex justify-center items-center">
                <div className="size-5 bg-lime-800 rounded-sm" />
              </div>
              <div className="flex flex-col">
                <div className="text-stone-700 text-xs font-medium leading-4 mb-1">Pending Logs</div>
                <div className="text-stone-900 text-2xl font-bold leading-8">0 Units</div>
              </div>
            </div>
            <div className="h-24 p-5 bg-white rounded-sm outline outline-1 outline-stone-300 flex justify-start items-center gap-4 shadow-sm">
              <div className="size-12 bg-orange-50 rounded-sm flex justify-center items-center">
                <div className="size-5 bg-yellow-800 rounded-sm" />
              </div>
              <div className="flex flex-col">
                <div className="text-stone-700 text-xs font-medium leading-4 mb-1">Production Batches</div>
                <div className="text-stone-900 text-2xl font-bold leading-8">0 Lots</div>
              </div>
            </div>
            <div className="h-24 p-5 bg-white rounded-sm outline outline-1 outline-stone-300 flex justify-start items-center gap-4 shadow-sm">
              <div className="size-12 bg-stone-100 rounded-sm flex justify-center items-center">
                <div className="size-5 bg-stone-600 rounded-sm" />
              </div>
              <div className="flex flex-col">
                <div className="text-stone-700 text-xs font-medium leading-4 mb-1">Sales Orders</div>
                <div className="text-stone-900 text-2xl font-bold leading-8">0 Pending</div>
              </div>
            </div>
          </div>

          {/* APPROVAL QUEUE LIST */}
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex justify-between items-center">
              <div className="text-stone-900 text-lg font-bold leading-6">
                Pending Verification Queue
              </div>
              <div className="flex justify-start items-start gap-2">
                <button className="px-4 py-1.5 rounded-sm outline outline-1 outline-stone-300 hover:bg-stone-50 text-stone-900 text-xs font-bold transition-colors">
                  Filter
                </button>
                <button className="px-4 py-1.5 rounded-sm outline outline-1 outline-stone-300 hover:bg-stone-50 text-stone-900 text-xs font-bold transition-colors">
                  Sort
                </button>
              </div>
            </div>

            {/* EMPTY STATE AREA */}
            <div className="w-full py-20 bg-white rounded-sm shadow-sm border border-stone-300 flex flex-col justify-center items-center">
              <div className="size-14 mb-4 bg-stone-100 rounded-full flex justify-center items-center">
                <div className="size-7 bg-stone-300 rounded-sm" />
              </div>
              <div className="text-stone-700 text-base font-bold">Antrean Approval Kosong</div>
              <div className="text-stone-500 text-sm mt-1">Bagus! Semua log, batch produksi, dan transaksi sudah diverifikasi.</div>
            </div>
          </div>

          {/* LIFECYCLE LEGEND (STATIC) */}
          <div className="w-full p-6 bg-orange-50 rounded-sm outline outline-1 outline-stone-300 flex flex-col items-center gap-6 mt-4">
            <div className="w-full text-stone-900 text-sm font-bold leading-5">
              Approval Lifecycle Legend
            </div>
            <div className="w-full max-w-[896px] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-lime-800 rounded-full flex justify-center items-center text-white text-xs font-bold">1</div>
                <div className="text-stone-900 text-xs font-bold">Sawmill Entry</div>
              </div>
              <div className="flex-1 h-px bg-stone-300 mx-4" />
              <div className="flex items-center gap-3">
                <div className="size-8 bg-yellow-800 rounded-full flex justify-center items-center text-white text-xs font-bold">2</div>
                <div className="text-stone-900 text-xs font-bold">Pra Dry Kiln</div>
              </div>
              <div className="flex-1 h-px bg-stone-300 mx-4" />
              <div className="flex items-center gap-3">
                <div className="size-8 bg-stone-500 rounded-full flex justify-center items-center text-white text-xs font-bold">3</div>
                <div className="text-stone-900 text-xs font-bold">Final Kiln Finish</div>
              </div>
              <div className="flex-1 h-px bg-stone-300 mx-4" />
              <div className="flex items-center gap-3">
                <div className="size-8 outline outline-2 outline-offset-[-2px] outline-lime-800 rounded-full flex justify-center items-center text-lime-800 text-xs font-bold">4</div>
                <div className="text-stone-900 text-xs font-bold">Sales Release</div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}