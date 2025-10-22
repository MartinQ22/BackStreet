import fs from "fs/promises";

class CartManager {
    constructor(pathFile) {
        this.pathFile = pathFile;
    }

    generateNewId = (carts) => {
    if (carts.length === 0) {return 1; }

    return carts[carts.length - 1].id + 1;
    }

    //addCart

    async addCart(newCart){
        try {
            //Lectura de los archivos
            const fileData = await fs.readFile( this.pathFile, "utf-8" );
            const carts = JSON.parse(fileData);

            const id = this.generateNewId(carts);
            carts.push({id, products: []})

            await fs.writeFile( this.pathFile, JSON.stringify(carts, null, 2), "utf-8" )
            return carts;
        } catch (error) {
            throw new Error("Error al añadir el carrito:" + error.message);
        }
    }

    //addProductInCart
    
     async addProductInCart(cid, pid, quantity){
        try {
        const fileData = await fs.readFile(this.pathFile, "utf-8");
        const carts = JSON.parse(fileData);

        const cart = carts.find(cartData => cartData.id == cid);

        if (cart) {
            const existingProduct = cart.products.find(prod => prod.id == pid);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ id: pid, quantity });
            }
        } else {
            throw new Error(`Error: Carrito con ID ${cid} no encontrado.`);
        }

        await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");
        return carts;
    } catch (error) {
        throw new Error("Error al añadir el producto al carrito: " + error.message);
    }
    }

    //GET
    async getProductInCartById(cid) {
    try {
        const fileData = await fs.readFile(this.pathFile, "utf-8");
        const carts = JSON.parse(fileData);

        const cart = carts.find((cartData) => cartData.id == cid);
        
        if (cart) {
            return cart.products;
        } else {
            throw new Error(`Cart with ID ${cid} not found.`);
        }
    } catch (error) {
        throw new Error("Error getting product:" + error.message);
    }
}
}

export default CartManager;