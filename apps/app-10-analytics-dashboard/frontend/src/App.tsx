import { useMemo, useState } from 'react';
import { useDarkMode } from '@repo/frontend-common/src/hooks';
import { ChartPanel, ConfirmDialog, DashboardCards, DataTable, EmptyState, ErrorState, LoadingSkeleton, Toast, type TableItem } from '@repo/frontend-common/src/components';
import { SaasLayout } from '@repo/frontend-common/src/layouts';
import { client } from './api/client';

const nav = [{ id: 'dashboard', label: 'Dashboard', icon: '📊' }, { id: 'records', label: 'Records', icon: '🗂️' }, { id: 'settings', label: 'Settings', icon: '⚙️' }];
const chartData = [{ name: 'Mon', value: 120 }, { name: 'Tue', value: 180 }, { name: 'Wed', value: 140 }, { name: 'Thu', value: 220 }, { name: 'Fri', value: 260 }, { name: 'Sat', value: 200 }, { name: 'Sun', value: 300 }];
const initialRows: TableItem[] = Array.from({ length: 12 }).map((_, idx) => ({ id: String(idx + 1), name: '10 Analytics Dashboard item ' + (idx + 1), owner: idx % 2 ? 'alice' : 'bob', status: idx % 3 ? 'active' : 'pending', updatedAt: new Date(Date.now() - idx * 3600_000).toLocaleDateString() }));

export default function App() {
  const { dark, toggleDark } = useDarkMode();
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(initialRows);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState(false);

  const stats = useMemo(() => [{ label: 'Total', value: String(rows.length), trend: '+12% tuần này' }, { label: 'Active', value: String(rows.filter((r) => r.status === 'active').length), trend: '+3.1%' }, { label: 'Pending', value: String(rows.filter((r) => r.status === 'pending').length), trend: '-1.2%' }, { label: 'Response', value: '98ms', trend: '-8ms' }], [rows]);
  const pingBackend = async () => { try { setLoading(true); setError(null); await client.get('/health'); } catch (_err) { setError('Không thể kết nối backend health endpoint'); } finally { setLoading(false); } };
  const onDelete = (id: string) => setConfirmId(id);
  const onConfirmDelete = () => { if (!confirmId) return; setRows((prev) => prev.filter((r) => r.id !== confirmId)); setConfirmId(null); setToast(true); setTimeout(() => setToast(false), 1800); };

  return (
    <SaasLayout appName="10 Analytics Dashboard" nav={nav} dark={dark} toggleDark={toggleDark} onSearch={setQuery}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-xl md:text-2xl font-semibold">10 Analytics Dashboard Dashboard</h1><button onClick={pingBackend} className="rounded-md border border-slate-700 px-3 py-2 text-sm">Check API</button></div>
        {loading && <LoadingSkeleton />}
        {error && <ErrorState message={error} onRetry={pingBackend} />}
        <DashboardCards items={stats} />
        <ChartPanel data={chartData} />
        {rows.length === 0 ? (<EmptyState title="No records" description="Thêm dữ liệu mới để hiển thị bảng." />) : (<DataTable rows={rows} query={query} onDelete={onDelete} />)}
      </div>
      <ConfirmDialog open={Boolean(confirmId)} title="Xác nhận xóa bản ghi?" onCancel={() => setConfirmId(null)} onConfirm={onConfirmDelete} />
      <Toast show={toast} message="Đã xóa thành công" />
    </SaasLayout>
  );
}
