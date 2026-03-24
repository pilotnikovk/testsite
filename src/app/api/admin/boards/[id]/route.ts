import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "ADMIN") return null;
  return session;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = parseInt(params.id);
  const data = await req.json();

  const board = await prisma.board.update({
    where: { id },
    data: {
      name: data.name,
      model: data.model,
      brand: data.brand || "",
      category: data.category,
      price: data.price ?? null,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      inStock: data.inStock ?? true,
    },
  });

  return NextResponse.json(board);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = parseInt(params.id);
  await prisma.board.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
