import express from "express";
import { readFileSync } from "fs";
import ProductManager from "../productManager.js";
import Product from "../models/product.model.js";

const viewsRouter = express.Router();
const productManager = new ProductManager("./data/products.json");

const allProducts = JSON.parse(readFileSync("./data/products.json", "utf8"));

//-------------- Handlebars View Routers --------------

// Home
viewsRouter.get("/", async(req,res) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const data = await Product.paginate({}, { limit, page, lean: true });
        const products = data.docs;
        delete data.docs;

        const links = [ ]

        for(let index = 1; index <= data.totalPages; index ++){
            links.push({ text: index, link: `?limit=${limit}&page=${index}`})
        }
        
        res.render("home", { products, links })
        // const products = await productManager.getProducts();
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
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