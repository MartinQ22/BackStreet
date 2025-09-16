import fs from "fs/promises";

class CartManager {
    constructor(pathFile) {
        this.pathFile = pathFile;
    }

    generateNewId = (carts) => {
        if(carts.length > 0){
            return carts [carts.length - 1].id + 1;
        }
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
            const fileData = await fs.readFile( this.pathFile, "utf-8" );
            const carts = JSON.parse(fileData);

            carts.forEach(cart => {
                if(cart.id == cid){

                    cart.products.push({ id : pid, quantity})
                };
            });

            await fs.writeFile( this.pathFile, JSON.stringify(carts, null, 2), "utf-8" )
            return carts;
        } catch (error) {
            throw new Error("Error al añadir el producto:" + error.message);
        }
    }

    //GET

    async getProductInCartById(cid){
            try {
                //Lectura de los archivos
                const fileData = await fs.readFile( this.pathFile, "utf-8" );
                const carts = JSON.parse(fileData);
    
                const cart = carts.find( (cartData) => cartData.id == cid );
                return cart.products;
            } catch (error) {
                throw new Error("Error al obtener el producto:" + error.message);
            }
        }
}



export default CartManager;