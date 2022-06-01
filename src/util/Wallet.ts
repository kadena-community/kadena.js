import * from 'util';

export interface SigningCap extends Cap {
  role: string;
  description: string;
  cap: {
    name: string;
    args: string[];
  };
}
