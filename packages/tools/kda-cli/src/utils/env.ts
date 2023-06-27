import * as _dotenv from 'dotenv';

_dotenv.config();

export const dotenv: {
  HOME: string;
} = {
  HOME: or(process.env.HOME, ''),
};

function or<T>(value: T | undefined, otherwise: T): T {
  return value === undefined ? otherwise : value;
}
