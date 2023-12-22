import { AGENT_DICIO } from "../constants";

export default function getAgent(): number {
  const agentOptions = Object.keys(AGENT_DICIO);
  const randomNum = Math.floor(Math.random() * 100);
  const agentIndex = randomNum % 2;
  const agent = agentOptions[agentIndex];
  return Number(agent);
}
