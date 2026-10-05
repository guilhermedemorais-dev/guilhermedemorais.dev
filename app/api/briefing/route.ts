import { Resend } from "resend";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function markdownValue(value: unknown) {
  if (Array.isArray(value)) return value.filter(Boolean).map((item) => `- ${String(item)}`).join("\n") || "Não informado";
  const text = String(value ?? "").trim();
  return text || "Não informado";
}

function buildBriefingMarkdown(briefing: any, transcript: Array<{ role?: string; content?: string }> = []) {
  const conversation = Array.isArray(transcript)
    ? transcript.map((m) => `**${m.role === "assistant" ? "ChatCommerce" : "Cliente"}:** ${String(m.content ?? "").trim()}`).join("\n\n")
    : "";

  return `# Briefing comercial — SOPHXY

## Lead
- **Nome:** ${markdownValue(briefing?.nome)}
- **Empresa:** ${markdownValue(briefing?.empresa)}
- **E-mail:** ${markdownValue(briefing?.email)}
- **WhatsApp:** ${markdownValue(briefing?.whatsapp)}

## Demanda
- **Objetivo:** ${markdownValue(briefing?.objetivo)}
- **Problema atual:** ${markdownValue(briefing?.problema)}
- **Solução desejada:** ${markdownValue(briefing?.solucao)}
- **Usuários / público:** ${markdownValue(briefing?.usuarios)}
- **Sistema existente:** ${markdownValue(briefing?.sistemaExistente)}
- **Prazo:** ${markdownValue(briefing?.prazo)}
- **Faixa de investimento:** ${markdownValue(briefing?.investimento)}
- **Prioridade:** ${markdownValue(briefing?.prioridade)}
- **Referências:** ${markdownValue(briefing?.referencias)}

## Funcionalidades essenciais
${markdownValue(briefing?.funcionalidades)}

## Integrações
${markdownValue(briefing?.integracoes)}

## Resumo para precificação
${markdownValue(briefing?.resumo)}

## Conversa
${conversation || "Não disponível"}
`;
}

export async function POST(request: Request) {
  try {
    const { briefing, transcript, channel } = await request.json();
    const nome = briefing?.nome || "Lead sem nome";
    const empresa = briefing?.empresa || "Sem empresa informada";
    const markdown = buildBriefingMarkdown(briefing, transcript);

    let emailSent = false;
    if (process.env.RESEND_API_KEY && process.env.BRIEFING_TO_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const fields = [
        ["Nome", briefing?.nome],
        ["Empresa", briefing?.empresa],
        ["E-mail", briefing?.email],
        ["WhatsApp", briefing?.whatsapp],
        ["Objetivo", briefing?.objetivo],
        ["Problema", briefing?.problema],
        ["Solução", briefing?.solucao],
        ["Usuários", briefing?.usuarios],
        ["Funcionalidades", Array.isArray(briefing?.funcionalidades) ? briefing.funcionalidades.join(", ") : ""],
        ["Integrações", Array.isArray(briefing?.integracoes) ? briefing.integracoes.join(", ") : ""],
        ["Sistema existente", briefing?.sistemaExistente],
        ["Prazo", briefing?.prazo],
        ["Investimento", briefing?.investimento],
        ["Referências", briefing?.referencias],
        ["Prioridade", briefing?.prioridade],
        ["Resumo", briefing?.resumo],
      ];

      const table = fields
        .map(([label, value]) => `<tr><td style="padding:6px 12px 6px 0;color:#777;vertical-align:top"><strong>${escapeHtml(label)}</strong></td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`)
        .join("");

      const conversation = Array.isArray(transcript)
        ? transcript
            .map((m: { role?: string; content?: string }) => `<p><strong>${escapeHtml(m.role)}:</strong> ${escapeHtml(m.content)}</p>`)
            .join("")
        : "";

      const { error } = await resend.emails.send({
        from: process.env.BRIEFING_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: [process.env.BRIEFING_TO_EMAIL],
        subject: `Novo briefing: ${nome} — ${empresa}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:760px;margin:auto">
            <h1>Novo lead qualificado</h1>
            <table style="border-collapse:collapse;width:100%">${table}</table>
            <hr style="margin:28px 0;border:none;border-top:1px solid #ddd">
            <h2>Conversa</h2>
            ${conversation}
          </div>
        `,
      });

      if (error) return Response.json({ error: error.message }, { status: 400 });
      emailSent = true;
    }

    let webhookSent = false;
    if (channel === "commerce" && process.env.BRIEFING_WEBHOOK_URL) {
      const webhookResponse = await fetch(process.env.BRIEFING_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "SOPHXY ChatCommerce",
          type: "commercial_briefing",
          briefing,
          markdown,
          transcript,
        }),
      });

      if (!webhookResponse.ok) {
        return Response.json({ error: "Falha ao encaminhar briefing comercial." }, { status: 502 });
      }
      webhookSent = true;
    }

    if (!emailSent && !webhookSent) {
      return Response.json(
        { error: "Nenhum canal de entrega de briefing está configurado." },
        { status: 500 }
      );
    }

    return Response.json({ ok: true, emailSent, webhookSent });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Falha ao enviar briefing." }, { status: 500 });
  }
}
