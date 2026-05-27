type Props = { title: string; desc: string; action?: React.ReactNode };

export default function EmptyState({ title, desc, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-[#eef4ff] grid place-items-center mb-4">
        <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-[#0866ff] fill-none stroke-[2] [stroke-linecap:round] [stroke-linejoin:round]">
          <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
        </svg>
      </div>
      <h3 className="text-lg font-black text-[#121826] mb-2">{title}</h3>
      <p className="text-[#687589] text-sm leading-[1.6] max-w-[380px] mb-6">{desc}</p>
      {action}
    </div>
  );
}
