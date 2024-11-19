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


app.get("/", (req, res) => {
    res.render ("home");
     });

     app.listen (port, () => {
        console.log (`Server running on port ${port}`)
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
    
        // Renderizar los resultados en la vista searchResults.ejs
        res.render('search', { results: data.results, query });
      } catch (error) {
        console.error('Error al realizar la búsqueda:', error.message);
        res.status(500).send('Hubo un problema con la búsqueda.');
      }
    });