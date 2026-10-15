import { HelpCircle, Mail, MessageCircle, FileText, ChevronRight } from 'lucide-react';

const Support = () => {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl animate-in fade-in duration-300">
      <div className="text-center mb-24">
        <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase text-slate-900 leading-none">Центр поддержки</h1>
        <p className="text-slate-400 font-medium uppercase tracking-widest text-sm">Найдите ответ или свяжитесь с нами</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 text-slate-900 font-bold">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
            <Mail className="w-10 h-10 text-[#49b6ff] mx-auto mb-4" />
            <h4 className="uppercase text-xs tracking-widest mb-2">Написать</h4>
            <span className="text-slate-300 text-[10px]">24 часа ответ</span>
        </div>
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
            <MessageCircle className="w-10 h-10 text-[#ff499e] mx-auto mb-4" />
            <h4 className="uppercase text-xs tracking-widest mb-2">Онлайн Чат</h4>
            <span className="text-slate-300 text-[10px]">Быстрая помощь</span>
        </div>
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
            <FileText className="w-10 h-10 text-slate-900 mx-auto mb-4" />
            <h4 className="uppercase text-xs tracking-widest mb-2">FAQ</h4>
            <span className="text-slate-300 text-[10px]">База знаний</span>
        </div>
      </div>

      <section className="mb-24 space-y-4">
        <h2 className="text-2xl font-bold mb-10 uppercase text-slate-900">Частые вопросы</h2>
        {[
            { q: 'Как осуществляется доставка?', a: 'Мы сотрудничаем с Boxberry и Почтой России.' },
            { q: 'Как стать автором?', a: 'Пройдите регистрацию в разделе "Художник".' },
            { q: 'Безопасна ли оплата?', a: 'Все платежи проходят через защищенный шлюз.' }
        ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-50 flex justify-between items-center group cursor-pointer hover:bg-slate-50 transition-colors">
                <span className="font-bold text-slate-800">{item.q}</span>
                <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-[#49b6ff] transition-all" />
            </div>
        ))}
      </section>

      <section className="bg-slate-900 rounded-[64px] p-20 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-10">Не нашли ответ?</h2>
          <form className="space-y-4 max-w-md">
            <input type="text" placeholder="Ваше имя" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-4 outline-none text-white font-bold" />
            <textarea placeholder="Ваш вопрос..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-4 h-32 outline-none text-white font-bold"></textarea>
            <button className="btn-blue w-full py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-400/20">Отправить заявку</button>
          </form>
        </div>
        <HelpCircle className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 -rotate-12" />
      </section>
    </div>
  );
};

export default Support;
