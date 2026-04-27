import { ReactNode } from 'react';
import { NavItem, Sidebar, Topbar } from '../components/dashboard-ui';

export function SaasLayout({ appName, nav, dark, toggleDark, onSearch, children }: { appName: string; nav: NavItem[]; dark: boolean; toggleDark: () => void; onSearch: (value: string) => void; children: ReactNode; }) {
  return <div className="min-h-screen bg-slate-950 text-slate-100 lg:flex"><Sidebar appName={appName} items={nav} /><div className="flex-1"><Topbar onSearch={onSearch} dark={dark} toggleDark={toggleDark} /><main className="p-4 md:p-6">{children}</main></div></div>;
}
