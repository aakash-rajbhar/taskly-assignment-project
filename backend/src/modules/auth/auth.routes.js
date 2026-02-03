import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "./auth.model.js";

const router = express.Router();

// Validation schemas
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

router.post("/signup", async (req, res, next) => {
  try {
    // Validate input
    const validatedData = signupSchema.parse(req.body);
    const { name, email, password } = validatedData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashed });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.errors[0].message });
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.errors[0].message });
    }
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out" });
});


export default router;
