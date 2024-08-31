import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

export interface IUser {
  email: string;
  id: number;
}

@Table
export class User extends Model implements IUser {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  /**
  * @example "sam@mail.com"
  */
  @Unique
  @Column
  email!: string;

  @Column
  password!: string;
}

export interface IAuthRequestBody {
   /**
  * @example "sam@mail.com"
  */
  email: string;
  password: string;
}

export interface IAuthResponseBody {
  token: string;
}