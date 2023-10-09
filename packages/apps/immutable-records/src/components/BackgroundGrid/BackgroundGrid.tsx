import { container } from './BackgroundGrid.css';

export const BackgroundGrid = () => {
  return (
    <div className={container}>
      {Array.from({ length: 800 }, (_, i) => i).map((i) => (
        <div key={i}>+</div>
      ))}
    </div>
  );
};
