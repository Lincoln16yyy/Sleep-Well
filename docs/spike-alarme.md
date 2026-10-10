# Spike: alarme confiável no Android (PWA × Capacitor × Kotlin)

> **Tipo:** investigação e documentação (spike) — issue #41. **Nada foi implementado.**
> Fatos verificados têm fonte numerada (§8); tudo que é estimativa está marcado como
> **Estimativa**. Nenhum dispositivo real foi usado nesta investigação.
> Pesquisa: **10/10/2026**, nas páginas oficiais listadas em §8.

## 1. Contexto e problema

O Noite Boa é um app web instalável (PWA) para registrar sono e criar
**consistência de horários** (`PLANO.md` §3). O produto quer oferecer um lembrete
de "hora de dormir" — e o requisito central é:

> **Avisar no horário mesmo com o celular bloqueado e o app fechado.**

`PLANO.md` §3 já registra a limitação com honestidade: navegadores **não garantem**
alarme com o app fechado; o MVP não promete alarme; a avaliação de app nativo vira
spike (esta issue, marcada `pos-mvp`).

**Estado atual do código (fatos do repositório):**

- `frontend/src/lib/reminder.js`: o lembrete usa `window.setTimeout` — o timer vive
  **na aba aberta**; se o usuário fechar o app/página, não há disparo. A notificação
  é exibida via service worker (caminho suportado no Chrome/Android) ou construtor
  clássico, sempre "melhor esforço".
- `frontend/public/sw.js`: service worker de **cache** (offline); não recebe push nem
  agenda nada.
- `frontend/public/manifest.webmanifest`: PWA instalável já pronta (`display: standalone`).
- `PLANO.md` §3/§11: lembrete de dormir é "melhor esforço"; alarme confiável exige
  plataforma com agendamento nativo.

Ou seja: hoje o app **não tem** nenhum mecanismo de agendamento que sobreviva ao
fechamento da página. As três alternativas abaixo respondem a pergunta da issue:
qual caminho adotar quando o M6 decidir implementar.

## 2. Comparação das três alternativas

| Critério | PWA (atual + melhorias) | Híbrido (Capacitor) | Nativo (Kotlin) |
|---|---|---|---|
| Disparo com app fechado/tela bloqueada | **Não garantido** — não existe API web de agendamento; timers morrem com a página/SW [5][6] | **Sim** — `@capacitor/local-notifications` agenda no sistema (alarmes exatos) [7] | **Sim** — `AlarmManager` direto [1][2] |
| Execução em segundo plano | SW é terminado quando ocioso (segundos) [5]; Periodic Background Sync é discricionário e só Chrome/PWA instalada [8][9] | Herda o Doze do Android; `allowWhileIdle` dispara em Doze (limite: 1×/9 min por app) [7] | Mesmo Doze; `setExactAndAllowWhileIdle` em Doze (1×/9 min); `setAlarmClock` sai do Doze antes de disparar [1][4] |
| Permissão de alarme exato | Inexistente na plataforma web | `SCHEDULE_EXACT_ALARM` no manifest (Android 12+); se negada, cai para alarme **aproximado** com aviso (`ScheduleResult.warning`) [7] | `SCHEDULE_EXACT_ALARM` (concedido pelo usuário, revogável — Android 12+; **negado por padrão** em apps novos no Android 14) ou `USE_EXACT_ALARM` (concedido na instalação, reservado a apps de alarme/calendário) [1][3] |
| Após reinicialização do dispositivo | Sem agendamento local que sobreviva | **Ponto não confirmado**: o plugin oficial não documenta reagendamento pós-boot (alarmes são apagados no reboot [1]) | Padrão documentado: permissão `RECEIVE_BOOT_COMPLETED` + `BroadcastReceiver` que reagenda [1] — atenção: no Android 13+, app em estado "restricted" não recebe o broadcast até ser aberto [10] |
| Bateria/fabricante | N/A (sem wake-up próprio) | Mesmas restrições do OS; fabricantes variam (ex.: Xiaomi/Huawei) — **não verificado nesta spike**, exige teste real | Idem; para o caso de alarme de tela cheia há ainda política própria da Play [3] |
| Versões do Android | Notifications amplamente suportadas; agendamento: nenhuma | `allowWhileIdle` exige API 23+; permissões de alarme exato começam no Android 12 (API 31) [7][1] | Mesmos limites de plataforma; minSdk é decisão do projeto [1] |
| Reaproveitamento do React | **100%** (é o app atual) | **~100% da UI** — o React roda em WebView; só a lógica de agendamento chama o plugin | **~0% da UI** — telas seriam reescritas em Kotlin/Compose (ou manter WebView = voltar ao híbrido) |
| Complexidade de desenvolvimento | Baixa (já existe), mas **não atende** ao requisito | Baixa/média: camada Capacitor + plugin oficial + POC de permissões | Alta: projeto Android, UI, permissões, receiver de boot |
| Teste em dispositivo real | — (já há E2E web, sem alarme) | Obrigatório: ≥2 fabricantes, tela bloqueada, Doze, reboot | Idem |
| Manutenção futura | 1 base (web) | 1 base + toolchain Capacitor/WebView | 2 produtos (web + app) ou rewrite total |
| Custo de publicação | **R$ 0 / US$ 0** (já publicado) | Play Store: **US$ 25 taxa única** [11] (ou distribuir APK fora da loja, sem taxa, com atrito) [12] | Play Store: idem US$ 25 [11] |

