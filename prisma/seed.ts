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
    { key: "phone", value: "+7 (915) 775-97-56" },
    { key: "address", value: "г. Ковров, ул. Чернышевского, д. 13" },
    { key: "email", value: "info@remont.local" },
    { key: "work_hours", value: "Ежедневно: 8:00–20:00" },
    { key: "hero_title", value: "Профессиональный ремонт телевизоров и бытовой техники" },
    { key: "hero_subtitle", value: "Быстро, качественно, с гарантией. Скидка пенсионерам и инвалидам 10%" },
    { key: "about_text", value: "Мы занимаемся ремонтом электроники с 2010 года. За это время отремонтировали более 15 000 единиц техники. Наши мастера имеют высокую квалификацию и постоянно повышают знания." },
  ];

  for (const s of defaults) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  // Sync services — always replace to keep in sync with this list
  const services = [
    { title: "Ремонт телевизоров", description: "Любые марки: Samsung, LG, Sony, Philips и др. Диагностика бесплатно.", icon: "tv", sortOrder: 1 },
    { title: "Ремонт микроволновок", description: "Замена магнетрона, конденсаторов, трансформаторов.", icon: "microwave", sortOrder: 2 },
  ];

  await prisma.service.deleteMany();
  await prisma.service.createMany({ data: services });

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
