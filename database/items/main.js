// Access Firestore collection
var db;
var userCollection;
var category;

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  if (currentPath.includes("/items/mobile")) {
    category = "mobile";
  } else if (currentPath.includes("/items/logo")) {
    category = "logo";
  } else if (currentPath.includes("/items/product-design")) {
    category = "product design";
  } else if (currentPath.includes("/items/web-design")) {
    category = "web design";
  }

  db = firebase.firestore().collection(`/koraa/items/${category}`);
  userCollection = firebase.firestore().collection("users");
});

// Get the form element
var myForm = document.getElementById('myForm');

// Listen for form submission
myForm.addEventListener('submit', function(e) {
  e.preventDefault();

  // Get form values
  var img = document.getElementById('img').value;
  var name = document.getElementById('name').value;
  var preview = document.getElementById('preview').value;
  var desc = document.getElementById('desc').value;

  // Get the current user's displayName
  var user = firebase.auth().currentUser;
  var displayName = user.displayName;

  // Retrieve the user's document from the "users" collection
  userCollection.doc(displayName).get()
    .then(function(doc) {
      if (doc.exists) {
        var userData = doc.data();
        var author = userData.username; // Assuming "email" is the field to be used as the author

        // Generate a new document ID
        var newDocRef = db.doc();
        var time = firebase.firestore.Timestamp.now();

        // Save data to Firestore with the same document ID
        newDocRef.set({
          img: img,
          name: name,
          author: author,
          preview: preview,
          desc: desc,
          time: time,
          links: `https://www.koraa.my.id/details/?category=${category}&id=${newDocRef.id}` // Constructing the links field
        })
        .then(function() {
          alert('Form submitted successfully');
          myForm.reset();
          console.log('Document written with displayName: ', displayName);

          // Create a new collection "items" within the user's document
          var userItemsCollection = userCollection.doc(displayName).collection("items");

          // Save data to userItemsCollection with the same document ID
          userItemsCollection.doc(newDocRef.id).set({
            img: img,
            name: name,
            author: author,
            preview: preview,
            desc: desc,
            time: time,
            links: `https://www.koraa.my.id/details/?category=${category}&id=${newDocRef.id}` // Constructing the links field
          })
          .then(function() {
            console.log('Item added to "items" collection with ID: ', newDocRef.id);
          })
          .catch(function(error) {
            console.error('Error adding item to "items" collection: ', error);
          });
        })
        .catch(function(error) {
          console.error('Error adding document: ', error);
        });
      } else {
        console.log("User document not found");
      }
    })
    .catch(function(error) {
      console.error("Error retrieving user document:", error);
    });
});


// Upload image to Firebase Storage
var storageRef = firebase.storage().ref();

document.getElementById('fileButton').addEventListener('change', function(e) {
  var file = e.target.files[0];
  var fileName = Date.now() + '_' + file.name;

  // Get the current user's displayName
  var user = firebase.auth().currentUser;
  var displayName = user.displayName;

  var uploadTask = storageRef.child(`/koraa/items/${category}/${displayName}/${fileName}`).put(file);

  uploadTask.on('state_changed', function(snapshot) {
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  }, function(error) {
    console.error('Error uploading file: ', error);
  }, function() {
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('File available at', downloadURL);
      document.getElementById('img').value = downloadURL;
    });
  });
});