## 3. Vantagens, desvantagens e limitações técnicas

### 3.1 PWA

**Vantagens:** zero código novo; 100% reaproveitado; sem loja, sem taxa, sem revisão;
já instalável (manifest + SW); web push no Android **chega com o navegador fechado**
(oS Android acorda o navegador para entregar push) [6] — hoje não usamos Web Push
(VAPID/backend de push), seria implementação nova.

**Desvantagens (limitação de plataforma):** não existe API web para "disparar exatamente
às 23:00 com a página fechada". `setTimeout` morre com a página [5]; service workers
são mortos em segundos de ociosidade [5]; Periodic Background Sync (a) só existe no
Chrome, (b) exige PWA instalada, (c) a frequência é do navegador/engajamento, **não do
desenvolvedor**, (d) é "Limited availability" experimental no MDN [8][9]. Web Push do
servidor avisaria "quase na hora", mas **sem garantia de horário** (entrega é esforço
máximo do serviço de push, não um alarme) e exige infra nova no back-end.

**Veredito:** continua a base do produto e o lembrete "melhor esforço" do site, mas
**não satisfaz** o requisito de alarme confiável da issue.

### 3.2 Capacitor (híbrido)

**Vantagens:** reaproveita ~100% do React (UI, testes Vitest, lógica de negócio); o
plugin oficial `@capacitor/local-notifications` cobre o essencial [7]:

- `schedule({ at, allowWhileIdle })` — notificação local com alarme exato e disparo
  em Doze (1×/9 min por app);
- Android 12+: `SCHEDULE_EXACT_ALARM` no manifest; `isExactNotification` (padrão `true`)
  **abre a tela de sistema "Alarms & reminders"** quando falta permissão; se o usuário
  recusar, **cai para alarme aproximado** com `warning` no resultado (ou recusa total
  com `isExactMandatory`);
- `checkExactNotificationSetting()` / `changeExactNotificationSetting()` para reagendar
  ao voltar do ajuste;
- Android 13+: permissão `POST_NOTIFICATIONS` tratada pelo plugin (desde a v8.3.0 ele
  pede antes de agendar);
- Android 14: pode declarar `USE_EXACT_ALARM` (só se alarme for função central) [7][3];
- canal de som configurável (Android 8+) — importante para "tocar algo" no lembrete.

**Desvantagens/limitações:**

- **Reboot não coberto pelo plugin**: alarmes do Android são apagados no reinício [1]
  e a documentação oficial do plugin **não menciona** reagendamento pós-boot. A solução
  provável (receiver nativo via código Capacitor custom) é viável, mas é **exatamente
  o que o POC da §7 precisa confirmar** — o plugin sozinho não garante.
- Camada extra de manutenção (Capacitor + WebView + plugins vs. navegador).
- Permissão de alarme exato pode ser negada → degradação para horário aproximado
  (comportamento documentado do plugin, mas UX a desenhar).

### 3.3 Kotlin (nativo)

