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

type OrderForm = {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  message: string;
};

export default function HomeCatalog({ boards }: { boards: Board[] }) {
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [orderBoard, setOrderBoard] = useState<Board | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => setSelectedBoard(board)}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group"
          >
            <div className="h-48 bg-gradient-to-br from-primary-100 to-blue-50 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
              {board.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={board.imageUrl} alt={board.name} className="h-full w-full object-cover" />
              ) : (
                <svg className="w-16 h-16 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              )}
              {board.inStock && (
                <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  В наличии
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-primary-800 text-lg mb-1 line-clamp-1">{board.name}</h3>
              <p className="text-xs text-gray-400 font-mono mb-2">{board.model}</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">{board.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs bg-blue-50 text-primary-700 px-2 py-1 rounded-lg">{board.category}</span>
                {board.price && (
                  <span className="font-bold text-accent-500 text-lg">
                    {board.price.toLocaleString("ru-RU")} ₽
                  </span>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setOrderBoard(board); }}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                Оставить заявку
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal для деталей */}
      {selectedBoard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedBoard(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-56 bg-gradient-to-br from-primary-100 to-blue-50 flex items-center justify-center rounded-t-2xl">
              {selectedBoard.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedBoard.imageUrl} alt={selectedBoard.name} className="h-full w-full object-cover rounded-t-2xl" />
              ) : (
                <svg className="w-20 h-20 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary-800">{selectedBoard.name}</h2>
                  <p className="text-sm text-gray-400 font-mono mt-0.5">{selectedBoard.model}</p>
                </div>
                <button
                  onClick={() => setSelectedBoard(null)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${selectedBoard.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {selectedBoard.inStock ? "В наличии" : "Нет в наличии"}
                </span>
                {selectedBoard.brand && (
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-primary-700 font-medium">{selectedBoard.brand}</span>
                )}
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">{selectedBoard.category}</span>
              </div>

              {selectedBoard.description && (
                <p className="text-gray-600 leading-relaxed mb-4">{selectedBoard.description}</p>
              )}

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

              {selectedBoard.price && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                  <span className="text-gray-500">Цена:</span>
                  <span className="text-2xl font-bold text-accent-500">{selectedBoard.price.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}

              <button
                onClick={() => { setOrderBoard(selectedBoard); setSelectedBoard(null); }}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Оставить заявку
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка формы заказа */}
      {orderBoard && (
        <OrderModal board={orderBoard} onClose={() => setOrderBoard(null)} />
      )}
    </>
  );
}

function OrderModal({ board, onClose }: { board: Board; onClose: () => void }) {
  const [form, setForm] = useState<OrderForm>({ clientName: "", clientPhone: "", clientEmail: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: board.id,
          boardName: board.name,
          boardModel: board.model,
          ...form,
        }),
      });
      
      if (res.ok) {
        setSent(true);
      } else {
        setError("Ошибка при отправке. Попробуйте позже.");
      }
    } catch {
      setError("Ошибка сети. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-primary-800">Оставить заявку</h2>
              <p className="text-sm text-gray-400 mt-0.5">{board.name} — {board.model}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
              ✕
            </button>
          </div>

          {sent ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-semibold text-primary-800 text-lg">Заявка отправлена!</p>
              <p className="text-sm text-gray-500 mt-1">Мы свяжемся с вами в ближайшее время.</p>
              <button onClick={onClose} className="mt-6 bg-accent-500 hover:bg-accent-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                Закрыть
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя *</label>
                <input
                  required
                  value={form.clientName}
                  onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                  placeholder="Иван Иванов"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                <input
                  required
                  type="tel"
                  value={form.clientPhone}
                  onChange={(e) => setForm((f) => ({ ...f, clientPhone: e.target.value }))}
                  placeholder="+7 (999) 000-00-00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.clientEmail}
                  onChange={(e) => setForm((f) => ({ ...f, clientEmail: e.target.value }))}
                  placeholder="example@mail.ru"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  rows={3}
                  placeholder="Дополнительная информация..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                />
              </div>
              
              {error && <p className="text-red-600 text-sm">{error}</p>}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {loading ? "Отправка..." : "Отправить заявку"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}