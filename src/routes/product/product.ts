import express from 'express';
import { verifyAdminExist, verifySuperAdminToken} from '../../middleware/auth/auth';
import { createProduct, fetchAllProducts, fetchProduct, updateProduct, deleteProduct } from 
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

export default router;
