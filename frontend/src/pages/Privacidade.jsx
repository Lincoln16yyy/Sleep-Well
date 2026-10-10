const conteudo = {
  maxWidth: '720px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

/** Pendência da issue #36: trecho que depende de decisão do responsável. */
const pendStyle = {
  background: '#FFF3CD',
  border: '1px solid #E6C75C',
  borderRadius: '6px',
  padding: '0.05rem 0.35rem',
};

function Pend({ children }) {
  return <span style={pendStyle}>{children}</span>;
}

export default function Privacidade() {
  return (
    <article style={conteudo}>
      <h1>Política de Privacidade</h1>
      <p style={{ fontSize: '14px', color: '#555' }}>Última atualização: 10 de outubro de 2026.</p>

      <p>
        Esta página explica, em linguagem simples, quais dados o Noite Boa guarda sobre você, para
        que usamos e o que você pode pedir. O Noite Boa é um aplicativo web para registrar seu
        sono e criar consistência de horários.
      </p>

      <h2>1. Quem é responsável pelo serviço</h2>
      <p>
        Responsável pelo Noite Boa: <Pend>a definir (pendência desta edição)</Pend>.
      </p>
      <p>
        Para assuntos de privacidade, o canal de contato é:{' '}
        <Pend>canal a definir (pendência desta edição)</Pend>.
      </p>

      <h2>2. Quais dados coletamos</h2>
      <p>
        <strong>No cadastro:</strong> nome de exibição, e-mail e senha. A senha não é guardada em
        texto: armazenamos apenas um código protegido, que não permite descobrir a senha original.
      </p>
      <p>
        <strong>No seu perfil:</strong> fuso horário (padrão América/São_Paulo) e sua escolha de
        compartilhar dados com amigos (padrão: desligado).
      </p>
      <p>
        <strong>Registros de sono:</strong> horário de início e fim, qualidade (de 1 a 5) e uma
        observação, se você escrever uma.
      </p>
      <p>
        <strong>Meta de sono:</strong> horas desejadas e os horários de dormir e de acordar.
      </p>
      <p>
        <strong>Amizades:</strong> o e-mail usado para convidar alguém. A amizade só começa quando
        a outra pessoa aceita o convite.
      </p>
      <p>
        <strong>No seu navegador:</strong> o token de acesso da sessão (que expira em 1 hora) e a
        preferência do lembrete de dormir. O aplicativo não usa cookies de publicidade,
        rastreamento ou analytics.
      </p>

      <h2>3. Para que usamos seus dados</h2>
      <ul>
        <li>criar e manter sua conta e permitir o login;</li>
        <li>mostrar seu histórico, estatísticas e meta de sono;</li>
        <li>
          calcular o ranking entre amigos — somente com amigos aceitos que ligaram o
          compartilhamento (quem está com o compartilhamento desligado, que é o padrão, não aparece
          no cálculo);
        </li>
        <li>
          mostrar o lembrete de hora de dormir enquanto o aplicativo estiver aberto (é o máximo que
          um site consegue garantir — não prometemos alarme com o aplicativo fechado);
        </li>
        <li>manter a segurança do serviço.</li>
      </ul>
      <p>
        Não vendemos seus dados, não os usamos para publicidade e não há serviços de analytics no
        aplicativo.
      </p>

      <h2>4. Serviços externos que processam seus dados</h2>
      <p>Para funcionar, o Noite Boa usa três serviços:</p>
      <ul>
        <li>
          <strong>Vercel</strong> — hospeda o site (frontend);
        </li>
        <li>
          <strong>Render</strong> — executa a API e mantém registros técnicos de diagnóstico;
        </li>
        <li>
          <strong>Neon</strong> — guarda o banco de dados, em infraestrutura fora do Brasil
          (região nos Estados Unidos).
        </li>
      </ul>
      <p>Nenhum outro serviço externo recebe seus dados.</p>

      <h2>5. Como protegemos seus dados</h2>
      <ul>
        <li>a comunicação entre o aplicativo e o serviço usa conexão criptografada (HTTPS);</li>
        <li>as senhas são guardadas com hash (BCrypt) — nem nós conseguimos ler sua senha;</li>
        <li>o acesso aos dados exige um token de login que expira em 1 hora;</li>
        <li>o banco de dados só é acessado pelas credenciais do serviço.</li>
      </ul>
      <p>
        Nenhum sistema é 100% seguro; adotamos medidas adequadas à natureza deste serviço, sem
        promessas além do que é tecnicamente possível garantir.
      </p>

      <h2>6. Por quanto tempo os dados são mantidos</h2>
      <p>
        Enquanto sua conta existir — não há prazo automático de descarte enquanto você usa o
        serviço. Os registros técnicos de diagnóstico ficam nas plataformas de hospedagem pelo tempo
        que elas mantêm; são usados apenas para corrigir problemas, não para perfilamento. Quando
        você exclui a conta, apagamos seus dados na hora, como explicado na seção 8.
      </p>

      <h2>7. Seus direitos (LGPD)</h2>
      <p>Pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode pedir:</p>
      <ul>
        <li>confirmação e acesso aos dados que temos sobre você;</li>
        <li>correção de dados incompletos ou desatualizados;</li>
        <li>eliminação dos dados;</li>
        <li>informação sobre com quem seus dados foram compartilhados;</li>
        <li>revogação do consentimento, quando o tratamento se basear em consentimento.</li>
      </ul>
      <p>
        Parte disso você mesmo faz no aplicativo: registros de sono podem ser editados ou excluídos
        na tela de Histórico, e o compartilhamento com amigos pode ser desligado em Configurações.
        Para o resto, use o canal de contato desta página. Saiba mais na{' '}
        <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm">
          Lei nº 13.709/2018 (Planalto)
        </a>{' '}
        e no{' '}
        <a href="https://www.gov.br/anpd/pt-br">site da Autoridade Nacional de Proteção de Dados</a>.
      </p>

      <h2>8. Como excluir a conta</h2>
      <p>
        Peça pelo canal de contato desta página. Ao confirmar, apagamos definitivamente seu e-mail,
        nome, registros de sono, meta e amizades — tudo é removido do banco de dados, e o acesso
        antigo à conta deixa de funcionar. Depois da exclusão, não é possível recuperar os dados.
      </p>

      <h2>9. Alterações nesta política</h2>
      <p>
        Quando esta política mudar, publicaremos a nova versão nesta mesma página e atualizaremos a
        data no topo. Não enviamos avisos por e-mail neste momento — por isso vale conferir esta
        página de vez em quando. Continuar usando o aplicativo depois de uma mudança significa que
        você aceita a versão nova.
      </p>

      <h2>10. Como entrar em contato</h2>
      <p>
        Sobre privacidade e sobre seus dados:{' '}
        <Pend>canal de contato a definir (pendência desta edição)</Pend>.
      </p>

      <p style={{ fontSize: '14px', color: '#555' }}>
        Este texto foi escrito em linguagem simples para informar você. Última atualização: 10 de
        outubro de 2026.
      </p>
    </article>
  );
}
