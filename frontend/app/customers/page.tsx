import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function CustomersDirectoryPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 font-['Manrope']">
      {/* SIDEBAR KOMPONEN */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* HEADER KOMPONEN */}
        <Header title="Customer Data Directory" />

        <main className="max-w-[1280px] w-full p-6 mx-auto flex flex-col justify-start items-start gap-8">
          
          {/* TITLE & TOP ACTIONS */}
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="text-neutral-800 text-2xl font-bold leading-8">
                Customer Analytics
              </div>
              <div className="text-neutral-500 text-sm font-normal leading-5">
                Manage global enterprise relationships and contract lifecycles.
              </div>
            </div>
            <div className="flex justify-start items-center gap-3">
              <button className="px-4 py-2 bg-white hover:bg-stone-50 transition-colors rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2 shadow-sm">
                {/* Export Icon Placeholder */}
                <div className="w-3.5 h-3.5 bg-yellow-800 rounded-sm" />
                <span className="text-center text-yellow-800 text-sm font-semibold leading-5">Export</span>
              </button>
              <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 transition-colors rounded-lg flex justify-start items-center gap-2 shadow-sm">
                {/* Add Icon Placeholder */}
                <div className="w-3.5 h-3.5 bg-white rounded-sm" />
                <span className="text-center text-white text-sm font-semibold leading-5">Add Customer</span>
              </button>
            </div>
          </div>

          {/* STATS & SMART ALERTS GRID */}
          <div className="w-full grid grid-cols-3 gap-6">
            
            {/* LEFT STATS COLUMN */}
            <div className="col-span-1 flex flex-col gap-4">
              
              <div className="p-4 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-neutral-200 flex flex-col gap-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-neutral-500 text-[10px] font-bold uppercase tracking-wide">MOST FREQUENT BUYER</div>
                  <div className="size-4 bg-yellow-800 rounded-sm" />
                </div>
                <div className="text-neutral-800 text-xl font-semibold leading-7">-</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-1.5 bg-stone-300 rounded-sm" />
                  <div className="text-stone-500 text-xs font-normal">0 Orders / YTD</div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-neutral-200 flex flex-col gap-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-neutral-500 text-[10px] font-bold uppercase tracking-wide">HIGHEST TOTAL</div>
                  <div className="size-4 bg-yellow-800 rounded-sm" />
                </div>
                <div className="text-neutral-800 text-xl font-semibold leading-7">$0</div>
                <div className="text-neutral-500 text-sm font-normal">-</div>
              </div>

              <div className="p-4 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-neutral-200 flex flex-col gap-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-neutral-500 text-[10px] font-bold uppercase tracking-wide">ACTIVE CUSTOMERS</div>
                  <div className="size-4 bg-yellow-800 rounded-sm" />
                </div>
                <div className="text-neutral-800 text-xl font-semibold leading-7">0</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-1.5 bg-stone-300 rounded-sm" />
                  <div className="text-stone-500 text-xs font-normal">0% vs Last Month</div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-neutral-200 flex flex-col gap-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-red-700 text-[10px] font-bold uppercase tracking-wide">OVERDUE PAYMENTS</div>
                  <div className="size-4 bg-red-700 rounded-sm" />
                </div>
                <div className="text-neutral-800 text-xl font-semibold leading-7">0 Alerts</div>
                <div className="text-red-700 text-xs font-normal">All payments are up to date</div>
              </div>

            </div>

            {/* RIGHT SMART ALERTS COLUMN */}
            <div className="col-span-2 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-neutral-200 flex flex-col overflow-hidden">
              <div className="p-5 bg-orange-50/50 border-b border-neutral-200 flex justify-between items-center">
                <div className="text-neutral-800 text-lg font-semibold leading-6">Smart Alerts</div>
                <div className="px-3 py-1 bg-stone-200 rounded-full">
                  <div className="text-stone-700 text-xs font-bold tracking-wide">0 New</div>
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-center items-center bg-stone-50/30">
                <div className="size-12 mb-3 bg-stone-200 rounded-full flex justify-center items-center">
                  <div className="size-6 bg-stone-400 rounded-sm" />
                </div>
                <div className="text-stone-500 text-sm font-medium">Tidak ada alert saat ini.</div>
                <div className="text-stone-400 text-xs mt-1">Peringatan kontrak dan pembayaran akan muncul di sini.</div>
              </div>
            </div>

          </div>

          {/* CUSTOMER DIRECTORY TABLE */}
          <div className="w-full bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-neutral-200 flex flex-col overflow-hidden">
            
            {/* SEARCH AND FILTER BAR */}
            <div className="p-4 bg-orange-50/30 border-b border-neutral-200 flex justify-start items-center">
              <div className="w-72 relative">
                <input 
                  type="text" 
                  placeholder="Filter customers..." 
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-200 text-sm focus:outline-lime-600"
                />
                <div className="absolute left-3 top-2.5 size-4 bg-stone-300 rounded-full" />
              </div>
            </div>

            {/* TABLE HEADER */}
            <div className="w-full bg-lime-50/50 border-b border-neutral-200 flex justify-start items-center px-6 py-4">
              <div className="w-24 text-neutral-500 text-[10px] font-bold uppercase tracking-wide">ID</div>
              <div className="w-48 text-neutral-500 text-[10px] font-bold uppercase tracking-wide">COMPANY</div>
              <div className="w-32 text-neutral-500 text-[10px] font-bold uppercase tracking-wide">TYPE</div>
              <div className="w-40 text-neutral-500 text-[10px] font-bold uppercase tracking-wide">TOTAL PURCHASES</div>
              <div className="w-24 text-neutral-500 text-[10px] font-bold uppercase tracking-wide">STATUS</div>
              <div className="w-28 text-neutral-500 text-[10px] font-bold uppercase tracking-wide">LOYALTY</div>
              <div className="flex-1 text-right text-neutral-500 text-[10px] font-bold uppercase tracking-wide">ACTIONS</div>
            </div>

            {/* TABLE BODY (EMPTY STATE) */}
            <div className="w-full py-16 flex flex-col justify-center items-center bg-neutral-50/30">
              <div className="size-12 mb-3 bg-stone-200 rounded-full flex justify-center items-center">
                <div className="size-6 bg-stone-400 rounded-sm" />
              </div>
              <div className="text-stone-500 text-sm font-medium">Belum ada data pelanggan.</div>
            </div>

            {/* PAGINATION (KOSONG) */}
            <div className="w-full px-6 py-4 border-t border-neutral-200 flex justify-between items-center bg-orange-50/30">
              <div className="text-neutral-500 text-xs font-medium">
                Showing 0 to 0 of 0 entries
              </div>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 text-stone-400 text-xs font-medium rounded-md border border-stone-200 bg-white" disabled>Prev</button>
                <button className="px-3 py-1 text-stone-400 text-xs font-medium rounded-md border border-stone-200 bg-white" disabled>Next</button>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}