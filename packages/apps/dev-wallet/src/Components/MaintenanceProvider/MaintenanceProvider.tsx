import { Maintenance } from '@/pages/maintenance/maintenance';
import { env } from '@/utils/env';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

const context = createContext<{
  isInMaintenance: boolean;
  refreshMaintenanceMode: () => void;
}>({
  isInMaintenance: false,
  refreshMaintenanceMode: () => {},
});

export const useMaintenance = () => {
  const contextProps = useContext(context);
  return contextProps;
};

export const MaintenanceProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isInMaintenance, setIsInMaintenance] = useState(false);

  const refreshMaintenanceMode = () => {
    window.location.reload();
  };

  useEffect(() => {
    const date = Date.now();

    // there should be at least an enddate if you want to maintenance message to show
    setIsInMaintenance(false);
    if (!env.MAINTENANCE_STARTDATE && !env.MAINTENANCE_ENDDATE) return;
    if (date > env.MAINTENANCE_STARTDATE && date < env.MAINTENANCE_ENDDATE) {
      setIsInMaintenance(true);
    }
  }, [env.MAINTENANCE_ENDDATE, env.MAINTENANCE_STARTDATE]);

  return (
    <context.Provider value={{ refreshMaintenanceMode, isInMaintenance }}>
      {isInMaintenance ? <Maintenance /> : children}
    </context.Provider>
  );
};
