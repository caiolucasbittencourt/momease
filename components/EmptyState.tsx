export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-stone-50 px-4 py-6 text-sm text-stone-600">
      {children}
    </div>
  );
}
