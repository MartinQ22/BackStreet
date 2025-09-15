import crypto from "crypto";
import fs from "fs/promises";

class ProductManager {

    constructor(pathFile) {
        this.pathFile = pathFile;
    }

    generateNewId(){
        return crypto.randomUUID();
    }

    async addProduct(newProduct){
        try {
            //Lectura de los archivos
            const fileData = await fs.readFile( this.pathFile, "utf-8" );
            const products = JSON.parse(fileData);

            const newId = this.generateNewId();
            // Creacion de producto 
            const product = {id: newId, ...newProduct}
            products.push(product)
            // Save de los datos en el json y reconvertirlos de array a JSON
            await fs.writeFile( this.pathFile, JSON.stringify(products, null, 2), "utf-8" )
            
            return products
        } catch (error) {
            throw new Error("Error al añadir el producto:" + error.message);
        }
    }

 async getProducts(){
    try {
        //Lectura de los archivos
            const fileData = await fs.readFile( this.pathFile, "utf-8" );
            const products = JSON.parse(fileData);

        return products;
    } catch (error) {
            throw new Error("Error al visualizar los productos:" + error.message);
    }}

    async getProductById(productId){
        try {
            //Lectura de los archivos
            const fileData = await fs.readFile( this.pathFile, "utf-8" );
            const products = JSON.parse(fileData);

            const product = products.find( product => product.id === productId );
            if(!product) throw new Error("El producto no existe");

            return product;
        } catch (error) {
            throw new Error("Error al obtener el producto:" + error.message);
        }
    }

    
    async deleteProductById(productId){
       
         try {
            //Lectura de los archivos
            const fileData = await fs.readFile( this.pathFile, "utf-8" );
            const products = JSON.parse(fileData);

             const filteredProducts = products.filter( product => product.id !== productId)
    
            // Save de los datos en el json y reconvertirlos de array a JSON
            await fs.writeFile( this.pathFile, JSON.stringify(filteredProducts, null, 2), "utf-8" )

             return filteredProducts;

         } catch (error) {
       
             throw new Error("Error al borrar el producto:" + error.message);
       
         }
    }

    async setProductById(productId, updates){
        try {
            //Lectura de los archivos
            const fileData = await fs.readFile( this.pathFile, "utf-8" );
            const products = JSON.parse(fileData);

            const indexProduct = products.findIndex( product => product.id === productId );
            if(indexProduct === -1) throw new Error("El producto no existe");

            products[indexProduct] = { ...products[indexProduct], ...updates};

            // Save de los datos en el json y reconvertirlos de array a JSON
            await fs.writeFile( this.pathFile, JSON.stringify(products, null, 2), "utf-8" )

            return products;

        } catch (error) {
           throw new Error("Error al cambiar el producto:" + error.message);
        }
    }
}

export default ProductManager;