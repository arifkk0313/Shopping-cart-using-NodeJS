var db = require('../cofig/connection')
var collection = require('../cofig/collections')
const bcrypt = require('bcrypt')
const { response } = require('../app')
const { reject, resolve } = require('promise')
var objectId = require('mongodb').ObjectId;
var Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id: 'rzp_test_QUphNk6TmauwWA',
    key_secret: 'FPSZE5CbH0rgvRcoOD2nRfhd',
});


module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertedId)
            })

        })

    },
    doLogin: (userData) => {

        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("succes");
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("faled");
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("login failed");
                resolve({ status: false })
            }
        })
    },

    getProfile: (userId) => {
        return new Promise(async (resolve, reject) => {
            let profile = await db.get().collection(collection.USER_COLLECTION).
                find({ _id: objectId(userId) })
                .toArray();
            resolve(profile)

        })
    },
    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity',
                        size: "$products.size",



                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        size: 1,
                        product: { $arrayElemAt: ['$product', 0] }

                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', { $toInt: '$product.price' }] } }
                    },


                }


            ]).toArray()
            if (total.length == 0) {
                resolve()
            } else {
                resolve(total[0].total)
            }
            // console.log(cartItems[0].product);
            //    console.log(total[0].total);



        })
    },
    getSubTotal: (userId, proId) => {
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity',
                        size: "$products.size",



                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        size: 1,
                        product: { $arrayElemAt: ['$product', 0] }

                    }
                },
                {
                    $project: {
                        _id: null,
                        sub: { $sum: { $multiply: ['$quantity', { $toInt: '$product.price' }] } }
                    },


                }


            ]).toArray()
            // console.log(cartItems[0].product);
            console.log(total[0].sub);
            resolve(total[0].sub)


        })
    },
    placeOrder: (order, products, total) => {
        return new Promise((resolve, reject) => {
            console.log(order, products, total);
            // let status = order['payment-method'] === 'COD' ? 'placed' : 'pending'
            let orderObj = {
                deliveryDetails: {
                    name: order.name,
                    building: order.building,
                    mobile: order.mobile,
                    
                    address: order.address,
                    pincode: order.pincode,

                },
                userId: objectId(order.userId),
                paymentMethod: order['payment-method'],
                products: products,
                totalAmount: total,
                status: 'pending',
                date: new Date()

            }

            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
                db.get().collection(collection.CART_COLLECTION).deleteOne({ user: objectId(order.userId) })
                resolve(response.insertedId)
            })
        })



    },
    getCartProductList: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (cart.products) {
                resolve(cart.products)
            }
            else {
                resolve(cart)
            }
        })

    },
    getUserOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({ userId: objectId(userId) }).
                toArray()
            // console.log(orders);
            resolve(orders)
        })

    },
    getOrderProducts: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match: { _id: objectId(orderId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity',
                        size: "$products.size",



                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        size: 1,
                        product: { $arrayElemAt: ['$product', 0] }

                    }
                }
            ]).toArray()
            // console.log(orderItems);
            resolve(orderItems)
        })
    },
    generateRazorpay: (orderId, total) => {

        console.log(orderId);
        return new Promise((resolve, reject) => {
            var options = {
                amount: total * 100,
                currency: "INR",
                receipt: orderId.toString(),

            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("new order: " + order);
                    console.log(order);
                    resolve(order)
                }
            })


        })
    },
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', 'FPSZE5CbH0rgvRcoOD2nRfhd')
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
            hmac = hmac.digest('hex')
            if (hmac == details['payment[razorpay_signature]']) {
                resolve()
            } else {
                reject()
            }
        })

    },
    changePaymentStatus: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.ORDER_COLLECTION)
                .updateOne(
                    { _id: objectId(orderId) },
                    {
                        $set: {
                            status: "pending",
                        },
                    }
                )
                .then(() => {
                    resolve();
                })
                .catch((response) => {
                    reject();
                });
        });
    },
    getProfileEdit: (userid) => {
        return new Promise((resolve, reject) => {
            let details = db.get().collection(collection.USER_COLLECTION).find({ _id: objectId(userid) }).toArray();
            resolve(details)
        })

    },
    setEditProfile: (userid, profiledata) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userid) },
                {
                    $set: {
                        Name: profiledata.Name,
                        Lastname: profiledata.Lastname,
                        Email: profiledata.Email,
                        Mobile: profiledata.Mobile,
                    },
                }
            ).then((response) => {
                resolve()
            })
        })
    },
    changepassword: (detail, userid) => {
        console.log("change password step 2")
        return new Promise(async (resolve, reject) => {
            let user = await db
                .get()
                .collection(collection.USER_COLLECTION)
                .findOne({ _id: objectId(userid) });
            console.log(user)
            if (user) {
                console.log("user exists")
                bcrypt
                    .compare(detail.CurrentPassword, user.Password)
                    .then(async (status) => {
                        console.log(status);
                        if (status) {
                            detail.password = await bcrypt.hash(detail.NewPassword, 10);

                            db.get()
                                .collection(collection.USER_COLLECTION)
                                .updateOne(
                                    { _id: objectId(userid) },
                                    {
                                        $set: {
                                            Password: detail.password,
                                        },
                                    }
                                );
                            resolve(true);
                        } else {

                            console.log("entered password is wrong")
                            resolve(false);

                            console.log("failed");
                        }
                    });
            } else {
                console.log("no user");
            }
        });
    },
    checkUsernumberLogin: (userdata) => {
       
        return new Promise(async (resolve, reject) => {
            console.log(userdata);
            let exists = false;
            let user = await db
              .get()
              .collection(collection.USER_COLLECTION)
              .findOne({ Mobile: userdata });
      
            if (user) {
              exists = true;
            }    
            resolve(exists);
          });
        },
    otpLogin: (phno) => {
        return new Promise(async (resolve, reject) => {
          let user = await db
            .get()
            .collection(collection.USER_COLLECTION)
            .findOne({ Mobile: phno });
    
          resolve(user);
        });
      },
      orderCancel:(orderId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},
            {
                $set:{
                    status:'cancelled'
                }
            }).then((response)=>{
                resolve()
            })
    })
},


}