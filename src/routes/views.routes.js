import express from 'express';
import cookieParser from 'cookie-parser';
import {ProductManager} from '../../main.js';
import { CartManager } from '../../main.js';
import { UserManager } from '../../main.js'
import { passportCall, authorization } from "../utils.js";
import { UserService } from '../services/service.js';

const router = express.Router();
const manejadorProductos = new ProductManager();
const manejadorItemsCart = new CartManager();
const manejadorUsuarios = new UserManager();

// ADMIN-PANEL  
router.get("/AdminPanel", 
    passportCall('jwt'), authorization(['admin']),
    async (req, res) => {
        const cookieToken = req.cookies.jwtCookieToken;
        let userId;
        const users = await manejadorUsuarios.getUsers(cookieToken);
        const Products = await manejadorProductos.getProducts();
        try {
            const user = await UserService.getByEmail(req.user.email).select('_id').exec();
            if (user) {
                userId = user._id;
            } else {
                console.log('Usuario no encontrado');
            }
        } catch (err) {
            console.error('Error al buscar usuario:', err);
        }
        const cartItems = await manejadorItemsCart.getCartItems(cookieToken, userId);
        res.render("Admin", {
            cart: cartItems.cart,
            user: req.user,
            products: Products,
            isAdmin: req.user.role === 'admin',
            users: users
        });
});

// LOGIN
router.get("/login", (req, res) => {
    res.render("login");
});

// REGISTER
router.get("/register", (req, res) => {
    res.render("register");
});

// CART
router.get("/cart/User", 
    passportCall('jwt'),
    authorization(['user', 'admin' , 'premiun']),
    async (req, res) => {
        const cookieToken = req.cookies.jwtCookieToken;
        let userId;
        try {
            const user = await UserService.getByEmail(req.user.email).select('_id').exec();
            if (user) {
                userId = user._id;
            } else {
                console.log('Usuario no encontrado');
            }
        } catch (err) {
            console.error('Error al buscar usuario:', err);
        }
        const cartItems = await manejadorItemsCart.getCartItems(cookieToken, userId);
        res.render("cart", {  
            cart: cartItems.cart,
            isAdmin: req.user.role === 'admin',
            user: req.user
        });
        
});

//CART
router.get("/cart", (req, res) => {
    res.render("cartNoUser");
});

// SUCURSALES USER
router.get('/sucursales/User',
    passportCall('jwt'),
    authorization(['user', 'admin' , 'premiun']), 
    async (req, res) => {
        const cookieToken = req.cookies.jwtCookieToken;
        let userId;
        try {
            const user = await UserService.getByEmail(req.user.email).select('_id').exec();
            if (user) {
                userId = user._id;
            } else {
                console.log('Usuario no encontrado');
            }
        } catch (err) {
            console.error('Error al buscar usuario:', err);
        }
        const cartItems = await manejadorItemsCart.getCartItems(cookieToken, userId);
        res.render('sucursales',{
            cart: cartItems.cart,
            isAdmin: req.user.role === 'admin',
            user: req.user
        });
});

// SUCURSALES
router.get('/sucursales', (req, res) => {
    res.render('sucursales');
});

//SABORES USER
router.get('/Sabores/User',
    passportCall('jwt'),
    authorization(['user', 'admin' , 'premiun']), 
    async (req, res) => {
        const cookieToken = req.cookies.jwtCookieToken;
        let userId;
        try {
            const user = await UserService.getByEmail(req.user.email).select('_id').exec();
            if (user) {
                userId = user._id;
            } else {
                console.log('Usuario no encontrado');
            }
        } catch (err) {
            console.error('Error al buscar usuario:', err);
        }
        const cartItems = await manejadorItemsCart.getCartItems(cookieToken, userId);
        res.render('Sabores',{
            cart: cartItems.cart,
            isAdmin: req.user.role === 'admin',
            user: req.user
        });
});

//SABORES
router.get('/Sabores', (req, res) => {
    res.render('Sabores');
});

// UPDATE PASSWORD
router.get('/updatePassword', (req, res) => {
    res.render('updatePassword');
});

router.get('/reset-password/:token', (req, res) => {
    res.render('updatePassword-email');
});

