interface Window {
  chrome?: {
    extension?: {
      getBackgroundPage?: () => Window;
    };
    runtime?: {
      onMessage?: {
        addListener?: (listener: (message: string) => void) => void;
      };
    };
  };
}
