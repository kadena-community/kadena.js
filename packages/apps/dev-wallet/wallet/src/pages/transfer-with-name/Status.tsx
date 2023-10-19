export const Status = ({ children }: { children?: string }) => {
  const colors: Record<string, string> = {
    success: "#1fff1f",
    failure: "#ff6c6c",
    default: "#feffe3",
  };
  return (
    <span style={{ color: colors[children || "default"] ?? colors.default }}>
      {children}
    </span>
  );
};
