import { useAccount } from '@/hooks/account';
import { Badge, Button } from '@kadena/kode-ui';
import SpireKeyKdacolorLogoWhite from '../SpireKeyKdacolorLogoWhite';

export const ConnectButton = () => {
  const { login } = useAccount();

  return (
    <Button
      onClick={login}
      variant="primary"
      isCompact={false}
      startVisual={<SpireKeyKdacolorLogoWhite style={{ color: 'black' }} />}
      endVisual={
        <Badge style={'inverse'} size="sm">
          Wallet
        </Badge>
      }
    >
      Connect
    </Button>
  );
};
