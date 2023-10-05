const functions = require('firebase-functions');
const admin = require('firebase-admin');
const connect = require('./connect');
const express = require('express');
const app = require('./app');

admin.initializeApp();

// MongoDB connection setup

const uri = "mongodb+srv://eguenther:yA5PwYwH2CvWkK77@cluster0.tjk98an.mongodb.net/";
connect(uri);

const firebaseApp = express();
firebaseApp.use(app);

exports.api = functions.https.onRequest(firebaseApp);

