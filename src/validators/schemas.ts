import Joi, { ObjectSchema } from "@hapi/joi";
const PASSWORD_REGEX = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);

const authRegister = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
});


const authLogin = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const adminSignUp = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
});


const adminLogin = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
// Define the Joi validation schema for a product
const productValidationSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    quantity: Joi.number().integer().min(0).required(),
    price: Joi.number().positive().required(),
    country: Joi.string().required(),
    category: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(), // Assuming a rating scale of 0 to 5
    posted_Date: Joi.date().required(),
    brand: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()).default([
        "https://cdn.mos.cms.futurecdn.net/Ajc3ezCTN4FGz2vF4LpQn9-1200-80.jpg"
    ]),
    specifications: Joi.string().required(),
    duration: Joi.number().integer().min(0).required(),
    isFeatured: Joi.boolean().required(),
    discount: Joi.number().positive().required(),
    stockStatus: Joi.string().required(),
    dimensions: Joi.object({
        height: Joi.number().positive().required(),
        width: Joi.number().positive().required(),
        depth: Joi.number().positive().required(),
    }).required(),
    warrantyPeriod: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
    customerReviews: Joi.array().items(Joi.object({
        _id: Joi.string().optional(), // Assuming _id is generated automatically
        username: Joi.string().required(),
        reviewText: Joi.string().required(),
        rating: Joi.number().min(0).max(5).required(), // Assuming a rating scale of 0 to 5
        reviewDate: Joi.date().required(),
    })).optional(), // Optional, in case there are no reviews initially
});



export default {
    "/auth/register": authRegister,
    "/auth/login": authLogin,
    "/auth/admin/signup": adminSignUp,
    "/auth/admin/signin": adminLogin ,
    "/product/create-product": productValidationSchema,
} as { [key: string]: ObjectSchema }
