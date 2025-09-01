// only for PoC purposes
export const createDataJson = (dataType: 'house' | 'car' | 'painting') => {
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
      model: 'Camry',
      year: 2020,
      vin: '1HGBH41JXMN109186',
      owner: 'Cringer',
      make: 'Toyota',
      mileage: { value: 15000, unit: 'km' },
      color: 'Blue',
      drivetrain: 'Front-Wheel Drive',
      bodyStyle: 'Sedan',
      doors: 4,
      seatingCapacity: 5,
      fuelEconomy: {
        city: 28,
        highway: 39,
        combined: 32,
      },
      dimensions: {
        length: 192.1,
        width: 72.4,
        height: 56.9,
        wheelbase: 111.2,
      },
      weight: 3350,
      cargoCapacity: 15.1,
      warranty: {
        basic: {
          years: 3,
          miles: 36000,
        },
        powertrain: {
          years: 5,
          miles: 60000,
        },
      },
      features: {
        infotainment: {
          screenSize: 9.0,
          appleCarPlay: true,
          androidAuto: true,
          navigation: true,
        },
        safety: [
          'Adaptive Cruise Control',
          'Lane Departure Warning',
          'Automatic Emergency Braking',
          'Blind Spot Monitoring',
        ],
        comfort: [
          'Leather Seats',
          'Heated Front Seats',
          'Dual-Zone Climate Control',
          'Power Moonroof',
        ],
        exterior: ['LED Headlights', 'Alloy Wheels', 'Fog Lights'],
      },
      price: {
        msrp: 30500,
        currentValue: 28000,
      },
      engine: {
        type: 'Inline-4',
        displacement: 2.5,
        horsepower: 203,
        torque: 184,
        cylinders: 4,
      },
      transmission: {
        type: 'Automatic',
        gears: 8,
      },
      history: {
        accidentHistory: [
          { date: '2022-05-10', description: 'Rear-ended at a stoplight' },
        ],
        serviceRecords: [
          { date: '2021-06-15', service: 'Oil Change' },
          { date: '2022-06-20', service: 'Tire Rotation' },
        ],
        ownershipHistory: [
          { owner: 'He-man', from: '2018-03-01', to: '2020-01-14' },
          { owner: 'Skeletor', from: '2020-01-15', to: 'Present' },
        ],
      },
    };
  } else if (dataType === 'painting') {
    return {
      dimensions: {
        height: '73.7 cm',
        width: '92.1 cm',
      },
      title: 'Starry Night',
      provenance: [
        'Acquired by the Museum of Modern Art in 1941',
        'Previously owned by various private collectors',
      ],
      description:
        "The Starry Night is one of van Gogh's most famous works, depicting a swirling night sky over a quiet town.",
      style: 'Post-Impressionism',
      artist: 'Vincent van Gogh',
      medium: 'Oil on canvas',
      location: 'Museum of Modern Art, New York City',
      exhibitionHistory: [
        {
          exhibitionName: 'Van Gogh and the Colors of the Night',
          location: 'Art Institute of Chicago',
          year: 2005,
        },
        {
          exhibitionName: 'Masterpieces of Post-Impressionism',
          location: 'Louvre Museum, Paris',
          year: 2010,
        },
      ],
      condition: 'Excellent',
      ImageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
      yearCreated: 1889,
      literature: [
        'Van Gogh: The Life by Steven Naifeh and Gregory White Smith',
        'The Letters of Vincent van Gogh',
      ],
    };
  }
};
