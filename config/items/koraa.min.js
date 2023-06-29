// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
      
// Memeriksa status login pengguna saat ini
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var username = user.displayName; // Menggunakan displayName pengguna sebagai username
      getFileInfo(username);
    } else {
      console.log('Pengguna belum login');
      window.location.href = '/auth/login/'; // Mengarahkan pengguna ke halaman login
    }
  });