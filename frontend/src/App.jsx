import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';
import Support from './pages/Support';
import { ShoppingBag, Search, Heart } from 'lucide-react';

const Header = ({ setPage, currentPage }) => (
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div className="container mx-auto px-6 h-20 flex items-center">
      <button onClick={() => setPage('home')} className="flex items-center gap-2 border-none bg-transparent cursor-pointer group mr-20">
        <div className="w-10 h-10 bg-[#49b6ff] rounded-xl flex items-center justify-center shadow-lg shadow-blue-400/20 group-hover:scale-110 transition-transform">
          <ShoppingBag className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-900">Merchania</span>
      </button>

      <nav className="hidden md:flex items-center gap-10 flex-1">
        <button onClick={() => setPage('catalog')} className={`nav-button ${currentPage === 'catalog' ? 'text-[#49b6ff] font-bold' : 'text-slate-500 font-medium hover:text-[#49b6ff]'}`}>Каталог</button>
        <button onClick={() => setPage('catalog')} className="nav-button text-slate-500 font-medium hover:text-[#49b6ff]">Стикеры</button>
        <button onClick={() => setPage('catalog')} className="nav-button text-slate-500 font-medium hover:text-[#49b6ff]">Значки</button>
        <button onClick={() => setPage('support')} className={`nav-button ${currentPage === 'support' ? 'text-[#49b6ff] font-bold' : 'text-slate-500 font-medium hover:text-[#49b6ff]'}`}>Помощь</button>
      </nav>

      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск мерча..."
            className="pl-11 pr-6 py-2.5 bg-gray-50 border-none rounded-full w-64 focus:ring-2 focus:ring-[#49b6ff]/20 outline-none text-sm transition-all"
          />
        </div>
        <button onClick={() => setPage('account')} className="p-2.5 text-gray-400 hover:text-[#ff499e] hover:bg-pink-50 rounded-full transition-all border-none bg-transparent cursor-pointer">
          <Heart className="w-6 h-6" />
        </button>
        <button onClick={() => setPage('cart')} className="p-2.5 text-gray-400 hover:text-[#49b6ff] hover:bg-blue-50 rounded-full relative transition-all border-none bg-transparent cursor-pointer">
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute top-2 right-2 bg-[#ff499e] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
        </button>
        <button onClick={() => setPage('login')} className="btn-blue py-2 px-6 ml-2">
          Войти
        </button>
      </div>
    </div>
  </header>
);

const Footer = ({ setPage }) => (
  <footer className="bg-slate-900 text-white pt-20 pb-10 mt-20">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <div className="w-8 h-8 bg-[#49b6ff] rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white w-5 h-5" />
            </div>
            Merchania
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Первый специализированный маркетплейс для независимых художников и коллекционеров авторского мерча.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-slate-500">Покупателям</h4>
          <ul className="space-y-4 text-sm text-slate-300 list-none p-0">
            <li><button onClick={() => setPage('catalog')} className="hover:text-[#49b6ff] bg-transparent border-none cursor-pointer p-0 text-left">Каталог товаров</button></li>
            <li><button onClick={() => setPage('support')} className="hover:text-[#49b6ff] bg-transparent border-none cursor-pointer p-0 text-left">Доставка и оплата</button></li>
            <li><button onClick={() => setPage('support')} className="hover:text-[#49b6ff] bg-transparent border-none cursor-pointer p-0 text-left">Вопросы и ответы</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-slate-500">Художникам</h4>
          <ul className="space-y-4 text-sm text-slate-300 list-none p-0">
            <li><button onClick={() => setPage('register')} className="hover:text-[#ff499e] bg-transparent border-none cursor-pointer p-0 text-left">Стать продавцом</button></li>
            <li><button onClick={() => setPage('dashboard')} className="hover:text-[#ff499e] bg-transparent border-none cursor-pointer p-0 text-left">Личный кабинет автора</button></li>
            <li><button onClick={() => setPage('support')} className="hover:text-[#ff499e] bg-transparent border-none cursor-pointer p-0 text-left">Правила площадки</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-slate-500">Контакты</h4>
          <p className="text-sm text-slate-300 mb-2">support@merchania.ru</p>
          <p className="text-sm text-slate-300">+7 (999) 000-00-00</p>
        </div>
      </div>
      <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs text-slate-500">© 2024 Merchania. Все права защищены. Дизайн: Прямой шрифт.</p>
        <div className="flex gap-8 text-xs text-slate-500 uppercase tracking-widest font-bold">
            <span className="hover:text-white cursor-pointer">Политика</span>
            <span className="hover:text-white cursor-pointer">Оферта</span>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [page, setPage] = useState('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const renderPage = () => {
    switch(page) {
      case 'home': return <Home setPage={setPage} />;
      case 'catalog': return <Catalog setPage={setPage} />;
      case 'product': return <Product setPage={setPage} />;
      case 'cart': return <Cart setPage={setPage} />;
      case 'checkout': return <Checkout setPage={setPage} />;
      case 'login': return <Login setPage={setPage} />;
      case 'register': return <Register setPage={setPage} />;
      case 'forgot-password': return <ForgotPassword setPage={setPage} />;
      case 'account': return <Account setPage={setPage} />;
      case 'dashboard': return <Dashboard setPage={setPage} />;
      case 'support': return <Support setPage={setPage} />;
      default: return <Home setPage={setPage} />;
    }
  };

  const isDashboard = page === 'dashboard';

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-slate-900 bg-white selection:bg-blue-100">
      {!isDashboard && <Header setPage={setPage} currentPage={page} />}

      <main className="flex-grow">
        {renderPage()}
      </main>

      {!isDashboard && <Footer setPage={setPage} />}

      {!['cart', 'checkout', 'dashboard', 'login', 'register'].includes(page) && (
        <button
          onClick={() => setPage('cart')}
          className="fixed bottom-10 right-10 w-16 h-16 bg-[#49b6ff] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40 border-none cursor-pointer"
        >
          <ShoppingBag className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 bg-[#ff499e] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-4 border-white">2</span>
        </button>
      )}
    </div>
  );
}
