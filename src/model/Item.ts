import { IUser } from "./User";

export interface IItem {
  id: number,
  path: string;
  owner: IUser;
}