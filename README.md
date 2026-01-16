# 💪 GymLog - Seu Companheiro de Treino

Um aplicativo web moderno para registrar, acompanhar e comparar seus treinos na academia. Monitore seu progresso, analise comparações automáticas com sessões anteriores e mantenha um histórico completo de seus exercícios.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Características

### 🏋️ **Registrar Treinos**
- Adicione exercícios com múltiplas séries
- Digite o peso (kg) e repetições para cada série
- Nomeie seus treinos (ex: "Peito e Tríceps")
- Selecione datas para treinos passados ou futuros

### 📈 **Comparação Automática**
- Compara automaticamente com seu último treino do mesmo exercício
- Indicadores visuais:
  - **↑ Verde** - Melhorou (peso ou reps)
  - **↓ Vermelho** - Piorou (peso ou reps)
  - **= Cinza** - Mesmo desempenho
  - **NEW Azul** - Primeiro treino do exercício

### 📅 **Histórico Completo**
- Visualize todos os seus treinos
- Expandir/retrair para ver detalhes
- Editar exercícios existentes
- Deletar treinos inteiros

### ⚙️ **Gerenciamento de Dados**
- Dados salvos localmente no seu navegador
- Visualize total de treinos registrados
- Apague todos os dados com um clique (com confirmação segura)

### 📱 **Design Responsivo**
- Otimizado para mobile (touch-friendly)
- Funciona em tablets e desktops
- Interface intuitiva e sem distrações
- Dark theme moderno

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+ 
- npm, yarn, pnpm ou bun

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/gymlog.git
cd gymlog
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Rode o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

4. **Abra no navegador**
```
http://localhost:3000
```

---

## 🛠️ Build & Deploy

### Compilar para Produção
```bash
npm run build
npm start
```

