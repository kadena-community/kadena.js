import React, { FC } from 'react';
import { Stack, Heading, Text } from "@kadena/kode-ui";
import * as styles from './style.css';

interface CrudCardProps {
  title: string;
  description: string[];
  titleIcon?: React.JSX.Element;
  headingSize?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
}

const CrudCard: FC<CrudCardProps>  = ({ titleIcon, headingSize, title, description, children }) => {
  return (
    <Stack className={styles.card}>
      <div className={styles.titleContainer}>
        {titleIcon && titleIcon}
        <Heading as={headingSize || 'h4'}>{title}</Heading>
        <div>
          {description.map((desc, index) => (
            <Text as="p" key={index}>{desc}</Text>
          ))}
        </div>
      </div>
      <div className={styles.contentContainer}>
        {children}
      </div>
    </Stack>
  );
}

export default CrudCard;