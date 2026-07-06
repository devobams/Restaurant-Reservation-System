
import app from "./app.js";
import { PORT } from "./src/config/app.config.js";

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});