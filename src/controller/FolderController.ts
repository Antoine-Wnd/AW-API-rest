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
} from "tsoa";
import { Folder, IFolderRequest } from "../model/Folder";
import { File } from "../model/File";
import { IItem } from "../model/Item";
import { IUser, User } from "../model/User";

function countSlashes(input: string): number {
  const slashCount = input.match(/\//g)?.length ?? 0;
  const extraSlashes = input.endsWith("/") ? 1 : 0;
  return slashCount - extraSlashes;
}

function filterChilren<T extends IItem>(items: T[], path: string): T[] {
  return items.filter(
    (item) =>
      item.path.startsWith(path) &&
      path !== item.path &&
      countSlashes(path) === countSlashes(item.path) - 1
  );
}

@Route("/api/folders")
@Security("jwt")
export class FolderController extends Controller {
  @Get("/{folderId}")
  public async getChildren(
    @Path() folderId: number,
    @Inject() currentUser: IUser
  ): Promise<IItem[]> {
    const findOptions = {
      include: [
        {
          model: User,
          attributes: ["email", "id"], // https://stackoverflow.com/a/38247617
        },
      ],
      attributes: ["id"],
      where: {
        "$owner.email$": currentUser.email,
        folderId: folderId
      },
    };
    // TODO: optimiser le filtrage côté BDD (actuellement on récupère tout le contenu du user puis on filtre dans le code)
    //const folders = await Folder.findAll(findOptions);
    const files = await File.findAll(findOptions);
    //const allContent = [...files];
    return files;
  }

  @Post("/")
  public async createFolder(
    @Body() request: IFolderRequest,
    @Inject() user: IUser
  ): Promise<void> {
    const currentUser = user as User;
    const id = request.id;
    //if (!path.startsWith("/") || path.length < 2 || path.endsWith("/")) {
    //  throw new Error("Incorrect path");
    //}
    // TODO: check with current user also
    //const count = await Folder.count({
    //  where: {
    //    Folder: id,
    //    ownerId: currentUser.id,
    //  },
    //});
    //if (count > 0) {
    //  throw new Error("Folder already exists");
    //}
    const folder = await Folder.create({ id: id, owner: currentUser });
    folder.$set("owner", currentUser);
  }
}