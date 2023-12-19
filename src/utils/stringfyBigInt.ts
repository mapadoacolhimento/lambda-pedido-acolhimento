export function stringfyBigInt(obj: Record<string, unknown>) {
  return Object.keys(obj).reduce((previousValue, currentKey) => {
    let currentObjValue = obj[currentKey];

    if (typeof currentObjValue === "bigint") {
      currentObjValue = currentObjValue.toString();
    }

    return {
      ...previousValue,
      [currentKey]: currentObjValue,
    };
  }, {});
}
