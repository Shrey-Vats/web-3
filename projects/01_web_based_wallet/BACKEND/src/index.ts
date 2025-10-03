import e from "express";

import dotenv from "dotenv";
import cors from "cors";
import { seedGenrator } from "./controllers/seedGenrator.js";

dotenv.config();
const app = e();
console.log(app)
app.use(e.json());
app.use(cors());

app.post("/", seedGenrator);


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});