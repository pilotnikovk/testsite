"use client";

import { useState } from "react";

type Board = {
  id: number;
  name: string;
  model: string;
  description: string | null;
  price: number | null;
  category: string;
  brand: string;
  compatibleModels: string;
  imageUrl: string | null;
  inStock: boolean;
  createdAt: Date;
};

const BRANDS = [
  { key: "Samsung", label: "Samsung", color: "from-blue-600 to-blue-800" },
  { key: "LG", label: "LG", color: "from-red-500 to-red-700" },
  { key: "Другие", label: "Другие", color: "from-gray-500 to-gray-700" },
];

export default function CatalogClient({ boards, categories }: { boards: Board[]; categories: string[] }) {
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const getBrandForBoard = (b: Board) => {
    if (b.brand === "Samsung") return "Samsung";
    if (b.brand === "LG") return "LG";
    return "Другие";
  };

  if (!activeBrand) {
    return (
      <div>
        <p className="text-gray-500 mb-8">Выберите бренд для просмотра каталога:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
          {BRANDS.map((brand) => {
            const count = boards.filter((b) => getBrandForBoard(b) === brand.key).length;
            return (
              <button
                key={brand.key}
                onClick={() => setActiveBrand(brand.key)}
                className={`bg-gradient-to-br ${brand.color} text-white rounded-2xl p-8 text-center hover:scale-105 transition-transform shadow-md`}
              >
                <div className="text-3xl font-bold mb-2">{brand.label}</div>
                <div className="text-white/70 text-sm">{count} позиций</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const filtered = boards.filter((b) => {
    const matchBrand = getBrandForBoard(b) === activeBrand;
    const matchSearch =
      search === "" ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.model.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Все" || b.category === activeCategory;
    const matchStock = !inStockOnly || b.inStock;
    return matchBrand && matchSearch && matchCat && matchStock;
  });

  return (
    <div>
      {/* Brand tabs */}
      <div className="flex gap-3 mb-6 flex-wrap items-center">
        {BRANDS.map((brand) => (
          <button
            key={brand.key}
            onClick={() => { setActiveBrand(brand.key); setActiveCategory("Все"); setSearch(""); }}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors ${
              activeBrand === brand.key
                ? "bg-primary-800 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {brand.label}
          </button>
        ))}
        <button
          onClick={() => { setActiveBrand(null); setActiveCategory("Все"); setSearch(""); }}
          className="ml-auto text-sm text-gray-400 hover:text-gray-600 underline"
        >
          ← Все бренды
        </button>
      </div>

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
            <div
              key={board.id}
              onClick={() => setSelectedBoard(board)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden cursor-pointer"
            >
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

      {/* Modal */}
      {selectedBoard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedBoard(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="h-48 bg-gradient-to-br from-primary-100 to-blue-50 flex items-center justify-center rounded-t-2xl">
              {selectedBoard.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedBoard.imageUrl} alt={selectedBoard.name} className="h-full w-full object-cover rounded-t-2xl" />
              ) : (
                <svg className="w-16 h-16 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              )}
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-primary-800">{selectedBoard.name}</h2>
                  <p className="text-sm text-gray-400 font-mono mt-0.5">{selectedBoard.model}</p>
                </div>
                <button
                  onClick={() => setSelectedBoard(null)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${selectedBoard.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {selectedBoard.inStock ? "В наличии" : "Нет в наличии"}
                </span>
                {selectedBoard.brand && (
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-primary-700 font-medium">{selectedBoard.brand}</span>
                )}
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">{selectedBoard.category}</span>
              </div>

              {/* Description */}
              {selectedBoard.description && (
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{selectedBoard.description}</p>
              )}

              {/* Compatible models */}
              {selectedBoard.compatibleModels && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-primary-800 mb-2">Совместимые модели:</h3>
                  <ul className="space-y-1">
                    {selectedBoard.compatibleModels.split("\n").filter(Boolean).map((m, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
                        {m.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price */}
              {selectedBoard.price && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-gray-500 text-sm">Цена:</span>
                  <span className="text-2xl font-bold text-accent-500">{selectedBoard.price.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
