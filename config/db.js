// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Memeriksa status login pengguna saat ini
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var username = user.displayName; // Menggunakan displayName pengguna sebagai username
    if (username) {
      getFileInfo(username, user.uid); // Memanggil fungsi getFileInfo dengan menambahkan user.uid sebagai parameter
    } else {
      console.log('Username belum diisi');
      window.location.href = '/auth/google'; // Redirect user to "/auth/google" if username is not filled
    }
  } else {
    console.log('Pengguna belum login');
    window.location.href = '/auth/login/'; // Mengarahkan pengguna ke halaman login
  }
});

// Fungsi untuk mendapatkan informasi file berdasarkan username dan uid pengguna
function getFileInfo(username, uid) {
  // Mengakses dokumen dengan id user.uid di koleksi 'users'
  firebase.firestore().collection('users').doc(uid).get()
    .then(function (doc) {
      if (doc.exists) {
        var fileInfo = doc.data();
        // Cek apakah field username ada di dokumen
        if (fileInfo.hasOwnProperty('username')) {
          // Lakukan tindakan sesuai kebutuhan jika username ada dalam dokumen
          console.log('Username ditemukan:', fileInfo.username);
        } else {
          console.log('Username tidak ditemukan');
          window.location.href = '/auth/google'; // Redirect user to "/auth/google" if username is not found
        }
      } else {
        console.log('Dokumen tidak ditemukan');
        window.location.href = '/auth/google'; // Redirect user to "/auth/google" if document doesn't exist
      }
    })
    .catch(function (error) {
      console.log('Error:', error);
      // Handle error if needed
    });
}
