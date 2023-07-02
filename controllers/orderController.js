const OrderItem = require('../models/order-item')
const Order = require('../models/orderModel')

//to post order
exports.postOrder = async (req,res)=>{
    const orderItemIds = Promise.all(req.body.orderItems.map(async(orderItem)=>{
        let newOrderItem = new OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })
        newOrderItem = await newOrderItem.save()
        return newOrderItem._id
    }))
    const orderItemIdResolved = await orderItemIds
    // to calculate total price 
    const total_price = await Promise.all(orderItemIdResolved.map(async(orderId)=>{
        const itemOrder = await OrderItem.findById(orderId).populate('product','product_price')
        const total = itemOrder.quantity*itemOrder.product.product_price
        return total
    }))
    const totalPrice = total_price.reduce((a,b)=>a+b,0)

    let order = new Order({
        orderItems:orderItemIdResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        totalPrice:totalPrice,
        user:req.body.user
    })
    order=await order.save()
    if(!order){
        return res.status(400).json({error:'something went wrong'})
    }
    res.send(order)
}

//to get all order
exports.orderList = async(req,res)=>{
    const order = await Order.find().populate('user','name').sort({dateOrdered:-1})
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)
}

// Order details
exports.orderDetails = async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId)
        .populate('user', 'name')
        .populate({ path: 'orderItems', populate: 'product' });
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
//update status
exports.updateStatus=async(req,res)=>{
    const order = await Order.findByIdAndUpdate(req.params.id,{
        status:req.body.status
    },{
        new:true
    })
    if(!order){
        return res.status(400).json({error:'something went wrong'})
    }
    res.send(order)
}
  
// User orders
exports.userOrders = async (req, res) => {
    try {
      const userOrders = await Order.find({ user: req.params.userid })
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } });
  
      if (userOrders.length === 0) {
        return res.status(404).json({ error: 'No orders found for the user' });
      }
  
      res.json(userOrders);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

//delete order
exports.deleteOrder=(req,res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order){
            await order.orderItems.map(async orderItem=>{
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.json({message:'order has been deleted'})
        }
        else{
            return res.status(400).json({error:'failed to delete order'})
        }
    })
    .catch(err=>{
        return res.status(400).json({error:err})
    })
}