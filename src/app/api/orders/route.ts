import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

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

  // Send email notification if configured
  if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "РемонтТехники <onboarding@resend.dev>",
        to: process.env.NOTIFY_EMAIL,
        subject: `Новая заявка от ${clientName}`,
        html: `
          <h2>Новая заявка #${order.id}</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td style="padding:8px;color:#666">Плата:</td><td style="padding:8px;font-weight:bold">${boardName} ${boardModel}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Клиент:</td><td style="padding:8px;font-weight:bold">${clientName}</td></tr>
            <tr><td style="padding:8px;color:#666">Телефон:</td><td style="padding:8px;font-weight:bold">${clientPhone}</td></tr>
            ${message ? `<tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Комментарий:</td><td style="padding:8px">${message}</td></tr>` : ""}
          </table>
          <p style="margin-top:16px;color:#888;font-size:12px">Дата: ${new Date(order.createdAt).toLocaleString("ru-RU")}</p>
        `,
      });
    } catch {
      // Email failure should not break order creation
    }
  }

  return NextResponse.json(order, { status: 201 });
}
