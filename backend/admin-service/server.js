import app from "./src/app.js";
import { config } from "./src/config/config.js";
import client from "./src/config/redis.db.js";

const PORT = config.port || 3003;



client;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
