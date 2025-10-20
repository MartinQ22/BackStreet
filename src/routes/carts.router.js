import express from "express";
import Cart from "../models/cart.model.js"

const cartRouter = express.Router()

// Crear carritos vacios
cartRouter.post("/", async (req, res) => {
  try {
    const cart = new Cart;
    await cart.save();
    res.status(201).json({ status: "success", payload: cart })
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al crear el carrito" })
  }
});

//Agregar productos al carrito
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    const updatedCart = await Cart.findByIdAndUpdate(cid, { $push: { products: { product: pid , quantity } } }, { new: true, runValidators: true });
    if(!cart) return res.status(404).json({ status: "error", message: "Error al agregar el producto" });
    res.status(200).json({ message: "Producto Añadido", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al añadir el producto al carrito" })
  }
});

//Traer productos del carrito 
cartRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid);
    if(!cart) return res.status(404).json({ status: "error", message: "Error al buscar el carrito" });
    res.status(200).json({status: "success", message: "Productos Encontrado", payload: cart.products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default cartRouter