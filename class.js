// class Persona{

//     //sirve para inicializar propiedades de la clase
//     constructor(nombre, edad, aura){
//         this.nombre = nombre
//         this.edad = edad
//         this.aura = aura
//     }

//     //metodos
//     saludar (){
//         const mensaje = "Hola, me llamo " + this.nombre + " y tengo " + this.edad + " años, " + "hoy farmee " + this.aura
//         return mensaje
//     }

//     trabajar(){
//         this.aura = this.humor - 5;
//         return "aura disminuida"
//     }
//     dormir(){
//         this.aura = this.humor + 100;
//         return "aura aumentada"
//     }
//     verAuran(){
//         return this.aura
//     }
// }

// const persona1 = new Persona( "Soto", 25, 10);
// const persona2 = new Persona( "Gasti", 21, 100);

// console.log(persona1);
// console.log(persona1.saludar());
// console.log(persona2.dormir());


// class ProductManager {

    
//     constructor(title, description, price, thumbnail, code, stock){
//         this.products = []
//             this.title = this.title
//             this.description = this.description
//             this.price = this.price
//             this.thumbnail = this.thumbnail
//             this.code = this.code
//             this.stock = this.stock

//         addProducts(newProduct){
            
//         };

//         getProducts(){

//         }
        
//     }
// }


const products = [
    {
        id:1,
    title: "Zapatillas nike Stein",
    desciption: "this is a description lore",
    price: 240,
    thumbnail: "http&/",
    code: "2Ad2",
    stock: 10,
    },
    {
        id:2,
    title: "Zapatillas Temu",
    desciption: "this is a description lore",
    price: 40,
    thumbnail: "http&/",
    code: "322ab2",
    stock: 101,
    }
    
]

class ProductManager {
    #admin;

    constructor(products){
        this.products = products;
        this.#admin = true;
    }

    getProducts(){
        return { message: "Lista de productos", products: this.products };
    }

    deleteProductsById(productId){
        try {

        if (!this.#admin) throw new Error("ACCESS DENIED");
            
            const newProducts = this.products.filter( product => product.id !== productId)
            this.products = newProducts;

            return {message: "producto eliminado", products: this.products };

        } catch (error) {
            console.log("Error al eliminar un producto:", error.message);
        }
    }

    generateId(){
        if(products.length > 0 ){
            return this.products[this.products.length - 1].id + 1;
        }else{
            return 1;
        }
    }

    addProduct(newProduct){
        try {
           if (!this.#admin) throw new Error("ACCESS DENIED");
           
           const id = this.generateId()
            this.products.push({ id:id , ...newProduct})
           
            return { message: "Producto agregado", products: this.products };
        } catch (error) {
            console.log("Error al agregar un producto:", error.message);
        }
    }

    updateProductById(productId, update){
        try {
            if (!this.#admin) throw new Error("ACCESS DENIED");

            const indexProduct = this.products.findIndex( product => product.id === productId );
            if(indexProduct === -1) throw new Error("El producto no existe");

            this.products[indexProduct] = { ...this.products[indexProduct], ...update};
            return { message: "productos actualizados", products: this.products}
    

        } catch (error) {
           console.log("Error al actualizar un producto:", error.message); 
        }
    }
}

function main(){
    const productManager = new ProductManager(products);

    console.log(productManager.getProducts());
    // console.log( productManager.deleteProductsById(1));
    console.log( productManager.addProduct({title: "ZAPAPAPA", desciption: "SISOI"}));
    console.log(productManager.updateProductById(1, { price: 777}));
    
}

main()