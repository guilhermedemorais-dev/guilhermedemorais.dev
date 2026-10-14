"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { caseStudies, evolution, featuredProjects, projects, services, technicalCapabilities } from "@/data/site";

type Panel = "sobre" | "portfolio" | "servicos" | "blog" | "loja" | "setup" | "videos" | "sdr" | "cartao";
type Message = { role: "user" | "assistant"; content: string };
type SearchItem = { title: string; panel: Panel; text: string };

const menu: { id: Panel; label: string }[] = [
  { id: "sobre", label: "Sobre" },
  { id: "servicos", label: "Serviços" },
  { id: "portfolio", label: "Portfólio" },
  { id: "sdr", label: "Fale comigo" },
  { id: "blog", label: "Blog" },
  { id: "loja", label: "Loja" },
  { id: "setup", label: "Setup" },
  { id: "videos", label: "Vídeos" },
  { id: "cartao", label: "Cartão" },
];

const projectMeta: Record<string,{status:string;kind:string;url:string;cover:string}> = {
  "ORION CRM / ERP": {
    status: "EM DESENVOLVIMENTO",
    kind: "Produto / cliente",
    url: "https://github.com/guilhermedemorais-dev/ORION-CRM",
    cover: "https://opengraph.githubassets.com/portfolio-orion/guilhermedemorais-dev/ORION-CRM"
  },
  "HabilitFy": {
    status: "PAUSADO · RETOMADA PLANEJADA",
    kind: "Startup própria",
    url: "https://github.com/guilhermedemorais-dev/Habilitfy",
    cover: "https://opengraph.githubassets.com/portfolio-habilitfy/guilhermedemorais-dev/Habilitfy"
  },
  "PIRCSEEK": {
    status: "PESQUISA",
    kind: "Research",
    url: "https://github.com/guilhermedemorais-dev/PIRCSEEK",
    cover: "https://opengraph.githubassets.com/portfolio-pircseek/guilhermedemorais-dev/PIRCSEEK"
  },
  "Engineering Harness": {
    status: "EM EVOLUÇÃO",
    kind: "Developer tooling",
    url: "https://github.com/guilhermedemorais-dev/Dev-workflow",
    cover: "https://opengraph.githubassets.com/portfolio-harness/guilhermedemorais-dev/Dev-workflow"
  },
  "Salve o Pau Brasil": {
    status: "PLANEJAMENTO MVP",
    kind: "Startup / impacto ambiental",
    url: "https://github.com/guilhermedemorais-dev/paubrasil-",
    cover: "https://opengraph.githubassets.com/portfolio-paubrasil/guilhermedemorais-dev/paubrasil-"
  }
};

