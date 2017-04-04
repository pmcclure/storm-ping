const express = require('express');
const path = require('path');
const firebase = require('firebase');
const ping = require('ping');
require('dotenv').config()

const app = express();

require('./firebase.js');

var hosts = ['dynamodb.us-west-1.amazonaws.com', 
			 'dynamodb.us-east-1.amazonaws.com',
			 'dynamodb.eu-west-1.amazonaws.com',
			 'dynamodb.eu-central-1.amazonaws.com',
			 'dynamodb.ap-south-1.amazonaws.com',
			 'dynamodb.ap-southeast-1.amazonaws.com',
			 'dynamodb.ap-northeast-1.amazonaws.com',
			 'dynamodb.cn-north-1.amazonaws.com.cn'];

app.use(express.static(path.resolve(__dirname, '..', './client')));

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', './client', 'index.html'));
});


const firebaseRef = firebase.database().ref();
const nodesRef = firebaseRef.child('nodes');

const ref = firebase.database().ref('/nodes/');

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		hosts.forEach(function (host) {
			ping.promise.probe(host)
				.then(function (res) {
					var newNodeRef = nodesRef.push({
						name: host,
						ping: res.time,
						timeStamp: Date(),
					});
				});
		});
	}
});

function pingEachHostInterval() {
	hosts.forEach(function (host) {
		ping.promise.probe(host)
			.then(function (res) {
				ref.orderByChild('name').equalTo(host).once('value').then(function (snapshot) {
					snapshot.forEach(function (childSnapshot) {
						var key = childSnapshot.key;

						if (key && (res.time !== 'unknown')) {
							childSnapshot.ref.update({ ping: res.time, timeStamp: Date() })
						}
					})
				})
			});
	});
};

setInterval(pingEachHostInterval, 1000);

module.exports = app;