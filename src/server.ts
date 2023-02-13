import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server as WebSocketServer } from 'ws';
import  errorHandler from './shared/errorHandler';
import * as dotenv from 'dotenv'

const WebSocket = require('ws');
const wssChat = new WebSocket.Server({ port:8000 });

dotenv.config()

// import categoriesRoutes from './routes/categories';
// import productsRoutes from './routes/products';
import usersRoutes from './controllers/users';
import itemsRoutes, { uploadOptions } from './controllers/items'
import ordersRoutes from './controllers/orders';
import path from "path";

export const app = express();
const api = process.env.API_URl;

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use('/public/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.get("/", (req, res) => {
    res.send("BADU WADA");
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('tiny'));
// app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/items`, itemsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`SERVER LISTENING TO ${PORT}!`);
});

mongoose.set("strictQuery", false);
mongoose.connect('mongodb+srv://Admin1:admin123@bloomcluster.rrjichs.mongodb.net/BloomDB').then(() => {
    console.log('DATABASE UP');

});

let chatClients: any[]=[];

wssChat.on('connection', (ws:any, req:any) => {

    console.log('New connection established - chat');
    
  
    chatClients.push(ws);
  
    ws.on('message', (data: any) => {
      chatClients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN ) {
          client.send(data);
        }
      });
    });
  
    ws.on('close', () => {
      chatClients = chatClients.filter((client) => client !== ws);
    });
  });

