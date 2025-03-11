import { Notification, NotificationHeading } from '@kadena/kode-ui';
import '@kadena/kode-ui/global';
import { darkThemeClass } from '@kadena/kode-ui/styles';
import { walletSdk } from '@kadena/wallet-sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import './global.css.ts';

import { useRoutes } from 'react-router-dom';
import routes from './routes';
import { useWalletState } from './state/wallet.ts';

const queryClient = new QueryClient();

interface ILogObject {
  level: number;
  message: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

interface ILogNotification extends ILogObject {
  id: number;
}

const logLevelMap: Record<
  number,
  { intent: 'info' | 'warning' | 'negative'; heading: string }
> = {
  0: { intent: 'info', heading: 'Debug' },
  1: { intent: 'info', heading: 'Information' },
  2: { intent: 'warning', heading: 'Warning' },
  3: { intent: 'negative', heading: 'Error' },
};

function App() {
  useWalletState('password');
  const routing = useRoutes(routes);
  const [notifications, setNotifications] = useState<ILogNotification[]>([]);
  const notificationIdCounter = useRef(0);

  useEffect(() => {
    const transport = (log: ILogObject) => {
      console.log(log);
      const id = notificationIdCounter.current++;
      const notification: ILogNotification = { ...log, id };

      setNotifications((prev) => [...prev, notification]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    };

    walletSdk.logger.setTransport(transport);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      enableSystem={true}
      defaultTheme="dark"
      value={{
        light: 'light',
        dark: darkThemeClass,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <>
          <Header />
          {routing}

          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '20px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            {notifications.map((notification) => {
              const { intent, heading } = logLevelMap[notification.level] || {
                intent: 'info',
                heading: 'Log',
              };

              return (
                <div key={notification.id} style={{ marginBottom: '10px' }}>
                  <Notification
                    isDismissable
                    onDismiss={() =>
                      setNotifications((prev) =>
                        prev.filter((n) => n.id !== notification.id),
                      )
                    }
                    intent={intent}
                    role="status"
                  >
                    <NotificationHeading>{heading}</NotificationHeading>
                    {notification.message}
                    {notification.data && (
                      <pre style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(notification.data, null, 2)}
                      </pre>
                    )}
                  </Notification>
                </div>
              );
            })}
          </div>
        </>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
