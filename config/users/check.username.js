// Firebase initialization
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// Get elements
var loginForm = document.getElementById('login-form');
var signupForm = document.getElementById('signup-form');
var successMessage = document.getElementById('success-message');
var errorMessage = document.getElementById('error-message');

// Google login
function googleLogin() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(function (userCredential) {
      var user = userCredential.user;

      // Check if the user is already registered (if the user has a Firestore document)
      return db.collection('users').doc(user.uid).get()
        .then(function(doc) {
          if (doc.exists) {
            // If the user exists, check if their email is verified and handle the redirection
            checkEmailVerification(user);
          } else {
            // If the user is not registered, redirect them to the "daftar" (register) page
            window.location.href = '/auth/daftar';
          }
        });
    })
    .catch(function (error) {
      errorMessage.innerHTML = error.message;
      errorMessage.style.display = 'block';
    });
}

// Google signup
function googleSignup() {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('profile'); // Request access to profile information, including birthdate
  firebase.auth().signInWithPopup(provider)
    .then(function (userCredential) {
      var user = userCredential.user;
      var signupTime = new Date().toLocaleString(); // Get the current time on signup
      var loginTime = signupTime; // Use signupTime as the loginTime on signup

      // Access birthdate from the additionalUserInfo object
      var birthdate = "Not available"; // Default value if birthdate is not provided
      if (userCredential.additionalUserInfo && userCredential.additionalUserInfo.profile && userCredential.additionalUserInfo.profile.birthday) {
        birthdate = userCredential.additionalUserInfo.profile.birthday;
      }

      // Get the Google profile picture URL
      var photoURL = user.photoURL || ''; // Use empty string if photoURL is not available

      // Create a new user document in Firestore with the user's Google email as the document ID
      return db.collection('users').doc(user.uid).set({
        email: user.email,
        loginTime: loginTime,
        plan: 'free',
        template: 'v1',
        signupTime: signupTime,
        uid: user.uid,
        birthday: birthdate,
        profile: photoURL
      });
    })
    .then(function() {
      var user = firebase.auth().currentUser;
      // Send email verification to the user
      return sendEmailVerification(user);
    })
    .then(function() {
      // Redirect the user to the "username.html" page
      window.location.href = '/auth/google';
    })
    .catch(function (error) {
      errorMessage.innerHTML = error.message;
      errorMessage.style.display = 'block';
    });
}

// Function to send email verification
function sendEmailVerification(user) {
  return user.sendEmailVerification().then(function() {
    // Email verification sent successfully. You can add any further actions if needed.
    console.log("Email verification sent!");
  }).catch(function(error) {
    // An error happened. Handle it here.
    console.error("Error sending email verification:", error);
  });
}


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
  var loginTime = new Date().toLocaleString(); // Get the current time on login

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      var user = userCredential.user;
      var categoryRef = db.collection('users').doc(user.uid); // Use uid as the document ID

      // Update the loginTime in the user document
      return categoryRef.update({ loginTime: loginTime })
        .then(function() {
          categoryRef.get()
            .then(function (doc) {
              if (doc.exists) {
                var category = doc.data().category;
                loadCategoryPage(category); // Load the category page dynamically using AJAX
              } else {
                showLoginForm();
              }
            })
            .catch(function (error) {
              showLoginForm();
            });
        })
        .then(function() {
          // Redirect to the root page after successful login
          window.location.href = '/';
        });
    })
    .catch(function (error) {
      errorMessage.innerHTML = error.message;
      errorMessage.style.display = 'block';
    });
}

// Perform signup
function signup() {
  var username = document.getElementById('new-username').value;
  var email = document.getElementById('new-email').value;
  var password = document.getElementById('new-password').value;
  var category = document.getElementById('kategori').value;
  var signupTime = new Date().toLocaleString(); // Get the current time on signup
  var loginTime = signupTime; // Use signupTime as the loginTime on signup

  // Check if the displayName is already taken
  db.collection('users').where('username', '==', username).get()
    .then(function (querySnapshot) {
      if (!querySnapshot.empty) {
        // Display an error message if the displayName is already taken
        errorMessage.innerHTML = 'Username is already taken. Please choose a different username.';
        errorMessage.style.display = 'block';
      } else {
        // Create a new user with the provided credentials
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(function (userCredential) {
            var user = userCredential.user;
            user.updateProfile({ displayName: username }) // Use displayName as the username

            // Send email verification to the user
            user.sendEmailVerification()
              .then(function() {
                // Email verification sent
                // Create a new user document in Firestore with the user's username as the document ID
                return db.collection('users').doc(user.uid).set({
                  category: category,
                  email: email,
                  loginTime: loginTime,
                  plan: 'free',
                  template: 'v1',
                  signupTime: signupTime,
                  uid: user.uid,
                  username: username
                });
              })
              .then(function() {
                // Redirect the user to a page informing them to check their email for verification
                window.location.href = '/verify-email';
              })
              .catch(function (error) {
                errorMessage.innerHTML = error.message;
                errorMessage.style.display = 'block';
              });
          })
          .catch(function (error) {
            errorMessage.innerHTML = error.message;
            errorMessage.style.display = 'block';
          });
      }
    })
    .catch(function (error) {
      errorMessage.innerHTML = error.message;
      errorMessage.style.display = 'block';
    });
}

// Load category page dynamically using AJAX
function loadCategoryPage(category) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      categoryContent.innerHTML = this.responseText;
    }
  };
  xhttp.open('GET', '/', true); // Replace with the correct URL for the root page
  xhttp.send();
}

// Validate form and enable/disable sign up button
function validateForm() {
  var username = document.getElementById('new-username').value;
  var email = document.getElementById('new-email').value;
  var password = document.getElementById('new-password').value;
  var category = document.getElementById('kategori').value;
  var signupButton = document.getElementById('signup-button');

  if (username !== '' && email !== '' && password !== '' && category !== '') {
    signupButton.disabled = false; // Enable sign up button
  } else {
    signupButton.disabled = true; // Disable sign up button
  }
}

// Add event listeners for form validation
document.getElementById('new-username').addEventListener('input', validateForm);
document.getElementById('new-email').addEventListener('input', validateForm);
document.getElementById('new-password').addEventListener('input', validateForm);
document.getElementById('kategori').addEventListener('change', validateForm);

// Check if user is already logged in
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    if (user.emailVerified) {
      var categoryRef = db.collection('users').doc(user.uid); // Use displayName as the username
      categoryRef.get()
        .then(function (doc) {
          if (doc.exists) {
            var category = doc.data().category;
            loadCategoryPage(category); // Load the category page dynamically using AJAX
          } else {
            showLoginForm();
          }
        })
        .catch(function (error) {
          showLoginForm();
        });
    } else {
      // Display a message to the user informing them that their account is not yet verified
      errorMessage.innerHTML = 'Please verify your email to proceed.';
      errorMessage.style.display = 'block';
    }
  } else {
    showLoginForm();
  }
});
