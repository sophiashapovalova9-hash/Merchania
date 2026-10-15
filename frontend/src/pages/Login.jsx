import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = ({ setPage }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 animate-in fade-in duration-300">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">С возвращением</h2>
          <p className="text-slate-400 mt-4 font-medium">Войдите в свой аккаунт Merchania</p>
        </div>

        <div className="bg-white rounded-[48px] p-12 shadow-2xl shadow-slate-200/50 border border-slate-50">
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-300 uppercase ml-4 tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200" />
                <input type="email" placeholder="mail@example.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-4 mr-4">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Пароль</label>
                <button onClick={() => setPage('forgot-password')} type="button" className="text-[10px] font-bold text-[#49b6ff] uppercase tracking-widest border-none bg-transparent cursor-pointer">Забыли?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200" />
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
            </div>
            <button onClick={() => setPage('account')} type="button" className="w-full btn-blue !py-4.5 !text-sm !uppercase !tracking-widest shadow-xl shadow-blue-400/20">
              Войти в систему <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
             <p className="text-sm text-slate-400">Нет аккаунта? <button onClick={() => setPage('register')} className="text-[#ff499e] font-bold underline underline-offset-4 border-none bg-transparent cursor-pointer">Создать новый</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
