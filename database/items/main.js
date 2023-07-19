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

  db = firebase.firestore().collection(`/items/`);
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
  myForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Show overlay
    showOverlay();

    // Check if user is logged in
    var user = firebase.auth().currentUser;
    if (user) {
      // User is logged in, continue with form submission logic
      submitForm(user);
    } else {
      // User is not logged in, redirect to login page
      window.location.href = '/auth/login/';
    }
  });

  // Function to submit the form
  function submitForm(user) {
    // Get form values
    var name = document.getElementById('name').value;
    var preview = document.getElementById('preview').value;
    var visibility = document.getElementById('visibility').value;
    var desc = document.getElementById('desc').value;
    var category = document.getElementById('category').value;

    // Get the current user's displayName
    var displayName = user.uid;

    // Retrieve the user's document from the "users" collection
    userCollection
      .doc(displayName)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var userData = doc.data();
          var author = userData.username; // Assuming "username" is the field to be used as the author
          var userPlan = userData.plan || 'free'; // Assuming "plan" is the field that stores the user's plan

          // Get the file input element
          var fileInput = document.getElementById('fileButton');

          // Check if a file is selected
          if (fileInput.files.length > 0) {
            // Check if the user has reached the storage limit based on their plan
            var storageRef = firebase.storage().ref();
            var userStorageRef = storageRef.child(`/items/${displayName}`);
            userStorageRef
              .listAll()
              .then(function (res) {
                var totalSize = 0;
                var promises = [];

                res.items.forEach(function (itemRef) {
                  promises.push(
                    itemRef.getMetadata().then(function (metadata) {
                      totalSize += metadata.size;
                    })
                  );
                });

                Promise.all(promises)
                  .then(function () {
                    var planStorageLimit = getPlanStorageLimit(userPlan);
                    var usedStorageBytes = convertSizeToBytes(planStorageLimit);
                    var usedStoragePercentage = (totalSize / usedStorageBytes) * 100;

                    // Check if the user has exceeded the storage limit
                    if (usedStoragePercentage <= 100) {
                      // Proceed with file upload and data saving
                      var file = fileInput.files[0];
                      var fileName = Date.now() + '_' + file.name;

                      // Upload image to Firebase Storage
                      var storagePath = `/items/${displayName}/${fileName}`;
                      var storageRef = firebase.storage().ref(storagePath);

                      var uploadTask = storageRef.put(file);

                      uploadTask.on(
                        'state_changed',
                        function (snapshot) {
                          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                          console.log('Upload is ' + progress + '% done');
                        },
                        function (error) {
                          console.error('Error uploading file: ', error);
                          // Hide overlay
                          hideOverlay();
                        },
                        function () {
                          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                            console.log('File available at', downloadURL);

                            // Save data to Firestore with the same document ID
                            var newDocRef = db.doc();
                            var time = firebase.firestore.Timestamp.now();

                            // Construct the itemData object based on the category
                            var itemData = {
                              file: downloadURL,
                              name: name,
                              author: author,
                              preview: preview,
                              desc: desc,
                              time: time,
                              fileName: fileName,
                              visibility: visibility,
                              category: category,
                              links: `/details/?category=${category}&id=${newDocRef.id}`, // Constructing the links field
                              uid: displayName // Add the uid field
                            };

                            

                            newDocRef
                              .set(itemData)
                              .then(function () {
                                alert('Form submitted successfully');
                                myForm.reset();
                                console.log('Document written with displayName: ', displayName);

                                // Create a new collection "items" within the user's document
                                var userItemsCollection = userCollection.doc(displayName).collection('items');

                                // Save data to userItemsCollection with the same document ID
                                userItemsCollection
                                  .doc(newDocRef.id)
                                  .set(itemData)
                                  .then(function () {
                                    console.log('Item added to "items" collection with ID: ', newDocRef.id);
                                    // Hide overlay
                                    hideOverlay();
                                  })
                                  .catch(function (error) {
                                    console.error('Error adding item to "items" collection: ', error);
                                    // Hide overlay
                                    hideOverlay();
                                  });
                              })
                              .catch(function (error) {
                                console.error('Error adding document: ', error);
                                // Hide overlay
                                hideOverlay();
                              });
                          });
                        }
                      );
                    } else {
                      // Display an error message to the user
                      alert('Storage limit exceeded. Upgrade your plan to upload more files.');
                      // Hide overlay
                      hideOverlay();
                    }
                  })
                  .catch(function (error) {
                    console.error('Error:', error);
                    // Hide overlay
                    hideOverlay();
                  });
              })
              .catch(function (error) {
                console.error('Error:', error);
                // Hide overlay
                hideOverlay();
              });
          } else {
            console.error('No file selected');
            // Hide overlay
            hideOverlay();
          }
        } else {
          console.log('User document not found');
          // Hide overlay
          hideOverlay();
        }
      })
      .catch(function (error) {
        console.error('Error retrieving user document:', error);
        // Hide overlay
        hideOverlay();
      });
  }

  // Function to convert size to bytes
  function convertSizeToBytes(size) {
    var units = {
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024
    };

    var pattern = /(\d+\.?\d*)\s*(KB|MB|GB)/i;
    var matches = size.match(pattern);

    if (matches && matches.length === 3) {
      var value = parseFloat(matches[1]);
      var unit = matches[2].toUpperCase();

      if (unit in units) {
        return value * units[unit];
      }
    }

    return 0;
  }
});


// Mendapatkan elemen-elemen yang diperlukan
var fileInput = document.getElementById('fileButton');
var nameInput = document.getElementById('name');
var previewInput = document.getElementById('preview');
var visibilityInput = document.getElementById('visibility');
var descInput = document.getElementById('desc');
var submitButton = document.getElementById('submitButton');

// Mendefinisikan fungsi validasi
function validateForm() {
  if (fileInput.value && nameInput.value && previewInput.value && visibilityInput.value && descInput.value) {
    submitButton.disabled = false; // Mengaktifkan tombol jika semua data diisi
  } else {
    submitButton.disabled = true; // Menonaktifkan tombol jika ada data yang belum diisi
  }
}

// Menambahkan event listener untuk memanggil fungsi validasi setiap kali input berubah
fileInput.addEventListener('change', validateForm);
nameInput.addEventListener('input', validateForm);
previewInput.addEventListener('input', validateForm);
visibilityInput.addEventListener('change', validateForm);
descInput.addEventListener('input', function() {
  var descValue = descInput.value;
  var formattedDesc = descValue.replace(/  /g, '&nbsp;');
  descInput.value = formattedDesc;
  validateForm();
});
