var db = require('../cofig/connection')
var collection = require('../cofig/collections')
const bcrypt = require('bcrypt')
const { response } = require('../app')
var { ObjectId } = require('mongodb')
const { reject, resolve } = require('promise')
const { USER_COLLECTION } = require('../cofig/collections')

module.exports = {
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ Email: userData.Email, Password: userData.Password })
            if (user) {
                response.user = user
                response.status = true
                resolve(response)

            } else {
                resolve({ status: false })
            }
        })
    },
    viewUsers: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(USER_COLLECTION).find().toArray().then((data) => {
                resolve(data)
            })
        })
    },
    getAllOrders: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).aggregate([{
                $group: {
                    _id: "$_id", orders: { $push: "$$ROOT" }
                }
            },
            {
                $unwind: "$orders"
            },
            {
                $sort: {
                    "orders._id": -1
                }
            }
            ]).toArray().then((response) => {
                console.log("order admin");
                console.log(response);
                resolve(response)
            })

        })
    },
    getAllOrdersinhistory: () => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            resolve(orders)
        })
    },
    changeOrderStatus: (orderId, stat) => {
        return new Promise((resolve, reject) => {
            console.log(stat, "in change");
            if (stat == "Delivered") {
                db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: ObjectId(orderId) }, {
                    $set: {
                        status: stat,
                        Delivered: true
                    }
                }).then(() => {
                    resolve()
                })
            } else if (stat == "Cancelled") {
                db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: ObjectId(orderId) }, {
                    $set: {
                        status: stat,
                        Cancelled: true
                    }
                }).then(() => {
                    resolve()
                })
            } else {
                db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: ObjectId(orderId) }, {
                    $set: {
                        status: stat
                    }
                }).then(() => {
                    resolve()
                })
            }
        })
    },
    getTotalRevenue:()=>{
        return new Promise((resolve,reject)=>{
            let totalRevenue = db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $group:{
                        _id:null,
                        total: {$sum:'$totalAmount'}
                    }
                }
            ]).toArray()
            resolve(totalRevenue)

        })
    },
    getAllUsers:()=>{
        return new Promise((resolve,reject)=>{
            let allusers = db.get().collection(collection.USER_COLLECTION).find().count()
            resolve(allusers)
        })
    },
    getAllAvailableProducts:()=>{
        return new Promise((resolve,reject)=>{
            let products = db.get().collection(collection.PRODUCT_COLLECTION).find().count()
            resolve(products)
        })
    },
    totalOrderCount:()=>{
        return new Promise((resolve,reject)=>{
            let totalCount = db.get().collection(collection.ORDER_COLLECTION).find().count()
            resolve(totalCount)
        })
    },
    recentOrders:()=>{
        return new Promise((resolve,reject)=>{
            let orders = db.get().collection(collection.ORDER_COLLECTION).find().limit(10).toArray()
            resolve(orders)
        })
    }



}