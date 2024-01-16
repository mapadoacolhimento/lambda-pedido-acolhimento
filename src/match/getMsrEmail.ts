import crypto from "crypto";
import type { Volunteers } from "@prisma/client";
import { AGENT_DICIO, VOLUNTEER_SUPPORT_TYPE_DICIO } from "../constants";
import type { SupportRequest, ZendeskUser } from "../types";

type Volunteer = Pick<Volunteers, "firstName" | "phone" | "registrationNumber">;

type MsrEmailParams = {
  volunteer: Volunteer;
  agent: number;
  msr: Partial<Omit<ZendeskUser, "id">> & Pick<SupportRequest, "supportType">;
};

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

export default function getMsrEmail({ volunteer, agent, msr }: MsrEmailParams) {
  const volunteerSupportTypeInfo =
    VOLUNTEER_SUPPORT_TYPE_DICIO[msr.supportType];

  const encryptedEmail = encrypt(msr.email!);
  const surveyLink = process.env["SURVEY_LINK"];

  const msrSurveyLink = `${surveyLink}?user_id=${encryptedEmail}`;

  return `
    <p>Olá ${msr.name}!
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
    <a href="${msrSurveyLink}">Quero preencher o formulário!</a>
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
    ${AGENT_DICIO[agent]} do Mapa do Acolhimento 💜
    </p>
    `;
}
