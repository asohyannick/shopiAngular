import express from 'express';
import { 
    registerAccount, 
    loginAccount, 
    fetchAllAccounts,
    fetchAnAccount, 
    updateAccount, 
    logOutUserFromHisOrHerAccount,
    signUpAdmin,
    signInAdmin,
    deleteAccount, 
    requestPasswordReset, 
    setNewAccountPassword,
} from '../../controllers/auth/user';
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';
import { 
    verifyGeneralApplicationAuthenticationToken
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
    logOutUserFromHisOrHerAccount
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
export default router;
