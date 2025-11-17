require('dotenv').config();

const express = require("express");
const app = express();
const cors = require('cors')
const loginRoute = require('./routes/userLogin')
const getAllUsersRoute = require('./routes/userGetAllUsers')
const registerRoute = require('./routes/userSignUp')
const getUserByIdRoute = require('./routes/userGetUserById')
const connectDB = require('./config/db.config')
const editUser = require('./routes/userEditUser')
const deleteUser = require('./routes/userDeleteAll')
const createReview = require('./routes/createReview')
const updateReview = require('./routes/updateReview')
const getReview = require('./routes/GetReview')
const deleteReview = require('./routes/deleteReview')
const getAllReview = require('./routes/getAllReview')
const adminRoutes = require('./routes/adminRoutes')
const editProfileRoute = require('./routes/userEditProfile')
const getProfileRoute = require('./routes/userGetProfile')
const trainInfoRoute = require('./routes/getTrainInfo')

const SERVER_PORT = 8081

connectDB()
app.use(cors({origin: '*'}))
app.use(express.json())
app.use('/user', loginRoute)
app.use('/user', registerRoute)
app.use('/user', getAllUsersRoute)
app.use('/user', getUserByIdRoute)
app.use('/user', editUser)
app.use('/user', deleteUser)
app.use('/reviews',createReview)
app.use('/reviews',updateReview)
app.use('/reviews',getReview)
app.use('/reviews',deleteReview)
app.use('/reviews',getAllReview)
app.use('/reviews',adminRoutes)
app.use('/user', getProfileRoute)
app.use('/user', editProfileRoute)
app.use('/api', trainInfoRoute)


app.listen(SERVER_PORT, (req, res) => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
})
