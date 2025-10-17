import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import { mediaUpload, uploadToCloudinary } from './middleware/multer.middleware.js';
import { accessTo, protect } from './middleware/auth.middleware.js';

import productRoutes from "./routes/product.routes.js"

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes
app.get("/", (req, res) => {
  res.send("Hello from Product Service");
});

app.post("/upload/test-upload", mediaUpload, async (req, res) => {
  try {
    const text = req.body;
    const image = req.file;
    let imageurl;
    console.log(text);

    if (image) {
      const uploaded = await uploadToCloudinary(req.file.buffer, "CartFlow/product");
      imageurl = uploaded.secure_url;
      console.log(imageurl);
    } else {
      return res.status(400).json({ message: "No image file provided" });
    }
    res.status(200).json({ message: "Test upload successful", text, imageurl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/protect-test",protect, accessTo("user","seller"), (req, res)=>{
  res.send(req.user)
})

app.use("/product",productRoutes)

app.use(errorHandler)

export default app;
