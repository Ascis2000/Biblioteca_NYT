
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

//Función auxiliar para pintar una foto en el album
const printPhoto = (title, url, docId) => {
	let card = document.createElement('article');
	card.setAttribute('class', 'card');
	let picture = document.createElement('img');
	picture.setAttribute('src', url);
	picture.setAttribute('style', 'max-width:250px');
	let caption = document.createElement('p');
	caption.innerHTML = title;
	let id = document.createElement('p');
	id.innerHTML = docId;
	const album = document.getElementById('album');
	card.appendChild(picture);
	card.appendChild(caption);
	card.appendChild(id);
	album.appendChild(card);
};

// Create
const createPicture = (picture) => {
	db.collection("nyt_books")
		.add(picture)
		.then((docRef) => {
			console.log("Document written with ID: ", docRef.id)
			readAll();
		})
		.catch((error) => console.error("Error adding document: ", error));
};


// Read all
const readAll = () => {
	// Limpia el album para mostrar el resultado
	cleanAlbum();

	//Petición a Firestore para leer todos los documentos de la colección album
	db.collection("nyt_books")
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				printPhoto(doc.data().title, doc.data().url, doc.id)
			});

		})
		.catch(() => console.log('Error reading documents'));
};

// Delete
const deletePicture = () => {
	const id = prompt('Introduce el ID a borrar');
	db.collection('album').doc(id).delete().then(() => {
		alert(`Documento ${id} ha sido borrado`);
		//Clean
		document.getElementById('album').innerHTML = "";
		//Read all again
		readAll();
	})
		.catch(() => console.log('Error borrando documento'));
};

//Clean 
const cleanAlbum = () => {
	document.getElementById('album').innerHTML = "";
};

//Show on page load
/* readAll(); */

//**********EVENTS**********

//Create
document.getElementById("create").addEventListener("click", () => {
	const title = prompt("Introduce el título de tu foto");
	const url = prompt("Introduce la url de tu foto");
	if (!title || !url) {
		alert("Hay un campo vacio. No se ha salvado");
		return
	}
	createPicture({
		title,
		url,
	});
});

//********FIRESTORE USERS COLLECTION******

const createUser = (user) => {
	db.collection("nyt_books")
		.add(user)
		.then((docRef) => console.log("Document written with ID: ", docRef.id))
		.catch((error) => console.error("Error adding document: ", error));
};

/* const readAllUsers = (born) => {
  db.collection("nyt_books")
	.where("first", "==", born)
	.get()
	.then((querySnapshot) => {
	  querySnapshot.forEach((doc) => {
		console.log(doc.data());
	  });
	});
}; */

// Read ONE
function readOne(id) {
	// Limpia el album para mostrar el resultado
	cleanAlbum();

	//Petición a Firestore para leer un documento de la colección album 
	var docRef = db.collection("nyt_books").doc(id);

	docRef.get().then((doc) => {
		if (doc.exists) {
			console.log("Document data:", doc.data());
			printPhoto(doc.data().title, doc.data().url, doc.id);
		} else {
			// doc.data() will be undefined in this case
			console.log("No such document!");
		}
	}).catch((error) => {
		console.log("Error getting document:", error);
	});

}

/**************Firebase Auth*****************/
const signUpUser = (email, password) => {
	firebase
		.auth()
		.createUserWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// Signed in
			let user = userCredential.user;
			console.log(`se ha registrado ${user.email} ID:${user.uid}`)
			alert(`se ha registrado ${user.email} ID:${user.uid}`)
			// ...
			// Saves user in firestore
			createUser({
				id: user.uid,
				email: user.email,
				favoritos: "p"
			});
		})
		.catch((error) => {
			console.log("Error en el sistema" + error.message, "Error: " + error.code);
		});
};

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
	signInUser(email, pass)
})

//Read all
getById("read-all").addEventListener("click", () => {
	readAll();
});

//Read one
getById('read-one').addEventListener("click", () => {
	const id = prompt("Introduce el id a buscar");
	readOne(id);
});

//Delete one
getById('delete').addEventListener('click', () => {
	deletePicture();
});

//Clean
getById('clean').addEventListener('click', () => {
	cleanAlbum();
});

getById("btn_signout").addEventListener('click', () => {
	signOut();
});

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

// Listener de usuario en el sistema
// Controlar usuario logado
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		console.log(`Está en el sistema:${user.email} ${user.uid}`);
		//document.getElementById("message").innerText = `Está en el sistema: ${user.uid}`;

        qSelector('#user-info p').innerHTML = "Usuario: " + user.email;

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
