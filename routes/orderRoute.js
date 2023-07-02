const express = require('express')
const { postOrder, orderList, orderDetails, updateStatus, userOrders, deleteOrder } = require('../controllers/orderController')
const router = express.Router()

router.post('/postOrder',postOrder)
router.get('/orderList',orderList)
router.get('/orderdetails/:id',orderDetails)
router.put('/updatestatus/:id',updateStatus)
router.get('/myorder/:userid',userOrders)
router.delete('/deleteorder/:id',deleteOrder)

module.exports=router