const uiTranslations: Record<string,string> = {
  "Sobre":"About","Serviços":"Services","Portfólio":"Portfolio","Loja":"Store","Vídeos":"Videos","Fale comigo":"Contact","Cartão":"Card",
  "Soluções digitais sob medida para empresas que precisam integrar operação, software, automação, inteligência artificial e segurança em um único ecossistema.":"Tailored digital solutions for companies that need to connect operations, software, automation, artificial intelligence and security in a single ecosystem.",
  "Cabo Frio, RJ · Brasil · Sistemas sob medida":"Cabo Frio, RJ · Brazil · Tailored systems",
  "Iniciar ChatCommerce →":"Start ChatCommerce →",
  "Entendo problemas, desenho soluções técnicas e transformo complexidade em sistemas que podem ser construídos, operados e evoluídos.":"I understand problems, design technical solutions and turn complexity into systems that can be built, operated and evolved.",
  "Cabo Frio, RJ · Brasil ·":"Cabo Frio, RJ · Brazil ·",
  "01 · Posicionamento":"01 · Positioning",
  "Engenharia para problemas que não cabem em uma stack.":"Engineering for problems that do not fit into a single stack.",
  "Atuo como Solutions Architect e Software Engineer em cenários que exigem visão de sistema, autonomia técnica e capacidade de atravessar produto, software, infraestrutura, automação, IA e segurança sem tratar nenhuma tecnologia como resposta universal.":"I work as a Solutions Architect and Software Engineer in scenarios that require systems thinking, technical autonomy and the ability to move across product, software, infrastructure, automation, AI and security without treating any technology as a universal answer.",
  "Visão sistêmica":"Systems thinking",
  "Leio o cenário inteiro antes de tomar decisão: operação, usuários, dependências, integrações, riscos, custo e impacto no negócio.":"I read the whole scenario before making decisions: operations, users, dependencies, integrations, risks, cost and business impact.",
  "Decisão técnica":"Technical decision-making",
  "Escolho arquitetura, stack e abordagem pelo contexto. Não pelo framework da moda, nem por apego a ferramenta.":"I choose architecture, stack and approach based on context, not the framework of the week or attachment to a tool.",
  "Execução hands-on":"Hands-on execution",
  "Consigo sair da estratégia e entrar na implementação, validar partes críticas e conduzir a solução até funcionar de verdade.":"I can move from strategy into implementation, validate critical parts and lead the solution until it actually works.",
  "Evolução profissional":"Professional evolution",
  "Base técnica":"Technical foundation",
  "Minha trajetória passou por infraestrutura, desenvolvimento, sistemas, operações digitais e construção de produtos.":"My path has crossed infrastructure, development, systems, digital operations and product building.",
  "Liderança técnica, consultoria e contato direto com operações ampliaram meu olhar de código para processo, integração, risco e resultado.":"Technical leadership, consulting and direct exposure to operations expanded my view from code to process, integration, risk and outcomes.",
  "Atuação atual":"Current focus",
  "Hoje combino arquitetura de soluções e engenharia de software para transformar cenários complexos em soluções que possam ser implementadas, operadas e evoluídas.":"Today I combine solutions architecture and software engineering to turn complex scenarios into solutions that can be implemented, operated and evolved.",
  "Meu valor não está em dominar uma stack específica. Está em conseguir entender cenários complexos, tomar boas decisões técnicas e transformar essas decisões em sistemas que funcionam.":"My value is not in mastering one specific stack. It is in understanding complex scenarios, making sound technical decisions and turning them into systems that work.",
  "Arquitetura & Decisão Técnica":"Architecture & Technical Decision-Making",
  "Estruturo soluções, avalio trade-offs e defino como sistemas, dados, integrações e infraestrutura devem trabalhar juntos.":"I structure solutions, evaluate trade-offs and define how systems, data, integrations and infrastructure should work together.",
  "Engenharia de Software":"Software Engineering",
  "Projeto e construo aplicações, plataformas, APIs e sistemas internos preparados para evoluir com a operação.":"I design and build applications, platforms, APIs and internal systems prepared to evolve with the operation.",
  "Automação & IA":"Automation & AI",
  "Aplico automação e inteligência artificial onde existe ganho real de eficiência, velocidade ou capacidade operacional.":"I apply automation and artificial intelligence where they create real gains in efficiency, speed or operational capacity.",
  "Consultoria Técnica":"Technical Consulting",
  "Diagnóstico cenários, identifico gargalos e ajudo empresas a decidir o que construir, integrar, modernizar ou substituir.":"I diagnose scenarios, identify bottlenecks and help companies decide what to build, integrate, modernize or replace.",
  "Ver portfólio →":"View portfolio →","Ver sistemas →":"View systems →",
  "02 · Portfólio":"02 · Portfolio","Produtos, startups e pesquisa aplicada.":"Products, startups and applied research.",
  "Projetos que mostram como eu penso, construo e valido soluções em contextos diferentes.":"Projects that show how I think, build and validate solutions across different contexts.",
  "Projetos & Startups":"Projects & Startups","Pesquisa & Engenharia":"Research & Engineering",
  "ver projeto ↗":"view project ↗","ver estudo ↗":"view research ↗","Sistemas & soluções comerciais →":"Commercial systems & solutions →",
  "03 · Atuação":"03 · Practice","Onde eu entro e gero valor.":"Where I step in and create value.",
  "Da decisão técnica à execução, atuo em cenários que exigem arquitetura, engenharia, integração, automação e visão de operação.":"From technical decisions to execution, I work in scenarios that require architecture, engineering, integration, automation and operational awareness.",
  "Notas de engenharia.":"Engineering notes.","Arquitetura, IA, segurança, software e pesquisa técnica.":"Architecture, AI, security, software and technical research.",
  "05 · Sistemas & Soluções Comerciais":"05 · Commercial Systems & Solutions",
  "Tecnologia que se adapta à operação, não o contrário.":"Technology that adapts to the operation, not the other way around.",
  "A SOPHXY reúne sistemas, automações e soluções que podem ser implantados, personalizados e integrados conforme a realidade de cada negócio.":"SOPHXY brings together systems, automations and solutions that can be deployed, customized and integrated to match each business operation.",
  "Catálogo em preparação. O ChatCommerce coleta o escopo e encaminha o briefing para análise e precificação.":"Catalog in preparation. ChatCommerce collects the scope and forwards the briefing for analysis and pricing.",
  "06 · Setup / Afiliados":"06 · Setup / Affiliates","Ferramentas que eu realmente uso.":"Tools I actually use.","Hardware, software e ferramentas do meu fluxo de trabalho.":"Hardware, software and tools from my real workflow.",
  "07 · Vídeos":"07 · Videos","Conteúdo em construção.":"Content in progress.","Tecnologia, engenharia, IA, segurança e a vida fora da tela.":"Technology, engineering, AI, security and life beyond the screen.",
  "09 · Cartão digital":"09 · Digital card","Um contato. Todos os caminhos.":"One contact. Every path.","Cabo Frio, RJ · Brasil":"Cabo Frio, RJ · Brazil",
  "VOCÊ":"YOU","processando":"processing","descreva seu projeto...":"describe your project...",
  "Sistema empresarial para centralizar clientes, estoque, vendas, PDV, financeiro e automações em uma única operação.":"Business system that centralizes customers, inventory, sales, POS, finance and automations in a single operation.",
  "Startup SaaS criada para digitalizar e organizar a operação de autoescolas, instrutores e alunos.":"SaaS startup created to digitize and organize the operation of driving schools, instructors and students.",
  "Startup de tecnologia e impacto ambiental em fase de planejamento do MVP, com monitoramento ambiental, IA e componentes Web3.":"Technology and environmental impact startup in MVP planning, combining environmental monitoring, AI and Web3 components.",
  "Pesquisa técnica sobre recuperação de contexto, busca híbrida e eficiência em sistemas baseados em LLMs.":"Technical research on context retrieval, hybrid search and efficiency in LLM-based systems.",
  "Pesquisa e engenharia aplicada a governança de desenvolvimento com agentes, validação, segurança e processos reproduzíveis.":"Research and applied engineering for agent-based development governance, validation, security and reproducible processes.",
  "EM DESENVOLVIMENTO":"IN DEVELOPMENT","Produto / cliente":"Product / client","PAUSADO · RETOMADA PLANEJADA":"PAUSED · RESUME PLANNED","Startup própria":"Own startup",
  "PLANEJAMENTO MVP":"MVP PLANNING","Startup / impacto ambiental":"Startup / environmental impact","PESQUISA":"RESEARCH","EM EVOLUÇÃO":"IN EVOLUTION"
};
const uiTranslationsReverse: Record<string,string> = Object.fromEntries(Object.entries(uiTranslations).map(([br,en]) => [en,br]));

