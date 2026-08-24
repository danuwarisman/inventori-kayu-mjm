interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="px-6 py-3 bg-white/80 border-b border-slate-200 backdrop-blur-[6px] inline-flex justify-between items-center sticky top-0 z-40">
      <div className="flex justify-start items-center gap-2">
        <div className="inline-flex flex-col justify-start items-start">
          <div className="size-5 bg-lime-600 rounded-sm" />
        </div>
        <div className="inline-flex flex-col justify-start items-start">
          <div className="h-8 justify-center text-stone-900 text-2xl font-semibold leading-8">
            {title}
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center gap-4">
        <div className="relative inline-flex flex-col justify-start items-start">
          <div className="w-64 pl-10 pr-4 py-2 bg-orange-50 rounded-sm inline-flex justify-center items-start overflow-hidden">
            <input
              type="text"
              placeholder="Search batch ID..."
              className="flex-1 bg-transparent border-none outline-none text-stone-900 text-sm placeholder:text-gray-500"
            />
          </div>
          <div className="h-5 left-[12px] top-[10px] absolute flex flex-col justify-start items-start">
            <div className="size-3.5 bg-slate-400 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
}