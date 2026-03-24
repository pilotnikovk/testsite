import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const boards = await prisma.board.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(boards);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = await req.json();
  const board = await prisma.board.create({
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

  return NextResponse.json(board, { status: 201 });
}
