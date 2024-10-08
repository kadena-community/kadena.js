import { Box, Stack } from '@kadena/kode-ui';
import { QRCode as ORiginalQRCode } from 'react-qrcode-logo';

export function QRCode(options: typeof ORiginalQRCode.defaultProps) {
  const { size = 100 } = options;
  const move = (size - 500) / 2;
  return (
    <Box
      style={{
        position: 'relative',
        minWidth: `${size}px`,
        minHeight: `${size * 1.1}px`,
      }}
    >
      <Stack
        style={{
          transform: `${move ? `translate(${move}px, ${move}px) scale(${size / 500})` : ''}`,
          minWidth: '500px',
          minHeight: '500px',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <ORiginalQRCode {...options} size={500} />
      </Stack>
    </Box>
  );
}
