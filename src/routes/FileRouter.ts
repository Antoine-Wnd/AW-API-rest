import { randomInt } from "crypto";
import express from "express";
import multer from "multer";
import fs from "fs/promises";
import { FileController } from "../controller/FileController";

const upload = multer({ dest: "uploads/" });
export const fileRouter = express.Router();

fileRouter.post("/:folderId", upload.single("datafile"), async (req, res) => {
  const { folderId } = req.params;
  const user = req.user;
  const fileReq = req.file;
  const file = req.body;

  if (!file || !user) {
    res.sendStatus(400);
    return;
  }

  console.log(fileReq);
  console.log(file);
  
  const fileController = new FileController();
  
  try {
    const file = await fileController.createFile(
      parseInt(folderId),
      req.body.name,
      user
    );
    res.json(file);

  } catch (e) {
    res.sendStatus(401);
  }


  const userId = user.id; 
  const fileId =file.id; 
  const fileName = file.name;

  await fs.rename(
    file.path,
    `uploads/${userId}-${fileId}-${file.name}`
  );
});

fileRouter.delete("/:fileId", async (req, res) => {
  const { fileId } = req.params;
  const fileController = new FileController();
  const user = req.user;
  if (!user) {
    res.sendStatus(401);
    return;
  }
  try {
    await fileController.deleteFile(parseInt(fileId), user);
    res.end();
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).json({
        message: e.message,
      });
    } else {
      res.sendStatus(400);
    }
  }
});


fileRouter.get("/:fileId", async (req, res) => {
  const { fileId } = req.params;
  const fileController = new FileController();
  const user = req.user;
  if (!user) {
    res.sendStatus(401);
    return;
  }
  try {
    const file = await fileController.downloadFile(parseInt(fileId), user);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).json({
        message: e.message,
      });
    } else {
      res.sendStatus(400);
    }
  }

  const directoryPath = 'uploads/';
  const fileName = `${userId}-${fileId}-${file.name}`
   res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
  
});