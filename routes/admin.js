const { response } = require('express');
var express = require('express');
const adminHelpers = require('../helpers/admin-helpers');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();

const path = require('path')
const fs = require('fs');
const userHelpers = require('../helpers/user-helpers');
const { json } = require('express/lib/response');
var moment = require('moment')
moment().format(); 
const verifyLogin=(req,res,next)=>{
  if(req.session.admin){
    next();
  }else{
    res.redirect('/admin/')
  }
}

router.get('/',(req,res)=>{

  if(req.session.admin){
    
    res.redirect('/admin/front-admin')        
  }
  res.render('admin/login-admin',{err:req.session.adminLoginErr,admin:true})
  req.session.adminLoginErr=false
});

router.get('/front-admin',verifyLogin, async(req,res)=>{

  let history = await adminHelpers.recentOrders()
  for(x of history){
    x.Date=moment(x.date).format('ll')
  }
  
  console.log(history);
  let totalAmount = await adminHelpers.getTotalRevenue()
  let totalUsers = await adminHelpers.getAllUsers()
  let totalproducts = await adminHelpers.getAllAvailableProducts()
  let totalOrders = await adminHelpers.totalOrderCount()
  // console.log(totalAmount);
  let user = req.session.user
  // console.log(user);
  var revenue = totalAmount[0].total
  res.render('admin/front-admin',{admin:true,user,revenue,totalUsers,totalproducts,totalOrders,history})
})


router.post('/login-admin',(req,res)=>{
  console.log(1);
  adminHelpers.doLogin(req.body).then((response)=>{
    
    
    console.log(2);
    
    if(response.status){
      req.session.user = response.user
      console.log(3);
      req.session.admin = true
      
      console.log("admin login");
      res.redirect('/admin/front-admin')
    }else{
      console.log(4);
      req.session.adminLoginErr = true;
      res.redirect('/admin/')
    }
  })
})
router.get('/add-product',async(req,res)=>{
  let category =await productHelpers.getCategory()
  let brand  =await productHelpers.getBrand()

  res.render('admin/add-product',{admin:true,brand,category})
})

router.post('/add-product',verifyLogin,(req,res,next)=>{
  productHelpers.addProduct(req.body).then((id)=>{
    let image1 = req.files.image1
     let image2 = req.files.image2
     let image3 = req.files.image3
     let image4 = req.files.image4
    console.log(id);

    image1.mv('./public/products/'+id+'1.jpg')
    image2.mv('./public/products/'+id+'2.jpg')
    image3.mv('./public/products/'+id+'3.jpg')
    image4.mv('./public/products/'+id+'4.jpg')
    // base64Date2 = image2.replace(/^data:image\/jpeg;base64,/, "")
    // const fileName2 = path.join(__dirname, '../public/products/'+ id + '2.jpeg')
    // fs.writeFile(fileName2, base64Date2, 'base64', function (err) {
    //   console.log(err);
    // })       
    res.redirect('/admin/add-product')
  }).catch((err)=>{
    if(err.code ==11000){
      

    }
    
  })  
})

router.get('/all-products',(req,res)=>{
  productHelpers.getAllProduct().then((products)=>{

    res.render('admin/all-products',{admin:true,products})
  })
  
})
router.get('/users',verifyLogin,(req,res)=>{
  adminHelpers.viewUsers().then((users)=>{
    // console.log(users);
    res.render('admin/users',{users,admin:true})
  })
  
})
router.get('/edit-product/:id',verifyLogin,async(req,res)=>{
  let product = await productHelpers.getProductDetails(req.params.id)
  let categories = await productHelpers.getCategory()
  let brands = await productHelpers.getBrand()
  
    res.render('admin/edit-product',{admin:true,product,categories,brands})
  // })
})
router.post('/edit-product/:id',verifyLogin,(req,res)=>{
  let id = req.params.id;
  productHelpers.UpdateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin/all-products')
    let image1 = req.files.image1
    let image2 = req.files.image2
    let image3 = req.files.image3
    let image4 = req.files.image4

    if(req.files.image1){
      image1.mv("./public/products/"+id+"1.jpg")      
    }
    if(req.files.image2){
      image2.mv("./public/products/"+id+"2.jpg")      
    }
    if(req.files.image3){
      image3.mv("./public/products/"+id+"3.jpg")      
    }
    if(req.files.image4){
      image4.mv("./public/products/"+id+"4.jpg")      
    }
    
  }).catch((err)=>{
    console.log(err);
  })
})
router.get("/delete-product/:proId", (req, res) => {
  console.log("reached to delete");
  
  let productId = req.params.proId
  productHelpers.deleteProduct(productId).then((resq) => {
    if(resq){
      res.json(true)
    }
  });
});
router.get('/category',(req,res)=>{
  productHelpers.getCategory().then((category)=>{
    res.render('admin/category',{admin:true,category})
  })
  
})
router.post('/category',(req,res)=>{
  productHelpers.addCategory(req.body).then((response)=>{
    res.redirect('/admin/category')
    // console.log(req.body);
    
  })
})
router.get('/delete-catagory/:catId',(req,res)=>{
  let productId = req.params.catId
  console.log(productId);
  productHelpers.deleteCategory(productId).then((response)=>{
    if(response){
      res.json(true)
    }
  })

})
router.get('/brand',verifyLogin,async(req,res)=>{
  productHelpers.getBrand().then((brand)=>{
    res.render('admin/brand',{admin:true,brand})
  })
  
})

router.post('/brand',(req,res)=>{
  console.log("helloo");
  productHelpers.addBrand(req.body).then((id)=>{
    
    let image = req.files.logoimage    
    if(req.files.logoimage){
      image.mv('./public/brand/'+id+'11.jpg',(err,done)=>{
        console.log("image");
        if(!err){
          res.redirect('/admin/brand')
        }else{
          res.redirect('/admin/brand')
        }
      })
    }else{
      res.redirect('/admin/brand')
    }
  })
})
router.get('/delete-brand/:banId',(req,res)=>{
  let productId = req.params.banId
  productHelpers.deleteBrand(productId).then((response)=>{
    if(response){
      res.json(true)
    }
    
  })
})
router.get('/orders',verifyLogin,async(req,res)=>{

  let history =await adminHelpers.getAllOrdersinhistory()
  
  for(x of history){
    x.date = moment(x.date).format('ll')
  }
  console.log(history);
  res.render('admin/orders',{admin:true,history})
})


router.get("/logout-admin", (req, res) => {
  console.log("OOOOOOOOOOOOOo")
  
  res.render("admin/login-admin",{admin:true});
});

router.get('/placed/:id', (req, res) => {
  states = 'placed'
  console.log("placed")

  adminHelpers.changeOrderStatus(req.params.id, states).then(() => {
    res.redirect('/admin/orders')
  })
})
router.get('/cancelled/:id', (req, res) => {
  states = 'Cancelled'
  console.log("cancelled")

  adminHelpers.changeOrderStatus(req.params.id, states).then(() => {
    res.redirect('/admin/orders')
  })
})

module.exports = router;