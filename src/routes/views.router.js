import express from "express";
import { readFileSync } from "fs";
import ProductManager from "../productManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager("./data/products.json");

const allProducts = JSON.parse(readFileSync("./data/products.json", "utf8"));

//Handlebars

viewsRouter.get("/", (req,res)=>{
    res.render("home")
})

viewsRouter.get("/dashboard", async(req,res)=>{
    const user = {username: "BartenderDev1", isAdmin: true};
    const products = await productManager.getProducts();
    
    res.render("dashboard", { products, user })
})





export default viewsRouter;