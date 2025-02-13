import Joi, {  ObjectSchema } from "@hapi/joi";
import { IBlogType } from "../types/blogType/blogType";
import { Types } from "mongoose";
import { IShoppingType } from "../types/shippingType/shippingType";
import { ITestimonailStatus } from '../types/testimonialType/testimonialType';
import { ICustomerType } from "../types/customerType/customerType";
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
    imageURLs: Joi.array().items(Joi.string().uri()).optional(),
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
    })).optional(),    // Optional, in case there are no reviews initially
    producers: Joi.array().items(Joi.string()).required(),
});


const profileSchema = Joi.object({
    fullName: Joi.string().min(3).max(100).required(),
    title: Joi.string().min(3).max(50).required(),
    summary: Joi.string().min(10).max(500).required(),
    skills: Joi.array().items(Joi.string()).min(1).required(),
    experience: Joi.array().items(Joi.object({
        company: Joi.string().min(2).max(100).required(),
        position: Joi.string().min(2).max(50).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().allow(null), // Allow null for current positions
        description: Joi.string().max(500).required(),
    })).optional(),
    education: Joi.array().items(Joi.object({
        institution: Joi.string().min(2).max(100).required(),
        degree: Joi.string().min(2).max(50).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
    })).optional(),
    projects: Joi.array().items(Joi.object({
        title: Joi.string().min(2).max(100).required(),
        description: Joi.string().max(500).required(),
        link: Joi.string().uri().required(),
    })).optional(),
    contactInfo: Joi.object({
        email: Joi.string().email().required(),
        phone: Joi.string().optional(),
        linkedin: Joi.string().uri().optional(),
    }).required(),
});


const contactValidationSchema = Joi.object({
    name: Joi.string()
        .required()
        .trim(),
    email: Joi.string()
        .email()
        .required()
        .trim()
        .lowercase(),
    phone: Joi.string()
        .optional()
        .pattern(/^(?:\+\d{1,3})?\d{10}$/, { name: 'phone' }) // Optional phone validation
        .message('Phone number must be in the format: +<country code> followed by 10 digits or just 10 digits'),
    date: Joi.date()
        .required()
        .greater('now'), // Ensure the date is in the future
    subject: Joi.string()
        .required()
        .trim(),
    message: Joi.string()
        .required()
        .trim()
        .min(10),
});


const suggestionValidationSchema = Joi.object({
    name: Joi.string()
        .required()
        .trim(),
    email: Joi.string()
        .email()
        .required()
        .trim()
        .lowercase(),
    suggestion: Joi.string()
        .required()
        .trim()
        .min(10) // Minimum length for the suggestion
        .messages({
            'string.min': 'Suggestion must be at least 10 characters long.',
        }),
    date: Joi.date().required().greater('now'),
    status: Joi.string()
        .valid('pending', 'reviewed', 'implemented')
        .default('pending'), // Optional: Default status if not provided
});

const blogSchema = Joi.object<IBlogType>({
  title: Joi.string().optional().min(1).max(255).messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title cannot be empty',
    'any.required': 'Title is required',
  }),
  content: Joi.string().optional().messages({
    'string.base': 'Content must be a string',
    'string.empty': 'Content cannot be empty',
    'any.required': 'Content is required',
  }),
  author: Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).optional().messages({
    'any.required': 'Author ID is required',
    'any.invalid': 'Author ID must be a valid ObjectId',
  }),
  email: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Tags must be an array of strings',
  }),
  date: Joi.date().optional().messages({
    'date.base': 'Date must be a valid date',
  }),
  imageURLs: Joi.array().items(Joi.string().uri()).optional().messages({
    'array.base': 'Image URLs must be an array of strings',
    'string.uri': 'Each image URL must be a valid URI',
  }),
  excerpt: Joi.string().optional().max(500).messages({
    'string.base': 'Excerpt must be a string',
    'string.max': 'Excerpt cannot exceed 500 characters',
  }),
  published: Joi.string().valid('true', 'false').optional().messages({
    'any.only': 'Published status must be either "true" or "false"',
  }),
});