**Vantagens:** controle total da plataforma — `setAlarmClock()` é o caminho "mais
próximo de um alarme real": funciona em Doze e o sistema sai do Doze antes de disparar
[1][4]; `setExactAndAllowWhileIdle` como alternativa; receiver `BOOT_COMPLETED`
documentado com o padrão de enable/disable [1]; permissão `USE_EXACT_ALARM` concedida
na instalação para apps cuja função central é alarme [3]. Sem camada intermediária.

**Desvantagens/limitações:**

- **Não reaproveita a UI React**: ou o app é reescrito em Kotlin/Compose (registro,
  login, histórico, dashboard, metas — ordens de magnitude mais esforço, §4), ou
  mantém uma WebView e na prática virá o mesmo híbrido do 3.2 com menos ferramentas.
- Dois produtos para manter (site + app) ou abandono do site.
- Mesmas políticas/permissões de alarme exato da Play [1][3] — não some o problema
  de UX, só muda a implementação.

## 4. Estimativas de esforço e custos

**Custos fixos (fatos, com fonte):**

| Item | Custo | Fonte |
|---|---|---|
| Google Play Console (distribuição total) | **US$ 25, taxa única** | [11] |
| Play "limited distribution" (até ~20 dispositivos, teste fechado) | grátis | [12] |
| PWA na Vercel (plano atual) | US$ 0 | já é o caso do projeto |
| Apple/App Store | fora do escopo desta issue (Android) | — |

**Esforço — Estimativa** (base: escopo conhecido do app; **não é tempo medido**):

| Alternativa | Decomposição | Total estimado |
|---|---|---|
| PWA | já existe; Web Push (backend + VAPID) seria +3 a 5 dias **e ainda sem garantia de horário** | 0 (hoje) / 3–5 d (com push, se quiser) |
| Capacitor | setup Capacitor + CI/assinatura 1–2 d · lógica de lembrete (agendar ao logar/mudar meta, cancelar, permissões) 2–3 d · **POC de reboot + permissões (§7) 1–2 d** · testes em 2–3 aparelhos reais 2–3 d · listing Play + revisão 1–2 d | **~7–12 dias** |
| Kotlin | item de alarme idêntico ao Capacitor (2–3 d) **+** reescrita de UI e auth em Kotlin/Compose (3–6 semanas) + publicação | **~4–8 semanas** |

Justificativa da diferença: o custo do nativo não está no alarme (AlarmManager é o
mesmo por baixo do Capacitor) e sim em **reescrever tudo o que já existe em React**.
O Capacitor paga o requisito de alarme reaproveitando o produto atual.

## 5. Riscos e pontos ainda não confirmados

1. **Reboot com o plugin Capacitor** — não documentado oficialmente; se não bastar
   o código custom, o esforço do híbrido sobe (guardar estado + receiver nativo).
   *Confirmar só com POC.*
2. **Política da Play para permissões de alarme** — `USE_EXACT_ALARM` é para apps
   **cuja função central é alarme** [3]; o Noite Boa é um app de sono com lembrete.
   Risco de precisar usar `SCHEDULE_EXACT_ALARM` (fluxo de settings com o usuário) ou
   de revisão da loja. *Não avaliado com a Play; depende do desenho final do app.*
3. **Fabricantes (Xiaomi, Huawei, Samsung…)** — matador de segundo plano varia fora
   do AOSP; **não verificado nesta spike**; exige teste em aparelho real (§7).
4. **Notificação ≠ alarme de tela cheia** — se um dia o requisito virar "despertar
   tocando som alto com tela cheia", é outra permissão (`USE_FULL_SCREEN_INTENT`,
   Android 14+) e outra avaliação. O escopo desta issue é **lembrete de dormir**.
5. **iOS** — fora do escopo (a issue é Android). Push/iOS tem regras próprias
   (Safari/PWA 16.4+); qualquer decisão futura deve reavaliar.
6. **Nenhum teste real foi executado** nesta spike — todos os cenários de dispositivo
   estão como critério para a implementação (§7), não como resultado.

## 6. Recomendação final

**Caminho recomendado: PWA continua como base do produto + Capacitor
(`@capacitor/local-notifications`) quando o M6 implementar o lembrete confiável.**

Justificativa:

1. **Requisito × capacidade:** o que falta hoje é agendamento que sobreviva à aba
   fechada — exatamente o que o plugin oficial entrega (alarme exato + Doze +
   fluxo de permissões) sem reescrever o app [7].
