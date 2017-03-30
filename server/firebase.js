const firebase = require('firebase');
require('dotenv').config()


var config = {
	apiKey: "AIzaSyBn-Az-pgMQ4HiQ6KYEj36dp6yD0O5dzQA",
    authDomain: "storm-ping.firebaseapp.com",
    databaseURL: "https://storm-ping.firebaseio.com",
    storageBucket: "storm-ping.appspot.com",
    messagingSenderId: "992995939735"
};

firebase.initializeApp(config);

const firebaseRef = firebase.database().ref();


firebase.auth().signInWithEmailAndPassword(process.env.FB_EMAIL, process.env.FB_PASS)
	.then(function (result) {
		console.log('logged in');
		firebaseRef.set({
			appName: 'storm-ping',
			version: '1.0.0',
			user: {
				name: 'admin'
			},
		}).then(() => {
			console.log('intial firebase database set confirmed');;
		}, (e) => {
			console.log('intial firebase database set failed');
		})

	})
	.catch(function (error) {
		console.log('login error', error)
	})

