import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import mongoose from 'mongoose';
import router from './router';

const app = express();
app.use(cors(
    {
        origin: true,
        credentials: true,
    }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});

const MONGO_URL=`mongodb+srv://nathanburugu:EDqCQeB0oywCORIS@nodeone.etnhyqh.mongodb.net/?retryWrites=true&w=majority`

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', err => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});

app.use('/', router())