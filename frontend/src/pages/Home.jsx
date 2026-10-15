import { ArrowRight, Zap, ShieldCheck, Heart } from 'lucide-react';

const Home = ({ setPage }) => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#49b6ff] rounded-full text-xs font-bold uppercase tracking-widest text-blue-400">
            <Zap className="w-3 h-3 fill-current" /> Маркетплейс нового поколения
          </div>
          <h1 className="text-6xl lg:text-8xl font-black leading-[0.95] tracking-tight text-slate-900">
            Авторский <br />
            <span className="text-[#49b6ff]">Мерч</span> здесь.
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
            Специализированная площадка для независимых художников и коллекционеров. Найди уникальные значки и стикеры в один клик.
          </p>
          <div className="flex flex-wrap gap-6 pt-4">
            <button onClick={() => setPage('catalog')} className="btn-blue px-10 py-5 text-lg shadow-2xl shadow-blue-400/30">
              В каталог <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => setPage('register')} className="bg-white border-2 border-slate-900 text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-900 hover:text-white transition-all">
              Стать автором
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] bg-gradient-to-br from-blue-50 to-pink-50 rounded-[64px] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 border border-slate-100 flex items-center justify-center">
            <div className="w-32 h-32 bg-white/50 rounded-full blur-3xl animate-pulse"></div>
          </div>
          <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[40px] shadow-2xl border border-slate-50 max-w-xs -rotate-3 hover:rotate-0 transition-transform">
             <div className="flex items-center gap-4 mb-4 text-[#ff499e]">
                <ShieldCheck className="w-10 h-10" />
                <span className="font-bold text-slate-900 leading-tight">Безопасная сделка гарантирована</span>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed font-medium">Мы удерживаем оплату до тех пор, пока вы не получите свой мерч.</p>
          </div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="bg-slate-50 py-32 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-4 text-slate-900">Популярные вселенные</h2>
              <p className="text-slate-400 font-medium">Топ фандомов по количеству мерча</p>
            </div>
            <button onClick={() => setPage('catalog')} className="text-[#49b6ff] font-bold border-b-2 border-blue-100 hover:border-[#49b6ff] transition-all pb-1 bg-transparent border-none cursor-pointer">Смотреть все</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: 'Genshin Impact', count: '2.4k+', color: 'from-[#49b6ff]/20' },
              { title: 'Star Rail', count: '1.2k+', color: 'from-[#ff499e]/20' },
              { title: 'Chainsaw Man', count: '850+', color: 'from-slate-200' },
            ].map((fan, i) => (
              <div key={i} className={`group relative aspect-[16/10] rounded-[48px] overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-br ${fan.color} to-white border border-slate-100`} onClick={() => setPage('catalog')}>
                <div className="absolute bottom-10 left-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">{fan.count} товаров</span>
                  <h3 className="text-3xl font-black tracking-tight text-slate-800">{fan.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product List */}
      <section className="container mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black tracking-tight mb-4 text-slate-900">Новинки недели</h2>
          <p className="text-slate-400 font-medium">Свежие работы от наших художников</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[1, 2, 3, 4].map(id => (
            <div key={id} onClick={() => setPage('product')} className="group cursor-pointer">
              <div className={`aspect-square rounded-[40px] mb-6 relative border border-slate-100 shadow-sm group-hover:shadow-xl transition-all ${id % 2 === 0 ? 'bg-[#49b6ff]/5' : 'bg-[#ff499e]/5'} flex items-center justify-center`}>
                <div className="w-20 h-20 border-4 border-white/50 rounded-full opacity-20"></div>
                <div className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-300 hover:text-[#ff499e] transition-colors shadow-sm">
                  <Heart className="w-5 h-5" />
                </div>
              </div>
              <div className="px-2">
                <span className="text-[10px] font-bold text-[#49b6ff] uppercase tracking-widest mb-1 block">Studio_Pan</span>
                <h3 className="font-bold text-lg mb-4 text-slate-800 line-clamp-1 group-hover:text-[#49b6ff] transition-colors tracking-tight">Акриловый стенд "Странник"</h3>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-slate-900">750 ₽</span>
                  <button onClick={(e) => { e.stopPropagation(); setPage('cart'); }} className="btn-blue !px-6 !py-2.5 !text-xs !uppercase !tracking-widest">В корзину</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Artist CTA */}
      <section className="container mx-auto px-6 pb-32">
        <div className="bg-[#ff499e] rounded-[64px] p-20 text-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-20">
          <div className="relative z-10 lg:w-1/2">
             <h2 className="text-5xl lg:text-7xl font-black leading-none tracking-tighter mb-10 uppercase">
                Твой мерч <br /> Твои правила.
             </h2>
             <p className="text-pink-100 text-xl leading-relaxed mb-12 max-w-md font-medium">
                Больше никаких переписок в соцсетях. Удобная панель управления, автоматическая логистика и прозрачная аналитика.
             </p>
             <button onClick={() => setPage('register')} className="bg-white text-[#ff499e] px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 shadow-2xl transition-all border-none cursor-pointer">
                СТАТЬ ПРОДАВЦОМ
             </button>
          </div>
          <div className="relative z-10 lg:w-1/2 grid grid-cols-2 gap-6 text-white">
             <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[40px] border border-white/20">
                <span className="text-4xl block mb-4">⚡</span>
                <h4 className="font-black text-xl mb-2">В 2 раза быстрее</h4>
                <p className="text-pink-50 text-sm leading-relaxed">Обработка заказов и отправка накладных.</p>
             </div>
             <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[40px] border border-white/20 translate-y-12">
                <span className="text-4xl block mb-4">📦</span>
                <h4 className="font-black text-xl mb-2">Boxberry Pro</h4>
                <p className="text-pink-50 text-sm leading-relaxed">Интеграция с логистической системой в один клик.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
