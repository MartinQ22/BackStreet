import express from "express";
import connectMongoDB from "./config/db.js"
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./productManager.js";
import CartManager from "./cartManager.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import dotenv from "dotenv";
import http from "http";

//inciializar tareas de entorno
dotenv.config()

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);

connectMongoDB();

//Socket.io
const io = new Server(server);
app.set("io", io);

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const cartManager = new CartManager("./data/carts.json");
const productManager = new ProductManager("./data/products.json");

//Persistencia de mensajes
const messages = [];

//WebSocket
io.on("connection", (socket) => {
  console.log("New User Online");

  //emitir los mensajes al user nuevo
  socket.emit("message history", messages);

  //event listener
  socket.on("nuevo mensaje", (data) => {
    messages.push(data);
    io.emit("broadcast new message", data);
  });

  //agregar nuevo productohy
  socket.on("newProduct", async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);

      io.emit("productAdded", newProduct);
    } catch (error) {
      console.log("Error al añadir producto");
    }
  });

  //eliminar producto
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

//HandleBars Config
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//endpoints Handlers
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);

// Metodo GET POR ID para obtener un producto
app.get("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);
    res.status(200).json({ message: "Producto encontrado", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Metodo DELETE para borrar los productos
app.delete("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const products = await productManager.deleteProductById(pid);

    // broadcast updated list to all clients
    const io = req.app.get("io");
    if (io) {
      io.emit("products:update", products);
    }

    res.status(200).json({ message: "Producto borrado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Metodo POST para subir los productos
// POST /api/products is handled in routes/products.router.js

// Metodo PUT para editar los productos
app.put("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;

    const products = await productManager.setProductById(pid, updates);
    res
      .status(200)
      .json({ message: "Cambios del producto aplicados", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//-------------------------- /api/Carritos ------------------------------

//! metodo POST de crear carritos vacios
app.post("/api/carts", async (req, res) => {
  try {
    const newCart = req.body;
    const carts = await cartManager.addCart(newCart);
    res.status(201).json({ message: "Nuevo Carrito Creado", carts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//! metodo traer productos del carrito UNFIN
app.get("/api/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = await cartManager.getProductInCartById(cid);
    res.status(200).json({ message: "Productos Encontrado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//! metodo POST de agregar el producto al carrito cant
app.post("/api/carts/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = parseInt(req.params.pid);
    const quantity = req.body.quantity;

    const carts = await cartManager.addProductInCart(cid, pid, quantity);
    res.status(200).json({ message: "Producto Añadido", carts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//iniciar server
server.listen(PORT, () => {
  console.log("Server funcionando correctamente");
});
