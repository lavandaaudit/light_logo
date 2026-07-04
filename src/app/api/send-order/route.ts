import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      comment,
      lightCount,
      lightSize,
      lightColor,
      distance,
      connectionType,
      engraving,
      packaging,
      totalPrice,
    } = body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "2294598@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD || "",
      },
    });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FFD700; text-align: center; margin-bottom: 24px;">Нове замовлення — Kyiv Light Logo</h1>

        <div style="background: #2a2a2a; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
          <h2 style="color: #FFD700; font-size: 16px; margin-bottom: 12px;">Контактна інформація</h2>
          <p><strong>Ім'я:</strong> ${name || "Не вказано"}</p>
          <p><strong>Телефон:</strong> ${phone || "Не вказано"}</p>
          <p><strong>Email:</strong> ${email || "Не вказано"}</p>
          ${comment ? `<p><strong>Коментар:</strong> ${comment}</p>` : ""}
        </div>

        <div style="background: #2a2a2a; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
          <h2 style="color: #FFD700; font-size: 16px; margin-bottom: 12px;">Параметри гірлянди</h2>
          <p><strong>Кількість підсвіток:</strong> ${lightCount} шт</p>
          <p><strong>Розмір підсвітки:</strong> ${lightSize}</p>
          <p><strong>Колір світла:</strong> ${lightColor}</p>
          <p><strong>Відстань між підсвітками:</strong> ${distance}</p>
          <p><strong>Тип підключення:</strong> ${connectionType}</p>
          <p><strong>Гравірування:</strong> ${engraving ? "Так" : "Ні"}</p>
          <p><strong>Індивідуальна упаковка:</strong> ${packaging ? "Так" : "Ні"}</p>
        </div>

        <div style="background: #FFD700; color: #000; border-radius: 8px; padding: 20px; text-align: center;">
          <p style="font-size: 18px; margin: 0;"><strong>Загальна вартість: ${totalPrice} грн</strong></p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: "2294598@gmail.com",
      to: "2294598@gmail.com",
      subject: `Нове замовлення гірлянди — ${name || "Клієнт"} — ${totalPrice} грн`,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send order" },
      { status: 500 }
    );
  }
}