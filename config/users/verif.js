// Firebase initialization
firebase.initializeApp(firebaseConfig);

// Mendapatkan referensi objek firebase.auth()
var auth = firebase.auth();

// Mendeteksi perubahan status otentikasi pengguna
auth.onAuthStateChanged(function(user) {
  // Memeriksa apakah pengguna telah masuk dan email sudah diverifikasi
  if (user && user.emailVerified) {
    // Redirect pengguna ke halaman tujuan
    window.location.replace("/");
  }
});
