import { sequelize } from "../src/services/database";

describe("Testing the database", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });
  test("Can conncet to database", async () => {
    await sequelize.authenticate();
  });
});