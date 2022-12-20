
//Realizar un proyecto de servidor basado en node.js y express que ofrezca una API RESTful de productos.
const express = require('express');
const { engine } = require('express-handlebars');
const {Router} = express;
const app = express();
app.use(express.json())
const productsRouter = Router();
const rootRouter = Router();

app.use(express.urlencoded({ extended: true }));





app.set('view engine', 'handlebars');
app.set('views', './views');

app.engine('handlebars', engine());


let productos = []


rootRouter.get('/', (req, res) => {
    res.render('form')
})

//GET '/api/productos' -> devuelve todos los productos.
productsRouter.get('/', (req, res)=>{
    res.render('products', {productos})

    
    
    
})


//POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
productsRouter.post('/', (req, res)=>{

    const productToAdd = req.body;
    
    

    let id = 1
    let ids = []
    if(productos.length>0){
        productos.forEach((o)=>{
            ids.push(o.id)
        });
        id = Math.max(...ids) + 1             
    }
                  
    productToAdd.id = id;


    productos.push(productToAdd)

    

    res.redirect('back')
})

// GET '/api/productos/:id' -> devuelve un producto según su id.
productsRouter.get('/:id', (req, res)=>{
    const producto = productos.filter(producto=> producto.id == req.params.id)
    const ids = productos.map(producto=> producto.id)
    if (ids.includes(parseInt(req.params.id))){
        res.json(producto)   
    } else {
        res.send({error: "producto no encontrado"})
    }
    
})

// PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
productsRouter.put('/:id', (req, res)=>{
    const ids = productos.map(producto=> producto.id)
    productos = productos.filter(producto=> producto.id != req.params.id)
    const productToAdd = req.body;
    productToAdd.id = parseInt(req.params.id);
    
    if (ids.includes(parseInt(req.params.id))){
        productos.push(productToAdd)  
        res.status(200).json({modified: productToAdd})
    } else {
        res.send({error: "producto no encontrado"})
    }
    
    
})

// DELETE '/api/productos/:id' -> elimina un producto según su id.
productsRouter.delete('/:id', (req, res)=>{
    const ids = productos.map(producto=> producto.id)
   
    if (ids.includes(parseInt(req.params.id))){
        const deletedProduct = productos.filter(producto=> producto.id == req.params.id)
        productos = productos.filter(producto=> producto.id != req.params.id)
        
        res.status(200).json({deleted: deletedProduct})
    } else {
        res.send({error: "producto no encontrado"})
    }

})



app.use('/api/productos', productsRouter)

app.use('/', rootRouter)

const PORT = 8080
app.listen(PORT, ()=> console.log(`I´m listening in port ${PORT}`))


