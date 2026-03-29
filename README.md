# Blog — Guia de Setup Completo

Stack: Next.js 15 · Supabase · Vercel · Tiptap · Resend

---

## Pré-requisitos

- Node.js 20+
- pnpm (recomendado) ou npm
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Vercel](https://vercel.com) (gratuita)
- Conta no [Resend](https://resend.com) (gratuita — Sprint 4)

---

## 1. Clonar e instalar

```bash
git clone <seu-repo>
cd blog
pnpm install
```

---

## 2. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Aguarde o banco inicializar (~2 min)
3. Vá em **SQL Editor** e execute todo o conteúdo de `supabase-schema.sql`
4. Vá em **Settings → API** e copie:
   - `Project URL`
   - `anon public key`
   - `service_role key` (atenção: mantenha segura)

---

## 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

RESEND_API_KEY=re_...          # Preencher no Sprint 4
RESEND_FROM_EMAIL=voce@dominio.com
RESEND_FROM_NAME=Seu Nome

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Meu Blog
NEXT_PUBLIC_SITE_DESCRIPTION=Blog pessoal e criativo
```

---

## 4. Criar usuário admin no Supabase

1. Vá em **Authentication → Users**
2. Clique em **Add user**
3. Insira seu email e uma senha forte
4. Esse será o único login do painel admin

---

## 5. Rodar em desenvolvimento

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## 6. Estrutura das rotas

| Rota | Descrição |
|---|---|
| `/` | Home com lista de posts |
| `/post/[slug]` | Post individual |
| `/tag/[tag]` | Posts por tag |
| `/busca?q=...` | Busca full-text |
| `/admin/login` | Login do painel |
| `/admin/posts` | Lista de posts (admin) |
| `/admin/posts/novo` | Criar post |
| `/admin/posts/[id]/editar` | Editar post |
| `/admin/newsletter` | Gerenciar newsletter |

---

## 7. Deploy na Vercel

```bash
# Instalar CLI da Vercel
npm i -g vercel

# Fazer deploy
vercel

# Configurar variáveis de ambiente na Vercel:
# vercel.com → seu projeto → Settings → Environment Variables
# Adicione todas as variáveis do .env.local
```

Ou conecte o repositório GitHub diretamente no painel da Vercel para deploy automático a cada push.

---

## 8. Sprints do projeto

| Sprint | Status | Conteúdo |
|---|---|---|
| Sprint 1 | ✅ Concluído | Setup, design system, layout, home, post, tag, busca |
| Sprint 2 | 🔄 Próximo | Painel admin completo + editor Tiptap |
| Sprint 3 | ⏳ Pendente | Upload de imagens, autenticação admin |
| Sprint 4 | ⏳ Pendente | Newsletter com Resend, email de confirmação |
| Sprint 5 | ⏳ Pendente | SEO avançado, sitemap, OG images dinâmicas, polish |

---

## 9. Fontes utilizadas

Carregadas via Google Fonts no `globals.css`:

- **Cinzel** — títulos e display
- **Cormorant Garamond** — corpo do texto
- **Jost** — UI, labels, meta

---

## Dúvidas frequentes

**O admin não aparece após login?**
Verifique se o usuário foi criado em Authentication → Users no Supabase e se as variáveis de ambiente estão corretas.

**As imagens não carregam?**
Confirme que o bucket `blog-media` foi criado como público no Supabase Storage e que a URL do projeto está correta no `next.config.ts`.

**Erro de CORS no Supabase?**
Adicione a URL do seu site em Supabase → Settings → API → URL Configuration → Additional Redirect URLs.
