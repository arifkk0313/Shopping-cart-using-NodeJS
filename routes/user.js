var express = require('express');
const { response } = require('../app');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers')
const productHelpers = require('../helpers/product-helpers');
const { resolve } = require('promise');
const { redirect } = require('express/lib/response');
const { puma } = require('../helpers/product-helpers');

var accountSid = "AC974544535c1157b67c6fc19a015ea523"
 var authToken = "6edfa05c7b93baf73624471da94ab2cc"
 var serviceSid = "VAa53f7a73dc389db4984c74e767283697"
 const client = require("twilio")(accountSid, authToken);


/* GET home page. */
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

router.get('/', async function (req, res, next) {
  let brand = await productHelpers.getBrand()
  let catagory = await productHelpers.getCategory()
  
  let user = req.session.user
  let cartCount = null
  if (req.session.user) {
   
    let cartCount = await productHelpers.getCartCount(req.session.user._id)
    // console.log(cartCount);
    productHelpers.popularProducts().then((data) => {

      console.log(data);
      res.render('user/front', { user, data, brand, catagory, cartCount })
    })


  }


  else {
    let catagory = await productHelpers.getCategory()
    let brand = await productHelpers.getBrand()
    productHelpers.popularProducts().then((data) => {
      res.render('user/front', { catagory, brand, data });
    })
  }



});
router.get('/login', async(req, res) => {
  let brand = await productHelpers.getBrand()
  let catagory = await productHelpers.getCategory()
  let user = req.session.user;
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/login', { "logginErr": req.session.logginErr ,loginErrphn: req.session.loginErrphn,})
    req.session.logginErr = false
  }
  req.session.loginErr = false;
  req.session.loginErrphn = false;
  req.session.passchange = false;

})
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.logginErr = "invalid username or password"
      res.redirect('/login')
    }
  })
})
router.get('/wishlist', verifyLogin, async (req, res) => {
  let brand = await productHelpers.getBrand()
  let catagory = await productHelpers.getCategory()
  let user = req.session.user;

  let product = await productHelpers.getWishlistProduct(req.session.user._id)
  console.log(product);
  res.render('user/wishlist', { brand,catagory,product, user: req.session.user })
})
router.get('/remove-wishlist/:id', (req, res) => {

  productHelpers.removeWishlist(req.params.id, req.session.user._id).then((response) => {
    res.redirect('/wishlist')
  })
})
router.get('/add-to-wishlist/:id', async (req, res) => {
  if (req.session.user) {
    var eachproductdetails = await productHelpers.getProductDetails(req.params.id)
    console.log(req.body);
    productHelpers.addToWishlist(req.params.id, req.session.user._id, eachproductdetails).then((data) => {


      // res.redirect('/')
      res.json(data)
    })
  }
  else {
    res.json({ login: true })
  }

})
router.get("/emptycart", async (req, res) => {

  let brand = await productHelpers.getBrand()
  let catagory = await productHelpers.getCategory()
  let user = req.session.user;
  
  let cartCount = null;
  if (req.session.user) {
    cartCount = await productHelpers.getCartCount(req.session.user._id);
  }
  res.render("user/emptycart", { catagory, cartCount, user: req.session.user })
})

