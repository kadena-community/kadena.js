import { recipe } from './../../../styles';

export const toggleButtonClass = recipe({
  base: {
    padding: 10,
    fontSize: 16,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    border: 'none',
  },

  variants: {
    isPressed: {
      true: {},
      false: {},
    },
    isSelected: {
      true: {
        color: 'white',
      },
      false: {
        color: 'black',
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        isPressed: true,
        isSelected: true,
      },
      style: {
        backgroundColor: 'darkgreen',
      },
    },
    {
      variants: {
        isPressed: true,
        isSelected: false,
      },
      style: {
        backgroundColor: 'gray',
      },
    },
    {
      variants: {
        isPressed: false,
        isSelected: true,
      },
      style: {
        backgroundColor: 'green',
      },
    },
    {
      variants: {
        isPressed: false,
        isSelected: false,
      },
      style: {
        backgroundColor: 'lightgray',
      },
    },
  ],
});
