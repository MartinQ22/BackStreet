import express from "express";
import connectMongoDB from "./config/db.js"
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./productManager.js";
import CartManager from "./cartManager.js";
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

//Endpoints Handlers
app.use("/", viewsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);


////WebSocket (libreria Socket.io)
const io = new Server(server);
app.set("io", io);

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const cartManager = new CartManager("./data/carts.json");
const productManager = new ProductManager("./data/products.json");

//Persistencia de mensajes (chat Page)
const messages = [];

//Establecimiento de la conexion con el nuevo user
io.on("connection", (socket) => {
  console.log("New User Online");

  //emitir los mensajes al user nuevo 
  socket.emit("message history", messages);

  //event listener websocket (chat Page)
  socket.on("nuevo mensaje", (data) => {
    messages.push(data);
    io.emit("broadcast new message", data);
  });

  //agregar nuevo producto websocket (realTime Page)
  socket.on("newProduct", async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);

      io.emit("productAdded", newProduct);
    } catch (error) {
      console.log("Error al añadir producto");
    }
  });

  //eliminar producto websocket (realTime Page)
  socket.on("deleteProduct", async (productId) => {
    try {
      await productManager.deleteProductById(productId);
      
      io.emit("productDeleted", productId);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      socket.emit("deleteError", { message: "Error al eliminar producto" });
    }
  });
});

//iniciar server
server.listen(PORT, () => {
  console.log("Server funcionando correctamente");
});