router.get('/cart', verifyLogin, async (req, res) => {
  let totalValue = 0



  let brand = await productHelpers.getBrand()
  let catagory = await productHelpers.getCategory()
  let user = req.session.user;
  let product = await productHelpers.getCartProducts(req.session.user._id)
  if (product.length > 0) {
    let totalValue = await userHelpers.getTotalAmount(req.session.user._id)
    let cartCount = await productHelpers.getCartCount(req.session.user._id)

    totalValue = await userHelpers.getTotalAmount(req.session.user._id)
    let newcarttotal = req.session.newcartamount
    res.render('user/cart', {catagory,brand, product, user: req.session.user, cartCount, totalValue })
  } else {
    res.redirect("/emptycart")
  }
  console.log("++++++++");

})
router.get('/add-to-cart/:id', verifyLogin, async (req, res) => {
  var eachProduct = await productHelpers.getProductDetails(req.params.id)
  console.log(11111);
  console.log(req.body);
  productHelpers.addToCart(req.params.id, req.session.user._id, eachProduct).then(() => {
    
    // res.redirect('/')
    
    // res.json({ status: true })
  })
})
router.post('/change-product-quantity', verifyLogin, async(req, res, next) => {
  // console.log(req.body);
  let id = req.body.user
  let proId = req.body.productx
  productHelpers.changeProductQuantity(req.body).then(async (response) => {
    response.total = await userHelpers.getTotalAmount(req.body.user)
    response.subtotal = await userHelpers.getSubTotal(req.body.user, req.body.product)
    response.subTotal = await productHelpers.getSubTotal(id, proId)
    // console.log(response.subtotal);
    res.json(response)
  })
})

router.get('/remove-cart/:id', verifyLogin, (req, res) => {
  console.log(req.params.id);
  productHelpers.deleteFromCart(req.params.id, req.session.user._id).then((response) => {
    res.redirect('/cart')
  })
})



router.get('/register', async(req, res) => {
  let brand = await productHelpers.getBrand()
  let catagory = await productHelpers.getCategory()
  let user = req.session.user;
  res.render('user/register')
})
router.post('/register', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    // console.log(response);
    // console.log(response);
  })
})
router.get('/forget-password', (req, res) => {
  res.render('user/forget-password')
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/productview/:id', async (req, res) => {
  let catagory = await productHelpers.getCategory()
  let brand = await productHelpers.getBrand();
  
  if (req.session.user) {
    let user = req.session.user
    let cartCount = await productHelpers.getCartCount(user._id)
  }
  productHelpers.getProductDetails(req.params.id).then((product) => {
    console.log(product);
    res.render('user/productview', { product, catagory, brand, user: req.session.user })
  })



  // productHelpers.getProductDetails(req.params.id).then((product) => {
  //   console.log(product);
  //   res.render('user/productview', { product, catagory, brand })
  // })

})


router.get('/place-order', verifyLogin, async (req, res) => {
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/placeorder', { total, user: req.session.user })
})
router.post('/place-order', async (req, res) => {
  // console.log(req.body);
  let products = await userHelpers.getCartProductList(req.body.userId)
  let totalPrice = await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body, products, totalPrice).then((orderId) => {

    if (req.body['payment-method'] === 'COD') {
      res.json({ codSuccess: true })
    } else {
      userHelpers.generateRazorpay(orderId, totalPrice).then((response) => {
        res.json(response)

      })
    }



  })


})
router.get('/order-success', (req, res) => {
  res.render('user/ordersuccess', { user: req.session.user })
})

router.get('/myorders', verifyLogin, async (req, res) => {
  let catagory = await productHelpers.getCategory()
  let brand = await productHelpers.getBrand();
  console.log(req.session.user);
  let orders = await userHelpers.getUserOrders(req.session.user._id)
  // console.log(orders);

  console.log(orders);

  res.render('user/myorders', {orders ,brand,catagory,user:req.session.user})
})

router.get('/view-order-products/:id', verifyLogin, async (req, res) => {
  if (req.session.user) {
    let singleorder = await userHelpers.getOrderProducts(req.params.id)
    let orders = await userHelpers.getUserOrders(req.session.user._id)
    console.log(singleorder);


    res.render('user/view-order-products', { user: req.session.user, singleorder, orders })
  }
})

router.post('/verify-payment', (req, res) => {

  console.log(req.body);
  userHelpers.verifyPayment(req.body).then(() => {
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
      console.log("payment successful");
      res.json({ status: true })

    })

  }).catch((err) => {
    console.log(err);
    res.json({ status: false, errMsg: '' })

  })
})

