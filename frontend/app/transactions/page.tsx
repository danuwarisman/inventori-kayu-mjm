import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function TransactionsPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 font-['Manrope']">
      {/* SIDEBAR KOMPONEN */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* HEADER KOMPONEN */}
        <Header title="Transactions Log" />

        <main className="max-w-[1200px] w-full p-6 mx-auto flex flex-col justify-start items-start gap-8">
          
          {/* TOP ACTIONS & NEW TRANSACTION BUTTON */}
          <div className="w-full flex justify-end">
            <button className="px-6 py-3 bg-lime-600 hover:bg-lime-700 transition-colors rounded-xl shadow-md flex justify-start items-center gap-2">
              {/* Plus Icon Placeholder */}
              <div className="size-3.5 bg-white rounded-sm" />
              <span className="text-white text-base font-bold leading-6">New Transaction</span>
            </button>
          </div>

          {/* FILTERS & STATS WIDGET */}
          <div className="w-full flex justify-between items-start gap-6">
            
            {/* FILTERS */}
            <div className="flex-1 p-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex justify-start items-center gap-6 shadow-sm">
              <div className="flex flex-col gap-1">
                <label className="text-stone-700 text-xs font-semibold leading-3 mb-1">Date Range</label>
                <div className="px-3 py-1.5 bg-orange-50 rounded-sm outline outline-1 outline-stone-300 flex items-center gap-2 cursor-pointer hover:bg-orange-100 transition-colors">
                  <div className="size-3 bg-stone-900 rounded-sm" />
                  <span className="text-stone-900 text-sm font-medium">Select Date Range...</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-stone-700 text-xs font-semibold leading-3 mb-1">Type</label>
                <select className="px-3 py-1.5 bg-orange-50 rounded-sm outline outline-1 outline-stone-300 text-stone-900 text-sm font-medium cursor-pointer min-w-[120px] hover:bg-orange-100 transition-colors">
                  <option>All Types</option>
                  <option>Purchase</option>
                  <option>Sale</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-stone-700 text-xs font-semibold leading-3 mb-1">Status</label>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-1.5 bg-lime-800 hover:bg-lime-900 transition-colors rounded-sm text-white text-sm font-bold">All</button>
                  <button className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 transition-colors rounded-sm text-stone-900 text-sm font-semibold">Pending</button>
                  <button className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 transition-colors rounded-sm text-stone-900 text-sm font-semibold">Approved</button>
                </div>
              </div>

              <div className="flex-1 flex justify-end items-end h-full">
                <button className="px-4 py-2 mt-4 bg-yellow-800 hover:bg-yellow-900 transition-colors rounded-sm shadow-sm text-white text-sm font-bold flex items-center gap-2">
                  {/* Filter Icon Placeholder */}
                  <div className="size-2.5 bg-white rounded-sm" />
                  Advanced Filters
                </button>
              </div>
            </div>

            {/* TOTAL VOLUME CARD */}
            <div className="w-64 p-4 bg-lime-700 rounded-lg flex flex-col justify-between items-start shadow-sm h-[88px]">
              <div className="flex flex-col gap-1 w-full">
                <div className="opacity-80 text-yellow-50 text-[10px] font-bold uppercase tracking-widest">TOTAL VOLUME</div>
                <div className="text-yellow-50 text-xl font-bold leading-6 mt-1">0.0 m³</div>
              </div>
            </div>
            
          </div>

          {/* TRANSACTIONS TABLE */}
          <div className="w-full bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col overflow-hidden shadow-sm">
            
            {/* TABLE HEADER */}
            <div className="w-full bg-orange-50 border-b border-stone-300 flex justify-start items-center px-6 py-4">
              <div className="w-40 text-stone-700 text-xs font-bold uppercase tracking-wide">TRANSACTION ID</div>
              <div className="w-32 text-stone-700 text-xs font-bold uppercase tracking-wide">DATE</div>
              <div className="w-64 text-stone-700 text-xs font-bold uppercase tracking-wide">ENTITY (CUSTOMER/SUPPLIER)</div>
              <div className="w-32 text-stone-700 text-xs font-bold uppercase tracking-wide">TYPE</div>
              <div className="w-32 text-right text-stone-700 text-xs font-bold uppercase tracking-wide">AMOUNT</div>
              <div className="w-36 text-center text-stone-700 text-xs font-bold uppercase tracking-wide ml-4">STATUS</div>
              <div className="flex-1 text-right text-stone-700 text-xs font-bold uppercase tracking-wide">ACTIONS</div>
            </div>

            {/* TABLE BODY (EMPTY STATE) */}
            <div className="w-full py-16 flex flex-col justify-center items-center bg-neutral-50/30">
              <div className="size-12 mb-3 bg-stone-200 rounded-full flex justify-center items-center">
                <div className="size-6 bg-stone-400 rounded-sm" />
              </div>
              <div className="text-stone-500 text-sm font-medium">Belum ada transaksi yang dicatat.</div>
              <div className="text-stone-400 text-xs mt-1">Klik "New Transaction" untuk mencatat penjualan atau pembelian baru.</div>
            </div>

            {/* PAGINATION (KOSONG) */}
            <div className="w-full px-6 py-4 border-t border-stone-200 flex justify-between items-center bg-stone-50">
              <div className="tex   t-stone-700 text-xs font-medium tracking-tight">Showing 0 of 0 transactions</div>
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