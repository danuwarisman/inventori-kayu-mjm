import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function CashflowDashboardPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 font-['Manrope']">
      {/* SIDEBAR KOMPONEN */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* HEADER KOMPONEN */}
        <Header title="Cashflow Dashboard" />

        <main className="max-w-[1440px] w-full p-8 mx-auto flex flex-col justify-start items-start gap-6">
          
          {/* HERO IMAGE PLACEHOLDER */}
          <div className="w-full bg-stone-100 rounded-lg shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-center items-center overflow-hidden h-72">
            <span className="text-stone-400 font-medium text-lg">Hero Banner / Image Placeholder</span>
          </div>

          {/* TOP FINANCIAL STATS (3 CARDS) */}
          <div className="w-full grid grid-cols-3 gap-6">
            {/* TOTAL REVENUE */}
            <div className="min-h-40 p-6 relative bg-white rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start overflow-hidden">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-start">
                  <div className="text-stone-700 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">TOTAL REVENUE</div>
                  <div className="size-8 bg-green-200 rounded-lg flex justify-center items-center">
                    <div className="w-3 h-2.5 bg-lime-950 rounded-sm" />
                  </div>
                </div>
                <div className="text-stone-900 text-3xl font-bold leading-8">$0</div>
              </div>
              <div className="w-full pt-4 flex justify-between items-center">
                <div className="px-2 py-1 bg-gray-100 rounded-sm flex items-center gap-1.5">
                  <div className="w-3 h-1.5 bg-green-800 rounded-sm" />
                  <div className="text-green-800 text-xs font-medium leading-4">0% vs last month</div>
                </div>
                <button className="text-neutral-500 text-xs font-medium hover:text-stone-700 transition-colors">Detail</button>
              </div>
              <div className="w-1 h-full left-0 top-0 absolute bg-lime-950" />
            </div>

            {/* NET PROFIT */}
            <div className="min-h-40 p-6 relative bg-white rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start overflow-hidden">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-start">
                  <div className="text-stone-700 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">NET PROFIT</div>
                  <div className="size-8 bg-sky-100 rounded-lg flex justify-center items-center">
                    <div className="w-3 h-2.5 bg-cyan-800 rounded-sm" />
                  </div>
                </div>
                <div className="text-stone-900 text-3xl font-bold leading-8">$0</div>
              </div>
              <div className="w-full pt-4 flex justify-between items-center">
                <div className="px-2 py-1 bg-gray-100 rounded-sm flex items-center gap-1.5">
                  <div className="w-3 h-1.5 bg-green-800 rounded-sm" />
                  <div className="text-green-800 text-xs font-medium leading-4">0% vs last month</div>
                </div>
                <button className="text-neutral-500 text-xs font-medium hover:text-stone-700 transition-colors">Detail</button>
              </div>
              <div className="w-1 h-full left-0 top-0 absolute bg-lime-950" />
            </div>

            {/* TOTAL EXPENSES */}
            <div className="min-h-40 p-6 relative bg-white rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start overflow-hidden">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-start">
                  <div className="text-stone-700 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">TOTAL EXPENSES</div>
                  <div className="size-8 bg-red-100 rounded-lg flex justify-center items-center">
                    <div className="w-3 h-2.5 bg-red-700 rounded-sm" />
                  </div>
                </div>
                <div className="text-stone-900 text-3xl font-bold leading-8">$0</div>
              </div>
              <div className="w-full pt-4 flex justify-between items-center">
                <div className="px-2 py-1 bg-red-50 rounded-sm flex items-center gap-1.5">
                  <div className="w-3 h-1.5 bg-red-700 rounded-sm" />
                  <div className="text-red-700 text-xs font-medium leading-4">0% vs last month</div>
                </div>
                <button className="text-neutral-500 text-xs font-medium hover:text-stone-700 transition-colors">Detail</button>
              </div>
              <div className="w-1 h-full left-0 top-0 absolute bg-red-800" />
            </div>
          </div>

          {/* MAIN CHARTS AND SIDE WIDGETS */}
          <div className="w-full grid grid-cols-3 gap-6">
            
            {/* CASHFLOW TREND CHART */}
            <div className="col-span-2 min-h-96 p-6 bg-white rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col">
              <div className="w-full pb-6 flex justify-between items-center">
                <div className="text-stone-900 text-xl font-bold leading-7">Cashflow Trend</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="size-3 bg-lime-900 rounded-full" />
                    <div className="text-stone-700 text-xs font-normal leading-4">Income</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 bg-red-800 rounded-full" />
                    <div className="text-stone-700 text-xs font-normal leading-4">Expenses</div>
                  </div>
                </div>
              </div>
              
              {/* EMPTY CHART AREA */}
              <div className="flex-1 w-full flex flex-col justify-center items-center bg-stone-50 rounded-lg border border-stone-200 mt-2 min-h-[250px]">
                 <div className="text-stone-500 text-sm font-medium">Belum ada data Cashflow bulanan.</div>
                 <div className="text-stone-400 text-xs mt-1">Grafik akan muncul setelah transaksi tercatat di sistem.</div>
              </div>
            </div>

            {/* SIDE WIDGETS */}
            <div className="col-span-1 flex flex-col gap-5">
              
              {/* QUICK ACTIONS */}
              <div className="p-6 relative bg-neutral-600 rounded-2xl flex flex-col justify-center items-start shadow-md">
                <div className="pb-2 text-white text-xl font-bold leading-7">Quick Actions</div>
                <div className="pb-6 text-green-200 text-sm font-normal leading-5">Ready for the month-end review?</div>
                <button className="w-full py-3 bg-green-200 hover:bg-green-300 transition-colors rounded-lg outline outline-1 outline-green-300 flex justify-center items-center gap-2">
                  <div className="w-3.5 h-4 bg-green-900 rounded-sm" />
                  <span className="text-green-900 text-base font-semibold leading-6">Generate Financial Report</span>
                </button>
              </div>

              {/* ACCOUNTS RECEIVABLE */}
              <div className="p-5 bg-white rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-indigo-50 rounded-full flex justify-center items-center">
                    <div className="size-5 bg-blue-600 rounded-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-stone-700 text-xs font-normal font-['JetBrains_Mono'] uppercase tracking-wide">ACCOUNTS RECEIVABLE</div>
                    <div className="text-stone-900 text-xl font-bold leading-5">$0</div>
                  </div>
                </div>
                <button className="text-neutral-500 text-sm font-medium hover:text-stone-800 transition-colors">View All</button>
              </div>

              {/* PENDING INVOICES (ADDED FOR BALANCE) */}
              <div className="p-5 bg-white rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-rose-50 rounded-full flex justify-center items-center">
                    <div className="size-5 bg-red-600 rounded-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-stone-700 text-xs font-normal font-['JetBrains_Mono'] uppercase tracking-wide">PENDING INVOICES</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-stone-900 text-xl font-bold leading-5">0</span>
                      <span className="text-stone-500 text-xs">awaiting payment</span>
                    </div>
                  </div>
                </div>
                <button className="text-neutral-500 text-sm font-medium hover:text-stone-800 transition-colors">View All</button>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}