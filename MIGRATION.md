# Migração para Supabase + Painel /admin — Setor Norte

O visual e o funcionamento do site continuam **idênticos**. O que muda: produtos,
categorias e o Drop agora vêm do Supabase, e há um painel em **`/admin`** para gerenciar tudo.
Se o Supabase estiver fora do ar ou sem configuração, o site cai automaticamente no
conteúdo de `siteContent.js` (fallback) e não quebra.

## 1) Criar o projeto no Supabase
1. Acesse https://supabase.com → New project.
2. Em **Project Settings → API**, copie:
   - `Project URL`  → vira `VITE_SUPABASE_URL`
   - `anon public`  → vira `VITE_SUPABASE_ANON_KEY`

## 2) Criar as tabelas, RLS e o bucket
1. No Supabase, abra **SQL Editor → New query**.
2. Cole TODO o conteúdo de `supabase/schema.sql` e clique em **RUN**.
   - Isso cria as tabelas (`products`, `categories`, `drop_settings`, `admins`),
     ativa o RLS (leitura pública, escrita só admin), cria a função `is_admin()`,
     o bucket `product-images` e já popula os produtos atuais (seed).

## 3) Criar seu usuário admin
1. **Authentication → Users → Add user** → e-mail + senha (marque "Auto Confirm").
2. Volte ao **SQL Editor** e rode (troque pelo seu e-mail):
   ```sql
   insert into public.admins (user_id, email)
   select id, email from auth.users where email = 'SEU-EMAIL@exemplo.com'
   on conflict (user_id) do nothing;
   ```
3. (Recomendado) Em **Authentication → Providers → Email**, desligue "Enable signups"
   para ninguém criar conta sozinho.

## 4) Configurar as variáveis de ambiente
**Local:** crie um arquivo `.env` na raiz (use `.env.example` de modelo):
```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```
**Netlify:** Site settings → Environment variables → adicione as MESMAS duas variáveis.
Depois rode um **Deploy** novo (as variáveis VITE_ entram no build).

## 5) Instalar e rodar
```
npm install
npm run dev
```
- Site: http://localhost:5173/
- Painel: http://localhost:5173/admin

## 6) Deploy no Netlify
- Já existe `public/_redirects` com `/* /index.html 200` para a rota `/admin`
  funcionar em refresh/link direto (SPA).
- Build command: `npm run build` · Publish directory: `dist`.

## Como usar o painel
- **Produtos:** criar/editar/excluir, upload de foto (vai pro Storage), marcar
  "Destaque" e "Peça do Drop", status disponível/esgotado.
- **Categorias:** adicionar/remover (não inclua "Todos"; o site adiciona sozinho).
- **Drop:** estado (inativo / em breve / ao vivo / encerrado), nome, frase e data.
  As peças do Drop são os produtos marcados como "Peça do Drop".

## Segurança (RLS)
- Qualquer pessoa **lê** produtos/categorias/drop (site público).
- Só quem está na tabela `admins` consegue **escrever** (inserir/editar/excluir)
  e fazer upload de imagens. A checagem é feita pela função `is_admin()`.

## Observações
- O campo da foto guarda a URL pública do Storage. Imagens antigas em
  `/public/images/...` continuam válidas se você colar o caminho manualmente.
- Excluir uma categoria **não** apaga produtos; só some do filtro.
