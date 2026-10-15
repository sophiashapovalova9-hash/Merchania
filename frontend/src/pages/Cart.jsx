import { Trash2, Plus, Minus, ArrowRight, Truck } from 'lucide-react';

const Cart = ({ setPage }) => {
  return (
    <div className="container mx-auto px-6 py-12 animate-in fade-in duration-500">
      <h1 className="text-4xl font-black mb-16 tracking-tight uppercase text-slate-900">Ваша корзина</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-8">
          {[1, 2].map(id => (
            <div key={id} className="flex flex-col sm:flex-row items-center gap-8 p-8 border border-slate-100 rounded-[40px] bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-24 h-24 bg-slate-100 rounded-3xl shrink-0 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-white/60 rounded-xl rotate-12"></div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="text-[10px] font-bold text-[#49b6ff] uppercase tracking-widest mb-1 block">Studio_Pan</span>
                <h3 className="font-bold text-xl text-slate-800 tracking-tight">Акриловый стенд "Странник"</h3>
              </div>
              <div className="flex items-center gap-6 bg-slate-50 p-2.5 rounded-2xl">
                <button className="w-8 h-8 bg-white rounded-lg shadow-sm font-bold text-slate-300 hover:text-slate-900 transition-colors border-none cursor-pointer"><Minus className="w-4 h-4" /></button>
                <span className="font-black text-lg">1</span>
                <button className="w-8 h-8 bg-white rounded-lg shadow-sm font-bold hover:text-[#49b6ff] transition-colors border-none cursor-pointer"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="text-2xl font-black text-slate-900 min-w-[100px] text-right">750 ₽</div>
              <button className="p-3 text-slate-200 hover:text-red-400 transition-colors border-none bg-transparent cursor-pointer">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-center gap-6 text-[#49b6ff]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Truck className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-600 font-medium">
              Добавьте товаров ещё на <span className="font-black">550 ₽</span> для бесплатной доставки!
            </p>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="bg-white rounded-[48px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-50 text-slate-900">
            <h3 className="text-xl font-bold mb-10 tracking-tight">Итог заказа</h3>
            <div className="space-y-5 mb-10 pb-10 border-b border-slate-50">
              <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
                <span>Товары (2)</span>
                <span className="text-slate-900">1 500 ₽</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
                <span>Доставка</span>
                <span className="text-slate-900">350 ₽</span>
              </div>
            </div>
            <div className="flex justify-between items-end mb-12">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">К оплате</span>
              <span className="text-5xl font-black text-[#ff499e] leading-none tracking-tighter">1 850 ₽</span>
            </div>
            <button onClick={() => setPage('checkout')} className="w-full btn-blue !py-5 !text-lg !uppercase !tracking-widest shadow-xl shadow-blue-400/20">
              Оформить заказ <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
