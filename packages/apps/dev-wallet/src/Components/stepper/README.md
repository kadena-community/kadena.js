```tsx
  const steps = [
    {
      id: 'someId1',
      route: '/',
      title: 'this is a main step',
      elements: <CuscomComponent1 />,
    },
    {
      id: 'someId2',
      route: 'route2',
      elements: <CuscomComponent2 />,
    },
    {
      id: 'someId3',
      route: 'route3',
      elements: <CuscomComponent3 />,
    },
  ];

  ....

   // i want to skip step1 for some reason
   <Stepper steps={steps} initialPath='route2'/>
```
