export default function Sidebar() {
  return (
    <aside className="w-64 fixed h-full py-6 left-0 top-0 bg-slate-50 border-r border-slate-200 inline-flex flex-col justify-between items-start z-50">
      <div className="self-stretch pb-8 flex flex-col justify-start items-start">
        <div className="self-stretch px-6 flex flex-col justify-start items-start">
          <div className="self-stretch flex flex-col justify-start items-start">
            <div className="self-stretch justify-center text-lime-600 text-lg font-bold leading-7">
              MargiJatiMakmur
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start">
            <div className="self-stretch justify-center text-slate-500 text-[10px] font-bold uppercase leading-4 tracking-wide">
              INVENTORY CONTROL
            </div>
          </div>
        </div>
      </div>
      <nav className="self-stretch flex-1 px-3 flex flex-col justify-start items-start gap-1">
        <div className="self-stretch px-3 py-2 inline-flex justify-start items-center gap-3 cursor-pointer hover:bg-slate-100 rounded-md">
          <div className="inline-flex flex-col justify-start items-start">
            <div className="size-4 bg-slate-400 rounded-sm" />
          </div>
          <div className="inline-flex flex-col justify-start items-start">
            <div className="w-16 h-5 justify-center text-slate-600 text-sm font-semibold leading-5">
              Dashboard
            </div>
          </div>
        </div>
        <div className="self-stretch px-3 py-2 bg-lime-600/10 border-r-4 border-lime-600 inline-flex justify-start items-center gap-3 cursor-pointer">
          <div className="inline-flex flex-col justify-start items-start">
            <div className="size-5 bg-lime-600 rounded-sm" />
          </div>
          <div className="inline-flex flex-col justify-start items-start">
            <div className="w-32 h-5 justify-center text-lime-600 text-sm font-semibold leading-5">
              Sawmill Tracking
            </div>
          </div>
        </div>
        <div className="self-stretch px-3 py-2 inline-flex justify-start items-center gap-3 cursor-pointer hover:bg-slate-100 rounded-md">
          <div className="inline-flex flex-col justify-start items-start">
            <div className="size-4 bg-slate-400 rounded-sm" />
          </div>
          <div className="inline-flex flex-col justify-start items-start">
            <div className="w-16 h-5 justify-center text-slate-600 text-sm font-semibold leading-5">
              Dry Kiln
            </div>
          </div>
        </div>
        <div className="self-stretch px-3 py-2 inline-flex justify-start items-center gap-3 cursor-pointer hover:bg-slate-100 rounded-md">
          <div className="inline-flex flex-col justify-start items-start">
            <div className="size-4 bg-slate-400 rounded-sm" />
          </div>
          <div className="inline-flex flex-col justify-start items-start">
            <div className="w-24 h-5 justify-center text-slate-600 text-sm font-semibold leading-5">
              Stock Reports
            </div>
          </div>
        </div>
        <div className="self-stretch px-3 py-2 inline-flex justify-start items-center gap-3 cursor-pointer hover:bg-slate-100 rounded-md">
          <div className="inline-flex flex-col justify-start items-start">
            <div className="size-4 bg-slate-400 rounded-sm" />
          </div>
          <div className="inline-flex flex-col justify-start items-start">
            <div className="w-16 h-5 justify-center text-slate-600 text-sm font-semibold leading-5">
              Settings
            </div>
          </div>
        </div>
      </nav>
      <div className="self-stretch px-6 pt-6 border-t border-slate-200 inline-flex justify-start items-center gap-3">
        <div className="size-10 relative rounded-xl border-2 border-lime-800/20 bg-slate-200" />
        <div className="inline-flex flex-col justify-start items-start">
          <div className="self-stretch flex flex-col justify-start items-start">
            <div className="h-4 justify-center text-stone-900 text-xs font-bold leading-4">
              Admin User
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start">
            <div className="h-3.5 justify-center text-slate-500 text-[10px] font-normal leading-4">
              Admin Lapangan
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}