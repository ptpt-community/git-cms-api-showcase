const Product = require("./Model/products.model")
module.exports = {
    read: async ()=>{
        const result = await Product.find();
        return result;
    },

    write: ()=>{
        new Product({name: "test"}).save().catch(console.log);
    }
}