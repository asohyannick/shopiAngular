import PromoCode from '../../models/promoCode/promoCode.model';
const applyPromoCodeHelperFunction = async( code: string, cartTotal: number) => {
const promoCode = await PromoCode.findOne({ code, isActive: true });
if (!promoCode) {
    return {success: false, message: "Invalid promo code"};
};
if (promoCode.expirationDate && promoCode.expirationDate < new Date()) {
    return {success: false, message: "Promo code has expired"};
}
let discount: number = 0;
if (promoCode.discountType === 'percentage') {
    discount = (cartTotal * promoCode.discountValue) / 100;
} else if(promoCode.discountType === 'fixed') {
    discount = promoCode.discountValue;
}
const newTotal = cartTotal  - discount;
return { success: true, discount, newTotal };
}

export default applyPromoCodeHelperFunction;