const feedbackSchema = Joi.object({
    userId: Joi.string()
        .custom((value, helpers) => {
            if (!Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
    firstName: Joi.string()
        .min(1)
        .max(50)
        .required(),
    lastName: Joi.string()
        .min(1)
        .max(50)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    feature: Joi.string()
        .min(1)
        .max(100)
        .required(),
    date: Joi.date()
        .required(),
    usabilityRating: Joi.string()
        .valid('1', '2', '3', '4', '5')
        .required(), // Assuming ratings are 1-5 as strings
    message: Joi.string()
        .max(500)
        .allow('', null), // Allow empty messages if needed
});

const shoppingTypeSchema = Joi.object<IShoppingType>({
    name: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.base': 'Name must be a string',
            'string.min': 'Name must be at least 1 character long',
            'string.max': 'Name must be at most 100 characters long',
            'any.required': 'Name is required',
        }),
    cost: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Cost must be a number',
            'number.positive': 'Cost must be a positive number',
            'any.required': 'Cost is required',
        }),
    estimatedDeliveryTime: Joi.string()
        .min(1)
        .max(50)
        .required()
        .messages({
            'string.base': 'Estimated delivery time must be a string',
            'string.min': 'Estimated delivery time must be at least 1 character long',
            'string.max': 'Estimated delivery time must be at most 50 characters long',
            'any.required': 'Estimated delivery time is required',
        }),
    carrier: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.base': 'Carrier must be a string',
            'string.min': 'Carrier must be at least 1 character long',
            'string.max': 'Carrier must be at most 100 characters long',
            'any.required': 'Carrier is required',
        }),
    trackingAvailable: Joi.boolean()
        .required()
        .messages({
            'boolean.base': 'Tracking available must be a boolean',
            'any.required': 'Tracking availability is required',
        }),
    international: Joi.boolean()
        .required()
        .messages({
            'boolean.base': 'International availability must be a boolean',
            'any.required': 'International availability is required',
        }),
    maxWeightLimit: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Max weight limit must be a number',
            'number.positive': 'Max weight limit must be a positive number',
            'any.required': 'Max weight limit is required',
        }),
    date: Joi.date()
        .required()
        .messages({
            'date.base': 'Date must be a valid date',
            'any.required': 'Date is required',
        }),
    dimensions: Joi.required().messages({
        'object.base': 'Dimensions must be an object',
        'any.required': 'Dimensions are required',
    }),
});

const testimonialValidationSchema = Joi.object({
    userId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    profileImage: Joi.string().uri().required(),
    name: Joi.string().min(1).max(100).required(),
    title: Joi.string().min(1).max(100).required(),
    message: Joi.string().min(1).required(),
    status: Joi.string().valid(...Object.values(ITestimonailStatus)).required(),
    continent: Joi.string().valid('Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'Antarctica').required(),
    date: Joi.date().required(),
    rating: Joi.number().min(1).max(5).required()
});

const customerValidationSchema = Joi.object<ICustomerType>({
    userId: Joi.string().optional(), // Assuming userId is a string representation of ObjectId
    firstName: Joi.string().required().trim(),
    lastName: Joi.string().required().trim(),
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().required().min(6), // Minimum password length
    phoneNumber: Joi.number().required().integer().min(1000000000).max(9999999999) // Assuming a 10-digit phone number
        .message('Phone number must be a 10-digit number'),
    country: Joi.string().optional().trim(),
    address: Joi.string().required().trim(),
    dateOfBirth: Joi.date().required().greater('1-1-1900'), // Ensure a realistic date
    message: Joi.string().optional().trim().min(10),
    subject: Joi.string().optional().trim(),
});



export default {
    "/auth/register": authRegister,
    "/auth/login": authLogin,
    "/auth/admin/signup": adminSignUp,
    "/auth/admin/signin": adminLogin ,
    "/product/create-product": productValidationSchema,
    "/about-me/create-profile": profileSchema,
    "/contact-me/create-contact": contactValidationSchema,
    "/suggestion/create-suggestion": suggestionValidationSchema,
    "/my-blog/create-post": blogSchema,
    "/feedback/create-feedback": feedbackSchema,
    "/shipping/create-shipping": shoppingTypeSchema,
    "/testimonial/create-testimonial": testimonialValidationSchema,
    "/customer/create-customer": customerValidationSchema,
} as { [key: string]: ObjectSchema }
