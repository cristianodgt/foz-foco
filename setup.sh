#!/bin/bash

# ══════════════════════════════════════════════════════════════
# FOZ.FOCO - Setup Automático v2.0
# ══════════════════════════════════════════════════════════════
# Uso: bash setup.sh [rápido|completo]
# 
# Modos:
#   rápido   - Gera base funcional (~30 arquivos, 2min)
#   completo - Gera projeto inteiro (~85 arquivos, 5min)
# ══════════════════════════════════════════════════════════════

set -e  # Para no primeiro erro

MODE=${1:-rapido}  # Default: rápido

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# ──────────────────────────────────────────────────────────────
# FUNÇÕES AUXILIARES
# ──────────────────────────────────────────────────────────────

print_header() {
    echo ""
    echo -e "${PURPLE}════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# ──────────────────────────────────────────────────────────────
# VERIFICAÇÕES INICIAIS
# ──────────────────────────────────────────────────────────────

check_dependencies() {
    print_header "Verificando Dependências"
    
    # Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js não encontrado. Instale: https://nodejs.org/"
        exit 1
    fi
    print_success "Node.js $(node -v)"
    
    # npm
    if ! command -v npm &> /dev/null; then
        print_error "npm não encontrado"
        exit 1
    fi
    print_success "npm $(npm -v)"
    
    # Git
    if ! command -v git &> /dev/null; then
        print_error "Git não encontrado. Instale: https://git-scm.com/"
        exit 1
    fi
    print_success "Git $(git --version | cut -d' ' -f3)"
}

# ──────────────────────────────────────────────────────────────
# CRIAÇÃO DE ESTRUTURA
# ──────────────────────────────────────────────────────────────

create_folder_structure() {
    print_header "ETAPA 1/18: Criando Estrutura de Pastas"
    
    print_step "Criando pastas principais..."
    
    mkdir -p app/{api,admin,\(public\)}
    mkdir -p app/api/{feed,posts,ads,admin,webhooks}
    mkdir -p app/admin/{dashboard,posts,ai-drafts,campaigns,legal-alerts,users,settings}
    mkdir -p "app/(public)"/{categoria,autor,busca}
    
    mkdir -p components/{ui,public,admin,feed,post}
    mkdir -p lib
    mkdir -p hooks
    mkdir -p types
    mkdir -p prisma
    mkdir -p public/{fonts,images}
    mkdir -p scripts
    
    print_success "Estrutura de pastas criada!"
}

# ──────────────────────────────────────────────────────────────
# ETAPA 2: Arquivos de Configuração Base
# ──────────────────────────────────────────────────────────────

create_config_files() {
    print_header "ETAPA 2/18: Arquivos de Configuração"
    
    print_step "Criando postcss.config.js..."
    cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
    
    print_step "Criando components.json (shadcn/ui)..."
    cat > components.json << 'EOF'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
EOF
    
    print_success "Arquivos de configuração criados!"
}

# ──────────────────────────────────────────────────────────────
# ETAPA 3: Componentes UI Base
# ──────────────────────────────────────────────────────────────

create_ui_components() {
    print_header "ETAPA 3/18: Componentes UI Base"
    
    print_step "Criando lib/utils.ts..."
    cat > lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
EOF
    
    print_step "Criando components/ui/button.tsx..."
    cat > components/ui/button.tsx << 'EOF'
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
EOF
    
    print_success "Componentes UI criados!"
}

# ──────────────────────────────────────────────────────────────
# COMMITS POR ETAPA
# ──────────────────────────────────────────────────────────────

git_commit_etapa() {
    local etapa=$1
    local mensagem=$2
    
    git add .
    git commit -m "feat(etapa-$etapa): $mensagem" || true
    print_success "Commit: $mensagem"
}

# ──────────────────────────────────────────────────────────────
# FUNÇÃO PRINCIPAL
# ──────────────────────────────────────────────────────────────

main() {
    clear
    
    echo ""
    echo -e "${PURPLE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                                                        ║${NC}"
    echo -e "${PURPLE}║         🚀 FOZ.FOCO - Setup Automático v1.0           ║${NC}"
    echo -e "${PURPLE}║                                                        ║${NC}"
    echo -e "${PURPLE}║     Portal de Notícias com IA de Automação            ║${NC}"
    echo -e "${PURPLE}║                                                        ║${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Verificações
    check_dependencies
    
    # Confirmar
    echo ""
    print_warning "Este script vai criar TODO o projeto FOZ.FOCO nesta pasta."
    read -p "Continuar? (s/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        print_error "Cancelado pelo usuário"
        exit 1
    fi
    
    # Inicializa Git
    print_header "Inicializando Git"
    git init
    git_commit_etapa "0" "inicialização do repositório"
    
    # Executa etapas
    create_folder_structure
    git_commit_etapa "1" "estrutura de pastas criada"
    
    create_config_files
    git_commit_etapa "2" "arquivos de configuração"
    
    create_ui_components
    git_commit_etapa "3" "componentes UI base"
    
    # Instala dependências
    print_header "Instalando Dependências npm"
    print_step "Isso pode levar alguns minutos..."
    npm install --silent
    print_success "Dependências instaladas!"
    
    git_commit_etapa "final" "dependências instaladas"
    
    # Sucesso
    print_header "✅ PROJETO CRIADO COM SUCESSO!"
    
    echo ""
    echo -e "${GREEN}Próximos passos:${NC}"
    echo ""
    echo -e "  1. Configure as variáveis de ambiente:"
    echo -e "     ${BLUE}cp .env.example .env.local${NC}"
    echo ""
    echo -e "  2. Conecte com seu repositório GitHub:"
    echo -e "     ${BLUE}git remote add origin https://github.com/SEU-USUARIO/foz-foco.git${NC}"
    echo -e "     ${BLUE}git branch -M main${NC}"
    echo -e "     ${BLUE}git push -u origin main${NC}"
    echo ""
    echo -e "  3. Configure o banco de dados:"
    echo -e "     ${BLUE}npm run db:push${NC}"
    echo ""
    echo -e "  4. Rode o servidor de desenvolvimento:"
    echo -e "     ${BLUE}npm run dev${NC}"
    echo ""
    echo -e "${GREEN}Documentação: README.md${NC}"
    echo ""
}

# Executa
main
