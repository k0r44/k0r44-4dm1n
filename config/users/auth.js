
    var db = firebase.firestore();

    // Get elements
    var loginForm = document.getElementById('login-form');
    var signupForm = document.getElementById('signup-form');
    var successMessage = document.getElementById('success-message');
    var errorMessage = document.getElementById('error-message');
    var categoryContent = document.getElementById('kategori');

    // Show login form
    function showLoginForm() {
      loginForm.style.display = 'block';
      signupForm.style.display = 'block';
      successMessage.style.display = 'none';
      errorMessage.style.display = 'none';
      categoryContent.innerHTML = '';
    }

    // Perform login
    function login() {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {
          var user = userCredential.user;
          var categoryRef = db.collection('users').doc(user.uid);

          categoryRef.get()
            .then(function(doc) {
              if (doc.exists) {
                var category = doc.data().category;
                loadCategoryPage(category); // Load the category page dynamically using AJAX

                // Check if the current URL is already the category page
                if (!window.location.href.includes('/items/category/' + category + '/')) {
                  window.location.href = '/items/category/' + category + '/'; // Redirect to the category page
                }
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(function(error) {
          errorMessage.innerHTML = error.message;
          errorMessage.style.display = 'block';
        });
    }

    // Perform signup
    function signup() {
      var email = document.getElementById('new-email').value;
      var password = document.getElementById('new-password').value;
      var category = document.getElementById('kategori').value;

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(userCredential) {
          var user = userCredential.user;
          // Create a new user document in Firestore with the user's UID as the document ID
          return db.collection('users').doc(user.uid).set({
            email: email,
            uid: user.uid,
            category: category
          });
        })
        .then(function() {
          successMessage.innerHTML = 'Akun berhasil dibuat. Silakan masuk.';
          successMessage.style.display = 'block';
          // After successful signup, redirect the user to the category page
          window.location.href = '/items/category/' + category + '/';
        })
        .catch(function(error) {
          errorMessage.innerHTML = error.message;
          errorMessage.style.display = 'block';
        });
    }

    // Load category page dynamically using AJAX
    function loadCategoryPage(category) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          categoryContent.innerHTML = this.responseText;
        }
      };
      xhttp.open('GET', true); // Replace with the correct URL for the category page
    }

    // Check if user is already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var categoryRef = db.collection('users').doc(user.uid);
        categoryRef.get()
          .then(function(doc) {
            if (doc.exists) {
              var category = doc.data().category;
              loadCategoryPage(category); // Load the category page dynamically using AJAX

              // Check if the current URL is already the category page
              if (!window.location.href.includes('/items/category/' + category + '/')) {
                window.location.href = '/items/category/' + category + '/'; // Redirect to the category page
              }
            } else {
              showLoginForm();
            }
          })
          .catch(function(error) {
            showLoginForm();
          });
      } else {
        showLoginForm();
      }
    });