router.get('/myaccount', verifyLogin, async (req, res) => {
  let profile = await userHelpers.getProfile(req.session.user._id)
  console.log(profile);

  res.render('user/myaccount', { profile, user: req.session.user })

})


router.get('/editprofile',verifyLogin,(req,res)=>{
  profileid = req.query.id
  userHelpers.getProfileEdit(profileid).then((profileedit)=>{
    res.render('user/editprofile',{profileedit,user:req.session.user})
    // console.log(profileedit);
  })
  
})

router.post('/edited-profile/:id',(req,res)=>{
  userHelpers.setEditProfile(req.params.id,req.body).then((id)=>{
    
    // console.log(req.body);
    res.redirect('/myaccount')

  })
})

router.get('/changepassword',verifyLogin,(req,res)=>{
  res.render('user/changepassword',{user:req.session.user,passwordincorect: req.session.passwordincorect})
  req.session.passwordincorect = false;
})

router.post('/changepassword',(req,res)=>{
  console.log(req.body);
  console.log("Step1");
  userHelpers.changepassword(req.body,req.session.user._id).then((response)=>{
    console.log("________+++");
    console.log(response);
    if(response){
      req.session.passwordcorect=true
      console.log("password changed successfully");
      res.redirect('/myaccount')


    }else{
      req.session.passwordincorect = true;
      res.redirect('/changepassword')
    }
  })
})
router.get("/brandpage/:name", async (req, res) => {
  let cartCount = null;
  if (req.session.user) {
    cartCount = await productHelpers.getCartCount(req.session.user._id);
  }
  let brand = await productHelpers.getBrand()
  let catagory = await productHelpers.getCategory()
  let user = req.session.user;
  
  let data = await productHelpers.getbranddetail(req.params.name)
  res.render("user/brandwise", {  data ,user, brand,brandName:req.params.name,catagory,cartCount });
});
router.get("/categorypage/:name",async(req,res)=>{


  let cartCount = null;
  if (req.session.user) {
    cartCount = await productHelpers.getCartCount(req.session.user._id);
  }
  let brand = await productHelpers.getBrand()
  let catagory = await productHelpers.getCategory()
  let user = req.session.user;
  let data = await productHelpers.getCategoryDetails(req.params.name)
  res.render('user/categorywise',{user,data,catagory,brand,cartCount})
  
})

router.get("/login/otp", (req, res, next) => {
  res.render("user/otp", { login: true, loginErrotp: req.session.loginErrotp })
  req.session.loginErrotp = false;
})

//   posting login  page through otp

router.post("/loginphonenumber", (req, res, next) => {
  console.log(req.body);
  signup_body = req.body;
  userHelpers.checkUsernumberLogin(req.body.phonenumber).then((response) => {
    console.log(response);
    if (response) {
      client.verify
        .services(serviceSid)
        .verifications.create({
          to: `+91${req.body.phonenumber}`,
          channel: "sms",
        })
        .then((response) => {
          console.log(response);
        });
      console.log(signup_body);
      console.log("hai");
      res.redirect("/login/otp");
    } else {
      req.session.loginErrphn = true;
      res.redirect("/login");
    }
  });
});
// //otp verification

router.post("/login/otp", (req, res) => {
  let { otp } = req.body;
  otp = otp.join("");
  console.log(otp);
  client.verify
    .services(serviceSid)
    .verificationChecks.create({
      to: `+91${signup_body.phonenumber}`,
      code: otp,
    })
    .then((response) => {
      console.log(response.valid);
      if (response.valid) {
        userHelpers.otpLogin(signup_body.phonenumber).then((userData) => {
          req.session.user = userData
          console.log(req.session.user);
          req.session.loggedIn = true
          res.redirect("/");
        })

      } else {
        req.session.loginErrotp = true;
        res.redirect("/login/otp");
      }
    });
});

router.get('/order-cancel/:id', (req, res) => {
  userHelpers.orderCancel(req.params.id).then(() => {
    res.redirect('/myorders')
  })
})

module.exports = router;
