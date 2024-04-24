export default function getFirstName(name: string) {
  const firstName = name.split(" ")[0] || "";
  const parseNameToLowercase = firstName.toLowerCase();
  return (
    parseNameToLowercase.charAt(0).toUpperCase() + parseNameToLowercase.slice(1)
  );
}
