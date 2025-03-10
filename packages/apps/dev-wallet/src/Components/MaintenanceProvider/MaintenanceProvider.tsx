import { Maintenance } from '@/pages/maintenance/maintenance';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

const context = createContext<(elm: JSX.Element | null) => void>(() => {
  throw new Error('MaintenanceContext not found');
});

export const useMaintenance = () => {
  const contextProps = useContext(context);
  return contextProps;
};

export const MaintenanceProvider: FC<PropsWithChildren> = ({ children }) => {
  const isInMaintenance = useState(false);

  const refreshMaintenanceMode = () => {
    window.location.reload();
  };

  return (
    <context.Provider value={{ refreshMaintenanceMode, isInMaintenance }}>
      {isInMaintenance ? <Maintenance /> : children}
    </context.Provider>
  );
};
