import express from "express";
import { readFileSync } from "fs";
import ProductManager from "../productManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager("./data/products.json");

const allProducts = JSON.parse(readFileSync("./data/products.json", "utf8"));

//-------------- Handlebars View Routers --------------

// Home
viewsRouter.get("/", async(req,res) => {
    const products = await productManager.getProducts();

    res.render("home", { products })
})
// Dashboard
viewsRouter.get("/dashboard", async(req,res)=>{
    const user = {username: "BartenderDev1", isAdmin: true};
    const products = await productManager.getProducts();
    
    res.render("dashboard", { products, user })
})

// Chat 
viewsRouter.get("/chat", (req, res) => {
    res.render("chat");
});

// Real Time Products 
viewsRouter.get("/realtimeproducts", async(req,res) => {
    const products = await productManager.getProducts();

    res.render("realTimeProducts", { products })
})





export default viewsRouter;