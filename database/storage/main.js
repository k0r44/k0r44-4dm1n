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
  

// Mendapatkan ukuran dan metadata file
function getFileInfo(username) {
    var storageRef = firebase.storage().ref('/items/' + username);
    storageRef.listAll().then(function(res) {
      if (res.items.length > 0) {
        var filePromises = res.items.map(function(itemRef) {
          return itemRef.getMetadata().then(function(metadata) {
            // Mengakses metadata file
            var namaFile = metadata.name;
            var ukuranFile = metadata.size;
            var tanggalUpload = new Date(metadata.timeCreated).toLocaleDateString(); // Mengubah format tanggal
  
            // Mengubah ukuran file menjadi KB, MB, atau GB
            var ukuranFormatted = formatSize(ukuranFile);
  
            // Menentukan ikon Feather Icons berdasarkan jenis file
            var jenisFile = '';
            if (namaFile.endsWith('.png') || namaFile.endsWith('.jpg')) {
              jenisFile = 'image';
            } else if (namaFile.endsWith('.mp4')) {
              jenisFile = 'video';
            } else {
              jenisFile = 'file'; // Ikon default untuk jenis file lainnya
            }
  
          // Menampilkan informasi file
          var fileInfoHTML = 
            '<li class="folder-box d-flex align-items-center">' +
                '<div class="d-flex align-items-center files-list">' +
                    '<div class="flex-shrink-0 file-left"><i data-feather="' + jenisFile + '"></i></div>' +
                        '<div class="flex-grow-1 ms-3">' +
                        '<h6>' + namaFile + '</h6>' +
                        '<p>' + tanggalUpload + ', ' + ukuranFormatted + '</p>' +
                    '</div>' +
                '</div>' +
            '</li>';
  
          return {
            fileInfoHTML: fileInfoHTML,
            ukuranFile: ukuranFile,
            timeCreated: metadata.timeCreated
          };
        });
      });

      Promise.all(filePromises).then(function(fileInfoArray) {
        // Mengurutkan fileInfoArray berdasarkan tanggal unggahan (timeCreated)
        fileInfoArray.sort(function(a, b) {
          var dateA = new Date(a.timeCreated);
          var dateB = new Date(b.timeCreated);
          return dateB - dateA; // Urutan menurun (dari yang terbaru ke yang terlama)
        });

        var fileInfoHTML = fileInfoArray.map(function(fileInfoObj) {
          return fileInfoObj.fileInfoHTML;
        }).join('');
  
        var totalSize = fileInfoArray.reduce(function(acc, fileInfoObj) {
          return acc + fileInfoObj.ukuranFile;
        }, 0);
        var totalSizeFormatted = formatSize(totalSize);
  
        // Mendapatkan informasi plan pengguna dari Firestore
        getPlanFromFirestore(username).then(function(plan) {
          var userPlan = plan || 'free'; // Jika plan kosong, asumsikan sebagai "free"
  
          var planStorageLimit = getPlanStorageLimit(userPlan);
          var usedStoragePercentage = ((totalSize / convertSizeToBytes(planStorageLimit)) * 100).toFixed(2);
  
          var totalSizeInfo =
            '<ul>' +
                '<li>' +
                    '<div class="btn btn-outline-primary"><i data-feather="database"></i>Storage</div>' +
                        '<div class="m-t-15">' +
                            '<div class="progress sm-progress-bar mb-3">' +
                                '<div class="progress-bar bg-primary" role="progressbar" style="width: ' + usedStoragePercentage + '%" ' +
                                'aria-valuenow="' + usedStoragePercentage + '" aria-valuemin="0" aria-valuemax="100"></div>' +
                            '</div>' +
                        '<h6 class="f-w-500">' + totalSizeFormatted + ' of ' + planStorageLimit + ' used</h6>' +
                    '</div>' +
                '</li>' +
            '</ul>' +
            '<hr>' +
            '<ul>' +
                '<li>' +
                    '<div class="btn btn-outline-primary"><i data-feather="grid"></i>Pricing plan</div>' +
                '</li>' +
                '<li> </li>' +
                    '<div class="pricing-plan">' +
                        '<h6>Trial Version </h6>' +
                        '<h5>' + userPlan.toUpperCase() + '</h5>' +
                        '<p>' + planStorageLimit + ' space</p>' +
                        '<div class="btn btn-outline-primary btn-xs">Selected</div>' +
                    '<img class="bg-img" src="../assets/images/dashboard/folder.png" alt="">' +
                '</div>' +
            '</ul>';
  
          document.getElementById('fileList').innerHTML = fileInfoHTML;
          document.getElementById('totalSizeInfo').innerHTML = totalSizeInfo;
  
          // Memuat ikon Feather Icons
          feather.replace();
        }).catch(function(error) {
          console.error('Error:', error);
        });
      }).catch(function(error) {
        console.error('Error:', error);
      });
    } else {
      console.log('Tidak ada file yang ditemukan');
    }
  }).catch(function(error) {
    console.error('Error:', error);
  });
}

// Fungsi untuk mengubah ukuran file menjadi KB, MB, atau GB
function formatSize(size) {
  if (size < 1024) {
    return size + ' bytes';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
}



// Fungsi untuk mengubah ukuran penyimpanan dalam byte menjadi satuan yang lebih besar
function convertSizeToBytes(size) {
  var numericValue = parseFloat(size);
  var unit = size.match(/[a-zA-Z]+/)[0].toLowerCase();

  switch (unit) {
    case 'kb':
      return numericValue * 1024;
    case 'mb':
      return numericValue * 1024 * 1024;
    case 'gb':
      return numericValue * 1024 * 1024 * 1024;
    default:
      return numericValue;
  }
}

// Fungsi untuk mendapatkan informasi plan pengguna dari Firestore
function getPlanFromFirestore(username) {
  return new Promise(function(resolve, reject) {
    var usersCollectionRef = firebase.firestore().collection('users');
    var userDocRef = usersCollectionRef.doc(username);
    userDocRef.get().then(function(doc) {
      if (doc.exists) {
        var userData = doc.data();
        var plan = userData.plan; // Ganti dengan nama field yang sesuai di Firestore
        resolve(plan);
      } else {
        reject(new Error('Dokumen pengguna tidak ditemukan'));
      }
    }).catch(function(error) {
      reject(error);
    });
  });
}
