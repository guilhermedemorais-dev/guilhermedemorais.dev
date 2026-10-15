export const featuredProjects = [
  {
    title: "ORION CRM / ERP",
    description: "Sistema empresarial para centralizar clientes, estoque, vendas, PDV, financeiro e automações em uma única operação.",
    descriptionEn: "Business system that centralizes customers, inventory, sales, POS, finance and automations in a single operation.",
    tag: "ERP",
  },
  {
    title: "HabilitFy",
    description: "Startup SaaS criada para digitalizar e organizar a operação de autoescolas, instrutores e alunos.",
    descriptionEn: "SaaS startup created to digitize and organize the operation of driving schools, instructors and students.",
    tag: "SaaS",
  },
  {
    title: "Salve o Pau Brasil",
    description: "Plataforma de rastreabilidade e monitoramento ambiental para acompanhar mudas e árvores da origem ao plantio e evolução em campo, com geolocalização, evidências periódicas, mapas e validação ambiental.",
    descriptionEn: "Environmental traceability and monitoring platform that follows seedlings and trees from origin through planting and field growth, with geolocation, periodic evidence, maps and environmental validation.",
    tag: "ENV",
  },
] as const;

export const caseStudies = [
  {
    title: "Engineering Harness",
    description: "Pesquisa e engenharia aplicada a governança de desenvolvimento com agentes, validação, segurança e processos reproduzíveis.",
    descriptionEn: "Research and applied engineering for agent-based development governance, validation, security and reproducible processes.",
    tag: "DEV",
  },
] as const;

export const projects = [...featuredProjects, ...caseStudies] as const;

export const products = [] as const;

export const services = [
  ["Arquitetura & Decisão Técnica", "Estruturo soluções, avalio trade-offs e defino como sistemas, dados, integrações e infraestrutura devem trabalhar juntos.", "Architecture & Technical Decision-Making", "I structure solutions, evaluate trade-offs and define how systems, data, integrations and infrastructure should work together."],
  ["Engenharia de Software", "Projeto e construo aplicações, plataformas, APIs e sistemas internos preparados para evoluir com a operação.", "Software Engineering", "I design and build applications, platforms, APIs and internal systems prepared to evolve with the operation."],
  ["Automação & IA", "Aplico automação e inteligência artificial onde existe ganho real de eficiência, velocidade ou capacidade operacional.", "Automation & AI", "I apply automation and artificial intelligence where they create real gains in efficiency, speed or operational capacity."],
  ["Consultoria Técnica", "Diagnóstico cenários, identifico gargalos e ajudo empresas a decidir o que construir, integrar, modernizar ou substituir.", "Technical Consulting", "I diagnose scenarios, identify bottlenecks and help companies decide what to build, integrate, modernize or replace."],
] as const;

export const evolution = [
  ["Base técnica", "Minha trajetória passou por infraestrutura, desenvolvimento, sistemas, operações digitais e construção de produtos.", "Technical foundation", "My path has crossed infrastructure, development, systems, digital operations and product building."],
  ["Visão sistêmica", "Liderança técnica, consultoria e contato direto com operações ampliaram meu olhar de código para processo, integração, risco e resultado.", "Systems thinking", "Technical leadership, consulting and direct exposure to operations expanded my view from code to process, integration, risk and outcomes."],
  ["Atuação atual", "Hoje combino arquitetura de soluções e engenharia de software para transformar cenários complexos em soluções que possam ser implementadas, operadas e evoluídas.", "Current focus", "Today I combine solutions architecture and software engineering to turn complex scenarios into solutions that can be implemented, operated and evolved."],
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
