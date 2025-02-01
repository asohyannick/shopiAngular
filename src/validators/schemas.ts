import Joi, {  ObjectSchema } from "@hapi/joi";
import { IBlogType } from "../types/blogType/blogType";
import { Types } from "mongoose";
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
    })).optional(),    // Optional, in case there are no reviews initially
    creator: Joi.string().required(),
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
        .pattern(/^(?:\+\d{1,3})?\d{10}$/, { name: 'phone' }), // Optional phone validation
    date: Joi.date().required().greater('now'), // Ensure the date is in the future
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
  title: Joi.string().required().min(1).max(255).messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title cannot be empty',
    'any.required': 'Title is required',
  }),
  content: Joi.string().required().messages({
    'string.base': 'Content must be a string',
    'string.empty': 'Content cannot be empty',
    'any.required': 'Content is required',
  }),
  author: Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required().messages({
    'any.required': 'Author ID is required',
    'any.invalid': 'Author ID must be a valid ObjectId',
  }),
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


export default {
    "/auth/register": authRegister,
    "/auth/login": authLogin,
    "/auth/admin/signup": adminSignUp,
    "/auth/admin/signin": adminLogin ,
    "/product/create-product": productValidationSchema,
    "/about-me/create-profile": profileSchema,
    "/contact-me/create-contact": contactValidationSchema,
    "/suggestion/create-suggestion": suggestionValidationSchema,
    "/my-blog/create-post": blogSchema
} as { [key: string]: ObjectSchema }
