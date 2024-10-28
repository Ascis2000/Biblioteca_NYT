
function pintarLibroHTML(libro){

    let htmlResponse = "";
    htmlResponse += `
        <div class="box">
            <!--<img src="${libro.imageLink}" alt="${libro.title}">-->
            <div class="title">${libro.title || 'Título no disponible'}</div>
            <div class="author">Autor: ${libro.author || 'Autor no disponible'}</div>
            <div class="details">
                País: ${libro.country || 'País no disponible'}<br>
                Páginas: ${libro.pages ? libro.pages : 'No disponible'}<br>
                Año: ${libro.year || 'Año no disponible'}<br>
                <a href="${libro.link || '#'}" target="_blank">Más información</a>
            </div>
        </div>
    `;
    return htmlResponse;
}

// getLibros()
function getLibros(mURL) {

    //const valorURL = url;
    const url = mURL;

    let resultado = fetch(url)
        .then(response => {
            if (!response.ok) {
                // si la respuesta no devuelve un ok
                throw new Error(`API no encontrada: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // devolvemos el objeto.results
            return data.results;
        })
        .catch(error => {
            console.error('Error al conectar:', error);
            const boxMensaje = document.getElementById('mensaje');
            let cadena = "";
            cadena += "Error al conectar con la BB.DD";
            boxMensaje.innerHTML = cadena; // Mensaje de error en el DOM
        });
        return resultado;
}

window.addEventListener('load', () => {
    
    getLibros('https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=PI1OamH6ecCkG49J1RyGL49hFgpkauFF').then(datos => {
    
        console.log(datos);
        let datosLibros = document.getElementById("datosLibros");
        datosLibros.innerHTML = `Total de libros: ${datos.books.length}`;
    
        /* datos.forEach(item => {
            let list_name = item.list_name; // Obtener la magnitud del terremoto
            const coords = item.geometry.coordinates; // Obtener las coordenadas (longitud, latitud)
            const latLng = [coords[1], coords[0]]; // Leaflet usa lat, long en vez de long, lat
    
            // Determinar el color del marcador según la magnitud
            let markerColor = getMarkerColors(magnitud);
            let fecha = milisegundosToFecha(item.properties.time);
    
            let cadena = "";
            cadena += `
                <strong>Título:</strong> <label>${item.properties.title}</label><br>
                <strong>Fecha:</strong> <label>${fecha}</label><br>
                <strong>Ubicación:</strong> <label>${item.properties.place}</label><br>
                <strong>Código:</strong> <label>${item.properties.code}</label><br>
                <strong>Magnitud:</strong> <label>${item.properties.mag}</label>
            `;
        }); */
    });
});
