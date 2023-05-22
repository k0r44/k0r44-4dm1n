const firebaseConfig = {
    apiKey: "AIzaSyA_2_DrjTzs1cIOY9_5mloWYcdLxpsFq5c",
    authDomain: "koraa-id.firebaseapp.com",
    databaseURL: "https://koraa-id-default-rtdb.firebaseio.com",
    projectId: "koraa-id",
    storageBucket: "koraa-id.appspot.com",
    messagingSenderId: "360256061577",
    appId: "1:360256061577:web:5d9dbb92ff3313c7b48658",
    measurementId: "G-VJT00SD3NT"
};

firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();
var db = firebase.firestore();
const auth = firebase.auth(); 