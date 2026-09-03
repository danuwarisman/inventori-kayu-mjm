interface StatCardProps {
  title: string;
  value: string;
  bgColor: string;
  iconColor: string;
}

export default function StatCard({ title, value, bgColor, iconColor }: StatCardProps) {
  return (
    <div className="h-20 p-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex justify-start items-center gap-4 shadow-sm">
      <div className={`size-12 rounded-md flex justify-center items-center ${bgColor}`}>
        <div className={`size-5 rounded-sm ${iconColor}`} />
      </div>
      <div className="inline-flex flex-col justify-start items-start">
        <div className="h-3 justify-center text-stone-700 text-[10px] font-semibold uppercase leading-3 tracking-tight">
          {title}
        </div>
        <div className="h-8 justify-center text-stone-900 text-2xl font-semibold leading-8">
          {value}
        </div>
      </div>
    </div>
  );
}