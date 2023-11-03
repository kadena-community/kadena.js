import { useEstimateGasLimitQuery } from '@/__generated__/sdk';
import { useRouter } from 'next/router';

const GasEstimation: React.FC = () => {
  const router = useRouter();

  const { loading, data, error } = useEstimateGasLimitQuery({
    variables: { transaction: }
  })

  return <div></div>;
};

export default GasEstimation;

