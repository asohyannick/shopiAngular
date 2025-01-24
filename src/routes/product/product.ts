import  express, { Request, Response, NextFunction } from 'express';
import { 
    verifyAdminExist, 
    verifySuperAdminToken,
    verifyGeneralApplicationAuthenticationToken,
} from '../../middleware/auth/auth';
import { 
    createProduct, 
    fetchAllProducts, 
    fetchProduct, 
    updateProduct, 
    deleteProduct, 
    searchProducts 
} from 
"../../controllers/product/productController";
const router = express.Router();

router.post('/create-product',
    verifySuperAdminToken, // Verify the admin token first
    verifyAdminExist, // Then check if the current user is an admin
    createProduct
);

router.get('/fetch-all-products', 
    verifySuperAdminToken, // Verify the admin token first
    verifyAdminExist, // Then check if the current user is an admin
    fetchAllProducts
);


router.get('/fetch-product/:id', 
    verifySuperAdminToken,  // Verify the admin token first
    verifyAdminExist,  // Then check if the current user is an admin
    fetchProduct
)


router.put('/update-product/:id', 
    verifySuperAdminToken,  // Verify the admin token first
    verifyAdminExist,  // Then check if the current user is an admin
    updateProduct
);


router.delete('/delete-product/:id', 
    verifySuperAdminToken,  // Verify the admin token first
    verifyAdminExist,  // Then check if the current user is an admin
    deleteProduct
);

router.get('/search-products',
    verifyGeneralApplicationAuthenticationToken,  // Check if user is authenticated 
    (req:Request, res:Response, next:NextFunction) => {
     if (req.user  && req.user.isAdmin) {
        // If the user is and admin, skip the next two middleware
        return next();
     }
     // If not an admin, continue to check for other conditions 
     return verifySuperAdminToken(req, res, next);
    }, 
    verifyAdminExist,
    searchProducts
);
export default router;
