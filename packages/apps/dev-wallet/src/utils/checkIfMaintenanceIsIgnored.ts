export const checkIfMaintenanceIsIgnored = (
  startDate: number,
  endDate: number,
) => {
  const date = Date.now();
  //check if we are still in maintenance mode.
  //if not, remove the ignoreMaintenance flag from localstorage
  if (
    (startDate && date < startDate) ||
    (endDate && date > endDate) ||
    (!startDate && !endDate)
  ) {
    window.localStorage.removeItem('ignoreMaintenance');
    return false;
  }

  const isIgnored = window.localStorage.getItem('ignoreMaintenance');
  if (isIgnored) return true;

  const urlParams = new URLSearchParams(window.location.search);
  const ignoreMaintenance = urlParams.get('ignoreMaintenance');

  if (ignoreMaintenance) {
    window.localStorage.setItem('ignoreMaintenance', 'true');
    return true;
  }

  return false;
};
