import express from 'express';
import { getAllUsers, deleteUser, dashboardStats} from "../controllers/adminController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/users", isAuthenticated, authorizeRoles("admin"), getAllUsers);

router.delete("/delete/:id", isAuthenticated, authorizeRoles("admin"), deleteUser);

router.get("/fetch/dashboard-stats", isAuthenticated, authorizeRoles("admin"), dashboardStats);

export default router;