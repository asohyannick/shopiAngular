import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Blog from "../../models/blog/blog.model";
import cloudinary from '../../config/cloudinaryConfig/cloudinaryConfig';
import compressImage from '../../utils/compressedImages/compressImage';
import multer from 'multer';
import Comment from "../../models/comment/comment.model";
interface CloudinaryUploadResponse {
   secure_url: string;
}
// Configure multer
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage }); // Multer setup with memory storage

// Defining the upload images function
const uploadImages = upload.array('imageURLs', 20);
const createBlog = async(req:Request, res:Response): Promise<Response> => {
const {title, content, author, email, tags,  excerpt, published } = req.body;

 if (!req.user || !req.user.isAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not allowed to create a blog post" });
 }

 try {
   const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "No images provided" });
  }
  const uploadedImageURLs: string[] = []; 
for (const file of files) {
    const compressedImage = await compressImage(file.buffer);
    const result = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResponse);
        });
        stream.end(compressedImage); 
    });
   uploadedImageURLs.push(result.secure_url);
}
    const newBlog = new Blog({
      title,
      content,
      email,
      author,
      tags,
      date: Date.now(),
      imageURLs: uploadedImageURLs,
      excerpt,
      published
    });
    await newBlog.save();
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message:"Blog post has been created successfully", 
      newBlog});
 } catch (error) {
    console.error("Error occurred while creating a blog post", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
 
}

const uploadBlogImages = (req: Request, res: Response, next: () => void) => {
    uploadImages(req, res, (err) => {
        console.error("Upload Error:", err);
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Image upload failed", error: err });
        }
        console.log('Uploaded files:', req.files); // Check the uploaded files
        next();
    });
};

const fetchBlogs = async(req:Request, res:Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not allowed to fetch blog posts" });
 }
 try {
    const posts = await Blog.find();
    return res.status(StatusCodes.OK).json({
        message: "Blog posts have been fetched successfully.", 
        post: posts
    })
 } catch (error) {
    console.error("Error occurred while fetching blog posts", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
}

const fetchBlog = async(req:Request, res:Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not allowed to fetch a blog post" });
 }
    const { id } = req.params;
 try {
    const post = await Blog.findById(id);
    if (!post) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Blog post not found"});
    }
    return res.status(StatusCodes.OK).json({message: "Blog post has been fetched successfully", post});
 } catch (error) {
    console.error("Error occurred while fetching a blog post", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
}

const updateBlog = async(req:Request, res:Response): Promise<Response> => {
   if (!req.user || !req.user.isAdmin) {
   return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not allowed to  update a blog post" });
 }
    const { id } = req.params;
 try {
    const post = await Blog.findByIdAndUpdate(id , req.body, {new: true});
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "Blog post not found"});
   }
   return res.status(StatusCodes.OK).json({message: "Blog post has been updated successfully", post});
 } catch (error) {
    console.error("Error occurred while updating a blog post ", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
}

const removeBlog = async(req:Request, res:Response): Promise<Response> => {
    if (!req.user || !req.user.isAdmin) {
     return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not allowed to delete a blog post" });
   }
   const { id } = req.params;
 try {
    const post = await Blog.findByIdAndDelete(id);
    if (!post) {
    return res.status(StatusCodes.NOT_FOUND).json({message: "Blog post not found"});
  }
  return res.status(StatusCodes.OK).json({message: "Blog post has been deleted successfully", post});
 } catch (error) {
   console.error("Error occurred while deleting a blog post", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
}

const subscribe = async(req:Request, res:Response): Promise<Response> => {
   const { email } = req.body;
 try {
   const newSubscription = new Blog({
      email
   });
   await newSubscription.save();
   return res.status(StatusCodes.CREATED).json({
      sucess: true,
      message: "Subscription successful", 
      subscription: newSubscription
   })
 } catch (error) {
   console.error("Error occurred while subscribing to my newsletters", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
 }
}

const createComment = async(req:Request, res:Response): Promise<Response> => {
 const { postId, userId, content  } = req.body;
  try {
   const newComment = new Comment({
     postId,
     userId,
     content
   });
   await newComment.save();
   return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Comment has been created successfully", 
      newComment
   });
  } catch (error) {
   console.error("Error occurred while creating a comment", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

const fetchComments = async(req:Request, res:Response): Promise<Response> => {
  try {
   const comments = await Comment.find();
   return res.status(StatusCodes.OK).json({message: "Comments have been fetched successfully", comments}) 
  } catch (error) {
   console.error("Error occurred while fetching  comments", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

const fetchComment = async(req:Request, res:Response): Promise<Response> => {
   const { id } = req.params;
  try {
   const comment = await Comment.findById(id);
   if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "Comment doesn't exist", comment});
   }
   return res.status(StatusCodes.OK).json({message: "Comment have been fetched successfully", comment}) 
  } catch (error) {
   console.error("Error occurred while fetching  comments", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

const updateComment = async(req:Request, res:Response): Promise<Response> => {
   const { id } = req.params;
  try {
   const comment = await Comment.findByIdAndUpdate(id, req.body, {new: true});
   if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "Comment not found"});
   }
   return res.status(StatusCodes.OK).json({message: "Comment has been updated successfully", comment});
  } catch (error) {
   console.error("Error occurred while updating  comment", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}

const removeComment = async(req:Request, res:Response): Promise<Response> => {
   const { id } = req.params;
  try {
   const comment = await Comment.findByIdAndDelete(id);
   if (!comment) {
   return res.status(StatusCodes.NOT_FOUND).json({message: "Comment not found"}); 
  }
   return res.status(StatusCodes.OK).json({message: "Comment has been deleted successfully", comment}) 
  } catch (error) {
   console.error("Error occurred while removing  comment", error);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
}


export {
   createBlog,
   uploadBlogImages,
   fetchBlogs,
   fetchBlog,
   updateBlog,
   removeBlog,
   subscribe,
   createComment,
   fetchComments,
   fetchComment,
   updateComment,
   removeComment
}
