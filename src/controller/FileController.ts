// src/users/usersController.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Path,
  Query,
  Route,
  Inject,
  Security,
  Delete,
  FormField,
  UploadedFile
} from "tsoa";
import { Folder, IFolderRequest } from "../model/Folder";

import { File, IFile, IFileRequest } from "../model/File";
import { IItem } from "../model/Item";
import { IUser, User } from "../model/User";

@Route("/api/files")
@Security("jwt")
export class FileController extends Controller {

  @Post("/{folderId}")
  public async createFile(
    @Path() folderId: number,
    @FormField() name: string,
    @Inject() user: IUser
  ): Promise<IFileRequest> {

    const currentUser = user as User;
    
    const file = await File.create({
      idFolder: folderId,
      name: name,
      user: currentUser
    });
    
        
    if (!file) {
      throw new Error("file not created");
    }

    return file;
  }


  @Delete("/{fileId}")
  public async deleteFile(
    @Path() fileId: number,
    @Inject() user: IUser
  ): Promise<void> {
    const currentUser = user as User;

    const file = await File.findOne({
      where: {
        id: fileId,
      },
    });
    
    if (!file) {
      throw new Error("file not found");
    }
 
    const folder = await file.destroy();
  }

  @Get("/{fileId}")
  public async downloadFile(
    @Path() fileId: number,
    @Inject() user: IUser
  ): Promise<IFileRequest> {
    const currentUser = user as User;

    const file = await File.findOne({
      where: {
        id: fileId,
      },
    });
    
    if (!file) {
      throw new Error("file not found");
    }
 
    return file;
  }


}