import { useState } from 'react';
import { LayoutDashboard, Box, Package, Truck, BarChart3, LogOut, Download, Plus, Edit3, Trash2, Search } from 'lucide-react';

const Dashboard = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-[#f8fafc] flex animate-in fade-in duration-300">
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col fixed inset-y-0 shadow-2xl shadow-slate-200/50">
        <div className="p-10 flex items-center gap-3 mb-10">
          <button onClick={() => setPage('home')} className="flex items-center gap-3 border-none bg-transparent cursor-pointer group">
            <div className="w-10 h-10 bg-[#ff499e] rounded-xl flex items-center justify-center shadow-lg shadow-pink-400/20 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">Artist Panel</span>
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-2">
            {[
                { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
                { id: 'products', label: 'Мои товары', icon: Box },
                { id: 'orders', label: 'Заказы', icon: Package },
                { id: 'logistics', label: 'Логистика', icon: Truck },
            ].map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all border-none cursor-pointer ${activeTab === item.id ? 'bg-pink-50 text-[#ff499e]' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                </button>
            ))}
        </nav>

        <div className="p-8 border-t border-slate-50 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xs">SP</div>
            <div className="flex-1">
                <span className="block font-bold text-sm leading-none text-slate-900">Studio_Pan</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1 block">Pro Account</span>
            </div>
            <button onClick={() => setPage('home')} className="p-2 text-slate-300 hover:text-[#ff499e] transition-colors border-none bg-transparent cursor-pointer">
                <LogOut className="w-5 h-5" />
            </button>
        </div>
      </aside>

      <main className="ml-80 flex-1 p-16 overflow-y-auto">
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'products' && <ProductsView />}
        {activeTab === 'logistics' && <LogisticsView />}
      </main>
    </div>
  );
};

const AnalyticsView = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500 text-slate-900">
        <header className="flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-black tracking-tight uppercase">Аналитика продаж</h1>
                <p className="text-slate-400 font-medium mt-2">Обзор спроса на ваш мерч</p>
            </div>
            <button className="bg-white border-2 border-slate-900 px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-slate-200 border-none cursor-pointer">
                <Download className="w-4 h-4" /> Скачать отчет
            </button>
        </header>

        <div className="grid grid-cols-4 gap-8 text-slate-900">
            {[
                { label: 'Чистый доход', val: '84 200 ₽', diff: '+12%', color: 'text-emerald-500' },
                { label: 'Заказы', val: '152', diff: '+5%', color: 'text-blue-500' },
                { label: 'Просмотры', val: '3.8k', diff: '+24%', color: 'text-[#ff499e]' },
                { label: 'Конверсия', val: '4.2%', diff: '-1%', color: 'text-rose-500' },
            ].map((s, i) => (
                <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-50">
                    <span className="text-[10px] font-bold uppercase text-slate-300 tracking-[0.2em] block mb-4">{s.label}</span>
                    <div className="flex items-end gap-3">
                        <h3 className="text-3xl font-black text-slate-900 leading-none uppercase">{s.val}</h3>
                        <span className={`font-bold text-xs mb-1 ${s.color}`}>{s.diff}</span>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-3 gap-12 text-slate-900">
            <div className="col-span-2 bg-white p-12 rounded-[48px] shadow-sm border border-slate-50">
                <h3 className="text-xl font-bold mb-10 tracking-tight">Динамика спроса</h3>
                <div className="h-64 flex items-end gap-6 p-6 border-b-2 border-slate-50 mb-6">
                    {[40, 60, 45, 90, 65, 80, 50].map((h, i) => (
                        <div key={i} className="w-full bg-blue-50 rounded-t-2xl relative group" style={{ height: `${h}%` }}>
                            {i === 3 && <div className="absolute inset-0 bg-[#ff499e] rounded-t-2xl"></div>}
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-50">
                <h3 className="text-xl font-bold mb-10 tracking-tight uppercase">Топ товаров</h3>
                <div className="space-y-8">
                    {[1, 2, 3].map(id => (
                        <div key={id} className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-slate-50 rounded-2xl shrink-0 border border-slate-100 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-slate-200 rounded-lg"></div>
                           </div>
                           <div className="flex-1 text-slate-900">
                               <span className="font-bold text-sm block leading-tight">Manga Pack</span>
                               <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1 block">42 продажи</span>
                           </div>
                           <span className="font-black text-[#ff499e]">+2.4k</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const ProductsView = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
        <header className="flex justify-between items-end">
            <h1 className="text-4xl font-black text-slate-900 uppercase">Мои товары</h1>
            <button className="pink text-white px-10 py-4 rounded-2xl font-bold text-sm uppercase shadow-xl shadow-pink-400/20 border-none cursor-pointer">
                <Plus className="w-5 h-5" /> Добавить товар
            </button>
        </header>
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden text-slate-900 font-bold">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex gap-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                    <input type="text" placeholder="Поиск..." className="w-full bg-white border border-slate-100 rounded-xl pl-12 pr-4 py-2.5 text-sm outline-none" />
                </div>
            </div>
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-300"><tr className="border-b border-slate-50"><th className="p-6">Товар</th><th className="p-6">Статус</th><th className="p-6">Остаток</th><th className="p-6 text-right">Действия</th></tr></thead>
                <tbody>
                    {[1, 2, 3].map(i => (
                        <tr key={i} className="border-b border-slate-50">
                            <td className="p-6 flex items-center gap-4 text-sm">Товар {i}</td>
                            <td className="p-6"><span className="px-4 py-1.5 bg-emerald-50 text-emerald-500 rounded-full text-[10px] uppercase tracking-widest">В продаже</span></td>
                            <td className="p-6">12 шт.</td>
                            <td className="p-6 text-right text-slate-200">
                                <button className="p-2 border-none bg-transparent cursor-pointer hover:text-blue-400"><Edit3 className="w-4 h-4" /></button>
                                <button className="p-2 border-none bg-transparent cursor-pointer hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const LogisticsView = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
        <header className="flex justify-between items-end text-slate-900">
            <h1 className="text-4xl font-black uppercase">Логистика</h1>
            <button className="blue text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase border-none cursor-pointer">PDF Отчет</button>
        </header>
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden font-bold">
            <div className="p-10 border-b border-slate-50 bg-slate-50/30 text-blue-400">Boxberry Pro Status</div>
            <table className="w-full text-left text-sm text-slate-900">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-300"><tr><th className="p-8">№ Заказа</th><th className="p-8">Статус</th><th className="p-8 text-right">Действие</th></tr></thead>
                <tbody>
                    <tr className="border-b border-slate-50"><td className="p-8">#ME-94821</td><td className="p-8"><span className="px-4 py-1 bg-amber-50 text-amber-500 rounded-full text-[10px] uppercase">Сборка</span></td><td className="p-8 text-right text-blue-400 underline cursor-pointer">Накладная</td></tr>
                </tbody>
            </table>
        </div>
    </div>
);

export default Dashboard;
