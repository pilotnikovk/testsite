import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { boardId, boardName, boardModel, clientName, clientPhone, message } = await req.json();

  if (!boardName || !clientName || !clientPhone) {
    return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      boardId: boardId || null,
      boardName,
      boardModel: boardModel || "",
      clientName,
      clientPhone,
      message: message || "",
    },
  });

  return NextResponse.json(order, { status: 201 });
}
