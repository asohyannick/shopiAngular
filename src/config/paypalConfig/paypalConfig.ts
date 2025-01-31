import paypal from 'paypal-rest-sdk';
paypal.configure({
    mode: 'sandbox',
    client_id:process.env.PAYPAL_CLIENT_ID as string,
    client_secret: process.env.PAYPAL_API_SECRET as string,
});

export default paypal;

