# SETOR NORTE — Site

Site da loja de streetwear **Setor Norte** (Altamira - PA). Feito em React + Vite.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que aparece no terminal (geralmente http://localhost:5173).

Para gerar a versão final (publicar):

```bash
npm run build
```

Os arquivos prontos ficam na pasta `dist/`.

## O que dá pra trocar sem mexer em código

Tudo fica em **`src/data/siteContent.js`**:

- **Número do WhatsApp** → `store.whatsapp` (formato `55` + DDD + número, só dígitos)
- **Produtos** → lista `products` (ID/SKU, nome, cor, preço, tamanhos, status)
- **Textos** da home, DTF, sobre, rodapé
- **Drop** → `drop.status` (`inactive`, `comingSoon`, `live`, `ended`)
- **Lookbook** e tabela de medidas

## Imagens

Coloque as fotos em `public/images/` (veja `public/images/README.txt`).
Enquanto não houver foto, aparece um placeholder com o ID do produto.

## Seções

Início (Hero) · Pronta Entrega (catálogo) · Personalização DTF · Drop (escondido) ·
Lookbook · Sobre · Contato/Footer · botão flutuante de WhatsApp.

O item **Drop** no menu e a seção só aparecem quando `drop.status` for diferente de `inactive`.

## Como ativar o Drop

Em `src/data/siteContent.js`, no objeto `drop`:

- `status: 'comingSoon'` + `releaseDate` → mostra contagem regressiva
- `status: 'live'` + preencher `drop.products` → mostra os produtos do drop
- `status: 'ended'` → mostra "encerrado"
- `status: 'inactive'` → some do site (padrão)
