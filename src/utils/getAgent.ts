export default function getAgent() {
  const agentOptions = [377511446392, 377577169651];
  const randomNum = Math.floor(Math.random() * 100);
  const agentIndex = randomNum % 2;
  return agentOptions[agentIndex];
}
