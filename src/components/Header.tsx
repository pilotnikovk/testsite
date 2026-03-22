"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-primary-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <svg className="w-8 h-8 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>РемонтТехники</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/#services" className="hover:text-accent-400 transition-colors">Услуги</Link>
            <Link href="/#how" className="hover:text-accent-400 transition-colors">Как работаем</Link>
            <Link href="/#contacts" className="hover:text-accent-400 transition-colors">Контакты</Link>
            <Link href="/catalog" className="hover:text-accent-400 transition-colors">Каталог плат</Link>
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                {(session.user as { role?: string })?.role === "ADMIN" && (
                  <Link href="/admin" className="text-sm hover:text-accent-400 transition-colors">
                    Админ панель
                  </Link>
                )}
                <span className="text-sm text-gray-300">{session.user?.name || session.user?.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm hover:text-accent-400 transition-colors">Войти</Link>
                <Link href="/register" className="text-sm bg-accent-500 hover:bg-accent-600 px-4 py-2 rounded-lg transition-colors">
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 text-sm font-medium border-t border-white/10 pt-3">
            <Link href="/#services" className="block py-2 hover:text-accent-400" onClick={() => setMenuOpen(false)}>Услуги</Link>
            <Link href="/#how" className="block py-2 hover:text-accent-400" onClick={() => setMenuOpen(false)}>Как работаем</Link>
            <Link href="/#contacts" className="block py-2 hover:text-accent-400" onClick={() => setMenuOpen(false)}>Контакты</Link>
            <Link href="/catalog" className="block py-2 hover:text-accent-400" onClick={() => setMenuOpen(false)}>Каталог плат</Link>
            {session ? (
              <>
                {(session.user as { role?: string })?.role === "ADMIN" && (
                  <Link href="/admin" className="block py-2 hover:text-accent-400" onClick={() => setMenuOpen(false)}>Админ панель</Link>
                )}
                <button onClick={() => signOut({ callbackUrl: "/" })} className="block py-2 text-red-300">Выйти</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 hover:text-accent-400" onClick={() => setMenuOpen(false)}>Войти</Link>
                <Link href="/register" className="block py-2 hover:text-accent-400" onClick={() => setMenuOpen(false)}>Регистрация</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
