import crypto from "crypto";
import type { Volunteers } from "@prisma/client";
import { isProduction } from "../utils";
import {
  AGENT_DICIO,
  SOCIAL_WORKER,
  VOLUNTEER_SUPPORT_TYPE_DICIO,
} from "../constants";
import type { SupportRequest, ZendeskUser } from "../types";
import { PUBLIC_SERVICE } from "../constants";

type Volunteer = Pick<Volunteers, "firstName" | "phone" | "registrationNumber">;
type Msr = Pick<ZendeskUser, "email" | "name"> &
  Pick<SupportRequest, "supportType">;

type MsrEmailParams = {
  volunteer?: Volunteer;
  agent: number;
  msr: Msr;
  referralType: number;
};

export default function getMsrEmail({
  volunteer,
  agent,
  msr,
  referralType = 0,
}: MsrEmailParams) {
  const encryptedEmail = encrypt(msr.email);
  const surveyLink = process.env["SURVEY_LINK"];

  const msrSurveyLink = `${surveyLink}?user_id=${encryptedEmail}`;
  const agentName = AGENT_DICIO[agent] || "Equipe";

  const referralEmailTemplate: Record<number, string> = {
    [PUBLIC_SERVICE]: publicServiceEmailTemplate(
      msr.name,
      agentName,
      msrSurveyLink
    ),
    [SOCIAL_WORKER]: socialWorkerEmailTemplate(msr.name, msrSurveyLink),
  };

  const emailTemplate = volunteer
    ? matchEmailTemplate({
        volunteer,
        msr,
        agentName,
        surveyLink: msrSurveyLink,
      })
    : referralEmailTemplate[referralType];

  const zendeskComment = {
    html_body: emailTemplate,
    author_id: agent,
    public: isProduction() ? true : false,
  };

  return zendeskComment;
}

function encrypt(data: string) {
  const encryptionMethod = process.env["ENCRYPTION_METHOD"]!;
  const secretKey = process.env["SECRET_KEY"]!;
  const secretIv = process.env["SECRET_IV"]!;

  const key = crypto
    .createHash("sha512")
    .update(secretKey)
    .digest("hex")
    .substring(0, 32);

  const iv = crypto
    .createHash("sha512")
    .update(secretIv)
    .digest("hex")
    .substring(0, 16);

  const cipher = crypto.createCipheriv(encryptionMethod, key, iv);
  return Buffer.from(
    cipher.update(data, "utf8", "hex") + cipher.final("hex")
  ).toString("base64");
}

type MatchEmailTemplate = {
  volunteer: Volunteer;
  agentName: string;
  msr: {
    supportType: SupportRequest["supportType"];
    name: ZendeskUser["name"];
  };
  surveyLink: string;
};

