import express from 'express';
import { 
    registerAccount, 
    loginAccount, 
    fetchAllAccounts,
    fetchAnAccount, 
    updateAccount, 
    deleteAccount, 
    userLogout,
    signUpAdmin,
    signInAdmin,
    adminLogout,
    requestPasswordReset, 
    setNewAccountPassword,
    adminUpdateAccount
} from '../../controllers/auth/authController';
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';
import { 
    verifyGeneralApplicationAuthenticationToken,
} from '../../middleware/auth/auth';
const router = express.Router();
router.post(
    "/register",
    schemaValidator("/auth/register"),
    registerAccount
);
router.post(
    "/login", 
    schemaValidator("/auth/login"),
    verifyGeneralApplicationAuthenticationToken,
    loginAccount
);
router.get(
    "/users",
    verifyGeneralApplicationAuthenticationToken,
    fetchAllAccounts
);
router.get(
    "/single-account/:id",
    verifyGeneralApplicationAuthenticationToken,
    fetchAnAccount
);
router.put(
    "/update-account/:id",
    verifyGeneralApplicationAuthenticationToken,
    updateAccount
);
router.delete(
    "/delete-account/:id",
    verifyGeneralApplicationAuthenticationToken,
    deleteAccount
);
router.post(
    "/password-reset", 
    verifyGeneralApplicationAuthenticationToken,
    requestPasswordReset
);
router.post("/set-new-password/:token",
    verifyGeneralApplicationAuthenticationToken,
    setNewAccountPassword
);
router.post(
    "/logout", 
    verifyGeneralApplicationAuthenticationToken,
    userLogout
);
router.post(
    "/admin/signup",
    schemaValidator("/auth/admin/signup"),
    signUpAdmin
);
router.post(
    "/admin/signin",
    schemaValidator("auth/admin/signin"),
    signInAdmin
);
router.post(
    '/admin/logout',
    adminLogout // Test this API endpoint before marking it as DONE.
);
router.put('/admin/update-account',
    adminUpdateAccount // Test this API endpoint before marking it as DONE.
);
export default router;
