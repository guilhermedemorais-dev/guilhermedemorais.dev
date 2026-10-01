"use client";

import { FormEvent, useMemo, useState } from "react";
import { products, projects, services } from "@/data/site";

type Panel = "sobre" | "portfolio" | "servicos" | "blog" | "loja" | "setup" | "videos" | "sdr" | "cartao";
type Message = { role: "user" | "assistant"; content: string };

const menu: { id: Panel; label: string }[] = [
  { id: "sobre", label: "Sobre" },
  { id: "portfolio", label: "Portfólio" },
  { id: "servicos", label: "Serviços" },
  { id: "blog", label: "Blog" },
  { id: "loja", label: "Loja" },
  { id: "setup", label: "Setup" },
  { id: "videos", label: "Vídeos" },
  { id: "sdr", label: "Fale comigo" },
  { id: "cartao", label: "Cartão" },
];

export default function Home() {
  const [panel, setPanel] = useState<Panel>("sobre");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Me conta o que você está tentando construir. Não precisa saber os termos técnicos.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [briefingSent, setBriefingSent] = useState(false);

  const panelIndex = useMemo(
    () => String(menu.findIndex((item) => item.id === panel) + 1).padStart(2, "0"),
    [panel]
  );

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const value = draft.trim();
    if (!value || sending) return;

    const nextMessages = [...messages, { role: "user" as const, content: value }];
    setMessages(nextMessages);
    setDraft("");
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Falha no atendimento.");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "Me conta um pouco mais.",
      };

      const finalMessages = [...nextMessages, assistantMessage];
      setMessages(finalMessages);

      if (data.status === "complete" && data.briefing && !briefingSent) {
        const emailResponse = await fetch("/api/briefing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            briefing: data.briefing,
            transcript: finalMessages,
          }),
        });

        if (emailResponse.ok) {
          setBriefingSent(true);
          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content: "Perfeito. Seu briefing foi enviado. Guilherme continua o atendimento com você pelo contato informado.",
            },
          ]);
        }
      }
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "Tive um problema para responder agora.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="scanlines" />
      <header className="consolebar">
        <div className="brand">
          <span>&gt;</span>
          <span>guilhermedemorais.dev</span>
          <button className="cursorButton" aria-label="Pesquisa">
            <span className="cursor" />
          </button>
        </div>
        <span className="locale">BR</span>
      </header>

      <main className="page">
        <section className="profile">
          <div className="avatar">SUA FOTO AQUI</div>
          <h1>GUILHERME DE MORAIS</h1>
          <p className="role">Software Engineer · Systems · Security · Automation</p>
          <p className="bio">Construindo sistemas, automações e produtos digitais que resolvem problemas reais.</p>
        </section>

        <section className="menuShell">
          <nav className="menu">
            {menu.map((item) => (
              <button
                key={item.id}
                className={panel === item.id ? "active" : ""}
                onClick={() => setPanel(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </section>

        <section className={panel === "sdr" ? "content chatContent" : "content"}>
          <div className="topline">
            <span>&gt; /{panel}</span>
            <span>[ {panelIndex} / 09 ]</span>
          </div>

          {panel === "sobre" && (
            <div className="panel enter">
              <div className="eyebrow">01 · Sobre mim</div>
              <h2>Engenharia, sistemas e segurança.</h2>
              <p className="lead">Software, automação, infraestrutura e produtos digitais com foco em problemas reais.</p>
              <div className="grid2">
                {services.map(([title, description]) => (
                  <article className="lineCard" key={title}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </article>
                ))}
              </div>
            </div>
          )}

          {panel === "portfolio" && (
            <div className="panel enter">
              <div className="eyebrow">02 · Portfólio</div>
              <h2>Projetos que já saíram da ideia.</h2>
              <div className="list">
                {projects.map((item) => (
                  <article className="row" key={item.title}>
                    <div className="thumb">{item.tag}</div>
                    <div><strong>{item.title}</strong><p>{item.description}</p></div>
                    <span>→</span>
                  </article>
                ))}
              </div>
            </div>
          )}

          {panel === "servicos" && (
            <div className="panel enter">
              <div className="eyebrow">03 · Serviços</div>
              <h2>Do problema à solução.</h2>
              <p className="lead">Sistemas web, automações, infraestrutura e segurança.</p>
            </div>
          )}

          {panel === "blog" && <SimplePanel eyebrow="04 · Blog" title="Notas de engenharia." text="Desenvolvimento, IA, segurança, arquitetura e automação." />}
          {panel === "setup" && <SimplePanel eyebrow="06 · Setup / Afiliados" title="Ferramentas que eu realmente uso." text="Hardware, periféricos, software e equipamentos recomendados." />}
          {panel === "videos" && <SimplePanel eyebrow="07 · Vídeos" title="Conteúdo em vídeo." text="YouTube, Shorts, TikTok e outras plataformas." />}
          {panel === "cartao" && <SimplePanel eyebrow="09 · Cartão digital" title="Um contato. Todos os caminhos." text="WhatsApp, redes sociais, QR Code, vCard e PDF." />}

          {panel === "loja" && (
            <div className="panel enter">
              <div className="eyebrow">05 · Loja de software</div>
              <h2>Software pronto para adaptar.</h2>
              <div className="list">
                {products.map((item) => (
                  <article className="row" key={item.title}>
                    <div className="thumb">{item.tag}</div>
                    <div><strong>{item.title}</strong><p>{item.description}</p></div>
                    <span>→</span>
                  </article>
                ))}
              </div>
            </div>
          )}

          {panel === "sdr" && (
            <div className="chatPanel enter">
              <div className="chatMessages">
                {messages.map((message, index) => (
                  <div className={`message ${message.role}`} key={index}>
                    <span className="messageRole">{message.role === "assistant" ? "SDR" : "VOCÊ"}</span>
                    <p>{message.content}</p>
                  </div>
                ))}
                {sending && <div className="typing">processando<span className="cursor inline" /></div>}
              </div>

              <form className="chatComposer" onSubmit={sendMessage}>
                <span>&gt;</span>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="descreva seu projeto..."
                  rows={1}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                />
                <button type="submit" disabled={sending}>↑</button>
              </form>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function SimplePanel({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="panel enter">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      <p className="lead">{text}</p>
    </div>
  );
}
