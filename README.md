# 🧱 Base Project Vite + React + TS

<p align="center">
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">
  <a href="https://github.com/carvalhoandre/base-project-vite" target="_blank">
    📁 Repositório no GitHub
  </a>
</p>

O **Base Project Vite** é um template completo para iniciar projetos com Vite + React + TypeScript, já configurado com as melhores práticas de lint, formatação, Git hooks e estrutura de pastas para escalar seu projeto com qualidade.

---

## 🚀 Funcionalidades

- ✅ Vite + React + TypeScript prontos para uso
- ✅ ESLint + Prettier + EditorConfig configurados
- ✅ Husky + Lint-Staged para validação em pre-commit
- ✅ Estrutura de pastas organizada
- ✅ Opções adicionais via CLI: Tailwind, React Router, Zustand
- ✅ Geração automática de README, .env.example, pull request template e mais

---

## 🧰 Tecnologias Utilizadas

- ⚡ [Vite](https://vitejs.dev/) — build ultra-rápido
- ⚛️ [React](https://reactjs.org/) — biblioteca para construção de interfaces
- 🔷 [TypeScript](https://www.typescriptlang.org/) — tipagem estática moderna
- 🎨 [TailwindCSS](https://tailwindcss.com/) — (opcional) CSS utilitário
- 🌐 [React Router](https://reactrouter.com/) — (opcional) roteamento
- 🧠 [Zustand](https://zustand-demo.pmnd.rs/) — (opcional) gerenciamento de estado

---

## 📂 Estrutura Inicial

```bash
📦 my-app/
├── 📂 src/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── 📂 .husky/
│   └── pre-commit
├── .eslintrc.json
├── .prettierrc
├── .editorconfig
├── .env.example
├── .gitignore
├── README.md
├── vite.config.ts
└── package.json
```

---

## ⚙️ Como Usar

Instale via CLI personalizada (exemplo com opções):

```bash
npx create-base-vite my-app --router --zustand --tailwind
```

Acesse a pasta e rode:

```bash
cd my-app
npm install
npm run dev
```

---

## 📏 Padrões de Código

- **Lint:** `eslint` com Airbnb + TypeScript
- **Formatador:** `prettier`
- **Pre-commit:** `husky` + `lint-staged`

```bash
npm run lint       # checa problemas
npm run format     # aplica Prettier
```

---

## 🤝 Contribuições

Sinta-se à vontade para abrir issues, forks e Pull Requests!

```bash
git clone https://github.com/carvalhoandre/base-project-vite.git
cd base-project-vite
npm install
```

Crie sua branch de feature:
```bash
git checkout -b feat/nome-da-sua-feature
```

Faça commit com padrão:
```bash
git commit -m "feat: minha contribuição"
```

E envie:
```bash
git push origin feat/nome-da-sua-feature
```

---

Feito com 💙 por [André Leite Carvalho](https://andreleitecarvalho.space/)

> Esse projeto foi criado com foco em agilidade, escalabilidade e qualidade de código para desenvolvedores React.

