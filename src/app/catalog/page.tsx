export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogClient from "./CatalogClient";

export default async function CatalogPage() {
  const boards = await prisma.board.findMany({ orderBy: { createdAt: "desc" } });
  const categories = Array.from(new Set(boards.map((b) => b.category))).sort();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-800">Каталог плат и блоков</h1>
            <p className="text-gray-500 mt-1">Запасные части и платы для ремонта техники</p>
          </div>
          <CatalogClient boards={boards} categories={categories} />
        </div>
      </main>
      <Footer />
    </>
  );
}
