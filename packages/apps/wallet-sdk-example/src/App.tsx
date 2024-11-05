import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Wallet } from './components/Wallet';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Wallet />
    </QueryClientProvider>
  );
}

export default App;
