export default function isJsonString(str: string | null) {
  try {
    if (str) {
      JSON.parse(str);
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
}
