export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-stone-300 px-4 py-6 text-sm text-stone-600">
      {children}
    </div>
  );
}