function matchEmailTemplate({
  msr,
  volunteer,
  agentName,
  surveyLink,
}: MatchEmailTemplate) {
  const volunteerSupportTypeInfo =
    VOLUNTEER_SUPPORT_TYPE_DICIO[msr.supportType];

  return `
    <p>Olá ${msr.name || ""}!
    </br>
    </br>
    Boa notícia!
    </br>
    </br>
    Conseguimos localizar uma ${volunteerSupportTypeInfo.occupation.toLowerCase()} disponível próxima a você. <span style="font-weight: bold">Estamos te enviando os dados abaixo para que entre em contato em até 30 dias.</span> É muito importante atentar-se a esse prazo pois, após esse período, a sua vaga pode expirar. Não se preocupe, caso você não consiga, poderá retornar à fila de atendimento se cadastrando novamente pelo site.
    </br>
    </br>
    ${volunteerSupportTypeInfo.occupation}: ${volunteer.firstName.toString()}
    </br>
    </br>
    Telefone: ${volunteer.phone}
    </br>
    </br>
    ${
      volunteerSupportTypeInfo.registryType
    }: ${volunteer.registrationNumber.toString()}
    </br>
    </br>
    No momento de contato com a voluntária, por favor, identifique que você buscou ajuda via Mapa do Acolhimento. <span style="font-weight: bold">Ela possui um prazo de 48 horas para retorná-la.</span>
    </br>
    </br>
    <span style="font-weight: bold">Caso você e a profissional indicada estejam distantes e haja algum impeditivo para que o seu atendimento remoto aconteça de forma segura,</span> por favor nos escreva para te oferecermos mais informações sobre como buscar ajuda presencial na rede pública de atendimento.
    </br>
    </br>
    Todos os atendimentos do Mapa do Acolhimento devem ser gratuitos pelo tempo que durarem. <span style="font-weight: bold">Caso você seja cobrada, comunique imediatamente à nossa equipe.</span>
    </br>
    </br>
    Além disso, <span style="font-weight: bold">o nosso time está conduzindo uma pesquisa para entender melhor a efetividade dos atendimentos prestados pelas nossas voluntárias. Para isso, precisamos que as mulheres que buscam nossa ajuda, compartilhem suas experiências e perspectivas conosco. Pode nos ajudar?</span>
    </br>
    </br>
    <a href="${surveyLink}">Quero preencher o formulário!</a>
    </br>
    </br>
    <span style="font-weight: bold">Lembrando que o preenchimento desse formulário é totalmente opcional e não impactará no atendimento que você receberá.</span> Caso ele te cause qualquer desconforto, estamos aqui para te acolher. Nos escreva para <a href="mailto:atendimento@mapadoacolhimento.org">atendimento@mapadoacolhimento.org</a>.
    </br>
    </br>
    Agradecemos pela coragem, pela confiança e esperamos que seja bem acolhida! Pedimos que entre em contato para compartilhar a sua experiência de atendimento.
    </br>
    </br>
    Um abraço,
    </br>
    </br>
    ${agentName} do Mapa do Acolhimento 💜
    </p>
    `;
}

