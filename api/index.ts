import { AppDataSource } from "./appDataSource";
import { server } from "./server";

AppDataSource.initialize()
  .then(() => {
    server.listen(process.env.PORT, async () => {
      console.log(`Listening in port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
