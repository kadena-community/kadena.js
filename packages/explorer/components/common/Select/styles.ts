/* eslint-disable @typescript-eslint/no-shadow */
import { useMemo } from 'react';
import { StylesConfig } from 'react-select';

export const useStyles = (customStyle?: {
  placeholder?: Record<string, string | number>;
  singleValue?: Record<string, string | number>;
  menu?: Record<string, string | number>;
}) => {
  const styles = useMemo<StylesConfig>(() => {
    return {
      container: styles => ({
        ...styles,
        height: '100%',
        minWidth: '140px',
      }),
      control: styles => ({
        ...styles,
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        height: '100%',
        cursor: 'pointer',
        '&:hover': {
          border: 'none',
        },
      }),
      singleValue: styles => ({
        ...styles,
        color: '#975E9A',
        fontWeight: 400,
        ...customStyle?.singleValue,
      }),
      indicatorSeparator: styles => ({
        ...styles,
        display: 'none',
      }),
      placeholder: styles => ({
        ...styles,
        ...customStyle?.placeholder,
      }),
      valueContainer: styles => ({
        ...styles,
        paddingLeft: '22px',
        paddingRight: '22px',
      }),
      menu: styles => ({
        ...styles,
        background: 'rgb(75 42 77)',
        color: '#975E9A',
        fontSize: '15px',
        ...customStyle?.menu,
      }),
      group: styles => ({
        ...styles,
        padding: 0,
        '#react-select-search-group-1-heading': {
          margin: 0,
        },
      }),
      option: (styles, { isFocused, isSelected }) => ({
        ...styles,
        lineHeight: '100%',
        padding: '8px 24px',
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
  }, []);

  return styles;
};
