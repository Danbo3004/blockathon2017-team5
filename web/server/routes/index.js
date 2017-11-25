import express from 'express';
import ssr from './ssr';

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/merchant*', ssr);

app.get('/', (req, res) => {
  res.status(200).render('../views/home.ejs');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(process.env);
  console.log(`Hello World listening on port ${process.env.PORT || 3000}!`);
});
