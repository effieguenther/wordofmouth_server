const functions = require('firebase-functions');
const admin = require('firebase-admin');
const connect = require('./connect');
const express = require('express');
const app = require('./app');
const config = require('./config.js');

admin.initializeApp();

// MongoDB connection setup

connect(config.mongoUrl);

const firebaseApp = express();
firebaseApp.use(app);

exports.api = functions.https.onRequest(firebaseApp);

