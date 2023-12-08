export default function normalizeCity(city: string): string {
  if (city === "not_found") return "not_found";

  return city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace("'", " ")
    .replace(/ *\([^)]*\) */g, "")
    .toUpperCase();
}
