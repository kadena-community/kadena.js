import { Maintenance } from '@/pages/maintenance/maintenance';
import { checkIfMaintenanceIsIgnored } from '@/utils/checkIfMaintenanceIsIgnored';
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
    const ignoreMaintenance = checkIfMaintenanceIsIgnored(
      env.MAINTENANCE_STARTDATE,
      env.MAINTENANCE_ENDDATE,
    );

    const date = Date.now();
    setIsInMaintenance(false);

    if (
      (!env.MAINTENANCE_STARTDATE && !env.MAINTENANCE_ENDDATE) ||
      ignoreMaintenance
    )
      return;
    if (
      (!env.MAINTENANCE_ENDDATE && date > env.MAINTENANCE_STARTDATE) ||
      (date > env.MAINTENANCE_STARTDATE && date < env.MAINTENANCE_ENDDATE)
    ) {
      setIsInMaintenance(true);
    }
  }, [env.MAINTENANCE_ENDDATE, env.MAINTENANCE_STARTDATE]);

  return (
    <context.Provider value={{ refreshMaintenanceMode, isInMaintenance }}>
      {isInMaintenance ? <Maintenance /> : children}
    </context.Provider>
  );
};
