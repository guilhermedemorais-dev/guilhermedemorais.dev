import type { Metadata } from "next";
import Link from "next/link";
import "./blog.css";

export const metadata: Metadata = {
  title: "Falha critica em JWT: CVE-2026-120459 | Guilherme de Morais",
  description: "O que a CVE-2026-120459 na biblioteca python-jose ensina sobre autenticacao, dependencias e revisao de codigo gerado com IA.",
};

const advisory = "https://github.com/advisories/GHSA-7jv8-hwmh-86qc";

export default function BlogPage() {
  return (
    <main className="gm-blog">
      <header className="gm-topbar">
        <Link href="/" className="gm-back" aria-label="Voltar ao portfolio">← /home</Link>
        <span className="gm-topbrand">GUILHERME DE MORAIS<span className="gm-cursor">_</span></span>
        <span className="gm-topright">/BLOG</span>
      </header>

      <article className="gm-article">
        <div className="gm-path">~/blog/security/cve-2026-120459</div>
        <div className="gm-author">
          <img src="/profile.jpg" width="54" height="54" alt="Foto de Guilherme de Morais" className="gm-avatar" />
          <div className="gm-author-text"><strong>Guilherme de Morais</strong><span>@guilhermedemorais · 03 nov 2026</span></div>
          <span className="gm-article-type">SECURITY NOTE / 001</span>
        </div>

        <div className="gm-headline">
          <div className="gm-chips"><span className="gm-critical">CRITICAL · CVSS 9.1</span><span>CVE-2026-120459</span><span>PYTHON / JWT</span></div>
          <h1>Seu login pode parecer seguro. <em>Mas uma chave vazia muda tudo.</em></h1>
          <p>Uma falha critica no <code>python-jose</code> expõe um problema real na validacao de tokens JWT. E levanta uma pergunta sobre softwares construidos na velocidade da IA.</p>
        </div>

        <div className="gm-thread"><span>01 / O FATO</span><h2>O que foi divulgado?</h2>
          <p>Em 2 de novembro de 2026, foi publicada a <strong>CVE-2026-120459</strong>, uma vulnerabilidade critica que afeta <code>python-jose</code> ate a versao 3.5.0, em condicoes especificas.</p>
          <p>As implementacoes <code>HMACKey</code> e <code>CryptographyHMACKey</code> aceitam secrets HMAC com comprimento zero. Se a aplicacao usar uma chave de verificacao vazia com HS256, HS384 ou HS512, um atacante pode falsificar tokens cujas claims sejam aceitas por <code>jwt.decode</code>.</p>
        </div>
        <div className="gm-thread"><span>02 / CONTEXTO</span><h2>JWT nao foi quebrado.</h2>
          <p>JWT e um formato de token, nao um sistema de autenticacao universal. O problema aqui e a combinacao de uma biblioteca vulneravel com uma configuracao de verificacao insegura. Aplicacoes com chaves validas e configuracoes apropriadas nao estao automaticamente expostas por usarem JWT.</p>
        </div>
        <div className="gm-thread"><span>03 / IMPACTO</span><h2>Quando a identidade pode ser falsificada</h2>
          <p>Se a aplicacao confiar nas claims de um token falsificado, pode aceitar uma identidade incorreta ou permissoes indevidas. O resultado concreto depende da autorizacao implementada em cada sistema.</p>
          <blockquote>Autenticacao nao e apenas conseguir fazer login. E conseguir provar, de forma verificavel, quem esta acessando o sistema.</blockquote>
        </div>
        <div className="gm-thread"><span>04 / VIBE CODING</span><h2>O codigo roda. E dai?</h2>
          <p>Ferramentas de IA podem acelerar a criacao de APIs, fluxos de login e produtos inteiros. Isso nao prova que aplicacoes geradas por IA estejam usando essa biblioteca, nem que estejam afetadas pela CVE.</p>
          <p>O risco mais amplo e publicar codigo sem revisao de dependencias, configuracao de secrets e testes negativos de autenticacao. Uma demonstracao funcional nao substitui um security review.</p>
        </div>
        <div className="gm-thread"><span>05 / CHECKLIST</span><h2>O que revisar agora</h2>
          <ul><li>Identifique se existe <code>python-jose</code> nas dependencias e qual versao e utilizada.</li><li>Bloqueie secrets HMAC vazios na inicializacao e falhe de maneira segura.</li><li>Restrinja explicitamente os algoritmos aceitos na verificacao de assinaturas.</li><li>Teste tokens invalidos, claims adulteradas e controle de acesso no backend.</li><li>Acompanhe o advisory e a disponibilizacao de uma versao corrigida.</li></ul>
          <p className="gm-small">Na data desta publicacao, o advisory nao indicava uma versao corrigida. Nao basta presumir que apenas atualizar resolve a configuracao vulneravel.</p>
        </div>
        <div className="gm-thread gm-conclusion"><span>06 / CONCLUSAO</span><h2>Software pronto nao significa software seguro.</h2>
          <p>Automatizar a escrita de codigo e util. Automatizar a confianca sem verificacao e perigoso. A responsabilidade pelo que vai para producao continua com quem desenvolve, revisa e opera a aplicacao.</p>
        </div>

        <footer className="gm-footer">
          <div className="gm-author gm-author-footer"><img src="/profile.jpg" width="44" height="44" alt="" className="gm-avatar" /><div className="gm-author-text"><strong>Guilherme de Morais</strong><span>Engenharia de software · IA · Ciberseguranca</span></div></div>
          <p>Voce revisa a seguranca do codigo gerado por IA antes de colocar em producao?</p>
          <div className="gm-actions"><a href={advisory} target="_blank" rel="noreferrer">Advisory oficial ↗</a><Link href="/">Conheca meu trabalho ↗</Link></div>
          <small>Fonte: GitHub Advisory Database, GHSA-7jv8-hwmh-86qc. Publicado em 02/11/2026. Conteudo informativo, sem afirmacao de exploracao ativa.</small>
        </footer>
      </article>
    </main>
  );
}
