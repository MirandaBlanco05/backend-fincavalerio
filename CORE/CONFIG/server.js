import express from "express";
import routes from "../../routes.js";

export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use("/api", routes);

  return app;
};
