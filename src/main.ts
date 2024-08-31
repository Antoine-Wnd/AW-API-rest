import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./services/database";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { folderRouter } from "./routes/FolderRouter";
import { userRouter } from "./routes/UserRouter";
import passport from "passport";
import "./services/authentication";
import { fileRouter } from "./routes/FileRouter";

export const app = express();

// init and configure passport
app.use(passport.initialize());

// logs des requêtes
app.use(morgan("tiny"));
app.use(bodyParser.json());
// Permet d'exposer le fichier openapi à swagger
app.use("/static", express.static("public"));
app.use(
  "/api/docs/",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/static/swagger.json",
    },
  })
);

app.use("/api/users", userRouter);
app.use(
  "/api/folders",
  passport.authenticate("jwt", { session: false }),
  folderRouter
);
app.use("/api/files", fileRouter);

const PORT = 3000;

export const server = app.listen(PORT, async () => {
  // TODO: do only in development and test modes
  await sequelize.sync();
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});