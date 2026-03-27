export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import AdminClient from "./AdminClient";

async function getData() {
  const [users, boards, settings, orders] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.board.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.setting.findMany(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return { users, boards, settings: Object.fromEntries(settings.map((s) => [s.key, s.value])), orders };
}

export default async function AdminPage() {
  const { users, boards, settings, orders } = await getData();
  return <AdminClient users={users} boards={boards} settings={settings} orders={orders} />;
}
