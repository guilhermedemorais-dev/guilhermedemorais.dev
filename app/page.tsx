"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { products, projects, services } from "@/data/site";

type Panel = "sobre" | "portfolio" | "servicos" | "blog" | "loja" | "setup" | "videos" | "sdr" | "cartao";
type Message = { role: "user" | "assistant"; content: string };
type SearchItem = { title: string; panel: Panel; text: string };

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

const bootLines = [
  "> INIT GUILHERME.DEV",
  "loading kernel...",
  "mounting portfolio...",
  "loading systems........ OK",
  "loading security....... OK",
  "loading automation..... OK",
  "loading ai modules..... OK",
  "starting interface...",
  "01001001 01101110 01101001 01110100",
  "usr/bin/dev",
  "module.systems",
  "module.security",
  "module.ai",
  "[####################] 100%",
  "> READY",
];

function SocialIcon({ kind }: { kind: "github" | "linkedin" | "instagram" | "youtube" | "tiktok" }) {
  const common = { viewBox: "0 0 24 24", width: 14, height: 14, fill: "currentColor", "aria-hidden": true } as const;
  if (kind === "github") return <svg {...common}><path d="M12 .7A11.3 11.3 0 0 0 8.43 22.72c.57.1.78-.25.78-.55v-2.15c-3.19.69-3.86-1.35-3.86-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.25 3.32.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.03 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.74.11 3.03.73.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.37-5.25 5.65.41.35.78 1.05.78 2.12v3.15c0 .3.21.66.79.55A11.3 11.3 0 0 0 12 .7Z" /></svg>;
  if (kind === "linkedin") return <svg {...common}><path d="M5.2 3.4A2.2 2.2 0 1 1 .8 3.4a2.2 2.2 0 0 1 4.4 0ZM1.2 7h4v13.8h-4V7Zm6.5 0h3.8v1.9h.1c.5-1 1.9-2.4 4.3-2.4 4.6 0 5.4 3 5.4 6.9v7.4h-4v-6.6c0-1.6 0-3.6-2.2-3.6s-2.6 1.7-2.6 3.5v6.7h-4V7Z" /></svg>;
  if (kind === "instagram") return <svg {...common}><path d="M7.3 2h9.4A5.3 5.3 0 0 1 22 7.3v9.4a5.3 5.3 0 0 1-5.3 5.3H7.3A5.3 5.3 0 0 1 2 16.7V7.3A5.3 5.3 0 0 1 7.3 2Zm0 1.9a3.4 3.4 0 0 0-3.4 3.4v9.4a3.4 3.4 0 0 0 3.4 3.4h9.4a3.4 3.4 0 0 0 3.4-3.4V7.3a3.4 3.4 0 0 0-3.4-3.4H7.3Zm9.9 1.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z" /></svg>;
  if (kind === "youtube") return <svg {...common}><path d="M23 12s0-3.5-.45-5.2a3 3 0 0 0-2.1-2.1C18.75 4.2 12 4.2 12 4.2s-6.75 0-8.45.5a3 3 0 0 0-2.1 2.1C1 8.5 1 12 1 12s0 3.5.45 5.2a3 3 0 0 0 2.1 2.1c1.7.5 8.45.5 8.45.5s6.75 0 8.45-.5a3 3 0 0 0 2.1-2.1C23 15.5 23 12 23 12Zm-13 3.4V8.6l6 3.4-6 3.4Z" /></svg>;
  return <svg {...common}><path d="M14.4 2h3.2c.3 2 1.5 3.5 3.4 4v3.2c-1.3 0-2.5-.3-3.4-.9v6.3a6.6 6.6 0 1 1-5.7-6.5v3.3a3.4 3.4 0 1 0 2.5 3.2V2Z" /></svg>;
}

