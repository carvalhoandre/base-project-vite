const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

process.env.NODE_OPTIONS = "--no-deprecation";

function safeExec(command, description) {
  try {
    console.log(`\n▶️ ${description}`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`\n❌ Erro ao executar: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = function setupTools(projectName) {
  const templatesPath = path.resolve(__dirname, "../templates");

  // 1. Inicializa repositório Git
  try {
    execSync("git init", { stdio: "inherit" });
    console.log("✅ Git init executado com sucesso.");
  } catch (err) {
    console.error("❌ Falha ao executar git init:", err.message);
  }

  // 2. Instala dependências
  const devDeps = [
    "eslint@8.57.0",
    "prettier",
    "eslint-config-prettier",
    "eslint-plugin-react",
    "eslint-plugin-prettier",
    "eslint-plugin-import",
    "eslint-plugin-jsx-a11y",
    "eslint-plugin-react-hooks",
    "@typescript-eslint/eslint-plugin@8.28.0",
    "@typescript-eslint/parser@8.28.0",
    "eslint-config-airbnb",
    "eslint-config-airbnb-typescript",
    "lint-staged",
    "husky",
  ];
  safeExec(
    `npm install -D ${devDeps.join(" ")} --legacy-peer-deps`,
    "Instalando dependências de desenvolvimento"
  );

  console.log("✅ Dependências instaladas com sucesso.");

  // 3. Copia arquivos de configuração do diretório templates
  const files = [
    ".eslintrc.json",
    ".prettierrc",
    ".editorconfig",
    ".github/pull_request_template.md",
    "README.md",
  ];

  files.forEach((file) => {
    const src = path.join(templatesPath, file);
    const dest = path.resolve(file);
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(src, dest);
  });

  // 4. Husky + lint-staged
  safeExec("npx husky install", "Instalando Husky");

  const pkgPath = path.resolve("package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.scripts = {
    ...pkg.scripts,
    prepare: "husky install",
    lint: "eslint . --ext .ts,.tsx,.js,.jsx",
    format: "prettier --write .",
  };
  pkg["lint-staged"] = {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  const huskyHook = ".husky/pre-commit";
  if (!fs.existsSync(huskyHook)) {
    const huskyHookPath = path.resolve(".husky/pre-commit");
    if (!fs.existsSync(huskyHookPath)) {
      fs.writeFileSync(
        huskyHookPath,
        `#!/bin/sh\n. \"$(dirname \"$0\")/_/husky.sh\"\n\nnpx lint-staged\n`
      );
      fs.chmodSync(huskyHookPath, 0o755);
      console.log("✅ Hook de pre-commit criado com sucesso.");
    }
  }

  // 5. Atualiza o title no index.html
  const hasProjectName = projectName !== "./";
  const indexHtmlPath = path.resolve("index.html");
  if (fs.existsSync(indexHtmlPath) && hasProjectName) {
    const html = fs.readFileSync(indexHtmlPath, "utf-8");
    const updatedHtml = html.replace(
      /<title>.*<\/title>/,
      `<title>${projectName}</title>`
    );
    fs.writeFileSync(indexHtmlPath, updatedHtml);
  }

  // 6. Limpa arquivos do Vite
  const appCssPath = path.resolve("src/App.css");
  const indexCssPath = path.resolve("src/index.css");
  const reactSvgPath = path.resolve("src/assets/react.svg");
  const appTsxPath = path.resolve("src/App.tsx");

  if (fs.existsSync(appCssPath)) fs.writeFileSync(appCssPath, "");
  if (fs.existsSync(indexCssPath)) fs.writeFileSync(indexCssPath, "");
  if (fs.existsSync(reactSvgPath)) fs.unlinkSync(reactSvgPath);

  if (fs.existsSync(appTsxPath) && hasProjectName) {
    fs.writeFileSync(
      appTsxPath,
      `
        export const App = () => {
          return <h1>${projectName}</h1>
        }
      `
    );
  }
};
