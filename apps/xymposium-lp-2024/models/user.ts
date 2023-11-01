export interface IUser {
  email: string;
  lastName: string;
  firstName: string;
  phone: string;
}

export interface ISignUpUser extends IUser {
  password: string;
}
