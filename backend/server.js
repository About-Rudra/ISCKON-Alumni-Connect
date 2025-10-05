import dotenv from "dotenv";
   dotenv.config();

   // Debug env vars
   console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
   console.log('Razorpay Key Secret:', process.env.RAZORPAY_KEY_SECRET);

   import express from "express";
   import cors from "cors";
   import fileUpload from "express-fileupload";

   import authRoutes from "./src/routes/authRoutes.js";
   import userRoutes from "./src/routes/userRoutes.js";
   import schoolRoutes from "./src/routes/schoolRoutes.js";
   import authenticateToken from "./src/middleware/authenticateToken.js";
   import errorHandler from "./src/middleware/errorMiddleware.js";
   import campaignRoutes from "./src/routes/campaignRoutes.js";
   import donationRoutes from "./src/routes/donationRoutes.js";
//    import donateRoutes from './src/routes/donateRoutes.js';

   const app = express();
   app.use(cors());
   app.use(express.json());
   app.use(fileUpload());

   app.use("/api/auth", authRoutes);
   app.use("/api/campaigns", campaignRoutes);
   app.use("/api/donations", donationRoutes);
   app.use("/api/users", authenticateToken, userRoutes);
   app.use("/api/schools", authenticateToken, schoolRoutes);
//    app.use('/api/donate', donateRoutes);

   app.get("/", (_req, res) => res.send("Backend live"));

   app.use(errorHandler);

   const PORT = process.env.PORT || 4000;
   app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


//    need this in env
// RAZORPAY_KEY_ID=rzp_test_YourKeyId
// RAZORPAY_KEY_SECRET=YourKeySecret
// RAZORPAY_WEBHOOK_SECRET=YourWebhookSecret