function publicServiceEmailTemplate(
  msrName: ZendeskUser["name"],
  agentName: string,
  surveyLink: string
) {
  return `
  <p>Olá, ${msrName}!
  </br>
  </br>
  Obrigada por aguardar!
  </br>
  </br>
  Infelizmente não encontramos uma voluntária disponível na sua localidade para que você receba o atendimento qualificado que precisa!
  </br>
  </br>
  Mas, para que não fique desamparada e ainda possa receber o atendimento necessário, <span style="font-weight:bold">orientamos que busque atendimento via rede de proteção às mulheres! É possível que você conheça todos os serviços públicos da rede de enfrentamento à violência contra as mulheres clicando neste link: <a href="https://bit.ly/GuiaServPublico">https://bit.ly/GuiaServPublico</a></span>. Caso queira encontrar o serviço disponível mais próximo da sua localização, além de receber informações sobre os principais canais de denúncia e protocolos de segurança, acesse aqui: <a href="https://bit.ly/mapa_servicos_publicos">https://bit.ly/mapa_servicos_publicos</a>.
  </br>
  </br>
  <span style="font-weight:bold">Também te indicamos a Cartilha #ComoMeProteger</span> que possui orientações sobre (1) como identificar a violência doméstica; (2) o que é o ciclo de violência; (3) o que é e como traçar um plano de segurança; (4) como se proteger e onde buscar ajuda; (5) como e onde obter acesso à justiça, abortamento legal e renda básica emergencial; além de (6) um detalhado passo-a-passo de segurança digital. Baixe aqui: <a href="https://bit.ly/CartilhaComoMeProteger">https://bit.ly/CartilhaComoMeProteger</a>.
  </br>
  </br>
  (!!) Lembrando que por uma questão de segurança, as informações desta cartilha não podem cair em mãos erradas, por isso, pedimos para que você faça o download e guarde-o em um local seguro!
  </br>
  </br>
  Além disso, <span style="font-weight: bold;">o nosso time está conduzindo uma pesquisa para entender melhor a efetividade do serviço que prestamos.</span> Para isso, <span style="font-weight:bold">precisamos que as mulheres que buscam nossa ajuda, compartilhem suas experiências e perspectivas conosco. Pode nos ajudar?</span>
  </br>
  </br>
  <a href="${surveyLink}">Quero preencher o formulário!</a>
  </br>
  </br>
  Lembrando que o preenchimento desse formulário é totalmente opcional. Caso ele te cause qualquer desconforto, estamos aqui para te acolher. Nos escreva para <a href="mailto:atendimento@mapadoacolhimento.org">atendimento@mapadoacolhimento.org</a>
  </br>
  </br>
  Estamos juntas!
  </br>
  </br>
  Um abraço,
  </br>
  </br>
  ${agentName} do Mapa do Acolhimento
  </p>
  `;
}
function socialWorkerEmailTemplate(
  msrName: ZendeskUser["name"],
  surveyLink: string
) {
  const socialWorkerCalendarLink = process.env["CAL_LINK"];

  return `
  <p>Olá, ${msrName}!</p>
  </br>
  </br>
  Esperamos que esteja bem, na medida do possível <3
  </br>
  </br>
  Estamos entrando em contato porque <span style="font-weight: bold;">infelizmente ainda não encontramos voluntárias disponíveis em seu município para seu atendimento</span>!
  </br>
  </br>
  Assim, para que possamos compreender melhor as suas necessidades e a situação de violência em que se encontra, a fim de te oferecer o suporte e encaminhamento qualificado que precisa, <span style="font-weight: bold;">te convidamos à conversar com uma assistente social de nossa equipe</span>!
  </br>
  </br>
  Vamos lá?!
  </br>
  </br>
  ➡️ <span style="font-weight: bold;">Como funciona?</span>
  Para que possa passar por uma <span style="font-weight: bold;">atendimento social remoto</span> com a assistente social indicada, você precisa acessar este <a href="${socialWorkerCalendarLink}">link</a> e selecionar o melhor dia e horário para seu atendimento!
  </br>
  </br>
  Ao selecionar, o agendamento será confirmado e você receberá uma notificação no seu e-mail <span style="font-weight: bold;">com o horário, dia e link do Google Meet para a realização do atendimento.</span>
  </br>
  </br>
  Com isso, basta aguardar o dia do encontro chegar e entrar na sala do Google Meet! Nossa assistente social estará te esperando lá!
  </br>
  </br>
  A profissional te fará algumas perguntas relacionadas à renda, escolaridade, situação de violência vivenciada, entre outras questões, para que <span style="font-weight: bold;">depois desse atendimento</span>, possamos te oferecer a orientação mais adequada ao seu caso.
  </br>
  </br>
  ➡️ <span style="font-weight: bold;">O que acontece depois do atendimento social?</span>
  Após análise técnica realizada pela assistente social, poderemos te oferecer <span style="font-weight: bold;">dois encaminhamentos</span>:
  Você poderá ser encaminhada para uma voluntária de outro Estado, para receber atendimento remoto;
  <span style="font-weight: bold;">E/ou</span> você poderá ser encaminhada para o serviço público de proteção às mulheres da sua região que possa atender, apropriadamente, a sua demanda.
  </br>
  </br>
  A assistente social te oferecerá todas as informações necessárias para que tenha a ajuda que precisa! Não se preocupe <3
  </br>
  </br>
  (!) Caso tenha alguma dúvida sobre esse processo ou não possa comparecer no atendimento agendado e precise remarcar, <span style="font-weight: bold;">basta entrar em contato conosco no e-mail:   <a href="mailto:atendimento@mapadoacolhimento.org">atendimento@mapadoacolhimento.org</a>.</span> Te retornaremos por lá com as orientações necessárias!
  </br>
  </br>
  Além disso, <span style="font-weight: bold;">o nosso time está conduzindo uma pesquisa para entender melhor a efetividade do serviço que prestamos.</span> Para isso, <span style="font-weight:bold">precisamos que as mulheres que buscam nossa ajuda, compartilhem suas experiências e perspectivas conosco. Pode nos ajudar?</span>
  </br>
  </br>
  <a href="${surveyLink}">Quero preencher o formulário!</a>
  </br>
  </br>
  Lembrando que o preenchimento desse formulário é totalmente opcional. Caso ele te cause qualquer desconforto, estamos aqui para te acolher. Nos escreva para <a href="mailto:atendimento@mapadoacolhimento.org">atendimento@mapadoacolhimento.org</a>
  </br>
  </br>
  Estamos juntas!
  </br>
  </br>
  Um abraço forte,
  Equipe do Mapa do Acolhimento 💜
  `;
}
