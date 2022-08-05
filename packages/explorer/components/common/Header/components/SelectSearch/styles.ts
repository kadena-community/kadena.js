/* eslint-disable @typescript-eslint/no-shadow */
import { useMemo } from 'react';
import { StylesConfig } from 'react-select';

export const useStyles = (width: number) => {
  const styles = useMemo<StylesConfig>(() => {
    return {
      control: styles => ({
        ...styles,
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        height: width > 1024 ? '48px' : '36px',
        minHeight: '36px',
        cursor: 'pointer',
        '&:hover': {
          border: 'none',
        },
      }),
      singleValue: styles => ({
        ...styles,
        color: '#975E9A',
        fontWeight: 400,
        fontSize: width > 1024 ? '15px' : '13px',
      }),
      indicatorSeparator: styles => ({
        ...styles,
        display: 'none',
      }),
      menu: styles => ({
        ...styles,
        width: '160px',
        background: 'rgb(68 41 91)',
        color: '#975E9A',
        fontSize: width > 1024 ? '15px' : '13px',
      }),
      valueContainer: styles => ({
        ...styles,
        ...(width <= 1024 && { padding: '0px' }),
        paddingLeft: width > 1024 ? '24px' : '16px',
      }),
      group: styles => ({
        ...styles,
        padding: 0,
        '#react-select-search-group-1-heading': {
          margin: 0,
          paddingLeft: width > 1024 ? '16px' : '12px',
        },
      }),
      option: (styles, { isFocused, isSelected }) => ({
        ...styles,
        lineHeight: '100%',
        paddingLeft: width > 1024 ? '24px' : '16px',
        backgroundColor: isSelected
          ? 'rgb(151 94 154 / 20%)'
          : isFocused
          ? 'rgb(151 94 154 / 10%)'
          : 'transparents',
        ':active': {
          ...styles[':active'],
          backgroundColor: 'rgb(151 94 154 / 20%)',
        },
      }),
    };
  }, [width]);

  return styles;
};
