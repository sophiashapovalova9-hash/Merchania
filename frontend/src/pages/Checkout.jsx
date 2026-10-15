import { ShieldCheck, CreditCard, Wallet } from 'lucide-react';

const Checkout = ({ setPage }) => {
  return (
    <div className="container mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 uppercase mb-16 tracking-tight">Оформление заказа</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-16">
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-[#49b6ff] rounded-full flex items-center justify-center text-white font-black">1</div>
                <h2 className="text-xl font-bold uppercase">Контакты</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Имя" className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none font-bold" />
                <input type="text" placeholder="Фамилия" className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none font-bold" />
                <input type="email" placeholder="Email" className="col-span-2 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none font-bold" />
              </div>
            </section>

            <section>
               <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-[#49b6ff] rounded-full flex items-center justify-center text-white font-black">2</div>
                <h2 className="text-xl font-bold uppercase">Оплата</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <button className="flex flex-col items-center gap-3 p-6 border-2 border-[#49b6ff] bg-blue-50/50 rounded-[32px] transition-all border-none cursor-pointer">
                    <CreditCard className="text-[#49b6ff] w-6 h-6" />
                    <span className="font-bold text-xs uppercase text-[#49b6ff]">Картой онлайн</span>
                 </button>
                 <button className="flex flex-col items-center gap-3 p-6 border-2 border-slate-50 bg-white rounded-[32px] hover:bg-slate-50 transition-all border-none cursor-pointer">
                    <Wallet className="text-slate-300 w-6 h-6" />
                    <span className="font-bold text-xs uppercase text-slate-300">СБП / Tinkoff</span>
                 </button>
              </div>
            </section>
          </div>

          <aside>
             <div className="bg-white rounded-[48px] p-12 shadow-2xl shadow-slate-200/50 border border-slate-50 sticky top-28 text-slate-900">
                <h3 className="text-xl font-bold mb-10 tracking-tight">Ваш заказ</h3>
                <div className="space-y-6 mb-10 pb-10 border-b border-slate-50">
                    <div className="flex justify-between font-bold text-sm text-slate-400"><span>Товары</span><span className="text-slate-900">1 500 ₽</span></div>
                    <div className="flex justify-between font-bold text-sm text-slate-400"><span>Доставка</span><span className="text-slate-900">350 ₽</span></div>
                </div>
                <div className="flex justify-between items-end mb-12">
                   <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">Итого</span>
                   <span className="text-5xl font-black text-[#ff499e] leading-none tracking-tighter">1 850 ₽</span>
                </div>
                <button onClick={() => setPage('home')} className="w-full btn-blue !py-5 shadow-xl shadow-blue-400/20 uppercase tracking-widest !font-black">Оплатить 1 850 ₽</button>
                <div className="flex items-center justify-center gap-2 mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure SSL Encryption
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
