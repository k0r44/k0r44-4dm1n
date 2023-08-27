// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

const statusHandlers = {
  'banned': handleBannedStatus,
  'banneddd': handleOtherBannedStatus
  // tambahkan status dan metodenya sesuai kebutuhan
};

// Deklarasi fungsi untuk menangani status banned
function handleBannedStatus() {
  fetch('/assets/status/banned/main.html')
    .then(response => response.text())
    .then(content => {
      document.body.innerHTML = content;
    })
    .catch(error => {
      console.error('Error loading 404.html:', error);
    });
}

function handleOtherBannedStatus() {
  fetch('/404.js')
    .then(response => response.text())
    .then(content => {
      document.body.innerHTML = content;
    })
    .catch(error => {
      console.error('Error loading 404.js:', error);
    });
}

// Memeriksa status login pengguna saat ini
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var username = user.displayName;
    if (username) {
      getFileInfo(username, user.uid);
    } else {
      console.log('Username belum diisi');
      window.location.href = '/auth/provider/google';
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
        var userInfo = doc.data();
        // Cek apakah field username ada di dokumen
        if (userInfo.hasOwnProperty('username')) {
          console.log('Username ditemukan:', userInfo.username);

          // Cek apakah ada field 'status' dengan nilai 'banned'
          if (userInfo.hasOwnProperty('status') && statusHandlers.hasOwnProperty(userInfo.status)) {
            statusHandlers[userInfo.status]();
        }
        
        } else {
          console.log('Username tidak ditemukan');
          window.location.href = '/auth/provider/google';
        }
      } else {
        console.log('Dokumen tidak ditemukan');
        window.location.href = '/auth/provider/google';
      }
    })
    .catch(function (error) {
      console.log('Error:', error);
      // Handle error if needed
    });
}



 // Mencegah tampilan pesan di konsol saat mengklik kanan
 window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

// Mencegah fungsi F12
window.addEventListener('keydown', function (e) {
  if (e.key === 'F12') {
      e.preventDefault();
  }
});

// Mencegah kombinasi tombol khusus (misalnya Ctrl+Shift+I)
window.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
  }
});

// Mencegah kombinasi tombol khusus (misalnya Ctrl+Shift+J)
window.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
  }
});

// Mencegah kombinasi tombol khusus (misalnya Ctrl+Shift+C)
window.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
  }
});