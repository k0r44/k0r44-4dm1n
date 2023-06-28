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

  // Get the form element
  var myForm = document.getElementById('myForm');

  // Show overlay function
  function showOverlay() {
    var overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
  }

  // Hide overlay function
  function hideOverlay() {
    var overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
  }

  // Listen for form submission
  myForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Show overlay
    showOverlay();

    // Get form values
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
          var author = userData.username; // Assuming "username" is the field to be used as the author

          // Get the file input element
          var fileInput = document.getElementById('fileButton');

          // Check if a file is selected
          if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var fileName = Date.now() + '_' + file.name;

            // Upload image to Firebase Storage
            var storagePath = `/koraa/items/${category}/${displayName}/${fileName}`;
            var storageRef = firebase.storage().ref(storagePath);

            var uploadTask = storageRef.put(file);

            uploadTask.on('state_changed', function(snapshot) {
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            }, function(error) {
              console.error('Error uploading file: ', error);
              // Hide overlay
              hideOverlay();
            }, function() {
              uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);

                // Save data to Firestore with the same document ID
                var newDocRef = db.doc();
                var time = firebase.firestore.Timestamp.now();

                newDocRef.set({
                  img: downloadURL,
                  name: name,
                  author: author,
                  preview: preview,
                  desc: desc,
                  time: time,
                  links: `/details/?category=${category}&id=${newDocRef.id}` // Constructing the links field
                })
                  .then(function() {
                    alert('Form submitted successfully');
                    myForm.reset();
                    console.log('Document written with displayName: ', displayName);

                    // Create a new collection "items" within the user's document
                    var userItemsCollection = userCollection.doc(displayName).collection("items");

                    // Save data to userItemsCollection with the same document ID
                    userItemsCollection.doc(newDocRef.id).set({
                      img: downloadURL,
                      name: name,
                      author: author,
                      preview: preview,
                      desc: desc,
                      time: time,
                      links: `/details/?category=${category}&id=${newDocRef.id}` // Constructing the links field
                    })
                      .then(function() {
                        console.log('Item added to "items" collection with ID: ', newDocRef.id);
                      })
                      .catch(function(error) {
                        console.error('Error adding item to "items" collection: ', error);
                      })
                      .finally(function() {
                        // Hide overlay
                        hideOverlay();
                      });
                  })
                  .catch(function(error) {
                    console.error('Error adding document: ', error);
                    // Hide overlay
                    hideOverlay();
                  });
              });
            });
          } else {
            console.error('No file selected');
            // Hide overlay
            hideOverlay();
          }
        } else {
          console.log("User document not found");
          // Hide overlay
          hideOverlay();
        }
      })
      .catch(function(error) {
        console.error("Error retrieving user document:", error);
        // Hide overlay
        hideOverlay();
      });
  });
});