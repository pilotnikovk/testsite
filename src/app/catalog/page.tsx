import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogClient from "./CatalogClient";
import Link from "next/link";

export default async function CatalogPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-primary-800 mb-3">Каталог плат</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Каталог запасных частей доступен только для зарегистрированных пользователей.
              Зарегистрируйтесь, чтобы получить доступ.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Зарегистрироваться
              </Link>
              <Link
                href="/login"
                className="border-2 border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Уже есть аккаунт
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const boards = await prisma.board.findMany({ orderBy: { createdAt: "desc" } });
  const categories = Array.from(new Set(boards.map((b) => b.category))).sort();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-800">Каталог плат</h1>
            <p className="text-gray-500 mt-1">Запасные части и платы для ремонта техники</p>
          </div>
          <CatalogClient boards={boards} categories={categories} />
        </div>
      </main>
      <Footer />
    </>
  );
}
