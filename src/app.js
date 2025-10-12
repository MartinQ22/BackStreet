import express from "express";
import { engine } from "express-handlebars";
import ProductManager from "../productManager.js";
import CartManager from "../cartManager.js";

const app = express();
app.use(express.json());

//HandleBars Config
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

const cartManager = new CartManager("./data/carts.json");
const productManager = new ProductManager("./data/products.json");

// Load all products from JSON file
const allProducts = JSON.parse(readFileSync("./data/products.json", "utf8"));

//Endpoints Handlers

app.get("/", (req,res)=>{
    res.render("home")
})

app.get("/dashboard", (req,res)=>{
    res.render("dashboard", { products })
})

// /api/products

// Metodo GET para obtener los productos
app.get("/api/products", async(req, res)=>{
    try {
        const products = await productManager.getProducts();
        res.status(200).json({message: "Lista de productos", products});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Metodo GET POR ID para obtener un producto
app.get("/api/products/:pid", async(req, res)=>{
    try {
        const pid = req.params.pid; 
        const product = await productManager.getProductById(pid);
        res.status(200).json({message: "Producto encontrado", product});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Metodo DELETE para borrar los productos
app.delete("/api/products/:pid", async(req, res)=>{
    try {
        const pid = req.params.pid;
        const products = await productManager.deleteProductById(pid);
        res.status(200).json({message: "Producto borrado", products});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
// Metodo POST para subir los productos
app.post("/api/products", async(req, res)=>{
    try {
       const newProduct = req.body;
       const product = await productManager.addProduct(newProduct)
       res.status(201).json({message: "Producto agregado", product})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// Metodo PUT para editar los productos
app.put("/api/products/:pid", async(req, res)=>{
    try {
       const pid = req.params.pid;
       const updates = req.body;

       const products = await productManager.setProductById(pid, updates);
       res.status(200).json({message: "Cambios del producto aplicados", products})
    } catch (error) {
       res.status(500).json({message: error.message}); 
    }
})

//-------------------------- /api/Carritos ------------------------------

//! metodo POST de crear carritos vacios
app.post("/api/carts", async(req, res)=>{
    try {
        const newCart = req.body;
        const carts = await cartManager.addCart(newCart)
        res.status(201).json({message: "Nuevo Carrito Creado", carts});
    } catch (error) {
       res.status(500).json({message: error.message}); 
    }
})
//! metodo traer productos del carrito UNFIN
app.get("/api/carts/:cid", async(req, res)=>{
    try {
        const cid = req.params.cid; 
        const products = await cartManager.getProductInCartById(cid);
        res.status(200).json({message: "Productos Encontrado", products});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//! metodo POST de agregar el producto al carrito cant
app.post("/api/carts/:cid/products/:pid", async(req, res)=>{
    try {
        const cid = req.params.cid;
        const pid = parseInt(req.params.pid);
        const quantity = req.body.quantity;

        const carts = await cartManager.addProductInCart(cid, pid, quantity);
        res.status(200).json({message: "Producto Añadido", carts});
    } catch (error) {
       res.status(500).json({message: error.message}); 
    }
})


app.listen( 8080, ()=>{
    console.log("Server funcionando correctamente");
})


