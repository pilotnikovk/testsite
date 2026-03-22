"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type User = { id: number; email: string; name: string | null; role: string; approved: boolean; createdAt: Date };
type Board = { id: number; name: string; model: string; category: string; price: number | null; inStock: boolean; description: string | null; imageUrl: string | null };
type Settings = Record<string, string>;

const TABS = [
  { id: "boards", label: "Платы" },
  { id: "users", label: "Пользователи" },
  { id: "settings", label: "Настройки" },
];

export default function AdminClient({
  users,
  boards,
  settings,
}: {
  users: User[];
  boards: Board[];
  settings: Settings;
}) {
  const router = useRouter();
  const [tab, setTab] = useState("boards");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="bg-primary-800 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <svg className="w-7 h-7 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="font-bold text-lg">Панель администратора</span>
        </div>
        <Link href="/" className="text-sm text-blue-200 hover:text-white transition-colors">← На сайт</Link>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Всего плат" value={boards.length} icon="📦" />
          <StatCard label="В наличии" value={boards.filter((b) => b.inStock).length} icon="✅" />
          <StatCard label="Пользователей" value={users.length} icon="👥" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6 w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? "bg-primary-800 text-white shadow" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "boards" && <BoardsTab boards={boards} onRefresh={() => router.refresh()} />}
        {tab === "users" && <UsersTab users={users} onRefresh={() => router.refresh()} />}
        {tab === "settings" && <SettingsTab settings={settings} onRefresh={() => router.refresh()} />}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-primary-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

// ===================== BOARDS TAB =====================
function BoardsTab({ boards, onRefresh }: { boards: Board[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Board | null>(null);
  const [search, setSearch] = useState("");

  const filtered = boards.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск..."
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 w-60"
        />
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="btn-primary text-sm py-2 px-4"
        >
          + Добавить плату
        </button>
      </div>

      {(showForm || editing) && (
        <BoardForm
          board={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); onRefresh(); }}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Название</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Артикул</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Категория</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Цена</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Наличие</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-primary-800">{b.name}</td>
                  <td className="px-4 py-3 font-mono text-gray-500">{b.model}</td>
                  <td className="px-4 py-3 text-gray-500">{b.category}</td>
                  <td className="px-4 py-3 text-accent-600 font-semibold">
                    {b.price ? `${b.price.toLocaleString("ru-RU")} ₽` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {b.inStock ? "Есть" : "Нет"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => { setEditing(b); setShowForm(false); }}
                        className="text-blue-600 hover:text-blue-800 text-xs underline"
                      >
                        Изменить
                      </button>
                      <DeleteBoardBtn id={b.id} onDeleted={onRefresh} />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">Ничего не найдено</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BoardForm({ board, onClose, onSaved }: { board: Board | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: board?.name || "",
    model: board?.model || "",
    category: board?.category || "",
    price: board?.price?.toString() || "",
    description: board?.description || "",
    imageUrl: board?.imageUrl || "",
    inStock: board?.inStock ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const url = board ? `/api/admin/boards/${board.id}` : "/api/admin/boards";
    const method = board ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: form.price ? parseFloat(form.price) : null }),
    });
    setLoading(false);
    if (res.ok) onSaved();
    else {
      const d = await res.json();
      setError(d.error || "Ошибка");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="font-semibold text-primary-800 mb-4">{board ? "Редактировать плату" : "Добавить плату"}</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Название" value={form.name} onChange={(v) => set("name", v)} required />
        <Field label="Артикул (модель)" value={form.model} onChange={(v) => set("model", v)} required />
        <Field label="Категория" value={form.category} onChange={(v) => set("category", v)} required placeholder="Телевизоры" />
        <Field label="Цена (₽)" value={form.price} onChange={(v) => set("price", v)} type="number" placeholder="2500" />
        <div className="sm:col-span-2">
          <Field label="Описание" value={form.description} onChange={(v) => set("description", v)} />
        </div>
        <Field label="URL изображения" value={form.imageUrl} onChange={(v) => set("imageUrl", v)} placeholder="https://..." />
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 self-end pb-2">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => set("inStock", e.target.checked)}
            className="w-4 h-4 accent-orange-500"
          />
          В наличии
        </label>
        {error && <p className="sm:col-span-2 text-red-600 text-sm">{error}</p>}
        <div className="sm:col-span-2 flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary text-sm py-2 px-5">
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg">
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
      />
    </div>
  );
}

function DeleteBoardBtn({ id, onDeleted }: { id: number; onDeleted: () => void }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!confirm) {
    return (
      <button onClick={() => setConfirm(true)} className="text-red-500 hover:text-red-700 text-xs underline">
        Удалить
      </button>
    );
  }

  return (
    <span className="flex gap-1 items-center">
      <button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          await fetch(`/api/admin/boards/${id}`, { method: "DELETE" });
          onDeleted();
        }}
        className="text-xs text-red-600 font-semibold"
      >
        {loading ? "..." : "Да"}
      </button>
      <button onClick={() => setConfirm(false)} className="text-xs text-gray-400">Нет</button>
    </span>
  );
}

// ===================== USERS TAB =====================
function UsersTab({ users, onRefresh }: { users: User[]; onRefresh: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Имя</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Роль</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-primary-800">{u.name || "—"}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.role !== "ADMIN" && (
                    <div className="flex gap-2 justify-end">
                      <DeleteUserBtn id={u.id} onDeleted={onRefresh} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function DeleteUserBtn({ id, onDeleted }: { id: number; onDeleted: () => void }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!confirm) return (
    <button onClick={() => setConfirm(true)} className="text-xs text-red-500 hover:text-red-700 underline">Удалить</button>
  );

  return (
    <span className="flex gap-1">
      <button disabled={loading} onClick={async () => { setLoading(true); await fetch(`/api/admin/users/${id}`, { method: "DELETE" }); onDeleted(); }} className="text-xs text-red-600 font-semibold">{loading ? "..." : "Да"}</button>
      <button onClick={() => setConfirm(false)} className="text-xs text-gray-400">Нет</button>
    </span>
  );
}

// ===================== SETTINGS TAB =====================
function SettingsTab({ settings, onRefresh }: { settings: Settings; onRefresh: () => void }) {
  const [form, setForm] = useState(settings);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const fields: { key: string; label: string; multiline?: boolean }[] = [
    { key: "site_name", label: "Название сайта" },
    { key: "phone", label: "Телефон" },
    { key: "email", label: "Email" },
    { key: "address", label: "Адрес" },
    { key: "work_hours", label: "Режим работы" },
    { key: "hero_title", label: "Заголовок Hero", multiline: true },
    { key: "hero_subtitle", label: "Подзаголовок Hero", multiline: true },
    { key: "about_text", label: "Текст «О нас»", multiline: true },
  ];

  async function handleSave() {
    setLoading(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setSaved(true);
    onRefresh();
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl">
      <h3 className="font-semibold text-primary-800 mb-6">Настройки сайта</h3>
      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
            {f.multiline ? (
              <textarea
                value={form[f.key] || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
              />
            ) : (
              <input
                type="text"
                value={form[f.key] || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleSave} disabled={loading} className="btn-primary text-sm py-2 px-6">
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Сохранено</span>}
      </div>
    </div>
  );
}