export default function Home() {
  const [panel, setPanel] = useState<Panel>("sobre");
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Me conta o que você está tentando construir. Não precisa saber os termos técnicos." }]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [briefingSent, setBriefingSent] = useState(false);
  const [bootVisible, setBootVisible] = useState(true);
  const [bootExiting, setBootExiting] = useState(false);
  const [bootCount, setBootCount] = useState(0);
  const [interfaceReady, setInterfaceReady] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [progress, setProgress] = useState(0);
  const [typeWord, setTypeWord] = useState("Systems");

  const panelIndex = useMemo(() => String(menu.findIndex((item) => item.id === panel) + 1).padStart(2, "0"), [panel]);

  const searchItems = useMemo<SearchItem[]>(() => {
    const projectItems = projects.map((item) => ({ title: item.title, panel: "portfolio" as Panel, text: `${item.title} ${item.description} ${item.tag}`.toLowerCase() }));
    const productItems = products.map((item) => ({ title: item.title, panel: "loja" as Panel, text: `${item.title} ${item.description} ${item.tag}`.toLowerCase() }));
    const serviceItems = services.map(([title, description]) => ({ title, panel: "servicos" as Panel, text: `${title} ${description}`.toLowerCase() }));
    const fixed: SearchItem[] = [
      { title: "Sobre", panel: "sobre", text: "sobre guilherme software engineer systems security automation" },
      { title: "Blog", panel: "blog", text: "blog notas engenharia desenvolvimento ia segurança arquitetura automação" },
      { title: "Setup", panel: "setup", text: "setup hardware periféricos software equipamentos afiliados" },
      { title: "Vídeos", panel: "videos", text: "vídeos youtube shorts tiktok conteúdo" },
      { title: "Fale comigo", panel: "sdr", text: "fale comigo orçamento projeto briefing chat sdr atendimento" },
      { title: "Cartão digital", panel: "cartao", text: "cartão digital whatsapp redes sociais qr code vcard pdf" },
    ];
    return [...fixed, ...projectItems, ...productItems, ...serviceItems];
  }, []);

  const searchHits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchItems.filter((item) => item.text.includes(q) || item.title.toLowerCase().includes(q)).slice(0, 6);
  }, [searchItems, searchQuery]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setBootVisible(false);
      setInterfaceReady(true);
      return;
    }
    let line = 0;
    const lineTimer = window.setInterval(() => {
      line += 1;
      setBootCount(Math.min(line, bootLines.length));
      if (line >= bootLines.length) window.clearInterval(lineTimer);
    }, 85);
    const exitTimer = window.setTimeout(() => setBootExiting(true), 1500);
    const doneTimer = window.setTimeout(() => {
      setBootVisible(false);
      setInterfaceReady(true);
    }, 1800);
    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const words = ["Systems", "Security", "Automation", "AI"];
    let wi = 0, ci = words[0].length, deleting = true, timer = 0;
    const tick = () => {
      const word = words[wi];
      if (!deleting) {
        ci += 1;
        setTypeWord(word.slice(0, ci));
        if (ci === word.length) {
          deleting = true;
          timer = window.setTimeout(tick, 900);
          return;
        }
      } else {
        ci -= 1;
        setTypeWord(word.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      timer = window.setTimeout(tick, deleting ? 45 : 70);
    };
    timer = window.setTimeout(tick, 900);
    return () => window.clearTimeout(timer);
  }, []);

  function selectPanel(next: Panel) {
    setPanel(next);
    setSearchOpen(false);
    setSearchQuery("");
  }

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
      if (!response.ok) throw new Error(data?.error || "Falha no atendimento.");
      const assistantMessage: Message = { role: "assistant", content: data.reply || "Me conta um pouco mais." };
      const finalMessages = [...nextMessages, assistantMessage];
      setMessages(finalMessages);
      if (data.status === "complete" && data.briefing && !briefingSent) {
        const emailResponse = await fetch("/api/briefing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ briefing: data.briefing, transcript: finalMessages }),
        });
        if (emailResponse.ok) {
          setBriefingSent(true);
          setMessages((current) => [...current, { role: "assistant", content: "Perfeito. Seu briefing foi enviado. Guilherme continua o atendimento com você pelo contato informado." }]);
        }
      }
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", content: error instanceof Error ? error.message : "Tive um problema para responder agora." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {bootVisible && (
        <div className={`bootScreen ${bootExiting ? "exit" : ""}`} aria-hidden="true">
          <div className="bootConsole">
            {bootLines.slice(Math.max(0, bootCount - 10), bootCount).map((line, index) => (
              <div key={`${line}-${index}`} className={line === "> READY" ? "bootReady" : ""}>
                {line}{line === "> READY" && <span className="bootCursor" />}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`siteShell ${interfaceReady ? "ready" : ""}`}>
        <div className="scanlines" />
        <div className="scrollProgress"><span style={{ width: `${progress}%` }} /></div>

        <header className="consolebar reveal reveal1">
          <div className="brand">
            <span>&gt;</span>
            <span>guilhermedemorais.dev</span>
            <button className="cursorButton" aria-label="Abrir pesquisa" onClick={() => setSearchOpen(true)}><span className="cursor" /></button>
          </div>

          <div className={`searchOverlay ${searchOpen ? "open" : ""}`}>
            <span>&gt;</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setSearchOpen(false);
                  setSearchQuery("");
                }
                if (event.key === "Enter" && searchHits[0]) selectPanel(searchHits[0].panel);
              }}
              autoFocus={searchOpen}
              aria-label="Pesquisar no site"
            />
            <button className="cursorButton" aria-label="Fechar pesquisa" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}><span className="cursor" /></button>
          </div>
          <span className="locale">BR</span>
        </header>

        {searchOpen && searchQuery && (
          <div className="searchResults">
            {searchHits.length ? searchHits.map((hit) => (
              <button key={`${hit.panel}-${hit.title}`} className="result" onClick={() => selectPanel(hit.panel)}>
                <strong>{hit.title}</strong><span>{hit.panel}</span>
              </button>
            )) : <div className="result empty"><strong>Nenhum resultado</strong><span>404</span></div>}
          </div>
        )}

        <main className="page">
          <section className="profile">
            <div className="avatar reveal reveal2"><img src="/profile.jpg" alt="Guilherme de Morais" /></div>
            <h1 className="reveal reveal3">GUILHERME DE MORAIS</h1>
            <p className="role reveal reveal4">Software Engineer · <span className="typeLine">{typeWord}</span></p>
            <p className="bio reveal reveal5">Construindo sistemas, automações e produtos digitais que resolvem problemas reais.</p>
            <div className="socials reveal reveal6">
              <a href="https://github.com/guilhermedemorais-dev" target="_blank" rel="noreferrer" aria-label="GitHub"><SocialIcon kind="github" /></a>
              <a href="#" aria-label="LinkedIn"><SocialIcon kind="linkedin" /></a>
              <a href="#" aria-label="Instagram"><SocialIcon kind="instagram" /></a>
              <a href="#" aria-label="YouTube"><SocialIcon kind="youtube" /></a>
              <a href="#" aria-label="TikTok"><SocialIcon kind="tiktok" /></a>
            </div>
          </section>

          <section className="menuShell reveal reveal7">
            <nav className="menu">
              {menu.map((item) => <button key={item.id} className={panel === item.id ? "active" : ""} onClick={() => selectPanel(item.id)}>{item.label}</button>)}
            </nav>
          </section>

          <section className={panel === "sdr" ? "content chatContent reveal reveal8" : "content reveal reveal8"}>
            <div className="topline"><span>&gt; /{panel}</span><span>[ {panelIndex} / 09 ]</span></div>

            {panel === "sobre" && (
              <div className="panel enter">
                <div className="eyebrow">01 · Sobre mim</div>
                <h2>Engenharia, sistemas e segurança.</h2>
                <p className="lead">Software, automação, infraestrutura e produtos digitais com foco em problemas reais.</p>
                <div className="grid2">{services.map(([title, description]) => <article className="lineCard" key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>
              </div>
            )}

            {panel === "portfolio" && (
              <div className="panel enter">
                <div className="eyebrow">02 · Portfólio</div>
                <h2>Projetos que já saíram da ideia.</h2>
                <div className="list">{projects.map((item) => <article className="row" key={item.title}><div className="thumb">{item.tag}</div><div><strong>{item.title}</strong><p>{item.description}</p></div><span className="arrow">→</span></article>)}</div>
              </div>
            )}

            {panel === "servicos" && <div className="panel enter"><div className="eyebrow">03 · Serviços</div><h2>Do problema à solução.</h2><p className="lead">Sistemas web, automações, infraestrutura e segurança.</p></div>}
            {panel === "blog" && <SimplePanel eyebrow="04 · Blog" title="Notas de engenharia." text="Desenvolvimento, IA, segurança, arquitetura e automação." />}

            {panel === "loja" && (
              <div className="panel enter">
                <div className="eyebrow">05 · Loja de software</div><h2>Software pronto para adaptar.</h2>
                <div className="list">{products.map((item) => <article className="row" key={item.title}><div className="thumb">{item.tag}</div><div><strong>{item.title}</strong><p>{item.description}</p></div><span className="arrow">→</span></article>)}</div>
              </div>
            )}

            {panel === "setup" && <SimplePanel eyebrow="06 · Setup / Afiliados" title="Ferramentas que eu realmente uso." text="Hardware, periféricos, software e equipamentos recomendados." />}
            {panel === "videos" && <SimplePanel eyebrow="07 · Vídeos" title="Conteúdo em vídeo." text="YouTube, Shorts, TikTok e outras plataformas." />}
            {panel === "cartao" && <SimplePanel eyebrow="09 · Cartão digital" title="Um contato. Todos os caminhos." text="WhatsApp, redes sociais, QR Code, vCard e PDF." />}

            {panel === "sdr" && (
              <div className="chatPanel enter">
                <div className="chatMessages">
                  {messages.map((message, index) => <div className={`message ${message.role}`} key={index}><span className="messageRole">{message.role === "assistant" ? "SDR" : "VOCÊ"}</span><p>{message.content}</p></div>)}
                  {sending && <div className="typing">processando<span className="cursor inline" /></div>}
                </div>
                <form className="chatComposer" onSubmit={sendMessage}>
                  <span>&gt;</span>
                  <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="descreva seu projeto..." rows={1} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
                  <button type="submit" disabled={sending}>↑</button>
                </form>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

function SimplePanel({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <div className="panel enter"><div className="eyebrow">{eyebrow}</div><h2>{title}</h2><p className="lead">{text}</p></div>;
}
