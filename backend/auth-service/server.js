import app from "./src/app.js";
const PORT = process.env.PORT || 3000;
import connectDB from "./src/config/db.js";




connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
