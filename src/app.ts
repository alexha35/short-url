import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import { connectDB } from './config/config_db';
import { urlRouter } from './routes/url';

const PORT = 3000 || process.env.port;

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.status(200).send('gROOOOOOT');
});

app.use('/url', urlRouter);

app.listen(PORT, () => {
	return console.log(`Express is listening at http://localhost:${PORT}`);
});
