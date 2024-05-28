export function isDerivationPathTemplateValid(
  derivationPathTemplate: string,
): boolean {
  return (
    typeof derivationPathTemplate === 'string' &&
    derivationPathTemplate.includes('<index>')
  );
}
