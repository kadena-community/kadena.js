// only for PoC purposes
export const createDataJson = (dataType: 'house' | 'car') => {
  if (dataType === 'house') {
    return {
      address: '123 Main St, Springfield, USA',
      owner: 'John Doe',
      value: 350000,
      size: '2000 sqft',
      bedrooms: 4,
      bathrooms: 3,
      yearBuilt: 1995,
      features: ['Garage', 'Swimming Pool', 'Garden'],
    };
  } else if (dataType === 'car') {
    return {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      vin: '1HGBH41JXMN109186',
      owner: 'Jane Smith',
      mileage: 15000,
      color: 'Blue',
      features: ['Bluetooth', 'Backup Camera', 'Cruise Control'],
    };
  }
};