### Deploy na Vercel
A forma mais fácil de fazer deploy é usando a [Plataforma Vercel](https://vercel.com):

1. Faça push do repositório para GitHub
2. Conecte no Vercel
3. Vercel detectará Next.js automaticamente e otimizará o build
4. Seu app estará live em minutos!

[Documentação de Deploy Next.js →](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 📖 Como Usar

### 🏋️ Aba Treino (Padrão)
1. **Selecione a data** - Escolha que dia deseja registrar
2. **Nomeie o treino** (opcional) - Ex: "Peito e Tríceps"
3. **Adicione exercício** - Digite o nome do exercício
4. **Defina as séries** - Adicione peso e reps
   - Clique "+ Série" para adicionar mais séries
5. **Clique "Adicionar Exercício"** - O exercício aparecerá abaixo
6. **Veja as comparações** - Indicadores mostram seu progresso

**💡 Dica:** Adicione múltiplos exercícios para o mesmo dia!

### 📅 Aba Histórico
1. **Veja todos os treinos** - Listados do mais recente para o mais antigo
2. **Clique para expandir** - Veja todos os exercícios e séries
3. **Edite exercícios** - Clique ✎ em um exercício para editar
4. **Delete conforme necessário** - Use o botão "Deletar Exercício" ou "Deletar Treino"

### ⚙️ Aba Ajustes
- **Sobre** - Informações do app
- **Armazenamento** - Veja quantos treinos você registrou
- **Limpar Dados** - Apague todos os treinos (com timer de segurança de 3 segundos)

---

## 🏗️ Estrutura do Projeto

```
gymlog/
├── app/
│   ├── page.tsx           # Página principal com lógica das 3 abas
│   ├── layout.tsx         # Layout root com metadados
│   └── globals.css        # Estilos globais e CSS customizado
├── components/
│   ├── ExerciseForm.tsx   # Formulário para adicionar exercícios
│   ├── ExerciseCard.tsx   # Card do exercício com modo edição
│   ├── SetRow.tsx         # Linha individual de série
│   ├── WorkoutCard.tsx    # Card expandível do treino
│   ├── BottomNav.tsx      # Navegação inferior com 3 abas
│   └── ClearDataModal.tsx # Modal de confirmação para limpar dados
├── lib/
│   ├── types.ts           # Tipos TypeScript (Workout, Exercise, Set)
│   └── workoutUtils.ts    # Funções utilitárias e localStorage
├── public/                # Arquivos estáticos
├── package.json           # Dependências do projeto
├── next.config.ts         # Configuração Next.js
├── tailwind.config.ts     # Configuração Tailwind CSS
├── tsconfig.json          # Configuração TypeScript
└── README.md              # Este arquivo
```

### Tipos de Dados
```typescript
// Um workout completo
type Workout = {
  id: string;              // ID único
  date: string;            // YYYY-MM-DD
  name?: string;           // Nome opcional (ex: "Peito e Tríceps")
  exercises: Exercise[];   // Array de exercícios
}

// Um exercício com séries
type Exercise = {
  name: string;            // Nome do exercício (ex: "Supino")
  sets: Set[];             // Array de séries
}

// Uma série individual
type Set = {
  setNumber: number;       // Número da série (1, 2, 3...)
  weight: number;          // Peso em kg
  reps: number;            // Repetições
  comparison?: string;     // 'up' | 'down' | 'equal' | 'new'
}
```

---

## 💾 Persistência de Dados

**GymLog usa Local Storage** para salvar seus dados:
- ✅ Nenhum servidor necessário
- ✅ Dados nunca são enviados para a internet
- ✅ Privacidade garantida
- ⚠️ Dados são específicos do navegador/dispositivo
- ⚠️ Limpar cache do navegador apaga os dados

**Chave de Storage:** `gymlog_workouts`

---

## 🎨 Design & Cores

### Paleta de Cores
| Cor | Uso | Valor |
|-----|-----|-------|
| Preto | Background primário | #0e0e11 |
| Cinza Escuro | Backgrounds secundários | #18181d, #27272e |
| Branco | Texto primário | #ffffff |
| Cinza Claro | Texto secundário | #a1a1aa |
| Verde | Melhoria (up) | #22c55e |
| Vermelho | Piora (down) | #ef4444 |
| Cinza | Igual (equal) | #9ca3af |
| Azul | Novo (new) | #3b82f6 |

### Fontes
- **Geist Sans** - Texto padrão
- **Geist Mono** - Código/números
- Font-smoothing otimizado para legibilidade

---

## 📱 Responsividade

Breakpoints otimizados:
- **Mobile** - Padrão (< 640px)
- **Tablet** (640px - 1024px)
- **Desktop** (> 1024px)

**Otimizações Mobile:**
- Inputs grandes (48px) para toque confortável
- Padding responsivo em todos os elementos
- Bottom navigation fixa com safe-area inset
- Fonte ajustada por tamanho de tela

---

## 🔧 Tech Stack

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **Next.js** | 16.1.1 | Framework React com SSR/SSG |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 4 | Styling utility-first |
| **ESLint** | 9 | Code linting |

### Recursos Utilizados
- Next.js App Router (novo sistema de roteamento)
- React Hooks (useState, useEffect)
- Client Components (`'use client'`)
- CSS customizado com variáveis CSS
- LocalStorage API
- Responsive Design Mobile-First

---

## 📋 Funcionalidades Planejadas

- [ ] Exportar dados como CSV/JSON
- [ ] Gráficos de progresso
- [ ] Sincronização na nuvem
- [ ] Autenticação de usuário
- [ ] Compartilhamento de treinos
- [ ] Sugestões de exercícios
- [ ] Dark/Light mode toggle
- [ ] Suporte offline completo (PWA)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

**Lucas Monte**

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org) - Framework incrível
- [Tailwind CSS](https://tailwindcss.com) - Styling eficiente
- [Vercel](https://vercel.com) - Plataforma de deploy

---

## 📞 Suporte

Encontrou um bug ou tem uma sugestão? Abra uma [issue](https://github.com/seu-usuario/gymlog/issues) no repositório!

---

**Desenvolvido com 💪 para academias em todo o Brasil**
