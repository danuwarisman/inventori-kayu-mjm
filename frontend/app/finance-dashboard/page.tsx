import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function FinanceDashboardPage() {
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
          <div className="w-full bg-white/0 rounded-lg shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start overflow-hidden">
            <div className="w-full h-48 bg-stone-200 flex justify-center items-center">
              <span className="text-stone-400 font-medium">Hero Image / Banner Placeholder</span>
            </div>
          </div>

          {/* TOP FINANCIAL STATS (3 CARDS) */}
          <div className="w-full grid grid-cols-3 gap-6">
            {/* TOTAL REVENUE */}
            <div className="min-h-40 p-6 relative bg-white rounded-lg shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start overflow-hidden">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-start">
                  <div className="text-stone-700 text-xs font-semibold uppercase leading-4 tracking-wide">TOTAL REVENUE</div>
                  <div className="p-1.5 bg-green-200 rounded-sm">
                    <div className="w-4 h-4 bg-green-900 rounded-sm" />
                  </div>
                </div>
                <div className="text-stone-900 text-3xl font-bold leading-8">$0</div>
              </div>
              <div className="w-full pt-4 flex justify-between items-end">
                <div className="px-2 py-1 bg-green-100 rounded-md flex items-center gap-1.5">
                  <div className="w-3 h-2 bg-stone-400 rounded-sm" />
                  <div className="text-stone-600 text-xs font-medium tracking-tight">0% vs last month</div>
                </div>
                <button className="text-green-900 text-xs font-bold hover:underline tracking-tight">Detail</button>
              </div>
              <div className="w-1 h-full left-0 top-0 absolute bg-green-900" />
            </div>

            {/* NET PROFIT */}
            <div className="min-h-40 p-6 relative bg-white rounded-lg shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start overflow-hidden">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-start">
                  <div className="text-stone-700 text-xs font-semibold uppercase leading-4 tracking-wide">NET PROFIT</div>
                  <div className="p-1.5 bg-violet-100 rounded-sm">
                    <div className="w-4 h-4 bg-stone-600 rounded-sm" />
                  </div>
                </div>
                <div className="text-stone-900 text-3xl font-bold leading-8">$0</div>
              </div>
              <div className="w-full pt-4 flex justify-between items-end">
                <div className="px-2 py-1 bg-stone-100 rounded-md flex items-center gap-1.5">
                  <div className="w-3 h-2 bg-stone-400 rounded-sm" />
                  <div className="text-stone-600 text-xs font-medium tracking-tight">0% vs last month</div>
                </div>
                <button className="text-green-900 text-xs font-bold hover:underline tracking-tight">Detail</button>
              </div>
              <div className="w-1 h-full left-0 top-0 absolute bg-stone-600" />
            </div>

            {/* TOTAL EXPENSES */}
            <div className="min-h-40 p-6 relative bg-white rounded-lg shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-between items-start overflow-hidden">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-start">
                  <div className="text-stone-700 text-xs font-semibold uppercase leading-4 tracking-wide">TOTAL EXPENSES</div>
                  <div className="p-1.5 bg-rose-200 rounded-sm">
                    <div className="w-4 h-4 bg-red-700 rounded-sm" />
                  </div>
                </div>
                <div className="text-stone-900 text-3xl font-bold leading-8">$0</div>
              </div>
              <div className="w-full pt-4 flex justify-between items-end">
                <div className="px-2 py-1 bg-rose-100 rounded-md flex items-center gap-1.5">
                  <div className="w-3 h-2 bg-red-400 rounded-sm" />
                  <div className="text-red-700 text-xs font-medium tracking-tight">0% vs last month</div>
                </div>
                <button className="text-green-900 text-xs font-bold hover:underline tracking-tight">Detail</button>
              </div>
              <div className="w-1 h-full left-0 top-0 absolute bg-red-700" />
            </div>
          </div>

          {/* MAIN CHARTS AND SIDE WIDGETS */}
          <div className="w-full grid grid-cols-3 gap-6">
            
            {/* CASHFLOW TREND CHART */}
            <div className="col-span-2 min-h-96 p-6 bg-white rounded-lg shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col">
              <div className="w-full pb-4 flex justify-between items-center border-b border-stone-100 mb-4">
                <div className="text-stone-900 text-xl font-bold leading-7">Cashflow Trend</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-900 rounded-full" />
                    <div className="text-stone-900 text-xs font-semibold tracking-tight">Income</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-700 rounded-full" />
                    <div className="text-stone-900 text-xs font-semibold tracking-tight">Expenses</div>
                  </div>
                </div>
              </div>
              
              {/* EMPTY CHART AREA */}
              <div className="flex-1 w-full flex flex-col justify-center items-center bg-stone-50 rounded-md border border-stone-200">
                 <div className="text-stone-500 text-sm font-medium">Belum ada data Cashflow.</div>
                 <div className="text-stone-400 text-xs mt-1">Grafik akan muncul setelah transaksi tercatat.</div>
              </div>
            </div>

            {/* SIDE WIDGETS */}
            <div className="col-span-1 flex flex-col gap-6">
              
              {/* QUICK ACTIONS */}
              <div className="p-6 bg-stone-800 rounded-lg shadow-sm flex flex-col gap-4">
                <div className="text-white text-xl font-bold leading-7">Quick Actions</div>
                <div className="text-stone-300 text-sm font-normal leading-5">Ready for the month-end review?</div>
                <button className="w-full py-3 bg-lime-200 hover:bg-lime-300 transition-colors rounded-sm shadow-sm flex justify-center items-center gap-2">
                  <div className="w-4 h-4 bg-stone-900 rounded-sm" />
                  <span className="text-stone-900 text-xs font-bold tracking-tight">Generate Financial Report</span>
                </button>
              </div>

              {/* PENDING INVOICES */}
              <div className="p-5 bg-white rounded-lg shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-stone-100 rounded-xl flex justify-center items-center">
                    <div className="w-5 h-5 bg-stone-600 rounded-sm" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-stone-700 text-xs font-semibold tracking-tight mb-1">Pending Invoices</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-stone-900 text-lg font-bold leading-6">0</span>
                      <span className="text-stone-500 text-xs">awaiting payment</span>
                    </div>
                  </div>
                </div>
                <button className="text-lime-800 text-xs font-bold hover:underline tracking-tight">View All</button>
              </div>

              {/* ACCOUNTS RECEIVABLE */}
              <div className="p-5 bg-white rounded-lg shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-stone-100 rounded-xl flex justify-center items-center">
                    <div className="w-5 h-5 bg-stone-600 rounded-sm" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-stone-700 text-xs font-semibold tracking-tight mb-1">Accounts Receivable</div>
                    <div className="text-stone-900 text-lg font-bold leading-6">$0</div>
                  </div>
                </div>
                <button className="text-lime-800 text-xs font-bold hover:underline tracking-tight">View All</button>
              </div>

              {/* TAX ESTIMATES */}
              <div className="p-5 bg-white rounded-lg shadow-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col gap-3">
                <div className="w-full flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-4 bg-stone-700 rounded-sm" />
                    <div className="text-stone-700 text-xs font-semibold tracking-tight">Tax Estimates</div>
                  </div>
                  <button className="text-lime-800 text-xs font-bold hover:underline tracking-tight">View</button>
                </div>
                <div className="text-stone-900 text-xl font-bold leading-7">$0</div>
                <div className="w-full h-1.5 bg-stone-100 rounded-xl overflow-hidden mt-1">
                  <div className="w-0 h-1.5 bg-stone-600" />
                </div>
                <div className="text-stone-500 text-xs font-medium tracking-tight">0% reserved of estimated total</div>
              </div>

              {/* ADD WIDGET BUTTON */}
              <button className="h-20 bg-stone-100 hover:bg-stone-200 transition-colors rounded-lg outline outline-1 outline-dashed outline-offset-[-1px] outline-stone-300 flex justify-center items-center text-stone-500 text-sm font-bold tracking-tight shadow-sm">
                + Add Widget
              </button>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}