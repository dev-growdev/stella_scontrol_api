import { ERoleType } from '../enums';

export interface User {
  uid: string;
  name: string;
  email: string;
  enable: boolean;
  role: ERoleType;
  phone: string;
  document?: string;
}
