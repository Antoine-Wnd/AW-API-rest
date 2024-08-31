import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
  Unique,
  PrimaryKey,
  AutoIncrement,
  DataType
} from "sequelize-typescript";
import { IItem } from "./Item";
import { User } from "./User";
import { Folder } from './Folder'

/**
 * Path examples: /photos/souvenir.png, /documents/2024/js-lecture.pdf
 */
export interface IFile extends IItem {}

@Table
export class File extends Model implements IFile {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Unique
  @Column
  path!: string;

  @Column
  name!: string;

  @BelongsTo(() => User)
  owner!: User;

  @ForeignKey(() => User)
  @Column
  ownerId!: number;

  @BelongsTo(() => Folder)
  folder!: Folder;

  @ForeignKey(() => Folder)
  @Column
  folderId!: number;
}

export interface IFileRequest {
  folderId: number,
  name: string,
  id: number,
  ownerId: number
}