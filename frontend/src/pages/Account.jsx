import { Heart, User, MapPin, LogOut, Package, Clock } from 'lucide-react';
import { useState } from 'react';

const Account = () => {
  const [tab, setTab] = useState('orders');

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 animate-in fade-in duration-300">
      <aside className="w-80 shrink-0">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-[#49b6ff] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">И</div>
            <h3 className="font-bold text-slate-900 mb-1">Иван Иванов</h3>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Buyer Account</p>
            <nav className="mt-12 space-y-2 text-left">
                <button onClick={() => setTab('orders')} className={`w-full flex items-center gap-4 px-6 py-3 rounded-2xl font-bold text-sm transition-all border-none cursor-pointer ${tab === 'orders' ? 'bg-blue-50 text-[#49b6ff]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
                    <Package className="w-5 h-5" /> Заказы
                </button>
                <button onClick={() => setTab('profile')} className={`w-full flex items-center gap-4 px-6 py-3 rounded-2xl font-bold text-sm transition-all border-none cursor-pointer ${tab === 'profile' ? 'bg-blue-50 text-[#49b6ff]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
                    <User className="w-5 h-5" /> Профиль
                </button>
                <div className="pt-10">
                    <button className="w-full flex items-center gap-4 px-6 py-3 rounded-2xl font-bold text-sm text-red-300 hover:bg-red-50 hover:text-red-500 transition-all border-none cursor-pointer">
                        <LogOut className="w-5 h-5" /> Выход
                    </button>
                </div>
            </nav>
        </div>
      </aside>

      <main className="flex-1">
        {tab === 'orders' ? <OrdersList /> : <ProfileSettings />}
      </main>
    </div>
  );
};

const OrdersList = () => (
    <div className="space-y-12">
        <h1 className="text-4xl font-black text-slate-900 uppercase">История заказов</h1>
        <div className="bg-white rounded-[40px] border-2 border-slate-50 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-slate-50/50 p-8 border-b border-slate-100 flex justify-between items-center">
                <div className="flex gap-10">
                    <div><span className="text-[8px] font-bold text-slate-300 uppercase block mb-1">Дата</span><span className="font-bold text-slate-900">24 мая 2024</span></div>
                    <div><span className="text-[8px] font-bold text-slate-300 uppercase block mb-1">Статус</span><span className="text-[#49b6ff] font-bold uppercase text-[10px]">В пути</span></div>
                </div>
                <span className="text-2xl font-bold text-[#ff499e]">1 800 ₽</span>
            </div>
            <div className="p-8 flex items-center justify-between">
                <div className="flex gap-6 items-center">
                    <div className="flex -space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 border-4 border-white flex items-center justify-center text-[#49b6ff]">📦</div>
                        <div className="w-16 h-16 rounded-2xl bg-pink-50 border-4 border-white flex items-center justify-center text-[#ff499e]">📦</div>
                    </div>
                    <div><span className="font-bold text-slate-900">2 товара</span><p className="text-xs text-slate-400 mt-1">Доставка в ПВЗ Boxberry: Москва</p></div>
                </div>
                <div className="bg-[#49b6ff] text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase shadow-lg shadow-blue-400/20 cursor-pointer">Отследить</div>
            </div>
        </div>
    </div>
);

const ProfileSettings = () => (
    <div className="space-y-12">
        <h1 className="text-4xl font-black text-slate-900 uppercase">Профиль</h1>
        <div className="bg-white rounded-[48px] p-12 border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2"><label className="text-[10px] font-bold text-slate-300 uppercase ml-4">Имя</label><input type="text" defaultValue="Иван" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none font-bold" /></div>
                <div className="space-y-2"><label className="text-[10px] font-bold text-slate-300 uppercase ml-4">Фамилия</label><input type="text" defaultValue="Иванов" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none font-bold" /></div>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center">
                <div><span className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Основной адрес (Boxberry)</span><p className="font-bold text-slate-900 leading-none">Москва, ул. Творческая, 42</p></div>
                <span className="text-xs font-bold text-[#49b6ff] border-b-2 border-blue-100 cursor-pointer">Изменить</span>
            </div>
            <button className="btn-blue !px-12 !py-4 shadow-xl shadow-blue-400/20 uppercase text-sm !font-black !tracking-widest">Сохранить изменения</button>
        </div>
    </div>
);

export default Account;
