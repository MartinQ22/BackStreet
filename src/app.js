import express from "express";
import connectMongoDB from "./config/db.js"
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import dotenv from "dotenv";
import http from "http";

//inciializar tareas de entorno
dotenv.config()

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);

connectMongoDB();

//HandleBars Config
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware 
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//Endpoints Handlers
app.use("/", viewsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);

//iniciar server
server.listen(PORT, () => {
  console.log("Server funcionando correctamente");
});
