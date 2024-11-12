interface TransactionModalProps {
  estimatedGas: number | null;
  transactionJSON: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  estimatedGas,
  transactionJSON,
  onClose,
  onConfirm,
}) => {
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
          Confirm Transaction
        </h2>
        <p className="text-white mb-4 text-center">
          Estimated Gas Cost: {estimatedGas ?? 'Calculating...'}
        </p>
        <textarea
          className="w-full h-40 p-2 mb-4 bg-gray-800 text-white rounded-md"
          readOnly
          value={transactionJSON}
        ></textarea>
        <div className="flex justify-around mt-6">
          <button
            onClick={onConfirm}
            className="bg-primary-green text-white font-semibold rounded-md py-2 px-4 hover:bg-secondary-green transition"
          >
            Confirm
          </button>
          <button onClick={onClose} className="text-white underline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