// HOME 
router.get('/home/User',
    passportCall('jwt'),
    authorization(['user', 'admin' , 'premiun']), 
    async (req, res) => {
        const cookieToken = req.cookies.jwtCookieToken;
        let userId;
        try {
            const user = await UserService.getByEmail(req.user.email).select('_id').exec();
            if (user) {
                userId = user._id;
            } else {
                console.log('Usuario no encontrado');
            }
        } catch (err) {
            console.error('Error al buscar usuario:', err);
        }
        const cartItems = await manejadorItemsCart.getCartItems(cookieToken, userId);
        res.render('home',{
            cart: cartItems.cart,
            isAdmin: req.user.role === 'admin',
            user: req.user
        });
});

// HOME USER
router.get('/home', (req, res) => {
    res.render('home');
});

// TIENDA
router.get('/tienda', async (req, res) => {
    try {
        const products = await manejadorProductos.getProducts();
        res.render('tienda', {
            products: products,
            user: req.user
        });
    } catch (error) {
        res.status(500).render('error');
    }
});


// TIENDA USER
router.get("/tienda/User",
    passportCall('jwt'),
    authorization(['user', 'admin' , 'premiun']),
    async (req, res) => {
        const cookieToken = req.cookies.jwtCookieToken;
        let userId;
        try {
            const user = await UserService.getByEmail(req.user.email).select('_id').exec();
            if (user) {
                userId = user._id;
            } else {
                console.log('Usuario no encontrado');
            }
            const products = await manejadorProductos.getProducts();
            const cartItems = await manejadorItemsCart.getCartItems(cookieToken, userId);
            res.render('tienda', {
                cart: cartItems.cart,
                isAdmin: req.user.role === 'admin',
                products: products,
                user: req.user
            });
        } catch (error) {
            res.status(500).render('error');
        }
    }
);

//PAGO EXITOSO
router.get("/successPayment", 
    passportCall('jwt'),
    authorization(['user', 'admin' , 'premiun']), async (req, res) => {
        res.render("success", {
            user: req.user
        });
});

// REALTIMEPRODUCTS
router.get("/realTimeProducts", 
    passportCall('jwt'),
    authorization('admin'),
    (req, res) => {
        res.render("realTimeProducts");
});

//CHAT
router.get('/chat',
    passportCall('jwt'),
    authorization('user'), 
    (req, res) => {
        res.render("chat");
    });

// CART ID
router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartDao.findCartByUserId(cid);
        if (!cart) {
            return res.render("error", { message: "Carrito no encontrado" });
        }

        const cartItems = cart.items;
        res.render("cart", { cartItems });
    } catch (error) {
        console.error(error);
        res.render("error", { message: "Error al obtener el carrito" });
    }
});

// Rutas relacionadas con cookies
router.use(cookieParser('MatiS3cr3tC0d3'));

router.get('/setcookie', (req, res) => {
    res.cookie('CooderCookie', 'Esta es una cookie con firma!!', { maxAge: 20000, signed: true }).send('Cookie asignada con exito!')
});

router.get('/getcookie', (req, res) => {
    res.send(req.signedCookies)
});

router.get('/deletecookie', (req, res) => {
    res.clearCookie('CooderCookie').send('Cookie borrada con exito!!')
});

// Rutas relacionadas con la sesión
router.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Se ha visitado este sitio ${req.session.counter} veces.`);
    } else {
        req.session.counter = 1;
        res.send('Bienvenido!');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.json({ error: 'Error logout', msg: "Error al cerrar la session" })
        }
        res.send('Session cerrada con exito!')
    })
});

/*router.get('/login', (req, res) => {
    const { username, password } = req.query;
    if (username != 'mati' || password !== 'mati123') {
        return res.status(401).send("Error de Login, usuario o contraseña incorrecta.");
    } else {
        req.session.user = username;
        req.session.admin = true;
        res.send('Login exitoso!!')
    }
});
*/

function auth(req, res, next) {
    if (req.session.user === 'mati' && req.session.admin) {
        return next()
    } else {
        return res.status(403).send("Usuario no autorizado para ingresar.");
    }
}

router.get('/private', auth, (req, res) => {
    res.send('Si estas viendo esto es porque estas autorizado!');
});

// Rutas relacionadas con el login con GitHub
router.get("/github/login", (req, res) => {
    res.render("github-login");
});

router.get("/github/error", (req, res) => {
    res.render("error", { error: "No se pudo autenticar usando GitHub!" });
});

export default router;
