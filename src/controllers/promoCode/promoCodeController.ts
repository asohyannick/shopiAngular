import { Request, Response } from "express";
import generateRandomPromoCode from "../../utils/generatePromoCode/generateRandomPromoCode";
import PromoCode from '../../models/promoCode/promoCode.model';
import { StatusCodes } from "http-status-codes";

const requestPromoCode = async(req: Request, res: Response): Promise<Response> => {
const {
    discountType, 
    discountValue, 
    expirationDate,
    userId
} = req.body;
try {
    const code = generateRandomPromoCode() // Generate a random promo code
    const promoCode = new PromoCode({
        code,
        discountType,
        discountValue,
        expirationDate,
        requestedBy: userId || undefined, // set user Id only if it is provided
    });
    await promoCode.save();
    return res.status(StatusCodes.CREATED).json({message: "Promo code requested successfully", promoCode});
} catch (error) {
    console.error("Error occurred while requesting  PROMO CODE", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
}
}

const applyPromoCode = async(req: Request, res:Response): Promise<Response> => {
    const { code, cartTotal} = req.body;
 try {
    const promoCode = await PromoCode.findOne({code, isActive: true});
    if (!promoCode) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "   Promo code not found or invalid"});
    };
    // Check if promo code has expired
    if (promoCode.expirationDate && promoCode.expirationDate < new Date()) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Promo code has expired"});
    }
    let discount:number = 0;
    if (promoCode.discountType === 'percentage') {
       discount = (cartTotal * promoCode.discountValue) / 100;
    } else if (promoCode.discountType === 'fixed') {
        discount = promoCode.discountValue;
    }
    const newTotal = cartTotal - discount;
    return res.status(StatusCodes.OK).json({message: "Promo code applied", discount, newTotal })
 } catch (error) {
    console.error("Error occurred while applying PROMO CODE", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });  
 }
}
export {
    requestPromoCode,
    applyPromoCode
}
