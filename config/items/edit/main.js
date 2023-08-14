// Mengambil referensi Firestore
const db = firebase.firestore();

// Mendapatkan itemId dari URL parameter
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemId');

// Lakukan operasi yang diperlukan untuk mengedit item dengan itemId yang diterima

// Contoh: Update nilai pada input field dengan data item yang akan diedit
const itemNameInput = document.getElementById('item-name');
const itemDescInput = document.getElementById('item-desc');
const visibilitySelect = document.getElementById('visibility-select');

// Mendapatkan data item dari Firestore berdasarkan itemId dan pengecekan pemilik item
db.collection('items').doc(itemId).get()
  .then((doc) => {
    if (doc.exists) {
      const itemData = doc.data();
      itemNameInput.value = itemData.name;
      itemDescInput.value = itemData.desc;
      visibilitySelect.value = itemData.visibility;

      const user = firebase.auth().currentUser;
      const author = user.uid;

      if (itemData.uid === author) {
        saveButton.disabled = false;
      } else {
        saveButton.disabled = true;
        saveButton.style.display = 'none';
        // Tampilkan alert bahwa user tidak memiliki izin untuk mengedit item
        const alertDiv = document.getElementById('not-user');
        alertDiv.style.display = 'block';
        console.log("You don't have permission to edit this item.");
      }
    } else {
      console.log("Item not found");
    }
  })
  .catch((error) => {
    console.log("Error getting item:", error);
  });

const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', function() {
  
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'block';

  const newItemName = itemNameInput.value;
  const newItemDesc = itemDescInput.value;
  const newVisibility = visibilitySelect.value;

  // Update data item di Firestore
  db.collection('items').doc(itemId).update({
    name: newItemName,
    desc: newItemDesc,
    visibility: newVisibility,
    // Lanjutkan dengan pembaruan nilai pada properti lainnya
  })
    .then(() => {
      console.log("Item successfully updated");

      // Update juga item di koleksi users/<uid>/items
      const user = firebase.auth().currentUser;
      const author = user.uid;

      db.collection('users').doc(author).collection('items').doc(itemId).update({
        name: newItemName,
        desc: newItemDesc,
        visibility: newVisibility,
        // Lanjutkan dengan pembaruan nilai pada properti lainnya
      })
        .then(() => {
          console.log("Item successfully updated in users collection");
          // Redirect ke halaman lain atau lakukan operasi lain setelah sukses menyimpan perubahan

          // Sembunyikan overlay setelah proses update selesai
          overlay.style.display = 'none';
        })
        .catch((error) => {
          console.log("Error updating item in users collection:", error);
          // Tampilkan pesan kesalahan atau lakukan operasi lain jika terjadi kesalahan

          // Sembunyikan overlay setelah proses update selesai
          overlay.style.display = 'none';
        });

    })
    .catch((error) => {
      console.log("Error updating item:", error);
      // Tampilkan pesan kesalahan atau lakukan operasi lain jika terjadi kesalahan

      // Sembunyikan overlay setelah proses update selesai
      overlay.style.display = 'none';
    });
});


// Tambahkan event listener untuk tombol Upload Image
const uploadButton = document.getElementById('save-button');
uploadButton.addEventListener('click', function() {
  const fileInput = document.getElementById('image-upload');
  const file = fileInput.files[0];

  if (file) {
    // Lakukan operasi upload file ke Firebase Storage
    const user = firebase.auth().currentUser;
    const author = user.uid;

    // Hapus file storage sebelumnya jika ada
    const itemDataRef = db.collection('items').doc(itemId);
    itemDataRef.get().then((doc) => {
      if (doc.exists) {
        const itemData = doc.data();
        const previousFileName = itemData.fileName;

        // Cek apakah ada file sebelumnya yang perlu dihapus
        if (previousFileName) {
          const storageRef = firebase.storage().ref();
          const previousFileRef = storageRef.child(`items/${author}/${previousFileName}`);

          // Hapus file storage sebelumnya
          previousFileRef.delete().then(() => {
            console.log("Previous file successfully deleted");
            uploadFile(file);
          }).catch((error) => {
            console.log("Error deleting previous file:", error);
          });
        } else {
          // Lanjutkan dengan upload file baru
          uploadFile(file);
        }
      } else {
        console.log("Item not found");
      }
    }).catch((error) => {
      console.log("Error getting item:", error);
    });
  } else {
    console.log("No file selected");
  }
});

// Fungsi untuk melakukan operasi upload file ke Firebase Storage
function uploadFile(file) {
  const user = firebase.auth().currentUser;
  const author = user.uid;
  const fileName = Date.now() + '_' + file.name;

  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(`items/${author}/${fileName}`);

  // Upload file ke Firebase Storage
  fileRef.put(file).then((snapshot) => {
    console.log("File uploaded successfully");

    // Dapatkan URL download file
    fileRef.getDownloadURL().then((url) => {
      console.log("Download URL:", url);

      const itemDataRef = db.collection('items').doc(itemId);
      itemDataRef.update({
        fileName: fileName,
        img: url,
      })

      const userRef = db.collection('users').doc(author).collection('items').doc(itemId);
      userRef.update({
        fileName: fileName,
        img: url,
      })

        .then(() => {
          console.log("File name successfully updated in Firestore");
        })
        .catch((error) => {
          console.log("Error updating file name in Firestore:", error);
        });
    }).catch((error) => {
      console.log("Error getting file download URL:", error);
    });
  }).catch((error) => {
    console.log("Error uploading file:", error);
  });
}
