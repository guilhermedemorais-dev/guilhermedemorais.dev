import { Resend } from "resend";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY || !process.env.BRIEFING_TO_EMAIL) {
      return Response.json(
        { error: "Configuração de e-mail incompleta." },
        { status: 500 }
      );
    }

    const { briefing, transcript } = await request.json();
    const resend = new Resend(process.env.RESEND_API_KEY);

    const nome = briefing?.nome || "Lead sem nome";
    const empresa = briefing?.empresa || "Sem empresa informada";

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

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Falha ao enviar briefing." }, { status: 500 });
  }
}
