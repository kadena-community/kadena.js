export const formatJson = (json: string) => {
  try {
    if (json.length > 0) {
      return JSON.stringify(JSON.parse(json), null, 2);
    }
  } catch (e) {
    console.warn('Failed to parse JSON. Returning original string.', json);
    return json;
  } finally {
    return json;
  }
};
