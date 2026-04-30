export const dynamic = "force-dynamic";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CatalogClient from "./catalog/CatalogClient";

async function getData() {
  const [settings, services, featuredBoards] = await Promise.all([
    prisma.setting.findMany(),
    prisma.service.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.board.findMany({
      where: { inStock: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);
  
  // Получаем уникальные категории для фильтров
  const categories = Array.from(new Set(featuredBoards.map((b) => b.category))).sort();
  
  return {
    s: Object.fromEntries(settings.map((x) => [x.key, x.value])),
    services,
    featuredBoards,
    categories,
  };
}

const serviceIcons: Record<string, React.ReactNode> = {
  tv: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  washing: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM4 7V5a2 2 0 012-2h12a2 2 0 012 2v2M12 13a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
  ),
  fridge: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 3h16a1 1 0 011 1v7H3V4a1 1 0 011-1zM3 11h18v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9zM8 7h1M8 15h1" />
    </svg>
  ),
  microwave: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6h18a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 011-1zM17 10h1M17 14h1M5 8h8v8H5z" />
    </svg>
  ),
  dishwasher: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zM4 8h16M9 12a3 3 0 106 0 3 3 0 00-6 0z" />
    </svg>
  ),
  ac: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h18a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zM8 13v6M12 13v3M16 13v6M6 9h1M10 9h4M17 9h1" />
    </svg>
  ),
};

const steps = [
  { num: "01", title: "Оставьте заявку", text: "Позвоните или напишите нам — опишите неисправность" },
  { num: "02", title: "Диагностика", text: "Мастер проведёт бесплатную диагностику и озвучит стоимость" },
  { num: "03", title: "Ремонт", text: "После вашего согласия выполняем ремонт в кратчайшие сроки" },
  { num: "04", title: "Гарантия", text: "От одного до трех месяцев" },
];

const advantages = [
  { title: "Опыт 20 лет", text: "Более 15 000 отремонтированных устройств", icon: "⭐" },
  { title: "Гарантия", text: "На все виды работ и запчасти", icon: "🛡️" },
  { title: "Выезд на дом", text: "Бесплатный выезд мастера в черте города. Выезд по области платный.", icon: "🚗" },
  { title: "Быстро", text: "95% ремонтов выполняется в день обращения", icon: "⚡" },
];

export default async function HomePage() {
  const { s, services, featuredBoards, categories } = await getData();

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary-900/50 text-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Ремонт телевизоров в Коврове
            </h1>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Платы, блоки ТВ - ЖК Samsung, Lg и другие бренды
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-10 max-w-3xl mx-auto">
              {s.hero_subtitle || "Быстро, качественно, с гарантией. Пенсионерам и инвалидам скидка 10%."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${s.phone}`} className="btn-primary text-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {s.phone}
              </a>
              <a href="#contacts" className="btn-outline text-lg">Узнать стоимость</a>
            </div>
            {/* Stats */}
            <div className="flex justify-center gap-16 mt-16">
              <div>
                <div className="text-4xl font-bold text-accent-500">15K+</div>
                <div className="text-blue-200 text-sm mt-1">ремонтов выполнено</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent-500">20</div>
                <div className="text-blue-200 text-sm mt-1">лет на рынке</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20 bg-white/75">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title">Наши услуги</h2>
            <p className="section-subtitle">Ремонтирую все виды бытовой техники ведущих производителей</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {services.map((service) => (
                <div key={service.id} className="card group">
                  <div className="text-accent-500 mb-4 group-hover:scale-110 transition-transform duration-200 w-fit">
                    {serviceIcons[service.icon] || serviceIcons.tv}
                  </div>
                  <h3 className="text-xl font-semibold text-primary-800 mb-2">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {featuredBoards.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="section-title">Популярные бренды</h2>
                <p className="section-subtitle">Каталог плат для Вашей техники</p>
              </div>
              
              <CatalogClient boards={featuredBoards} categories={categories} />
              
              <div className="text-center mt-12">
                <Link 
                  href="/catalog" 
                  className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-md hover:shadow-lg"
                >
                  Смотреть весь каталог
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Advantages */}
        <section className="py-20 bg-primary-800/50 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title !text-white">Почему выбирают нас</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              {advantages.map((adv) => (
                <div key={adv.title} className="text-center p-6 bg-white/10 rounded-2xl hover:bg-white/15 transition-colors">
                  <div className="text-4xl mb-3">{adv.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{adv.title}</h3>
                  <p className="text-blue-200 text-sm">{adv.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="py-20 bg-white/75">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title">Как мы работаем</h2>
            <p className="section-subtitle">Простой процесс от заявки до получения исправной техники</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {steps.map((step, i) => (
                <div key={step.num} className="relative text-center">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-accent-500/30 z-0" />
                  )}
                  <div className="relative z-10 w-16 h-16 bg-accent-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-primary-800 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-white/75">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="section-title">О нас</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {s.about_text}
              </p>
            </div>
          </div>
        </section>

        {/* Контакты */}
        <section id="contacts" className="py-20 bg-primary-800/50 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title !text-white">Контакты</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {/* Телефон */}
              <div className="text-center p-6 bg-white/10 rounded-2xl">
                <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Телефон</h3>
                <a href={`tel:${s.phone}`} className="text-accent-400 hover:text-accent-300 text-lg">{s.phone}</a>
              </div>

              {/* Адрес */}
              <div className="text-center p-6 bg-white/10 rounded-2xl">
                <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Адрес</h3>
                <p className="text-blue-200">г. Ковров, ул. Чернышевского, 13</p>
              </div>

              {/* Режим работы */}
              <div className="text-center p-6 bg-white/10 rounded-2xl">
                <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Режим работы</h3>
                <p className="text-blue-200 text-sm">{s.work_hours}</p>
              </div>
            </div>

            {/* Карта Яндекса */}
            <div className="mt-10 rounded-xl overflow-hidden border border-white/20 shadow-lg">
              <iframe 
                src="https://yandex.ru/map-widget/v1/?ll=41.31899,56.35898&z=17&pt=41.31899,56.35898"
                width="100%" 
                height="280" 
                frameBorder="0"
                title="Мастер на карте Коврова, ул. Чернышевского 13"
                loading="lazy"
                className="w-full"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}