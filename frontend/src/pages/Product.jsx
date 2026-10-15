import { useState } from 'react';
import { Star, Heart, Share2, ShieldCheck, Truck, RotateCcw, ChevronRight } from 'lucide-react';

const Product = ({ setPage }) => {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="container mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <nav className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 mb-12">
        <button onClick={() => setPage('home')} className="hover:text-[#49b6ff] border-none bg-transparent cursor-pointer">Главная</button>
        <ChevronRight className="w-4 h-4" />
        <button onClick={() => setPage('catalog')} className="hover:text-[#49b6ff] border-none bg-transparent cursor-pointer">Каталог</button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900">Акриловый стенд "Странник"</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
        <div className="space-y-6">
          <div className="aspect-square bg-gradient-to-br from-slate-50 to-blue-50 rounded-[64px] overflow-hidden border border-slate-100 shadow-inner flex items-center justify-center">
             <div className="w-32 h-32 border-8 border-white/40 rounded-full opacity-20"></div>
          </div>
          <div className="flex gap-6">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-24 h-24 rounded-3xl overflow-hidden border-4 transition-all flex items-center justify-center border-none cursor-pointer ${activeImg === i ? 'bg-pink-50 ring-4 ring-[#ff499e]' : 'bg-slate-50 opacity-40 hover:opacity-100'}`}
              >
                <div className="w-8 h-8 border-2 border-[#ff499e]/20 rounded-lg rotate-12"></div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 text-slate-900">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs uppercase">SP</div>
              <span className="text-[#49b6ff] font-black uppercase text-sm border-b-2 border-blue-100 pb-0.5">Studio_Pan</span>
            </div>
            <div className="flex items-center gap-2 text-[#49b6ff]">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-slate-900 font-black text-sm uppercase">4.9 <span className="text-slate-300 font-medium ml-1">(128)</span></span>
            </div>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] mb-6 uppercase">Акриловый <br /> стенд "Странник"</h1>
          <div className="text-4xl font-black mb-10">750 ₽</div>

          <p className="text-slate-500 text-lg leading-relaxed mb-12 max-w-xl font-medium">
            Высококачественный акриловый стенд с двусторонней печатью. Высота 15 см. Идеально для украшения полки. Поставляется в защитной пленке.
          </p>

          <div className="space-y-12 mb-12">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 px-1">Выберите размер</h4>
              <div className="flex gap-4">
                <button className="px-10 py-4 rounded-2xl border-4 border-slate-900 font-black text-sm uppercase transition-all bg-white cursor-pointer">15 см</button>
                <button className="px-10 py-4 rounded-2xl border-2 border-slate-100 font-black text-sm uppercase text-slate-300 hover:border-[#49b6ff] hover:text-[#49b6ff] transition-all bg-white cursor-pointer">20 см (+250 ₽)</button>
              </div>
            </div>
          </div>

          <div className="flex gap-6 mb-16">
            <button onClick={() => setPage('cart')} className="flex-1 btn-blue !py-5 !text-lg !uppercase !tracking-widest shadow-2xl shadow-blue-400/30">Добавить в корзину</button>
            <button className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 hover:text-[#ff499e] transition-colors border-none bg-transparent cursor-pointer border border-slate-100"><Heart className="w-6 h-6" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center gap-3">
                <Truck className="w-6 h-6 text-[#49b6ff]" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Доставка</span>
                <span className="text-xs font-bold">от 2-х дней</span>
             </div>
             <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center gap-3">
                <ShieldCheck className="w-6 h-6 text-green-500" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Гарантия</span>
                <span className="text-xs font-bold">Безопасная сделка</span>
             </div>
             <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center gap-3">
                <RotateCcw className="w-6 h-6 text-[#ff499e]" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Остаток</span>
                <span className="text-xs font-bold">12 штук</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
