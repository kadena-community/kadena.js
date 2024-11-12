import { ChainId } from '@kadena/client';
import { useChains } from '../hooks/chains';
import { useWalletState } from '../state/wallet';

interface ChainSelectionModalProps {
  onSelect: (chainId: ChainId) => void;
  onClose: () => void;
  currentChain: ChainId;
  submit: () => void;
}

export const ChainSelectionModal: React.FC<ChainSelectionModalProps> = ({
  onSelect,
  onClose,
  currentChain,
  submit,
}) => {
  const wallet = useWalletState();
  const { chains } = useChains(wallet.selectedNetwork);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className="p-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
        style={{
          backgroundColor: '#1B2330',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Select Chain
        </h2>
        <select
          value={currentChain}
          onChange={(e) => onSelect(e.target.value as ChainId)}
          className="w-full p-2 mb-4 text-white bg-dark-slate rounded-md"
        >
          {chains.map((chain) => (
            <option key={chain} value={chain}>
              Chain {chain}
            </option>
          ))}
        </select>
        <button
          onClick={submit}
          className="w-full bg-primary-green text-white font-semibold py-2 px-4 rounded-md hover:bg-secondary-green transition mb-2"
        >
          Confirm
        </button>
        <button onClick={onClose} className="w-full text-white underline">
          Cancel
        </button>
      </div>
    </div>
  );
};
