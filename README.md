# guilhermedemorais.dev

Portfólio pessoal e comercial de Guilherme de Morais.

## Stack

- Next.js
- TypeScript
- CSS próprio
- OpenAI API para o SDR técnico
- Resend para envio do briefing por e-mail
- Vercel para deploy

## Fluxo do SDR

1. O visitante abre **Fale comigo**.
2. O agente coleta o contexto do projeto em formato de conversa.
3. Quando o briefing estiver completo, a API gera um resumo estruturado.
4. O briefing e a conversa são enviados por e-mail.
5. Guilherme continua o atendimento pelo WhatsApp.

Não há banco de dados nesta primeira versão.

## Variáveis de ambiente

Copie `.env.example` e configure:

```
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-luna
RESEND_API_KEY=
BRIEFING_TO_EMAIL=
BRIEFING_FROM_EMAIL=
```

Nunca publique chaves no repositório.

## Conteúdo editável

Os dados iniciais de projetos, produtos e serviços ficam em:

```
data/site.ts
```

Isso permite atualizar o catálogo sem mexer na estrutura principal da página.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Deploy

Conectar este repositório à Vercel e cadastrar as variáveis de ambiente no projeto.
