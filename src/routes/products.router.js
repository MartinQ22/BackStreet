import express from "express";
import Product from "../models/product.model.js";
import ProductManager from "../productManager.js";
import uploader from "../utils/uploader.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./data/products.json");

//mongoose get products
productsRouter.get("/", async(req, res)=>{
  try {

    const { limit = 10, page = 1 } = req.query;

    const data = await Product.paginate( {}, { limit, page } );
    const products = data.docs;
    delete data.docs;

    res.status(200).json({ status: "success", payload: products, ...data });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al recuperar el producto" });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    //aca creamos el producto de forma local
    const { title, description, code, price,category, stock  } = req.body;

    const product = new Product({ title, description, code, price,category, stock })
    //aca lo guardamos
    await product.save();
    res.status(201).json({ status: "success", payload: product })
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al crear el producto" })
  }
})

//Modificar producto
productsRouter.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(pid, updates, { new: true, runValidators: true });
    if (!updatedProduct) return res.status(404).json({ status: "error", message: "Error al encontrar el producto" });

    res.status(200).json({ status: "success", payload: updatedProduct })
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al modificar el producto" })
  }
});

//Borrar producto
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const deletedProduct = await Product.findByIdAndDelete(pid)

    if (!deletedProduct) return res.status(404).json({ status: "error", message: "Error al encontrar el producto" });

    res.status(200).json({ status: "success", message: "↓↓↓ Producto eliminado ↓↓↓", payload: deletedProduct })
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al borrar el producto"  });
  }
});

//productos Dashboard
productsRouter.post("/", uploader.single("image"), async (req, res) => {
  const title = req.body.title;
  const price = parseInt(req.body.price);
  const thumbnail = "/img/" + req.file.filename;

  await productManager.addProduct({ title, price, thumbnail });

  res.redirect("/dashboard");
});

//Productos Route para realTimeProducts
productsRouter.post("/", uploader.single("image"), async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const category = req.body.category;
  const price = parseInt(req.body.price);
  const thumbnail = req.file ? "/img/" + req.file.filename : "";

  const newProduct = await productManager.addProduct({ 
    title, 
    description, 
    category, 
    price, 
    thumbnail 
  });

  // Emitir el evento Socket.IO para actualizar a todos los clientes
  const io = req.app.get("io");
  if (io) {
    io.emit("productAdded", newProduct[newProduct.length - 1]);
  }

  res.redirect("/realtimeproducts");
});

export default productsRouter;