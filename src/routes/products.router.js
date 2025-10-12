import express from "express";
import ProductManager from "../productManager.js";
import uploader from "../utils/uploader.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./data/products.json");

productsRouter.post("/", uploader.single("image"), async (req, res) => {
  const title = req.body.title;
  const price = parseInt(req.body.price);
  const thumbnail = "/img/" + req.file.filename;

  await productManager.addProduct({ title, price, thumbnail });

  res.redirect("/dashboard");
});

export default productsRouter;
