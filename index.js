import express from "express"
import bodyParser from "body-parser"
import fetch from "node-fetch"
import dotenv from 'dotenv';


dotenv.config();

const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN;

const app = express ();
const port = 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const news = [
  { id: 1, title: 'Vinilos Latinos de Salsa Que Todo Coleccionista Debería Tener', image: '/images/Fania Explosion.jpg', location: 'Earth', daysAgo: '3d', content: 'Contenido de la noticia 1.' },
  { id: 2, title: 'Dónde Escuchar Rock en Español en Los Ángeles: Los Mejores Spots', image: '/images/329582_1559623106.jpg', location: 'Pakistan', daysAgo: '4d', content: 'Contenido de la noticia 2.' },
  { id: 3, title: 'Rock Mexicano Hoy: Las Bandas que Están Redefiniendo el Género', image: '/images/enjambre.jpg', location: 'California', daysAgo: '5d', content: 'Contenido de la noticia 3.' }
];

const users = [];

app.get("/", (req, res) => {
    res.render("home", { news: news.slice(0,3) });
});

app.get('/news', (req, res) => {
  res.render('news', { news });
});

app.post('/news', (req, res) => {
  const { title, image, content } = req.body;
  const id = news.length + 1;
  news.push({ id, title, image: image || '', location: 'Comunidad', daysAgo: '0d', content });
  res.redirect('/news');
});

app.get('/news/:id', (req, res) => {
  const article = news.find(n => n.id === parseInt(req.params.id));
  if (!article) {
    return res.status(404).send('Noticia no encontrada');
  }
  res.render('news-detail', { article });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const { name, email } = req.body;
  users.push({ name, email });
  res.render('register', { message: 'Registro exitoso!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Renderizar Busqueda Discogs //



app.get('/search', async (req, res) => {
      const query = req.query.q || 'vinilos'; // Captura el término de búsqueda del formulario
    
      try {
        // URL de la API de Discogs
        const url = `https://api.discogs.com/database/search?q=${query}&token=${DISCOGS_TOKEN}`;
    
        // Realizar la solicitud HTTP con fetch
        const response = await fetch(url, {
          headers: { 'User-Agent': 'ViniloTracks/1.0' }, // Cambia el nombre de la app si lo deseas
        });
    
        if (!response.ok) {
          throw new Error(`Error al obtener resultados: ${response.status}`);
        }
    
        // Convertir la respuesta en JSON
        const data = await response.json();
    
        // Renderizar los resultados en la vista search.ejs
        res.render('search', { results: data.results, query });
      } catch (error) {
        console.error('Error al realizar la búsqueda:', error.message);
        res.status(500).send('Hubo un problema con la búsqueda.');
      }
    });
