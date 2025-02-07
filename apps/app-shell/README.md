# App Shell

## Setup

### 🍎 iOS

[📚 Referência](https://capacitorjs.com/docs/getting-started/environment-setup#ios-requirements)

1. Instale XCode (precisa ser a versão da app store)
2. Rode XCode, aceite os termos e instale o simulador de iOS
3. Instale Cocoapods usando homebrew `brew install cocoapods`

### 🤖 Android

[📚 Referência](https://capacitorjs.com/docs/getting-started/environment-setup#android-requirements)

1. Instale o Android Studio e as ferramentas de linha de comando `brew install android-studio android-platform-tools`
2. Abra o Android Studio e siga as instruções de instalação expressa
3. Instale Temurin ([versão Java com licença aberta](https://adoptium.net/temurin/)) `brew install --cask temurin@17`

🚨🤖 Pode ser necessário abrir o projeto `./apps/app-shell/android` com o Android Studio **pelo menos uma vez** antes de conseguir buildar com sucesso. Isso porque buildando pela linha de comando não acontece o popup de permissões de pasta do MacOS.

### Gerando assets

[📚 Referência](https://github.com/ionic-team/capacitor-assets)

💻 `pnpm generate-assets`

O comando vai gerar os ícones e tela de splash com base no que temos na pasta [`./assets`](./assets/) e popular as pastas de android e ios.

## Rodando localmente

1. `pnpm build` para gerar o html local
2. `pnpm sync` para sincronizar html local pras pastas nativas
3. `pnpm android` para rodar android OU `pnpm ios` para rodar iOS

### Apontando para localhost

No arquivo [`./capacitor.config.ts`](./capacitor.config.ts) mude a `url` do `server` para `localhost:3000` (ou o path que quiser)

🚨🤖 Em android, é necessário iniciar o emulador e então rodar o comando `adb reverse tcp:3000 tcp:3000`, para que localhost possa ser acesso

## Plugins

### Usando plugins em apps

```typescript
// Retorno com mapa dos módulos disponíveis
const { device } = useNativeFeatures();
```

1. É necessário que `"@monorepo/unified-shell": "workspace:*",` esteja nas dependências do app que vai usar o plugin
2. Faça o import do hook `useNativeFeatures` e deestruture com os plugins que você quer usar (vide [./src/plugins.ts](./src/plugins.ts) ou autocomplete para lista de plugins)

### Adição de novos plugins

1. Adicione a dependência do plugin via pnpm ou no [package.json](./package.json) do shell unificado
2. Adicione o export do plugin no arquivo [./src/plugins.ts](./src/plugins.ts). O nome do export é o nome que será usado - ex: `@capacitor/browser` fica disponível como `browser`.
3. Gere uma nova build para as lojas!

### Atualização de plugins

1. Atualize o [package.json](./package.json) do shell unificado (não esqueça de rodar `pnpm install`)
2. Gere uma nova build para as lojas!

🤔 **Para considerarmos:** Breaking changes poderíamos adicionar versão ao nome do plugin, obrigando uma correção geral e gerando erro para rotas que estejam rodando em um shell desatualizado.

## Configuração

### Abrindo URLs internamente vs externamente

No arquivo `capacitor.config.ts`, podemos definir um array de urls (incluindo wildcard) que devem abrir _dentro_ do app quando usando links e afins:

```
  server: {
    allowNavigation: ["*"]
  }
```

Isso é necessário para que o roteamento de apps funcione de maneira transparente, evitando abrir abas de browsers.

### Começando numa URL específica

Podemos definir uma url raíz de onde o app inicia, pulando completamente qualquer coisa que seja "buildada" junto

```
  server: {
    url: "http://localhost:3000"
    cleartext: true, // apenas localhost no android
  }
```

## App stores

TBD
