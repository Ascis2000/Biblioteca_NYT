
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

    // mostramos la capa de cargar datos
    MO_objID('boxCargarDatos', 'flex');

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
            
            let cadena = "";
            cadena += "Error al conectar con la BB.DD";

            mostrarModal(cadena);
        })
        .finally(() => {
            // ocultamos la capa de cargar datos
            MO_objID('boxCargarDatos', 'none');
        });
        return resultado;
}

function obtenerLibrosBiblioteca(){

    let apiKey = "PI1OamH6ecCkG49J1RyGL49hFgpkauFF";

    getLibros('https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=' + apiKey)
    .then(datos => {
    
        console.log(datos);
        let datosLibros = getById("datosLibros");
        datosLibros.innerHTML = `Total de listas de libros: ${datos.length}`;
        
        let cadena = "";

        datos.forEach(item => {
            let list_name = item.list_name; 
            let display_name = item.display_name; 
            let list_name_encoded = item.list_name_encoded; 
            let oldest_published_date = item.oldest_published_date;
            let newest_published_date = item.newest_published_date;
            let updated = item.updated;
    
            cadena += `
                <div class="box">
                    <strong>list_name:</strong> <label>${list_name}</label><br>
                    <strong>display_name:</strong> <label>${display_name}</label><br>
                    <strong>list_name_encoded:</strong> <label>${list_name_encoded}</label><br>
                    <strong>oldest_published_date:</strong> <label>${oldest_published_date}</label><br>
                    <strong>newest_published_date:</strong> <label>${newest_published_date}</label><br>
                    <strong>updated:</strong> <label>${updated}</label>
                </div>
            `;
        });
        datosLibros.innerHTML = cadena;
    });
}

window.addEventListener('load', () => {
    
    obtenerLibrosBiblioteca();
});
