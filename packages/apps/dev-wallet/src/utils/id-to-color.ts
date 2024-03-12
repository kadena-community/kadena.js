export function idToColor(id: string) {
  let hash = 0;
  // Process every other character to reduce iterations
  for (let i = 0; i < id.length; i += 2) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }

  return color;
}
