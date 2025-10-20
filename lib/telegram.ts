export async function sendToTelegram(data: {
  userData: { name: string; phone: string; city: string }
  answers: Record<string, string>
  resolvedAnswers?: Array<{ id: string; question: string; answer: string }>
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error("[v0] Telegram credentials not configured")
    return { success: false, error: "Telegram not configured" }
  }

  // Telegram MarkdownV2 requires escaping these characters
  const escapeMdV2 = (text: string) =>
    (text ?? "")
      .replace(/[_*\[\]()~`>#+\-=|{}.!]/g, (m) => `\\${m}`)

  let message = `🛏️ *Нова заявка на підбір матрацу*\n\n`
  message += `👤 *Контактні дані:*\n`
  message += `Ім'я: ${escapeMdV2(data.userData.name)}\n`
  message += `Телефон: ${escapeMdV2(data.userData.phone)}\n`
  message += `Місто: ${escapeMdV2(data.userData.city)}\n\n`
  message += `📋 *Відповіді на опитування:*\n`

  if (Array.isArray(data.resolvedAnswers) && data.resolvedAnswers.length) {
    for (const item of data.resolvedAnswers) {
      message += `${escapeMdV2(item.question)}: ${escapeMdV2(item.answer)}\n`
    }
  } else {
    Object.entries(data.answers).forEach(([key, value]) => {
      const questionLabel = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      message += `${escapeMdV2(questionLabel)}: ${escapeMdV2(String(value))}\n`
    })
  }

  message += `\n⏰ Дата: ${escapeMdV2(new Date().toLocaleString("uk-UA"))}`

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "MarkdownV2",
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("[v0] Telegram API error:", result)
      return { success: false, error: result.description }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error sending to Telegram:", error)
    return { success: false, error: "Network error" }
  }
}
