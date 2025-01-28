import express from "express";
import { verifySuperAdminToken, verifyAdminExist } from "../../middleware/auth/auth";
import { 
    createCustomer,
    customerLogin,
    fetchCustomers, 
    fetchCustomer, 
    updateCustomer, 
    deleteCustomer
} from "../../controllers/customer/customerController";
const router = express.Router();
router.post('/create-customer',
    verifySuperAdminToken,
    verifyAdminExist,
    createCustomer,
);
router.post('/customer-login',
    verifySuperAdminToken,
    verifyAdminExist,
    customerLogin
);
router.get('/fetch-customers',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchCustomers,
);
router.get('/fetch-customer/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchCustomer,
);
router.put('/update-customer/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    updateCustomer,
);
router.delete('/remove-customer/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    deleteCustomer,
);
export default router;
