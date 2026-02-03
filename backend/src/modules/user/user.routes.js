import express from "express";
import { z } from "zod";
import User from "../auth/auth.model.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Validation schema for profile update
const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long").optional(),
  email: z.string().email("Invalid email format").optional()
}).refine(data => data.name || data.email, {
  message: "At least one field (name or email) must be provided"
});

router.get("/", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put("/", protect, async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    
    // Check if email is being changed and if it's already taken
    if (validatedData.email) {
      const existingUser = await User.findOne({ 
        email: validatedData.email,
        _id: { $ne: req.user.id }
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      validatedData,
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.errors[0].message });
    }
    next(err);
  }
});

export default router;