2. **Reuso:** ~100% da UI React, testes e lógica permanecem; o esforço estimado é
   7–12 dias contra 4–8 semanas do nativo (§4, Estimativa).
3. **A PWA sozinha não fecha o requisito** (limitação de plataforma, §3.1) e o nativo
   paga um preço desproporcional para um lembrete — o `AlarmManager` que o Capacitor
   usa é o mesmo do Kotlin [1][2]; a diferença é a UI, que já existe.
4. **Condição:** a recomendação **não é decisão final** — depende do POC da §7
   (principalmente reboot e permissão exata em aparelho real). Se o POC mostrar que a
   camada Capacitor não entrega o cenário-alvo, aí sim avaliar Kotlin puro.

A preferência inicial pela alternativa híbrida, indicada na issue, **se manteve após
a pesquisa** — pelos motivos acima, não por premissa.

## 7. Critérios para uma futura implementação

- [ ] **POC em aparelho real (Android 12+):** agendar lembrete para 2 min à frente,
      fechar o app, bloquear a tela → notificação dispara (e registra o log).
- [ ] **POC de reboot:** reagendar após reiniciar o dispositivo (definir se o plugin
      basta ou é preciso código nativo); considerar a ressalva do estado "restricted"
      no Android 13+ [10].
- [ ] **POC de permissão negada:** recusar "Alarms & reminders" → confirmar degradação
      para horário aproximado e desenhar a UX de reconvencão [7].
- [ ] Testar em **≥2 fabricantes** (ex.: Samsung + Xiaomi) com restrição de bateria.
- [ ] Decisão humana de distribuição: Play Store (US$ 25 [11]) × APK direto (sem taxa).
- [ ] Lógica de agendamento escrita em módulo TypeScript puro, coberto por testes
      (mesmo padrão dos testes atuais de `reminder`).
- [ ] O lembrete web (site) **não regride** — continua melhor esforço para quem usa
      o navegador.
- [ ] Escopo explícito: **lembrete de dormir** (notificação) — alarme de tela cheia é
      nova issue (§5.4).

## 8. Fontes consultadas

Todas consultadas em 10/10/2026:

1. Android Developers — *Schedule alarms* (APIs, `USE_EXACT_ALARM`/`SCHEDULE_EXACT_ALARM`,
   boot receiver): https://developer.android.com/develop/background-work/services/alarms
2. Android Developers — *AlarmManager (API reference)* (alarmes são apagados no reboot;
   revogação de permissão apaga alarmes agendados): https://developer.android.com/reference/android/app/AlarmManager
3. Android Developers — *Schedule exact alarms are denied by default* (Android 14):
   https://developer.android.com/about/versions/14/changes/schedule-exact-alarms
4. Android Developers — *Optimize for Doze and App Standby* (`setAlarmClock` e
   `*AllowWhileIdle` em Doze; limite de 1×/9 min): https://developer.android.com/training/monitoring-device-state/doze-standby
5. web.dev — *Service workers* (SW terminado após segundos de ociosidade): https://web.dev/learn/pwa/service-workers
6. web.dev — *Push notifications FAQ* (Android acorda o navegador para push com o app
   fechado): https://web.dev/articles/push-notifications-faq
7. Capacitor — *Local Notifications plugin* (schedule, `allowWhileIdle`,
   `isExactNotification`, permissões Android 12/13/14): https://capacitorjs.com/docs/apis/local-notifications
8. Chrome for Developers — *Periodic Background Sync* (só PWA instalada; frequência
   guiada por engajamento, não pelo desenvolvedor): https://developer.chrome.com/docs/capabilities/periodic-background-sync
9. MDN — *Web Periodic Background Synchronization API* ("Limited availability",
   experimental): https://developer.mozilla.org/en-US/docs/Web/API/Web_Periodic_Background_Synchronization_API
10. Android Developers — *Background optimization* (estado "restricted" não recebe
    `BOOT_COMPLETED` no Android 13+): https://developer.android.com/topic/performance/background-optimization
11. Google Play Console Help — *Get started with Play Console* (taxa única de US$ 25):
    https://support.google.com/googleplay/android-developer/answer/6112435
12. Android Developer Console Help — *Get started* (distribuição limitada sem taxa,
    até ~20 dispositivos): https://support.google.com/android-developer-console/answer/16604405
