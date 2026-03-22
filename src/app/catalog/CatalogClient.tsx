"use client";

import { useState } from "react";

type Board = {
  id: number;
  name: string;
  model: string;
  description: string | null;
  price: number | null;
  category: string;
  imageUrl: string | null;
  inStock: boolean;
  createdAt: Date;
};

export default function CatalogClient({ boards, categories }: { boards: Board[]; categories: string[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = boards.filter((b) => {
    const matchSearch =
      search === "" ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.model.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Все" || b.category === activeCategory;
    const matchStock = !inStockOnly || b.inStock;
    return matchSearch && matchCat && matchStock;
  });

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию или артикулу..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-orange-500"
          />
          Только в наличии
        </label>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["Все", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-accent-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 mb-4">Найдено: {filtered.length} позиций</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg">Ничего не найдено</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((board) => (
            <div key={board.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
              {/* Image placeholder */}
              <div className="h-36 bg-gradient-to-br from-primary-100 to-blue-50 flex items-center justify-center">
                {board.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={board.imageUrl} alt={board.name} className="h-full w-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                  </svg>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-primary-800 text-sm leading-tight">{board.name}</h3>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                    board.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}>
                    {board.inStock ? "В наличии" : "Нет"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono mb-2">{board.model}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{board.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-50 text-primary-700 px-2 py-1 rounded-lg">{board.category}</span>
                  {board.price && (
                    <span className="font-bold text-accent-500 text-sm">
                      {board.price.toLocaleString("ru-RU")} ₽
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
