import React from 'react';
import * as styles from './style.css';

export const ListingHeader: React.FC = () => {
  return (
    <div className={styles.listingHeader}>
      <img
        src={`/listingHeader.png`}
        alt="Header Image"
        className={styles.listingImage}          
      />  
    </div>
  );
};
