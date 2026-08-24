import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function MasterDataPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 font-['Manrope']">
      {/* SIDEBAR KOMPONEN */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* HEADER KOMPONEN */}
        <Header title="Master Data Inventory" />

        <main className="max-w-[1200px] w-full p-6 mx-auto flex flex-col gap-8">
          
          {/* TOP ACTIONS & FILTERS */}
          <div className="w-full flex justify-between items-end">
            <div className="flex justify-start items-center gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-stone-500 text-[10px] font-bold uppercase tracking-wide">
                  GRADE FILTER
                </label>
                <select className="h-10 px-3 bg-white rounded-sm outline outline-1 outline-stone-300 text-stone-900 text-sm cursor-pointer min-w-[140px]">
                  <option>All Grades</option>
                  <option>Grade A</option>
                  <option>Grade B</option>
                  <option>Grade C</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-stone-500 text-[10px] font-bold uppercase tracking-wide">
                  SIZE CATEGORY
                </label>
                <select className="h-10 px-3 bg-white rounded-sm outline outline-1 outline-stone-300 text-stone-900 text-sm cursor-pointer min-w-[140px]">
                  <option>All Sizes</option>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
              <button className="mt-5 size-10 bg-rose-50 hover:bg-rose-100 transition-colors rounded-sm outline outline-1 outline-lime-800/20 flex justify-center items-center">
                {/* Filter Icon Placeholder */}
                <div className="w-4 h-3 bg-lime-800 rounded-sm" />
              </button>
            </div>
            
            <button className="h-10 px-6 bg-lime-800 hover:bg-lime-900 transition-colors rounded-sm shadow-sm flex justify-center items-center gap-2">
              {/* Plus Icon Placeholder */}
              <div className="size-2.5 bg-white rounded-sm" />
              <span className="text-white text-sm font-bold">Add New Wood Batch</span>
            </button>
          </div>

          {/* TABLE AREA */}
          <div className="w-full bg-white rounded-lg outline outline-1 outline-stone-300 flex flex-col overflow-hidden shadow-sm">
            
            {/* TABLE HEADER */}
            <div className="w-full bg-stone-100 border-b border-stone-300 flex justify-start items-center px-6 py-4">
              <div className="w-48 text-stone-900 text-xs font-bold uppercase tracking-wide">WOOD TYPE</div>
              <div className="w-48 text-stone-900 text-xs font-bold uppercase tracking-wide">SIZE (L X W X T)</div>
              <div className="w-24 text-stone-900 text-xs font-bold uppercase tracking-wide">GRADE</div>
              <div className="w-32 text-stone-900 text-xs font-bold uppercase tracking-wide">QUANTITY</div>
              <div className="w-32 text-stone-900 text-xs font-bold uppercase tracking-wide">STATUS</div>
              <div className="w-40 text-stone-900 text-xs font-bold uppercase tracking-wide">LAST UPDATED</div>
              <div className="flex-1 text-right text-stone-900 text-xs font-bold uppercase tracking-wide">ACTIONS</div>
            </div>

            {/* TABLE BODY (EMPTY STATE) */}
            <div className="w-full py-16 flex flex-col justify-center items-center bg-neutral-50/30">
              <div className="size-12 mb-3 bg-stone-200 rounded-full flex justify-center items-center">
                <div className="size-6 bg-stone-400 rounded-sm" />
              </div>
              <div className="text-stone-500 text-sm font-medium">Belum ada data master kayu.</div>
              <div className="text-stone-400 text-xs mt-1">Klik "Add New Wood Batch" untuk menambahkan data baru.</div>
            </div>

            {/* PAGINATION (KOSONG) */}
            <div className="w-full px-6 py-4 border-t border-stone-200 flex justify-between items-center bg-stone-50">
              <div className="text-stone-500 text-xs font-medium tracking-tight">Showing 0 of 0 entries</div>
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