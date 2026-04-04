import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como coletamos, usamos e protegemos seus dados neste blog.',
}

export default function PrivacidadePage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Meu Blog'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const year = new Date().getFullYear()

  return (
    <div style={{ maxWidth: '720px' }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.6rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '0.75rem',
            opacity: 0.8,
          }}
        >
          ✦ Legal
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            color: 'var(--text)',
            fontWeight: 600,
            marginBottom: '0.5rem',
          }}
        >
          Política de Privacidade
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.8rem',
            color: 'var(--text-faint)',
          }}
        >
          Última atualização:{' '}
          {new Date().toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(to right, var(--gold-deep), transparent)',
            marginTop: '1.5rem',
            opacity: 0.5,
          }}
        />
      </div>

      {/* Conteúdo */}
      <div className="prose-blog">
        <Section title="1. Introdução">
          <p>
            Esta Política de Privacidade descreve como o <strong>{siteName}</strong> ({siteUrl})
            coleta, usa e protege as informações dos visitantes. Ao utilizar este site, você
            concorda com as práticas descritas neste documento.
          </p>
        </Section>

        <Section title="2. Dados coletados">
          <p>Podemos coletar os seguintes tipos de informação:</p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              marginTop: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <li>
              <strong>Dados de conta:</strong> nome e email fornecidos ao criar uma conta para
              comentar.
            </li>
            <li>
              <strong>Comentários:</strong> textos publicados por você nos posts do blog.
            </li>
            <li>
              <strong>Newsletter:</strong> email fornecido voluntariamente para receber
              atualizações.
            </li>
            <li>
              <strong>Dados de navegação:</strong> informações coletadas automaticamente como
              endereço IP, tipo de navegador e páginas visitadas, por meio de cookies e serviços de
              análise.
            </li>
          </ul>
        </Section>

        <Section title="3. Como usamos os dados">
          <ul
            style={{
              paddingLeft: '1.5rem',
              marginTop: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <li>Permitir que você comente nos posts.</li>
            <li>Enviar novos posts por email, caso você tenha se inscrito na newsletter.</li>
            <li>Melhorar o conteúdo e a experiência do blog.</li>
            <li>Exibir anúncios relevantes por meio do Google AdSense.</li>
          </ul>
        </Section>

        <Section title="4. Google AdSense e cookies">
          <p>
            Este site utiliza o <strong>Google AdSense</strong> para exibir anúncios. O Google usa
            cookies para exibir anúncios com base em visitas anteriores a este e outros sites. Você
            pode desativar a publicidade personalizada acessando as{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Configurações de anúncios do Google
            </a>
            .
          </p>
          <p style={{ marginTop: '0.875rem' }}>
            Para mais informações sobre como o Google usa dados de sites que utilizam seus serviços,
            acesse:{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
            >
              policies.google.com/technologies/partner-sites
            </a>
          </p>
        </Section>

        <Section title="5. Compartilhamento de dados">
          <p>Não vendemos nem compartilhamos seus dados pessoais com terceiros, exceto:</p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              marginTop: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <li>
              <strong>Supabase:</strong> plataforma de banco de dados onde os dados são armazenados.
            </li>
            <li>
              <strong>Resend:</strong> serviço de envio de emails para a newsletter.
            </li>
            <li>
              <strong>Google AdSense:</strong> serviço de publicidade que pode usar cookies.
            </li>
            <li>
              <strong>Vercel:</strong> plataforma de hospedagem do site.
            </li>
          </ul>
        </Section>

        <Section title="6. Seus direitos (LGPD)">
          <p>
            De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
          </p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              marginTop: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <li>Acessar os dados que temos sobre você.</li>
            <li>Solicitar a correção de dados incorretos.</li>
            <li>Solicitar a exclusão de seus dados.</li>
            <li>
              Cancelar a inscrição da newsletter a qualquer momento pelo link presente em cada
              email.
            </li>
            <li>Excluir sua conta e comentários entrando em contato conosco.</li>
          </ul>
        </Section>

        <Section title="7. Retenção de dados">
          <p>
            Mantemos seus dados enquanto sua conta estiver ativa ou enquanto for necessário para os
            fins descritos nesta política. Dados da newsletter são removidos imediatamente após o
            cancelamento da inscrição.
          </p>
        </Section>

        <Section title="8. Segurança">
          <p>
            Adotamos medidas técnicas para proteger seus dados, incluindo criptografia de senhas e
            comunicação via HTTPS. Contudo, nenhum sistema é 100% seguro e não podemos garantir
            segurança absoluta.
          </p>
        </Section>

        <Section title="9. Alterações nesta política">
          <p>
            Podemos atualizar esta política periodicamente. A data de última atualização será sempre
            indicada no topo desta página. O uso continuado do site após alterações implica
            aceitação da política atualizada.
          </p>
        </Section>

        <Section title="10. Contato">
          <p>
            Dúvidas sobre esta política? Entre em contato pelo email disponível nas redes sociais do
            blog.
          </p>
        </Section>

        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.78rem',
            color: 'var(--text-faint)',
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)',
          }}
        >
          © {year} {siteName}. Todos os direitos reservados.{' '}
          <Link href="/" style={{ color: 'var(--emerald-light)' }}>
            Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.15rem',
          color: 'var(--gold-light)',
          fontWeight: 600,
          marginBottom: '0.875rem',
          paddingBottom: '0.4rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.05rem',
          color: 'var(--text-muted)',
          lineHeight: 1.8,
        }}
      >
        {children}
      </div>
    </div>
  )
}
