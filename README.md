# 🎫 Casa do Urso - Bug Tracker

Formulário web para reportar bugs e melhorias, com integração direta ao Notion.

## 🚀 Deploy em 5 minutos

### Passo 1: Criar Integração no Notion

1. Acesse [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Clique em **"+ Nova integração"**
3. Dê um nome: `Bug Tracker Casa do Urso`
4. Selecione o workspace da Casa do Urso
5. Clique em **"Enviar"**
6. **Copie o "Internal Integration Secret"** (começa com `secret_`)

### Passo 2: Conectar a Integração ao Database

1. Abra o database **🎫 Bug Tracker** no Notion
2. Clique nos **três pontinhos (...)** no canto superior direito
3. Vá em **"Conexões"** → **"Conectar a"**
4. Selecione a integração que você criou
5. Clique em **"Confirmar"**

### Passo 3: Deploy no Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SEU-USUARIO/bug-tracker-app)

Ou manualmente:

1. Faça push deste código para um repositório no GitHub
2. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
3. Clique em **"New Project"**
4. Selecione o repositório do bug-tracker
5. Em **"Environment Variables"**, adicione:
   - `NOTION_TOKEN` = o secret que você copiou no Passo 1
   - `NOTION_DATABASE_ID` = `06157c2e-128c-4f6d-8452-61d2c981b74b`
6. Clique em **"Deploy"**

### Passo 4: Pronto! 🎉

Você terá uma URL tipo: `https://seu-projeto.vercel.app`

Compartilhe esse link com qualquer pessoa! Quando preencherem o formulário, o ticket aparece automaticamente no Notion.

---

## 🧪 Testar Localmente

```bash
# Instalar dependências
npm install

# Criar .env.local com suas variáveis
cp .env.example .env.local
# Edite .env.local com seu NOTION_TOKEN

# Rodar
npm run dev
```

Acesse http://localhost:3000

---

## 📁 Estrutura

```
├── app/
│   ├── api/
│   │   └── ticket/
│   │       └── route.ts    # API que cria tickets no Notion
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            # Formulário
├── .env.example
├── package.json
└── README.md
```

---

## 🔧 Personalização

### Mudar cores
Edite `tailwind.config.js`:
```js
colors: {
  mint: '#3ECFB2',    // Verde principal
  coral: '#FF6B6B',   // Bugs
  purple: '#9775FA',  // Melhorias
}
```

### Adicionar campos
Edite `app/page.tsx` (formulário) e `app/api/ticket/route.ts` (API)

---

## ❓ Problemas Comuns

**"Erro ao criar ticket"**
- Verifique se a integração está conectada ao database no Notion
- Confira se o NOTION_TOKEN está correto no Vercel

**"Database not found"**
- O NOTION_DATABASE_ID pode estar errado
- A integração precisa ter acesso ao database

---

Feito com 💚 para a Casa do Urso
