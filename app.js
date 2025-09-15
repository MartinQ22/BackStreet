import express from "express";
import ProductManager from "./productManager.js";

const app = express();
app.use(express.json());

const productManager = new ProductManager("./data/products.json");

app.get("/", (req, res)=>{
    res.send("Hola a todos!")
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
       res.status(201).json({message: "Producto agregado", products})
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

// /api/Carritos


app.listen( 8080, ()=>{
    console.log("Server funcionando correctamente");
})

