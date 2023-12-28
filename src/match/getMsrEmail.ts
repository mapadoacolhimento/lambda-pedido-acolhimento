import type { Volunteers } from "@prisma/client";
import { AGENT_DICIO, VOLUNTEER_SUPPORT_TYPE_DICIO } from "../constants";
import type { SupportRequest, ZendeskUser } from "../types";

type Volunteer = Pick<
  Volunteers,
  "firstName" | "zendeskUserId" | "phone" | "registrationNumber"
>;

type MsrEmailParams = {
  volunteer: Volunteer;
  agent: number;
  msr: ZendeskUser & Pick<SupportRequest, "supportType">;
};

export default function getMsrEmail({ volunteer, agent, msr }: MsrEmailParams) {
  const volunteerSupportTypeInfo =
    VOLUNTEER_SUPPORT_TYPE_DICIO[msr.supportType];

  return `Olá, ${msr.name}!
  
  Boa notícia!
  
  Conseguimos localizar uma ${volunteerSupportTypeInfo.occupation.toLowerCase()} disponível próxima a você. Estamos te enviando os dados abaixo para que entre em contato em até 30 dias. É muito importante atentar-se a esse prazo pois, após esse período, a sua vaga pode expirar. Não se preocupe, caso você não consiga, poderá retornar à fila de atendimento se cadastrando novamente pelo site.
  
  ${volunteerSupportTypeInfo.occupation}: ${volunteer.firstName}
  
  Telefone: ${volunteer.phone}
  
  ${volunteerSupportTypeInfo.registryType}: ${volunteer.registrationNumber}
  
  Diante do contexto da pandemia do covid-19, sabemos que podem surgir algumas dificuldades para que receba o acolhimento necessário, especialmente à distância, que é a recomendação neste momento. Por isso, caso haja algum obstáculo que impossibilite que o seu atendimento aconteça de forma segura, por favor nos escreva e para te oferecermos mais informações sobre como buscar ajuda na rede pública de atendimento. Não se preocupe, você também poderá iniciar os atendimentos de modo presencial quando esse período tão difícil passar.
  
  Todos os atendimentos do Mapa devem ser gratuitos pelo tempo que durarem. Caso você seja cobrada, comunique imediatamente a nossa equipe. No momento de contato com a voluntária, por favor, identifique que você buscou ajuda via Mapa do Acolhimento.
  
  Agradecemos pela coragem, pela confiança e esperamos que seja bem acolhida! Pedimos que entre em contato para compartilhar a sua experiência de atendimento.
  
  Um abraço,
  
  ${AGENT_DICIO[agent]} do Mapa do Acolhimento`;
}
