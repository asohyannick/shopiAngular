const generateRandomPromoCode = (length: number = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let results = '';
    for(let i:number = 0; i < length; i++ ) {
       results += chars.charAt(Math.random() * chars.length)
    }
    return results;
}

export default generateRandomPromoCode;

