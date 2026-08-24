import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function DryKilnPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 font-['Manrope']">
      {/* SIDEBAR KOMPONEN */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* HEADER KOMPONEN */}
        <Header title="Dry Kiln Monitoring" />

        <main className="max-w-[1024px] w-full p-6 mx-auto flex flex-col justify-start items-start gap-8">
          
          {/* STAGE TRACKER */}
          <div className="self-stretch px-10 py-8 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-center items-center shadow-sm">
            <div className="w-full max-w-[800px] relative inline-flex justify-between items-center">
              {/* Line Background */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-stone-200 z-0" />
              
              {/* Nodes */}
              <div className="relative z-10 flex flex-col justify-start items-center gap-3">
                <div className="size-10 bg-lime-800 rounded-xl shadow-sm outline outline-4 outline-white flex justify-center items-center">
                  <div className="size-3 bg-white rounded-full" />
                </div>
                <div className="text-lime-800 text-xs font-bold uppercase tracking-tight">SAWMILL</div>
              </div>
              <div className="relative z-10 flex flex-col justify-start items-center gap-3">
                <div className="size-10 bg-stone-200 rounded-xl outline outline-4 outline-white flex justify-center items-center">
                  <div className="size-3 bg-stone-400 rounded-full" />
                </div>
                <div className="text-stone-500 text-xs font-bold uppercase tracking-tight">PRA DRY KILN</div>
              </div>
              <div className="relative z-10 flex flex-col justify-start items-center gap-3">
                <div className="size-10 bg-stone-200 rounded-xl outline outline-4 outline-white flex justify-center items-center">
                  <div className="size-3 bg-stone-400 rounded-full" />
                </div>
                <div className="text-stone-500 text-xs font-bold uppercase tracking-tight">DRY KILN</div>
              </div>
              <div className="relative z-10 flex flex-col justify-start items-center gap-3">
                <div className="size-10 bg-stone-200 rounded-xl outline outline-4 outline-white flex justify-center items-center">
                  <div className="size-3 bg-stone-400 rounded-full" />
                </div>
                <div className="text-stone-500 text-xs font-bold uppercase tracking-tight">FINAL STOCK</div>
              </div>
            </div>
          </div>

          {/* PRA-DRY KILN STAGES */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="w-full flex justify-between items-center">
              <div className="flex justify-start items-center gap-2">
                <div className="size-3 bg-yellow-800 rounded-xl" />
                <div className="text-stone-900 text-xl font-semibold leading-7">Pra-Dry Kiln Stages</div>
              </div>
              <div className="px-3 py-1 bg-orange-100 rounded-xl">
                <div className="text-yellow-800 text-xs font-semibold tracking-tight">0 Batches Active</div>
              </div>
            </div>

            {/* EMPTY STATE PRA-DRY */}
            <div className="w-full py-12 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-center items-center shadow-sm">
              <div className="text-stone-500 text-sm font-medium">Belum ada batch di tahap Pra-Dry Kiln.</div>
            </div>
          </div>

          {/* DRY KILN FINAL STAGES & STATS */}
          <div className="w-full grid grid-cols-3 gap-6">
            
            {/* DRY KILN ACTIVE BATCHES */}
            <div className="col-span-2 flex flex-col gap-4">
              <div className="w-full flex justify-between items-center">
                <div className="flex justify-start items-center gap-2">
                  <div className="size-3 bg-lime-800 rounded-xl" />
                  <div className="text-stone-900 text-xl font-semibold leading-7">Dry Kiln Final Stages</div>
                </div>
                <div className="px-3 py-1 bg-lime-100 rounded-xl">
                  <div className="text-lime-800 text-xs font-semibold tracking-tight">0 Batches Active</div>
                </div>
              </div>

              {/* EMPTY STATE DRY KILN */}
              <div className="w-full h-full min-h-[160px] bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-center items-center shadow-sm">
                <div className="text-stone-500 text-sm font-medium">Belum ada batch di tahap Dry Kiln (Final).</div>
              </div>
            </div>

            {/* SIDE STATS */}
            <div className="col-span-1 flex flex-col justify-end gap-4 mt-11">
              <div className="p-5 bg-orange-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start shadow-sm">
                <div className="w-full h-1.5 bg-slate-300 rounded-full mb-4" />
                <div className="flex items-end gap-1">
                  <div className="text-stone-900 text-2xl font-semibold leading-8">0.0</div>
                  <div className="text-slate-500 text-sm font-normal mb-1">m³</div>
                </div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-tight mt-1">
                  TOTAL VOLUME IN KILN
                </div>
              </div>
              <div className="p-5 bg-orange-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start shadow-sm">
                <div className="w-full h-1.5 bg-slate-300 rounded-full mb-4" />
                <div className="flex items-end gap-1">
                  <div className="text-stone-900 text-2xl font-semibold leading-8">0.0</div>
                  <div className="text-slate-500 text-sm font-normal mb-1">%</div>
                </div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-tight mt-1">
                  ENERGY EFFICIENCY
                </div>
              </div>
            </div>
          </div>

          {/* BATCH MOVEMENT HISTORY */}
          <div className="w-full bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center">
              <div className="text-stone-900 text-xl font-semibold leading-7">Batch Movement History</div>
              <div className="flex justify-start items-start gap-3">
                <button className="px-4 py-1.5 rounded-sm outline outline-1 outline-stone-300 hover:bg-stone-50 text-stone-700 text-sm font-medium transition-colors">
                  Filter
                </button>
                <button className="px-4 py-1.5 rounded-sm outline outline-1 outline-stone-300 hover:bg-stone-50 text-stone-700 text-sm font-medium transition-colors">
                  Export
                </button>
              </div>
            </div>
            
            {/* TABLE HEADER */}
            <div className="bg-stone-50 border-b border-stone-200 flex justify-start items-start">
              <div className="w-32 px-6 py-4 text-stone-500 text-xs font-bold uppercase tracking-wider">BATCH ID</div>
              <div className="w-48 px-6 py-4 text-stone-500 text-xs font-bold uppercase tracking-wider">SPECIES</div>
              <div className="w-32 px-6 py-4 text-stone-500 text-xs font-bold uppercase tracking-wider">ENTRY DATE</div>
              <div className="w-32 px-6 py-4 text-stone-500 text-xs font-bold uppercase tracking-wider">STARTING MC</div>
              <div className="w-32 px-6 py-4 text-stone-500 text-xs font-bold uppercase tracking-wider">TARGET MC</div>
              <div className="w-36 px-6 py-4 text-stone-500 text-xs font-bold uppercase tracking-wider">STATUS</div>
              <div className="flex-1 px-6 py-4 text-right text-stone-500 text-xs font-bold uppercase tracking-wider">ACTION</div>
            </div>
            
            {/* TABLE BODY (EMPTY STATE) */}
            <div className="w-full py-16 flex flex-col justify-center items-center bg-neutral-50/30">
              <div className="size-12 mb-3 bg-stone-200 rounded-full flex justify-center items-center">
                <div className="size-6 bg-stone-400 rounded-sm" />
              </div>
              <div className="text-stone-500 text-sm font-medium">Belum ada riwayat pergerakan batch.</div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}