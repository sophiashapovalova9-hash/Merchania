import { useState } from 'react';
import { Search, Heart, SlidersHorizontal, ChevronDown } from 'lucide-react';

const Catalog = ({ setPage }) => {
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 animate-in fade-in duration-300">
      <aside className={`w-full lg:w-80 shrink-0 space-y-12 transition-all ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <div>
          <h2 className="text-xl font-bold mb-8 flex items-center justify-between text-slate-900">
            Фильтры
            <button className="text-xs font-bold text-slate-400 hover:text-[#49b6ff] uppercase tracking-widest bg-transparent border-none cursor-pointer">Сбросить</button>
          </h2>

          <div className="space-y-12 text-slate-900">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 px-1">Фандом (Тайтл)</h4>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                <input type="text" placeholder="Поиск..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
              </div>
              <div className="space-y-4 px-1">
                {['Genshin Impact', 'Honkai: Star Rail', 'Chainsaw Man', 'Jujutsu Kaisen'].map((fan, i) => (
                   <label key={fan} className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${i === 0 ? 'bg-[#49b6ff] border-[#49b6ff]' : 'border-slate-200 group-hover:border-[#49b6ff]'}`}>
                        {i === 0 && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <span className={`font-bold text-sm ${i === 0 ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>{fan}</span>
                   </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 px-1">Тип мерча</h4>
              <div className="space-y-4 px-1">
                {['Значки (Pins)', 'Стикеры', 'Акриловые стенды', 'Постеры', 'Брелоки'].map((type, i) => (
                   <label key={type} className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${i === 2 ? 'bg-[#ff499e] border-[#ff499e]' : 'border-slate-200 group-hover:border-[#ff499e]'}`}>
                        {i === 2 && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <span className={`font-bold text-sm ${i === 2 ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>{type}</span>
                   </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 px-1">Цена, ₽</h4>
              <div className="flex gap-4 items-center text-slate-900">
                 <input type="number" placeholder="От" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold outline-none" />
                 <span className="text-slate-300 font-bold">—</span>
                 <input type="number" placeholder="До" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold outline-none" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
           <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 uppercase text-slate-900">Каталог мерча</h1>
              <p className="text-slate-400 font-medium text-sm uppercase tracking-widest">Найдено 1,248 товаров</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-100 rounded-2xl pl-6 pr-12 py-3 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer">
                  <option>Сначала новые</option>
                  <option>По популярности</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-3 bg-slate-100 rounded-2xl border-none cursor-pointer">
                <SlidersHorizontal className="w-5 h-5 text-slate-600" />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(id => (
            <div key={id} onClick={() => setPage('product')} className="group cursor-pointer">
              <div className={`aspect-square rounded-[48px] overflow-hidden mb-6 relative border border-slate-100 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 ${id % 3 === 0 ? 'bg-[#49b6ff]/5' : id % 3 === 1 ? 'bg-[#ff499e]/5' : 'bg-slate-50'} flex items-center justify-center`}>
                <div className="w-20 h-20 border-2 border-white/50 rounded-3xl rotate-12 opacity-30"></div>
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-300 hover:text-[#ff499e] transition-colors shadow-sm">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="absolute bottom-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 border border-white">Genshin Impact</div>
              </div>
              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                   <div>
                     <span className="text-[10px] font-bold text-[#49b6ff] uppercase tracking-widest mb-1 block">Studio_Pan</span>
                     <h3 className="font-bold text-xl text-slate-900 group-hover:text-[#49b6ff] transition-colors leading-tight">Акриловый стенд "Странник"</h3>
                   </div>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <span className="text-3xl font-black text-slate-900">750 ₽</span>
                  <button onClick={(e) => { e.stopPropagation(); setPage('cart'); }} className="btn-blue !rounded-2xl !px-8 !py-3 !text-xs !font-black !uppercase !tracking-[0.2em] shadow-lg shadow-blue-400/20">В корзину</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 flex justify-center gap-3">
          {[1, 2, 3, '...', 12].map((n, i) => (
             <button key={i} className={`w-14 h-14 rounded-2xl font-black text-sm transition-all border-none cursor-pointer ${n === 1 ? 'bg-[#49b6ff] text-white shadow-xl shadow-blue-400/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
                {n}
             </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Catalog;
