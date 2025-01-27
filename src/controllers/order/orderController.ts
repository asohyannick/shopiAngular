import { Request, Response  } from "express";
import StatusCodes from 'http-status-codes';
import Order from "../../models/order/order.model";
import { io } from "../../index";
import OrderHistory from "../../models/order/orderHistory.model";

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
    return res.status(StatusCodes.CREATED).json({message: "Order history has been created successfully.", newHistory});
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
    const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Order not found"})
    }
    order.status = status;
    await order.save();
    // Emit event to notify the client about the status update 
    io.emit('orderUpdated', {orderId: order._id, status});
    return res.status(StatusCodes.OK).json({message: "Order status has been updated successfully.", order})
  } catch (error) {
    console.error("Error occurred while updating an order", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const orderHistoryDetails = async(req:Request, res:Response): Promise<Response> => {
  try {
    const order = await Order.findById(req.params.id).populate('products.productId');
    if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Order not found"})
    }
    // Emit an event to notify the client about the order fetch
    io.emit('orderUpdated', {orderId: order._id});
    return res.status(StatusCodes.OK).json({message: "Order details has been fetched successfully.", order})
  } catch (error) {
    console.error("Error occurred while fetching the details of an  order", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const fetchUserOrders = async(req:Request, res:Response): Promise<Response> => {
    const {userId} = req.body;
  try {
    const orders = await Order.find({ userId }).populate("Products.productId");
    return res.status(StatusCodes.OK).json({message: "Order history has been fetched successfully.", orders});
  } catch (error) {
    console.error("Error occurred while fetch a user with the associated  order", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const cancelAnOrder = async(req:Request, res:Response): Promise<Response> => {
    const {id} = req.params;
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
    const order = await Order.findById(id);
    if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Order not found"});
    }
    const orderHistory = await OrderHistory.find({orderId: order._id});
    return res.status(StatusCodes.OK).json({orderHistory});
  } catch (error) {
    console.error("Error occurred while fetching an order", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

const deleteOrderHistory = async(req:Request, res:Response): Promise<Response> => {
  const { historyId } = req.params;
  try {
    const historyRecord = await OrderHistory.findById(historyId);
    if (!historyRecord) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "Order history not found."});
    }
    await OrderHistory.findByIdAndDelete(historyId);
    return res.status(StatusCodes.OK).json({message: "Order history has been deleted successfully."});
  } catch (error) {
    console.error("Error occurred while deleting an order", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
  }
}

// Fetch past orders for a user
const pastOrder = async(req:Request, res:Response):Promise<Response> => {
const { userId } = req.params;
try {
  const orders = await Order.find({ userId }).populate('products.productId');
  if (!orders.length) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "No past orders found."});
  }
  return res.status(StatusCodes.OK).json({message: "Past order histories have been fetched successfully", orders});
} catch (error) {
  console.error("Error occurred while fetching past order", error);
 return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" }); 
}

}


export {
  createOrderHistory,
  fetchAllOrderHistories,
  updateOrderHistory,
  orderHistoryDetails,
  fetchUserOrders,
  cancelAnOrder,
  orderHistory,
  deleteOrderHistory,
  pastOrder
}
