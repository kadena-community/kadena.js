import { createQR as createQRService } from '@/services/qr';
import { useEffect, useState } from 'react';
import { useToasts } from './toast';

export const useQR = (id?: string) => {
  const [QR, setQR] = useState<string>();
  const { addToast } = useToasts();

  const createQR = async (data: string): Promise<void> => {
    try {
      //@TODO URL
      const result = await createQRService(
        `http://localhost:3000/event/${data}/scan`,
      );
      setQR(result);
    } catch (e) {
      addToast(e.message);
    }
  };

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      createQR(id);
    }
  }, []);

  return { createQR, QR };
};
