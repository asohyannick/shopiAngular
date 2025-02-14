import { Request, Response  } from "express";
import StatusCodes from 'http-status-codes';
import Order from "../../models/order/order.model";
import { io } from "../../index";
import OrderHistory from "../../models/order/orderHistory.model";


const createOrder = async(req:Request, res:Response): Promise<Response> => {
  const { 
    userId,
    products,
    status,
    trackingNumber
  } = req.body;
  try {
    const createOrder = new Order({
      userId,
      products,
      status,
      trackingNumber
    });
    await createOrder.save();
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Order has been created successfully", 
      createOrder
    });
  } catch(error) {
  console.error("Error occurred while creating an order", error);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const createOrderHistory = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
    const {
      status,
      notes, 
      changedBy, 
      changeReason, 
      previousStatus 
} = req.body;
  try {
    // Check if the associated user exists
    const order = await Order.findById(id);
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "Order not found"});
    }
    // Create a new order history record
    const newHistory = new OrderHistory({
        orderId: order._id,
        status,
        notes,
        changedBy, // User who made the change
        changeReason, // Reason for the change 
        previousStatus // Previous status before the change
    });
    await newHistory.save();
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Order history has been created successfully.", 
      newHistory
    });
  } catch (error) {
    console.error("Error occurred while creating an order", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const fetchAllOrderHistories = async(req:Request, res:Response): Promise<Response> => {
    const { id } = req.params;
  try {
    // Fetch all histories for the given order
    const histories = await OrderHistory.find({orderId: id});
    return res.status(StatusCodes.OK).json({
        message: "All order histories have been successfully fetched from the database.",
        histories
    });
  } catch (error) {
    console.error("Error occurred while fetching all order history an order", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const updateOrderHistory = async(req:Request, res:Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const orderUpdated = await OrderHistory.findByIdAndUpdate(id, req.body, {new: true});
    if (!orderUpdated) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Order not found"})
    }
    // Emit event to notify the client about the status update 
    io.emit('orderUpdated', {orderId: orderUpdated.orderId});
    return res.status(StatusCodes.OK).json({
      message: "Order status has been updated successfully.", 
      orderUpdated
    })
  } catch (error) {
    console.error("Error occurred while updating an order", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const orderHistoryDetails = async(req:Request, res:Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const orderDetails = await Order.findById(id).populate('products.productId');
    if (!orderDetails) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Order not found"})
    }
    // Emit an event to notify the client about the order fetch
    io.emit('orderUpdated', {orderId: orderDetails._id});
    return res.status(StatusCodes.OK).json({
      message: "Order details has been fetched successfully.", 
      orderDetails
    })
  } catch (error) {
    console.error("Error occurred while fetching the details of an  order", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const fetchUserOrder = async(req:Request, res:Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const orders = await Order.find({userId: id}).populate("products.productId");
    if (!orders) {
      return res.status(StatusCodes.BAD_REQUEST).json({message: "User's order hsitory does not exist"});
    }
    return res.status(StatusCodes.OK).json({
      message: "User's order history has been fetched successfully.",
      orders
    });
  } catch (error) {
    console.error("Error occurred while fetch a user with the associated  order", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const cancelAnOrder = async(req:Request, res:Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Order not found "});
    }
    // Check if an order can be cancel since pending means it  can be cancel
    if (order.status !== 'pending') {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Order cannot be canceled"});
    }
    order.status = 'cancelled';
    await order.save();
    // Emit event to notify the client about the cancellation
    io.emit('orderCancelled', {orderId: order._id, status: 'canceled'});
    return res.status(StatusCodes.OK).json({message: "Order history has been cancelled successfully.", order});
  } catch (error) {
    console.error("Error occurred while updating an order", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const orderHistory = async(req:Request, res:Response): Promise<Response> => {
  const {id} = req.params;
  try {
    const orderHistory = await OrderHistory.findById(id);
    if (!orderHistory) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "Order not found"});
    }
    return res.status(StatusCodes.OK).json({
      message: "Order history has been fetched successfully.", 
      orderHistory
    });
  } catch (error) {
    console.error("Error occurred while fetching an order", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const deleteOrderHistory = async(req:Request, res:Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const historyRecord = await OrderHistory.findByIdAndDelete(id);
    if (!historyRecord) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "Order history not found."});
    }
    return res.status(StatusCodes.OK).json({
      message: "Order history has been deleted successfully.", 
      historyRecord
    });
  } catch (error) {
    console.error("Error occurred while deleting an order", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

// Fetch past orders for a user
const pastOrder = async(req:Request, res:Response):Promise<Response> => {
const { id } = req.params;
try {
  const orders = await Order.findById(id).populate('products.productId');
  if (!orders) {
    return res.status(StatusCodes.NOT_FOUND).json({message: "No past orders found."});
  }
  return res.status(StatusCodes.OK).json({
    message: "Past order histories have been fetched successfully", 
    orders
  });
} catch (error) {
  console.error("Error occurred while fetching past order", error);
 return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
}

}


export {
  createOrder,
  createOrderHistory,
  fetchAllOrderHistories,
  updateOrderHistory,
  orderHistoryDetails,
  fetchUserOrder,
  cancelAnOrder,
  orderHistory,
  deleteOrderHistory,
  pastOrder
}