const bootLines = [
  "> INIT GUILHERME.DEV",
  "loading kernel...",
  "mounting portfolio...",
  "loading systems........ OK",
  "loading security....... OK",
  "loading ai modules..... OK",
  "starting interface...",
  "module.architecture",
  "module.security",
  "module.ai",
  "[####################] 100%",
  "> READY",
];


function SocialIcon({ kind }: { kind: "github" | "linkedin" | "instagram" }) {
  const common = { viewBox: "0 0 24 24", width: 14, height: 14, fill: "currentColor", "aria-hidden": true } as const;
  if (kind === "github") return <svg {...common}><path d="M12 .7A11.3 11.3 0 0 0 8.43 22.72c.57.1.78-.25.78-.55v-2.15c-3.19.69-3.86-1.35-3.86-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.25 3.32.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.03 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.74.11 3.03.73.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.37-5.25 5.65.41.35.78 1.05.78 2.12v3.15c0 .3.21.66.79.55A11.3 11.3 0 0 0 12 .7Z" /></svg>;
  if (kind === "linkedin") return <svg {...common}><path d="M5.2 3.4A2.2 2.2 0 1 1 .8 3.4a2.2 2.2 0 0 1 4.4 0ZM1.2 7h4v13.8h-4V7Zm6.5 0h3.8v1.9h.1c.5-1 1.9-2.4 4.3-2.4 4.6 0 5.4 3 5.4 6.9v7.4h-4v-6.6c0-1.6 0-3.6-2.2-3.6s-2.6 1.7-2.6 3.5v6.7h-4V7Z" /></svg>;
  return <svg {...common}><path d="M7.3 2h9.4A5.3 5.3 0 0 1 22 7.3v9.4a5.3 5.3 0 0 1-5.3 5.3H7.3A5.3 5.3 0 0 1 2 16.7V7.3A5.3 5.3 0 0 1 7.3 2Zm0 1.9a3.4 3.4 0 0 0-3.4 3.4v9.4a3.4 3.4 0 0 0 3.4 3.4h9.4a3.4 3.4 0 0 0 3.4-3.4V7.3a3.4 3.4 0 0 0-3.4-3.4H7.3Zm9.9 1.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z" /></svg>;
}

