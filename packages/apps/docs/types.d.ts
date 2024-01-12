declare module '*.yaml' {
  const data: {
    menu: string[];
    pages: Record<
      string,
      {
        title: string;
        url: string;
      }
    >;
  };
  export default data;
}
