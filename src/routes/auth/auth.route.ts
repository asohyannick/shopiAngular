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
    adminUpdateAccount,
    googleAuth
} from '../../controllers/auth/authController';
import { 
    gitHubRedirect, 
    githubAuthentication
} from '../../controllers/auth/githubAuth/githubAuth';
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';
import { 
    verifyGeneralApplicationAuthenticationToken,
    verifyGithubAuthToken
} from '../../middleware/auth/auth';
const router = express.Router();

// user routes
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

// admin routes
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
// Third-party Auth route
router.post('/google/auth',
    googleAuth
);
// Github authentication route
router.get('/auth/github',
    gitHubRedirect
);
router.get('/auth/github/callback',
    verifyGithubAuthToken,
    githubAuthentication
);
export default router;
