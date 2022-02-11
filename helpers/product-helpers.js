var db = require('../cofig/connection')
var collection = require('../cofig/collections')
const { ObjectId, ObjectID } = require('bson');
const { reject, resolve } = require('promise');
const { response } = require('express');
const res = require('express/lib/response');

module.exports = {
    addProduct: (product) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
                // console.log(data);
                resolve(data.insertedId)

            })

        })

    },
    getAllProduct: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
   
    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: ObjectId(proId) }).then((response) => {
                resolve(response)
            })
        })

    },getCategory:()=>{
        return new Promise ((resolve,reject)=>{
            let category = db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(category)
        })
    },
    addCategory:(categoryData)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(categoryData).then((response)=>{
                resolve(response)
            })
        })
    },deleteCategory:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:ObjectID(productId)}).then((response)=>{
                resolve(true)
            })
        })
    },
    addBrand:(branddata)=>{
        
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.BRAND_COLLECTION).insertOne(branddata).then((response)=>{
                // console.log(response);
                resolve(response.insertedId)
            })
        })
    },
    getBrand:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.BRAND_COLLECTION).find().toArray().then((product)=>{
                resolve(product)
            })
            
        })
    },
    deleteBrand:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.BRAND_COLLECTION).deleteOne({_id:ObjectID(proId)}).then((response)=>{
                resolve(true)
            })
        })

    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectID(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    UpdateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:ObjectID(proId)},{
                $set:{
                    name:proDetails.name,
                    catagory:proDetails.catagory,
                    size:proDetails.size,
                    colour:proDetails.colour,
                    brand:proDetails.brand,
                    price:proDetails.price,
                    stock:proDetails.stock
                }
            }).then((response)=>{
                
                resolve(response)
            })
        })

    },
    addToWishlist:(proId,userId,product)=>{
        price = parseInt(product.price)
        let proObj={
            item:ObjectId(proId),
            price:price,
            status:true
        }

        return new Promise(async(resolve,reject)=>{
            let userCartList = await db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:ObjectId(userId)})
            if(userCartList){
                console.log(userCartList);
                let proExist = userCartList.products.findIndex(product=>product.item==proId)
                console.log(proExist);
                if(proExist!=-1){
                    
                    // db.get().collection(collection.CART_COLLECTION)
                    // .updateOne({user:objectId(userId),'products.item':objectId(prodId.proId)},
                    // {
                    //     $inc:{'products.$.quantity':1}
                    
                    // })
                    resolve("error")
                }else{
                    ;
                    db.get().collection(collection.WISHLIST_COLLECTION)
                .updateOne({user:ObjectId(userId)},
                {
                    $push:{products:proObj}
                }).then((response)=>{
                     resolve("success")
                })
               

                }
                
            }
            else{
                let cartObj = {
                    user:ObjectId(userId),
                    products:[proObj]
                }
                db.get().collection(collection.WISHLIST_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getWishlistProduct:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let wishlistitems = await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([
                {
                    $match:{user:ObjectId(userId)}
                },
                {
                    $unwind: '$products'
                },
                {
                    $project:{
                        item:'$products.item'
                    }
                },
                {
                    $lookup:{
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        size:1,
                        product:{$arrayElemAt:['$product',0]}

                    }
                }
                
               
            ]).toArray()
            resolve(wishlistitems)
        })

    },
    removeWishlist:(wId,userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.WISHLIST_COLLECTION).update({user:ObjectId(userId)},{$pull:{products:{item:ObjectId(wId)}}}).then((response)=>{
                resolve(response)
            })
        })
    },
    deleteFromCart:(proId,userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION).updateOne({user:ObjectId(userId)},
            {
                $pull:{products:{item:ObjectId(proId)}}
            }).then((response)=>{
                resolve({removeProduct:true})
            })
        })
    },
     popularProducts:()=>{
        
        return new Promise(async(resolve,reject)=>{
            let popular = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
                {
                    "$limit": 8
                }
            ]).toArray()
            resolve(popular)
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:ObjectId(userId)}
                },
                {
                    $unwind: '$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity',
                        size:"$products.size",
                        
                        
                        
                    }
                },
                {
                    $lookup:{
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        size:1,
                        product:{$arrayElemAt:['$product',0]}

                    }
                }
                
                // {
                //     $lookup:{
                //         from:collection.PRODUCT_COLLECTION,
                //         let:{prodList:'$products'},
                //         pipeline:[
                //             {
                //                 $match:{
                //                     $expr:{
                //                         $in:['$_id',"$$prodList"]
                //                     }
                //                 }
                //             }
                //         ],
                //         as:'cartItems'
                //     }
                // }
            ]).toArray()
            // console.log(cartItems[0].product);
           
            resolve(cartItems)
            
            
        })
    },
    addToCart: (proId, userId) => {
        let proObj = {
          item: ObjectId(proId),
          quantity: 1,
        };
        return new Promise(async (resolve, reject) => {
          let userCart = await db
            .get()
            .collection(collection.CART_COLLECTION)
            .findOne({ user: ObjectId(userId) });
          if (userCart) {
            let proExist = userCart.products.findIndex(
              (product) => product.item == proId
            );
    
            console.log(proExist);
            if (proExist != -1) {
              db.get()
                .collection(collection.CART_COLLECTION)
                .updateOne(
                  { user: ObjectId(userId), "products.item": ObjectId(proId) },
                  {
                    $inc: { "products.$.quantity": 1 },
                  }
                )
                .then(() => {
                  resolve();
                });
            } else {
              db.get()
                .collection(collection.CART_COLLECTION)
                .updateOne(
                  { user: ObjectId(userId) },
                  {
                    $push: { products: proObj },
                  }
                )
                .then((response) => {
                  resolve(response);
                });
            }
          } else {
            console.log("cart");
            let cartobj = {
              user: ObjectId(userId),
              products: [proObj],
            };
            db.get()
              .collection(collection.CART_COLLECTION)
              .insertOne(cartobj)
              .then((response) => {
                resolve(response);
              });
          }
        });
      },
    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
            if(cart){
                count = cart.products.length

            }
            resolve(count)
        })
    },
  
    changeProductQuantity:(details)=>{
        
        details.count = parseInt(details.count)
        details.quantity = parseInt(details.quantity)


        return new Promise((resolve,reject)=>{
            if(details.count ==-1 && details.quantity==1){
                db.get().collection(collection.CART_COLLECTION).updateOne({_id:ObjectId(details.cart)},
                {
                    $pull:{products:{item:ObjectId(details.product)}}
                }
                ).then((response)=>{
                    resolve({removeProduct:true})
                })
            }else{
                
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:ObjectId(details.cart),'products.item':ObjectId(details.product)},
            {
                $inc:{'products.$.quantity':details.count}
            }
            ).then((response)=>{
                
                resolve({status:true})
            })
            }

        })
        },
        getbranddetail:(proname)=>{
            return new Promise(async(resolve,reject)=>{
            let brand = await  db.get().collection(collection.PRODUCT_COLLECTION).find({brand:(proname)}).toArray()
                resolve(brand)
            })
        },
        getCategoryDetails:(proname)=>{
            return new Promise((resolve,reject)=>{
                let category = db.get().collection(collection.PRODUCT_COLLECTION).find({catagory:(proname)}).toArray()
                resolve(category)
            })
        },
        // puma:()=>{
        //     return new Promise((resolve,reject)=>{
        //         db.get().collection(collection.PRODUCT_COLLECTION).find({brand:'Puma'}).toArray().then((response)=>{
                    
        //             resolve(response)
        //         })
        //     })
        // },
        // allensolly:()=>{
        //     return new Promise((resolve,reject)=>{
        //         db.get().collection(collection.PRODUCT_COLLECTION).find({brand:'Allen Solly'}).toArray().then((response)=>{
                    
        //             resolve(response)
        //         })
        //     })
        // }
    
        getSubTotal: (userId, proId) => {
            return new Promise(async (resolve, reject) => {
              let subtotal = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                  $match: {
                    user: ObjectId(userId)
                  }
                },
                {
                  $unwind: '$products'
                },
                {
                  $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                  }
                },
                {
                  $lookup: {
                    from: collection.PRODUCT_COLLECTION,
                    localField: 'item',
                    foreignField: '_id',
                    as: 'products'
        
                  }
                },
                {
                  $match: {
                    item: ObjectId(proId)
                  }
                },
                {
                  $project: {
                    item: 1, quantity: 1, product: { $arrayElemAt: ['$products', 0] }
        
                  }
                },
                {
                  $project: {
                    unitPrice: { $toInt: '$product.price' },
                    quantity: { $toInt: '$quantity' }
                  }
                },
                {
                  $project: {
                    _id: null,
                    subtotal: { $sum: { $multiply: ['$quantity', '$unitPrice'] } }
                  }
                }
              ]).toArray()
        
              console.log(subtotal)
        
              if (subtotal.length > 0) {
                db.get().collection(collection.CART_COLLECTION).updateOne({ user: ObjectId(userId), "products.item": ObjectId(proId) },
                  {
                    $set: {
                      'products.$.subtotal': subtotal[0].subtotal
                    }
                  }).then((response) => {
        
                    resolve(subtotal[0].subtotal)
                    
                  })
              }
              else {
                subtotal = 0
                resolve(subtotal)
              }
            })
          },
    
}
