// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
      
// Memeriksa status login pengguna saat ini
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var username = user.displayName; // Menggunakan displayName pengguna sebagai username

    // Memeriksa apakah email pengguna sudah diverifikasi
    if (user.emailVerified) {
      getFileInfo(username);
    } else {
      console.log('Email pengguna belum diverifikasi');
      window.location.href = '/verify-email'; // Mengarahkan pengguna ke halaman verifikasi email
    }
  } else {
    console.log('Pengguna belum login');
    window.location.href = '/auth/login/'; // Mengarahkan pengguna ke halaman login
  }
});
