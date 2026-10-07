# ADR-0001: Escolha da stack

- **Status:** aceita (revisável)
- **Data:** 2026-10-07

## Contexto
O projeto anterior (Meu Soninho) era um app estático, sem contas nem dados persistentes. O novo projeto precisa de usuários, histórico de sono e estatísticas, e serve também como portfólio de back-end.

## Decisão
- Back-end: Java 21 + Spring Boot 3 + Maven, PostgreSQL 16, Flyway, JWT.
- Front-end: React + Vite (JavaScript), PWA no pós-MVP.
- CI: GitHub Actions. Dev local: Docker Compose.

## Alternativas consideradas
- Manter app estático com `localStorage`: simples, mas sem contas e sem dados entre dispositivos.
- Node/Express no back-end: mais rápido de começar, mas foge do foco de estudo em Java.
- TypeScript no front-end: melhor a longo prazo; adiado para reduzir a curva inicial.

## Consequências
Mais peças para configurar no início (banco, auth, deploy), em troca de um produto real e de aprendizado aplicável a vagas de back-end Java.
