# Contexto do Projeto: Stack Fullstack & Mobile

## 1. Visão Geral da Stack
- **Backend:** NestJS com TypeScript, Prisma ORM e banco de dados PostgreSQL.
- **Web:** NextJS (App Router) com TypeScript e TailwindCSS.
- **Mobile:** Expo (React Native) com TypeScript e NativeWind (Tailwind para mobile).

---

## 2. Diretrizes Gerais de Código
- Escreva código limpo, modular e estritamente tipado com TypeScript.
- Prefira exportações nomeadas (`export const ...`) em vez de exportações padrão (`export default`), exceto onde o NextJS ou Expo exigirem.
- Seja direto: forneça o código corrigido/gerado imediatamente, seguido apenas de explicações breves se necessário.

---

## 3. Regras para o Backend (NestJS + Prisma)
- Sempre use os padrões do NestJS (Dependency Injection, DTOs para validação com class-validator).
- Utilize os subgrupos do Prisma de forma eficiente para evitar queries N+1.
- Sempre trate erros com exceções nativas do NestJS (ex: `NotFoundException`, `BadRequestException`).
- Mantenha a lógica de negócios nos Services; Controllers servem apenas para rotas e validação de entrada.

---

## 4. Regras para o Frontend Web (NextJS + Tailwind)
- Use componentes funcionais e a estrutura do App Router (`app/` directory).
- Diferencie claramente Server Components (padrão) de Client Components (`'use client'`).
- Utilize classes utilitárias do TailwindCSS de forma semântica e organizada.
- Prefira componentes assíncronos no servidor para buscar dados diretamente com `fetch` ou chamadas diretas ao banco se aplicável.

---

## 5. Regras para o Mobile (Expo + NativeWind)
- Desenvolva pensando em performance mobile (evite re-renderizações desnecessárias).
- Use as tags do NativeWind de forma limpa. Lembre-se de usar `className` para estilização.
- Certifique-se de que os componentes funcionem bem tanto em iOS quanto em Android (use `Platform.OS` quando precisar de ajustes específicos).
- Utilize o Expo Router para navegação baseada em arquivos se aplicável.
