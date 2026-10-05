export const featuredProjects = [
  {
    title: "ORION CRM / ERP",
    description: "Sistema empresarial para centralizar clientes, estoque, vendas, PDV, financeiro e automações em uma única operação.",
    tag: "ERP",
  },
  {
    title: "HabilitFy",
    description: "Startup SaaS criada para digitalizar e organizar a operação de autoescolas, instrutores e alunos.",
    tag: "SaaS",
  },
  {
    title: "Salve o Pau Brasil",
    description: "Startup de tecnologia e impacto ambiental em fase de planejamento do MVP, com monitoramento ambiental, IA e componentes Web3.",
    tag: "R&D",
  },
] as const;

export const caseStudies = [
  {
    title: "PIRCSEEK",
    description: "Pesquisa técnica sobre recuperação de contexto, busca híbrida e eficiência em sistemas baseados em LLMs.",
    tag: "AI",
  },
  {
    title: "Engineering Harness",
    description: "Pesquisa e engenharia aplicada a governança de desenvolvimento com agentes, validação, segurança e processos reproduzíveis.",
    tag: "DEV",
  },
] as const;

export const projects = [...featuredProjects, ...caseStudies] as const;

export const products = [] as const;

export const services = [
  ["Arquitetura & Decisão Técnica", "Estruturo soluções, avalio trade-offs e defino como sistemas, dados, integrações e infraestrutura devem trabalhar juntos."],
  ["Engenharia de Software", "Projeto e construo aplicações, plataformas, APIs e sistemas internos preparados para evoluir com a operação."],
  ["Automação & IA", "Aplico automação e inteligência artificial onde existe ganho real de eficiência, velocidade ou capacidade operacional."],
  ["Consultoria Técnica", "Diagnóstico cenários, identifico gargalos e ajudo empresas a decidir o que construir, integrar, modernizar ou substituir."],
] as const;

export const evolution = [
  ["Base técnica", "Minha trajetória passou por infraestrutura, desenvolvimento, sistemas, operações digitais e construção de produtos."],
  ["Visão sistêmica", "Liderança técnica, consultoria e contato direto com operações ampliaram meu olhar de código para processo, integração, risco e resultado."],
  ["Atuação atual", "Hoje combino arquitetura de soluções e engenharia de software para transformar cenários complexos em soluções que possam ser implementadas, operadas e evoluídas."],
] as const;

export const technicalCapabilities = [
  ["Architecture", "Modular Monolith · Domain-Oriented Design · API-First · REST APIs · Event-Driven Workflows · Async Processing · Queues · Webhooks · Integration Architecture · RBAC · Transactional Workflows · Caching · Monorepos · ADRs"],
  ["Software Engineering Practices", "Spec-Driven Development (SDD) · Test-Driven Development (TDD) · Human-in-the-Loop · DevSecOps · Independent QA · PR-based Development · CI/CD"],
  ["AI-Assisted Development", "Agentic Software Development · Coding Agents · Context Engineering · MCP · RAG · LLM APIs · Multi-Agent Workflows · AI-Assisted Code Review"],
  ["Product & UX", "User Flows · Usability · Information Architecture · Responsive Design · Design Systems · Accessibility Awareness · UI/UX Review"],
  ["Frontend", "Next.js · React · Vue.js · TypeScript · Tailwind CSS"],
  ["Backend", "Node.js · NestJS · Express · PHP · Laravel · Python · C++"],
  ["Data", "PostgreSQL · MySQL · MongoDB · Redis · SQLite"],
  ["Infrastructure", "Docker · Linux · NGINX · AWS · Vercel · DigitalOcean · VPS · GitHub Actions"],
  ["Automation", "n8n · Webhooks · API Integrations · Workflow Automation"],
  ["Web Platforms", "WordPress · Custom Themes · Custom Plugins · Headless WordPress · WooCommerce"],
] as const;
