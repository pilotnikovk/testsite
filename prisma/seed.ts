import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@remont.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        name: "Администратор",
        role: "ADMIN",
        approved: true,
      },
    });
    console.log(`Admin created: ${adminEmail} / ${adminPassword}`);
  }

  // Default settings
  const defaults: { key: string; value: string }[] = [
    { key: "site_name", value: "РемонтТехники" },
    { key: "phone", value: "+7 (915) 775-9756" },
    { key: "address", value: "г. Москва, ул. Примерная, д. 1" },
    { key: "email", value: "info@remont.local" },
    { key: "work_hours", value: "Пн–Пт: 9:00–20:00, Сб: 10:00–18:00" },
    { key: "hero_title", value: "Профессиональный ремонт телевизоров и бытовой техники" },
    { key: "hero_subtitle", value: "Быстро, качественно, с гарантией. Скидка пенсионерам и инвалидам 10%" },
    { key: "about_text", value: "Мы занимаемся ремонтом электроники с 2010 года. За это время отремонтировали более 15 000 единиц техники. Наши мастера имеют высокую квалификацию и постоянно повышают знания." },
  ];

  for (const s of defaults) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  // Sync services — always replace to keep in sync with this list
  const services = [
    { title: "Ремонт телевизоров", description: "Любые марки: Samsung, LG, Sony, Philips и др. Диагностика бесплатно.", icon: "tv", sortOrder: 1 },
    { title: "Ремонт микроволновок", description: "Замена магнетрона, конденсаторов, трансформаторов.", icon: "microwave", sortOrder: 2 },
  ];

  await prisma.service.deleteMany();
  await prisma.service.createMany({ data: services });

  // Sample boards
  const categories = ["Телевизоры", "Стиральные машины", "Холодильники", "Микроволновки"];
  const sampleBoards = [
    { name: "Плата питания", model: "BN44-00932A", brand: "Samsung", category: "Телевизоры", price: 2500, inStock: true, description: "Блок питания для Samsung UE43, UE49, UE55" },
    { name: "Плата питания", model: "EAX67865301", brand: "LG", category: "Телевизоры", price: 3200, inStock: true, description: "Блок питания для LG 43UJ6307, 49UJ6307" },
    { name: "T-CON плата", model: "6871L-5765A", brand: "LG", category: "Телевизоры", price: 4100, inStock: false, description: "T-CON плата LG 55UK6300" },
    { name: "Инвертор мотора", model: "DC92-01803F", brand: "Samsung", category: "Стиральные машины", price: 1800, inStock: true, description: "Модуль инвертора Samsung WF-серия" },
    { name: "Модуль управления", model: "EBR75257104", brand: "LG", category: "Стиральные машины", price: 2900, inStock: true, description: "Модуль управления LG F-серия" },
    { name: "Плата управления", model: "DA92-00596A", brand: "Samsung", category: "Холодильники", price: 3500, inStock: true, description: "Модуль управления Samsung RB-серия" },
    { name: "Инвертор компрессора", model: "EBR73766104", brand: "LG", category: "Холодильники", price: 4800, inStock: false, description: "Инвертор компрессора LG GC-серия" },
    { name: "Плата управления", model: "DE92-03885A", brand: "Samsung", category: "Микроволновки", price: 1200, inStock: true, description: "Плата управления Samsung ME-серия" },
  ];

  const existingBoards = await prisma.board.count();
  if (existingBoards === 0) {
    await prisma.board.createMany({ data: sampleBoards });
    console.log("Sample boards created");
  }

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
