
// pintarLibrosHTML
async function pintarLibrosHTML(valor) {

    //event.preventDefault(); // evita el desplazamiento del scroll

    try {
        // mostramos la capa de cargar datos
        MO_objID('boxCargarDatos', 'flex');

        // https://api.nytimes.com/svc/books/v3/lists/current/${valor}.json?api-key=PI1OamH6ecCkG49J1RyGL49hFgpkauFF
        // https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=PI1OamH6ecCkG49J1RyGL49hFgpkauFF

        let api_key = "PI1OamH6ecCkG49J1RyGL49hFgpkauFF"
        const response = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${valor}.json?api-key=${api_key}`);
        const data = await response.json();
        const results = data.results;
        let books = results.books;
        console.log(results);

        MO_objID('boxCargarDatos', 'none'); // ocultamos la capa de cargar datos

        MO_objID('boxLibros', 'block'); // mostramos la capa de cargar datos
        MO_objID('boxCategoriasLibros', 'none'); // ocultamos la capa de cargar datos

        let txtInfoSPAN = qSelector("#txtInfoLibros span");
        txtInfoSPAN.innerHTML = books.length;

        let dataResultadosLibros = getById("dataResultadosLibros");

        let cadena = "";
        cadena += "<div class='boxBooks'>";

        books.forEach((item, index) => {
            let rank = item.rank; 
            let title = item.title; 
            let book_image = item.book_image;

            let weeks_on_list = item.weeks_on_list;
            let description = item.description;
            let amazon_product_url = item.amazon_product_url;

            let imgSRC = (book_image) ? book_image : './assets/img/imgDefault.png';

            cadena += `
                <div class="box">
                    <div class="tituloBook">
                        <label class="num">#${rank}</label>
                        <span>${title}</span>
                    </div>
                    <div class="item especial">
                        <img src="${imgSRC}" class="img_width" title="${title}">
                    </div>
                    <div class="item">
                        <label class="dato">Weeks on list: ${weeks_on_list}</label>
                    </div>
                    <div class="item">
                        <label class="dato">Description: ${description}</label>
                    </div>

                    <div class="item">
                        <label class="datoMain">
                            <a href="${amazon_product_url}" target="_blank">
                                BUY AT AMAZON
                            </a>
                        </label>
                    </div>
                </div>
            `;
        });
        cadena += "</div>";
        dataResultadosLibros.innerHTML = cadena;

    } catch (error) {
        // si se produjo un error
        // ocultamos la capa de cargar datos
        MO_objID('boxCargarDatos', 'none');

        console.error(error);
        mostrarModal(error);
    }
}


// getListadoCategorias()
function getListadoCategorias(mURL) {

    // mostramos la capa de cargar datos
    MO_objID('boxCargarDatos', 'flex');

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

function pintarCategoriasBiblioteca(){

    let apiKey = "PI1OamH6ecCkG49J1RyGL49hFgpkauFF";
    // https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=PI1OamH6ecCkG49J1RyGL49hFgpkauFF
    getListadoCategorias('https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=' + apiKey)
    .then(datos => {
    
        console.log(datos);

        let txtInfoSPAN = qSelector("#txtInfoCategorias span");
        txtInfoSPAN.innerHTML = datos.length;

        let dataResultadosCategorias = getById("dataResultadosCategorias");
        
        let cadena = "";
        cadena += "<div class='boxBooks'>";

        datos.forEach((item, index) => {
            let list_name = item.list_name; 
            let list_name_encoded = item.list_name_encoded; 
            let oldest_published_date = item.oldest_published_date;
            let newest_published_date = item.newest_published_date;
            let updated = item.updated;
    
            cadena += `
                <div class="box">
                    <label class="num">List Name ${index + 1}</label>
                    <div class="item">
                        <label class="datoMain">
                            <a href="#" onclick="pintarLibrosHTML('${list_name_encoded}')">
                                ${list_name}
                            </a>
                        </label>
                    </div>
                    <div class="item">
                        <label>Oldest:</label>
                        <label class="dato">${oldest_published_date}</label>
                    </div>
                    <div class="item">
                        <label>Newest:</label>
                        <label class="dato">${newest_published_date}</label>
                    </div>
                    <div class="item">
                        <label>Updated:</label>
                        <label class="dato">${updated}</label>
                    </div>
                </div>
            `;
        });
        cadena += "</div>";
        dataResultadosCategorias.innerHTML = cadena;
    });
}

let btn_volverIndice = getById("btn_volverIndice");
btn_volverIndice.addEventListener('click', () => {
    
    MO_objID('boxLibros', 'none'); // ocultamos la capa de cargar datos
    MO_objID('boxCategoriasLibros', 'block'); // mostramos la capa de cargar datos

});

window.addEventListener('load', () => {
    
    pintarCategoriasBiblioteca();

});
