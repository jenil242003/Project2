///Imports and defines

const express = require("express");
const server = express();
const {request,response} = require("http")
const cors = require("cors")
const mongoose = require("mongoose")
const Product = require("./models/product")
const port = 3000;

const db_uri = "mongodb+srv://new_user1430:Jenillodu@cluster0.rnz3xev.mongodb.net/products?retryWrites=true&w=majority";

///Middleware

server.use(express.urlencoded({extended:false}));
server.use(express.json());
server.use(cors());



//Connections

mongoose.connect(db_uri).then((result) => {
    server.listen(port, () => {
        console.log(`Listening on ${port}...\nConnect to DB`);
    });
}).catch((error) => {console.log(error);
});

///Router

server.get("/",(request, response) =>{
    response.send("Live!!!!");
});


server.get("/products", async(request, response) => {
    const products = await Product.find();
    response.send(products);
});

server.post("/addProduct", async(request, response) => {
const product = request.body
const postProduct = new Product({
    id:product.id,
    productName: product.productName,
    brand: product.brand,
    quantity: product.quantity,
    price: product.price,
    image: product.image,
});
const saveProduct = await postProduct.save();
saveProduct ? response.send("Prodct is added to inventory") 
: response.send("Failed to add!");
});

server.delete("/product/:id", async (request, response) => {
    const { id } = request.params;
    const deleteProduct = await Product.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
    });
    deleteProduct
    ? response.send(`${id} product has been deleted`)
    : response.send("failed tp delete!")
});

server.patch("/product/:id", async (request, response) => {
    const {id} = request.params;
    const product = request.body;
    const patchProduct = await Product.updateOne(
        {_id: new mongoose.Types.ObjectId(id)},
        {$set: product}
    );
    patchProduct
    ? response.send(`${product.productName} has been edited`)
    : response.send("Failed to edit");
 });