export default function Home() {
  const [panel, setPanel] = useState<Panel>("sobre");
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Me conta o que você está tentando construir. Não precisa saber os termos técnicos." }]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [briefingSent, setBriefingSent] = useState(false);
  const [chatMode, setChatMode] = useState<"portfolio" | "commerce">("portfolio");
  const [bootVisible, setBootVisible] = useState(true);
  const [bootExiting, setBootExiting] = useState(false);
  const [bootCount, setBootCount] = useState(0);
  const [bootProgress, setBootProgress] = useState(0);
  const [interfaceReady, setInterfaceReady] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [progress, setProgress] = useState(0);
  const [typeWord, setTypeWord] = useState("Architecture");
  const [locale, setLocale] = useState<"br" | "en">("br");

  const panelIndex = useMemo(() => String(menu.findIndex((item) => item.id === panel) + 1).padStart(2, "0"), [panel]);

  const searchItems = useMemo<SearchItem[]>(() => {
    const projectItems = projects.map((item) => ({ title: item.title, panel: "portfolio" as Panel, text: `${item.title} ${item.description} ${item.tag}`.toLowerCase() }));
    const serviceItems = services.map(([title, description]) => ({ title, panel: "servicos" as Panel, text: `${title} ${description}`.toLowerCase() }));
    const fixed: SearchItem[] = [
      { title: "Sobre", panel: "sobre", text: "sobre guilherme solutions architect software engineering security ai cabo frio" },
      { title: "Blog", panel: "blog", text: "blog engenharia inteligência artificial segurança arquitetura" },
      { title: "Setup", panel: "setup", text: "setup hardware software ferramentas" },
      { title: "Vídeos", panel: "videos", text: "vídeos conteúdo" },
      { title: "Fale comigo", panel: "sdr", text: "fale comigo projeto briefing consultoria" },
      { title: "Cartão digital", panel: "cartao", text: "contato linkedin instagram github cabo frio" },
    ];
    return [...fixed, ...projectItems, ...serviceItems];
  }, []);

  const searchHits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchItems.filter((item) => item.text.includes(q) || item.title.toLowerCase().includes(q)).slice(0, 6);
  }, [searchItems, searchQuery]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setBootVisible(false); setInterfaceReady(true); return; }

    const duration = 3000;
    const startedAt = performance.now();
    let raf = 0;
    const animate = (now: number) => {
      const value = Math.min(1, (now - startedAt) / duration);
      setBootProgress(value);
      setBootCount(Math.min(bootLines.length, Math.max(1, Math.floor(value * bootLines.length) + 1)));
      if (value < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const exitTimer = window.setTimeout(() => setBootExiting(true), duration + 120);
    const doneTimer = window.setTimeout(() => { setBootVisible(false); setInterfaceReady(true); }, duration + 450);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(exitTimer); window.clearTimeout(doneTimer); };
  }, []);

  useEffect(() => {
    const map = locale === "en" ? uiTranslations : uiTranslationsReverse;
    const root = document.querySelector(".siteShell");
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    let current = walker.nextNode();
    while (current) {
      nodes.push(current as Text);
      current = walker.nextNode();
    }
    for (const node of nodes) {
      const raw = node.nodeValue ?? "";
      const trimmed = raw.trim();
      const translated = map[trimmed];
      if (translated) node.nodeValue = raw.replace(trimmed, translated);
    }
    const composer = document.querySelector(".chatComposer textarea") as HTMLTextAreaElement | null;
    if (composer) composer.placeholder = locale === "en" ? "describe your project..." : "descreva seu projeto...";
    document.documentElement.lang = locale === "en" ? "en" : "pt-BR";
  }, [locale, panel, interfaceReady]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  useEffect(() => {
    const words = ["Architecture", "Software", "Security", "AI"];
    let wi = 0, ci = words[0].length, deleting = true, timer = 0;
    const tick = () => {
      const word = words[wi];
      if (!deleting) {
        ci += 1; setTypeWord(word.slice(0, ci));
        if (ci === word.length) { deleting = true; timer = window.setTimeout(tick, 900); return; }
      } else {
        ci -= 1; setTypeWord(word.slice(0, ci));
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
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

  function startCommerceChat() {
    setChatMode("commerce");
    setBriefingSent(false);
    setMessages([{ role: "assistant", content: "Me conta o que sua empresa precisa resolver. Vou levantar o escopo para a SOPHXY analisar e precificar." }]);
    setPanel("sdr");
    setSearchOpen(false);
    setSearchQuery("");
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const value = draft.trim();
    if (!value || sending) return;
    const nextMessages = [...messages, { role: "user" as const, content: value }];
    setMessages(nextMessages); setDraft(""); setSending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, mode: chatMode }),
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
          body: JSON.stringify({ briefing: data.briefing, transcript: finalMessages, channel: chatMode }),
        });
        if (emailResponse.ok) {
          setBriefingSent(true);
          setMessages((current) => [...current, { role: "assistant", content: chatMode === "commerce" ? "Briefing concluído. A SOPHXY recebeu o escopo para análise e precificação." : "Perfeito. Seu briefing foi enviado. Guilherme continua o atendimento com você pelo contato informado." }]);
        }
      }
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", content: error instanceof Error ? error.message : "Tive um problema para responder agora." }]);
    } finally { setSending(false); }
  }

  return (
    <>
      {bootVisible && (
        <div className={`bootScreen ${bootExiting ? "exit" : ""}`} aria-hidden="true">
          <div className="bootConsole bootConsoleFull">
            {bootLines.slice(0, bootCount).map((line, index) => (
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
            <span>&gt;</span><span>guilhermedemorais.dev</span>
            <button className="cursorButton" aria-label="Abrir pesquisa" onClick={() => setSearchOpen(true)}><span className="cursor" /></button>
          </div>
          <div className={`searchOverlay ${searchOpen ? "open" : ""}`}>
            <span>&gt;</span>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
                if (e.key === "Enter" && searchHits[0]) selectPanel(searchHits[0].panel);
              }}
              autoFocus={searchOpen} aria-label="Pesquisar no site" />
            <button className="cursorButton" aria-label="Fechar pesquisa" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}><span className="cursor" /></button>
          </div>
          <button className="locale localeToggle" type="button" onClick={() => setLocale((current) => current === "br" ? "en" : "br")} aria-label={locale === "en" ? "Mudar para português do Brasil" : "Switch to English"}><span className={locale === "br" ? "active" : ""}>BR</span><span>/</span><span className={locale === "en" ? "active" : ""}>EN</span></button>
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
          {panel === "loja" ? (
            <section className="profile companyProfile">
              <div className="companyAvatar reveal reveal2"><img src="/sophxy-logo.webp" alt="SOPHXY" /></div>
              <h1 className="reveal reveal3">SOPHXY</h1>
              <p className="role reveal reveal4">Digital Systems Security · Software House</p>
              <p className="bio reveal reveal5">Soluções digitais sob medida para empresas que precisam integrar operação, software, automação, inteligência artificial e segurança em um único ecossistema.</p>
              <p className="location reveal reveal5">Cabo Frio, RJ · Brasil · Sistemas sob medida</p>
              <div className="companyActions reveal reveal6">
                <button type="button" onClick={startCommerceChat}>Iniciar ChatCommerce →</button>
              </div>
            </section>
          ) : panel !== "sdr" && (
            <section className="profile">
              <div className="avatar reveal reveal2"><img src="/profile.jpg" alt="Guilherme de Morais" /></div>
              <h1 className="reveal reveal3">GUILHERME DE MORAIS</h1>
              <p className="role reveal reveal4">Solutions Architect · Software Engineering · Security & AI</p>
              <p className="bio reveal reveal5">Entendo problemas, desenho soluções técnicas e transformo complexidade em sistemas que podem ser construídos, operados e evoluídos.</p>
              <p className="location reveal reveal5">Cabo Frio, RJ · Brasil · <span className="typeLine">{typeWord}</span></p>
              <div className="socials reveal reveal6">
                <a href="https://github.com/guilhermedemorais-dev" target="_blank" rel="noreferrer" aria-label="GitHub"><SocialIcon kind="github" /></a>
                <a href="https://www.linkedin.com/in/guilherme-de-morais-a440a8132" target="_blank" rel="noreferrer" aria-label="LinkedIn"><SocialIcon kind="linkedin" /></a>
                <a href="https://www.instagram.com/guilhermedmoraisss" target="_blank" rel="noreferrer" aria-label="Instagram"><SocialIcon kind="instagram" /></a>
              </div>
            </section>
          )}

          <section className="menuShell reveal reveal7">
            <nav className="menu">
              {menu.map((item) => <button key={item.id} className={panel === item.id ? "active" : ""} onClick={() => selectPanel(item.id)}>{item.label}</button>)}
            </nav>
          </section>

          <section className={panel === "sdr" ? "content chatContent reveal reveal8" : "content reveal reveal8"}>
            <div className="topline"><span>&gt; /{panel}</span><span>[ {panelIndex} / 09 ]</span></div>

            {panel === "sobre" && (
              <div className="panel enter">
                <div className="eyebrow">01 · Posicionamento</div>
                <h2>Engenharia para problemas que não cabem em uma stack.</h2>
                <p className="lead">Atuo como Solutions Architect e Software Engineer em cenários que exigem visão de sistema, autonomia técnica e capacidade de atravessar produto, software, infraestrutura, automação, IA e segurança sem tratar nenhuma tecnologia como resposta universal.</p>

                <div className="valueGrid">
                  <article className="valueCard"><span>01</span><h3>Visão sistêmica</h3><p>Leio o cenário inteiro antes de tomar decisão: operação, usuários, dependências, integrações, riscos, custo e impacto no negócio.</p></article>
                  <article className="valueCard"><span>02</span><h3>Decisão técnica</h3><p>Escolho arquitetura, stack e abordagem pelo contexto. Não pelo framework da moda, nem por apego a ferramenta.</p></article>
                  <article className="valueCard"><span>03</span><h3>Execução hands-on</h3><p>Consigo sair da estratégia e entrar na implementação, validar partes críticas e conduzir a solução até funcionar de verdade.</p></article>
                </div>

                <div className="evolutionBlock">
                  <div className="eyebrow">Evolução profissional</div>
                  {evolution.map(([title,text]) => (
                    <article className="evolutionItem" key={title}><h3>{title}</h3><p>{text}</p></article>
                  ))}
                </div>

                <div className="quoteBlock">Meu valor não está em dominar uma stack específica. Está em conseguir entender cenários complexos, tomar boas decisões técnicas e transformar essas decisões em sistemas que funcionam.</div>

                <div className="grid2">{services.map(([title, description]) => <article className="lineCard" key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>

                <div className="evolutionBlock">
                  <div className="eyebrow">Technical capabilities</div>
                  {technicalCapabilities.map(([title, items]) => (
                    <article className="evolutionItem" key={title}><h3>{title}</h3><p>{items}</p></article>
                  ))}
                </div>

                <div className="ctaRow">
                  <button onClick={() => selectPanel("portfolio")}>Ver portfólio →</button>
                  <button onClick={() => selectPanel("loja")}>Ver sistemas →</button>
                </div>
              </div>
            )}

            {panel === "portfolio" && (
              <div className="panel enter">
                <div className="eyebrow">02 · Portfólio</div>
                <h2>Produtos, startups e pesquisa aplicada.</h2>
                <p className="lead">Projetos que mostram como eu penso, construo e valido soluções em contextos diferentes.</p>

                <div className="sectionLabel">Projetos & Startups</div>
                <div className="projectGrid">
                  {featuredProjects.map((item) => {
                    const meta=projectMeta[item.title];
                    return <a className="projectCard" key={item.title} href={meta?.url || "#"} target="_blank" rel="noreferrer">
                      <div className="projectCover">{meta?.cover ? <img src={meta.cover} alt="" /> : <span>{item.tag}</span>}</div>
                      <div className="projectMeta"><span>{meta?.status || "PROJETO"}</span><span>{meta?.kind || item.tag}</span></div>
                      <h3>{item.title}</h3><p>{item.description}</p><div className="projectLink">ver projeto ↗</div>
                    </a>;
                  })}
                </div>

                <div className="sectionLabel caseLabel">Pesquisa & Engenharia</div>
                <div className="projectGrid">
                  {caseStudies.map((item) => {
                    const meta=projectMeta[item.title];
                    return <a className="projectCard" key={item.title} href={meta?.url || "#"} target="_blank" rel="noreferrer">
                      <div className="projectCover">{meta?.cover ? <img src={meta.cover} alt="" /> : <span>{item.tag}</span>}</div>
                      <div className="projectMeta"><span>{meta?.status || "CASE"}</span><span>{meta?.kind || item.tag}</span></div>
                      <h3>{item.title}</h3><p>{item.description}</p><div className="projectLink">ver estudo ↗</div>
                    </a>;
                  })}
                </div>

                <div className="ctaRow"><button onClick={() => selectPanel("loja")}>Sistemas & soluções comerciais →</button></div>
              </div>
            )}

            {panel === "servicos" && (
              <div className="panel enter"><div className="eyebrow">03 · Atuação</div><h2>Onde eu entro e gero valor.</h2>
                <p className="lead">Da decisão técnica à execução, atuo em cenários que exigem arquitetura, engenharia, integração, automação e visão de operação.</p>
                <div className="grid2">{services.map(([title,description])=><article className="lineCard" key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>
              </div>
            )}
            {panel === "blog" && <SimplePanel eyebrow="04 · Blog" title="Notas de engenharia." text="Arquitetura, IA, segurança, software e pesquisa técnica." />}

            {panel === "loja" && (
              <div className="panel enter">
                <div className="eyebrow">05 · Sistemas & Soluções Comerciais</div><h2>Tecnologia que se adapta à operação, não o contrário.</h2>
                <p className="lead">A SOPHXY reúne sistemas, automações e soluções que podem ser implantados, personalizados e integrados conforme a realidade de cada negócio.</p>
                <div className="emptyState">Catálogo em preparação. O ChatCommerce coleta o escopo e encaminha o briefing para análise e precificação.</div>
                <div className="ctaRow"><button type="button" onClick={startCommerceChat}>Iniciar ChatCommerce →</button></div>
              </div>
            )}

            {panel === "setup" && <SimplePanel eyebrow="06 · Setup / Afiliados" title="Ferramentas que eu realmente uso." text="Hardware, software e ferramentas do meu fluxo de trabalho." />}
            {panel === "videos" && <SimplePanel eyebrow="07 · Vídeos" title="Conteúdo em construção." text="Tecnologia, engenharia, IA, segurança e a vida fora da tela." />}
            {panel === "cartao" && (
              <div className="panel enter"><div className="eyebrow">09 · Cartão digital</div><h2>Um contato. Todos os caminhos.</h2>
                <p className="lead">Cabo Frio, RJ · Brasil</p>
                <div className="contactLinks">
                  <a href="https://github.com/guilhermedemorais-dev" target="_blank" rel="noreferrer">GitHub ↗</a>
                  <a href="https://www.linkedin.com/in/guilherme-de-morais-a440a8132" target="_blank" rel="noreferrer">LinkedIn ↗</a>
                  <a href="https://www.instagram.com/guilhermedmoraisss" target="_blank" rel="noreferrer">Instagram ↗</a>
                </div>
              </div>
            )}

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
