export interface User {
  uid: string;
  name: string;
  email: string;
  enable: boolean;
  phone: string;
  document?: string;
}

export interface AuthUser {
  user: User;
  token: string;
}
