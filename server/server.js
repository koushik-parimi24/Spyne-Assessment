require('dotenv').config();
const express = require('express')
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const cors = require('cors');
const authRouter = require('./routes/auth/auth-route')
const adminProductsRouter = require('./routes/admin/products-routes')

mongoose
.connect(
process.env.MONGO_URL
)
.then(()=> console.log('MongoDB connected'))
.catch((error)  => console.log(error));




const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin :process.env.CLIENT_BASE_URL,
        methods : ["GET","POST","DELETE","PUT"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
          ],
          credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/admin/products',adminProductsRouter)


app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
