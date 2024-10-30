
const firebaseConfig = {
	apiKey: "AIzaSyAYos4oiAf1nhgmSC2l4DhNQzzgXXrnPTA",
	authDomain: "demoweb-32dd6.firebaseapp.com",
	projectId: "demoweb-32dd6",
	storageBucket: "demoweb-32dd6.appspot.com",
	messagingSenderId: "284825331676",
	appId: "1:284825331676:web:0eb9ed79330abd43589119"
};

firebase.initializeApp(firebaseConfig);// Inicializar app Firebase
const db = firebase.firestore();// db representa mi BBDD //inicia Firestore

// Read all
const readAll = () => {

	//Petición a Firestore para leer todos los documentos de la colección album
	db.collection("nyt_books")
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				
			});
		})
		.catch(() => console.log('Error reading documents'));
};

//********FIRESTORE USERS COLLECTION******

const createUser = (user) => {
	db.collection("nyt_books")
		.add(user)
		.then((docRef) => console.log("Document written with ID: ", docRef.id))
		.catch((error) => console.error("Error adding document: ", error));
};

/**************Firebase Auth*****************/

getById("frm_signUp").addEventListener("submit", function (event) {
	event.preventDefault();

	let email = event.target.elements.email.value;
	let pass = event.target.elements.pass.value;
	let pass2 = event.target.elements.pass2.value;

	pass === pass2 ? signUpUser(email, pass) : alert("error password");
});

getById("frm_signIn").addEventListener("submit", function (event) {
	event.preventDefault();

	let email = event.target.elements.email2.value;
	let pass = event.target.elements.pass3.value;
	signInUser(email, pass);
})

getById("btn_signout").addEventListener('click', () => {
	signOut();
});

const signUpUser = (email, password) => {
	firebase
		.auth()
		.createUserWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// Signed in
			let user = userCredential.user;
			let texto = `se ha registrado ${user.email} ID:${user.uid}`
			console.log(texto);

			getById("txtMensajeModal").innerHTML = texto;
			MO_objID('txtModal', 'none');

			appModal.boxModal.onclick = function() {
				MO_objID('txtModal', 'block');
				appModal.boxModal.classList.add('hidden');
				window.location.reload();
			};
			// ...
			// Saves user in firestore
			createUser({
				id: user.uid,
				email: user.email,
				favoritos: ""
			});
			
		})
		.catch((error) => {
			console.log("Error en el sistema" + error.message, "Error: " + error.code);
		});
};

const signInUser = (email, password) => {
	firebase.auth().signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// Signed in
			let user = userCredential.user;
			console.log(`Usuario logado: ${user.email} ID:${user.uid}`)
			alert(`Usuario logado: ${user.email} ID:${user.uid}`)
			console.log("USER", user);
			window.location.reload();
		})
		.catch((error) => {
			let errorCode = error.code;
			let errorMessage = error.message;
			console.log(errorCode)
			console.log(errorMessage)
		});
}

const signOut = () => {
	let user = firebase.auth().currentUser;

	firebase.auth().signOut()
	.then(() => {
		console.log("Saliste del sistema: " + user.email);
		window.location.reload();
	}).catch((error) => {
		console.log("hubo un error: " + error);
	});
}

function addFavoritos(categoria, libro){
	//encontrarFavorito(categoria, libro);
	updateFavoritos(categoria, libro);
}

// Listener de usuario en el sistema
// Controlar usuario logado
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		console.log(`Está en el sistema:${user.email} ${user.uid}`);
		//document.getElementById("message").innerText = `Está en el sistema: ${user.uid}`;

        qSelector('#user-info p').innerHTML = "Usuario: " + user.email + " y " + user.uid;

        getById('user-icon').classList.add("user_active");
        
        MO_objID('signup', 'none');
        MO_objID('signin', 'none');
	} else {
		console.log("no hay usuarios en el sistema");
		// document.getElementById("message").innerText = `No hay usuarios en el sistema`;

        qSelector('#user-info p').innerHTML = "Usuario no logado";
        getById('user-icon').classList.add("user_inactive");

		MO_objID('logout', 'none'); // ocultamos la capa boxLogOut
	}
});

function encontrarFavorito(categoria, textoFav){
	// Asegúrate de que el UID está disponible
	const user = firebase.auth().currentUser;

	if (user) {
		const uid = user.uid;
		const favorito = textoFav; 

		// si el usuario está activo y existe favorito
		if (uid && favorito) {
			
			/* 
			Filtrado de Documentos:
			El primer where("id", "==", uid) filtra los documentos para que 
			solo se devuelva aquellos donde el campo id coincide con el uid 
			del usuario autenticado.
			El segundo where("favoritos", "==", favorito) aplica un segundo filtro 
			que restringe aún más los documentos devueltos, buscando aquellos que 
			también tienen el campo favoritos igual al valor de favorito que estás 
			buscando, que seria "textoFav" pasado por argumento
			*/
			const query = firebase.firestore().collection("nyt_books")
				.where("id", "==", uid)
				.where("favoritos", "==", favorito);

			query.get()
				.then((snapshot) => {
					if (!snapshot.empty) {
						snapshot.forEach(doc => {
							console.log("Documento encontrado:", doc.id, "=>", doc.data());
						});
					} else {
						console.log("No se encontró ningún documento que coincida con los criterios.");
					}
				})
				.catch((error) => {
					console.error("Error obteniendo documentos: ", error);
				});
		} else {
			console.error("UID o favorito está indefinido.");
		}
	} else {
		console.error("Usuario no autenticado.");
	}
}

// Función para actualizar el campo "favoritos" de un documento
function updateFavoritos(categoria, nuevoFavorito) {

	const user = firebase.auth().currentUser;
	
	if (user) {
		const userRef = firebase.firestore().collection('nyt_books').doc(user.uid);
	
		userRef.get().then(doc => {
			// Inicializar el objeto favoritos si no existe
			let favoritos = doc.exists ? doc.data().favoritos || {} : {};
	
			// Verificar si la categoría ya existe en favoritos
			if (favoritos[categoria]) {
				// Si la categoría existe, añadir el nuevo favorito al array si no existe ya
				if (!favoritos[categoria].includes(nuevoFavorito)) {
					favoritos[categoria].push(nuevoFavorito);
				}
			} else {
				// Si la categoría no existe, crear un nuevo array con el favorito
				favoritos[categoria] = [nuevoFavorito];
			}
	
			// Actualizar el documento en Firestore
			return userRef.set({
				id: user.uid,
				email: user.email,
				favoritos: favoritos
			}, { merge: true });
		})
		.then(() => {
			console.log("Documento creado o actualizado con éxito.");
		})
		.catch(error => {
			console.error("Error al crear o actualizar el documento:", error);
		});
	} else {
		console.error("Usuario no autenticado.");
	}
}