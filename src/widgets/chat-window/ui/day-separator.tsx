interface DaySeparatorProps {
  label: string;
}

export function DaySeparator({ label }: DaySeparatorProps) {
  return (
    <div className="sticky top-0 z-10 my-2 flex justify-center">
      <span className="rounded-lg bg-bubble-in px-3 py-1 text-xs text-meta uppercase shadow-sm">
        {label}
      </span>
    </div>
  );
}
