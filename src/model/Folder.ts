import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
  Unique,
  AutoIncrement,
  PrimaryKey,
  DataType
} from "sequelize-typescript";
import { IItem } from "./Item";
import { User } from "./User";

/**
 * path example: /photos, /documents/2024
 */
export interface IFolder extends IItem {}

@Table
export class Folder extends Model implements IFolder {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column
  path!: string;

  @BelongsTo(() => User)
  owner!: User;

  @ForeignKey(() => User)
  @Column
  ownerId!: number;
}

export interface IFolderRequest {
  id: number;
}