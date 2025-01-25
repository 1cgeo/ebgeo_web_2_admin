# EBGeo Admin Dashboard

Interface administrativa para gerenciamento do sistema EBGeo - plataforma geoespacial para análise de terreno e visualização 3D.

## Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Visualizar build de produção
npm run preview
```

## Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
├── context/         # Gerenciamento de estado global
├── hooks/           # Hooks React personalizados
├── layouts/         # Componentes de layout
├── pages/           # Páginas da aplicação
├── services/        # Serviços de API
├── theme/           # Configuração do tema MUI 
├── types/          # Tipos TypeScript
└── utils/          # Funções utilitárias
```

## Desenvolvimento

### Pré-requisitos

- Node.js ≥ 18.0.0
- NPM ≥ 8.0.0

### Variáveis de Ambiente

Crie o arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

## Suporte a Navegadores

- Chrome ≥ 100
- Firefox ≥ 100
- Safari ≥ 15
- Edge ≥ 100