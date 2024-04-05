export function getTimestamp() {
  const now = new Date(Date.now());

  const options = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return now.toLocaleString("en-US", options);
}

export function extractDogEntries(fetchResponse) {
  return Array.isArray(fetchResponse?.data?.dogCollection?.items)
    ? fetchResponse?.data?.dogCollection?.items
    : [];
}

export function extractDogEntry(fetchResponse) {
  return Array.isArray(fetchResponse?.data?.dogCollection?.items)
    ? fetchResponse?.data?.dogCollection?.items[0]
    : null;
}

export function extractProductEntries(fetchResponse) {
  return Array.isArray(fetchResponse?.data?.productCollection?.items)
    ? fetchResponse?.data?.productCollection?.items
    : [];
}

export function extractProductEntry(fetchResponse) {
  return Array.isArray(fetchResponse?.data?.productCollection?.items)
    ? fetchResponse?.data?.productCollection?.items[0]
    : null;
}
