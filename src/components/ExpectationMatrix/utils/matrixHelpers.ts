export function buildChangedPayload(original: any, form: any) {
  const payload: Record<string, any> = {};

  Object.keys(form).forEach((key) => {
    if (form[key] !== original[key]) {
      payload[key] = form[key];
    }
  });

  return payload;
}

export function getInitials(name?: string) {
  return (name || "?")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}