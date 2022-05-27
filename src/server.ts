import express from "express";
import cors from 'cors';
import { routes } from "./routes";
const app = express();

app.use(cors({ origin: '*' }))
app.use(express.json());
app.use('/api', routes);

app.listen(3000, () => console.log("\u{1F525} Server is running"));