import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export type NavItem = { id: string; label: string; icon: string };
export type StatItem = { label: string; value: string; trend: string };
export type TableItem = { id: string; name: string; status: string; owner: string; updatedAt: string };

export function Sidebar({ appName, items }: { appName: string; items: NavItem[] }) {
  return (
    <aside className="w-full lg:w-64 border-r border-slate-800 bg-slate-900/70 p-4">
      <h2 className="text-lg font-semibold text-indigo-300">{appName}</h2>
      <nav className="mt-4 space-y-1">
        {items.map((item) => (
          <button key={item.id} className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export function Topbar({ onSearch, dark, toggleDark }: { onSearch: (value: string) => void; dark: boolean; toggleDark: () => void }) {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-800 bg-slate-900/60 px-4 py-3">
      <input
        type="search"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full md:w-80 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
      />
      <div className="flex items-center gap-2">
        <button onClick={toggleDark} className="rounded-md border border-slate-700 px-3 py-2 text-sm">{dark ? '🌙 Dark' : '☀️ Light'}</button>
        <button className="rounded-full bg-indigo-500 px-3 py-2 text-xs font-medium">User ▾</button>
      </div>
    </header>
  );
}

export function DashboardCards({ items }: { items: StatItem[] }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
      {items.map((item) => (
        <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <p className="text-xs text-slate-400">{item.label}</p>
          <p className="mt-1 text-2xl font-semibold">{item.value}</p>
          <p className="mt-1 text-xs text-emerald-300">{item.trend}</p>
        </article>
      ))}
    </section>
  );
}

export function ChartPanel({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 h-72">
      <h3 className="text-sm font-semibold mb-3">Performance Trend</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#818cf8" fill="#312e81" />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
}

export function LoadingSkeleton() { return <div className="animate-pulse rounded-xl border border-slate-800 bg-slate-900 h-48" />; }
export function EmptyState({ title, description }: { title: string; description: string }) { return <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-slate-300"><p className="font-medium">{title}</p><p className="text-sm text-slate-400 mt-2">{description}</p></div>; }
export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) { return <div className="rounded-xl border border-rose-700/40 bg-rose-950/20 p-4"><p className="text-rose-300">{message}</p><button onClick={onRetry} className="mt-3 rounded-md border border-rose-500 px-3 py-1 text-sm">Retry</button></div>; }
export function Toast({ message, show }: { message: string; show: boolean }) { if (!show) return null; return <div className="fixed bottom-4 right-4 rounded-md bg-emerald-600 px-4 py-2 text-sm">{message}</div>; }

export function ConfirmDialog({ open, title, onCancel, onConfirm }: { open: boolean; title: string; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/70 p-4"><div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-4"><h4 className="font-semibold">{title}</h4><p className="text-sm text-slate-400 mt-1">Hành động này không thể hoàn tác.</p><div className="mt-4 flex justify-end gap-2"><button onClick={onCancel} className="rounded-md border border-slate-700 px-3 py-1">Cancel</button><button onClick={onConfirm} className="rounded-md bg-rose-600 px-3 py-1">Delete</button></div></div></div>;
}

export function DataTable({ rows, query, onDelete }: { rows: TableItem[]; query: string; onDelete: (id: string) => void }) {
  const [page, setPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(true);
  const filtered = useMemo(() => rows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()) || row.owner.toLowerCase().includes(query.toLowerCase())), [rows, query]);
  const sorted = useMemo(() => [...filtered].sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))), [filtered, sortAsc]);
  const size = 5;
  const pageRows = sorted.slice((page - 1) * size, page * size);
  const totalPages = Math.max(1, Math.ceil(sorted.length / size));

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold">Records</h3><button className="rounded-md border border-slate-700 px-2 py-1 text-xs" onClick={() => setSortAsc((v) => !v)}>Sort {sortAsc ? '↑' : '↓'}</button></div>
      <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-slate-400"><th className="py-2">Name</th><th>Owner</th><th>Status</th><th>Updated</th><th></th></tr></thead><tbody>{pageRows.map((row) => (<tr key={row.id} className="border-t border-slate-800"><td className="py-2">{row.name}</td><td>{row.owner}</td><td>{row.status}</td><td>{row.updatedAt}</td><td><button onClick={() => onDelete(row.id)} className="text-rose-300">Delete</button></td></tr>))}</tbody></table></div>
      <div className="mt-3 flex items-center justify-end gap-2 text-xs"><button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button><span>{page}/{totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button></div>
    </section>
  );
}
