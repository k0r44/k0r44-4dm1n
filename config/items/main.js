
// Mengambil referensi Firestore
const db = firebase.firestore();

// Get user details elements
var userfullNameText = document.getElementsByClassName('username')[0];

// Set user details and login time
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var author = user.uid; // Menggunakan displayName sebagai nilai author
    var categoryRef = firebase.firestore().collection('users').doc(author);
    categoryRef.get()
      .then(function(doc) {
        if (doc.exists) {
          userfullNameText.textContent = doc.data().username;

          // Panggil fungsi untuk mendapatkan item-item pengguna dan menambahkan listener realtime
          getUserItems(author);
        } else {
          userfullNameText.textContent = "User not logged in";
          // ...
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  } else {
    // ...
  }
});

// Get logout button element
var logoutButton = document.getElementById('logout-button');

// Add event listener to logout button
logoutButton.addEventListener('click', function() {
  firebase.auth().signOut()
    .then(function() {
      // Redirect to the login page after successful logout
      window.location.href = '/auth/login/'; // Ganti '/login' dengan URL yang benar untuk halaman login
    })
    .catch(function(error) {
      console.log(error);
    });
});

// Fungsi untuk mendapatkan item-item pengguna dan menambahkan listener realtime
function getUserItems(author) {
  db.collection(`users/${author}/items`)
    .orderBy("time", "desc")
    .onSnapshot((querySnapshot) => {
      const itemsContainer = document.querySelector(".items-container");
      let html = "";

      // Buat objek untuk menyimpan data item
      const itemDataMap = {};

      // Fungsi untuk mengubah format angka menjadi '1k' jika nilainya mencapai 1000
      function formatNumber(value) {
        if (value >= 1000) {
          return (value / 1000).toFixed(1) + 'k';
        } else {
          return value.toString();
        }
      }

      querySnapshot.forEach((doc) => {
        const item = doc.data();
        const itemId = doc.id;

        // Simpan data item ke objek itemDataMap
        itemDataMap[itemId] = {
          item,
          view: item.view || 0
        };

        const formattedView = formatNumber(itemDataMap[itemId].view); // Ubah format angka
        const itemHtml = `
          <div class="col-lg-4 col-md-6 box-col-33" id="${itemId}">
            <div class="card custom-card">
              <div class="card-header"><img class="img-fluid" src="${item.file}" alt=""></div>
              <div class="card-profile"><img class="rounded-circle" src="https://www.koraa.my.id/assets/img/logo/koraa.png" alt=""></div>
              <div class="text-center profile-details"><a href="https://koraa.my.id${item.links}">
                  <h4>${item.name}</h4></a>
                <h6>${item.visibility}</h6>
              </div>
              <ul class="card-social">
                <!-- Coming Soon -->
                <li>
                  <a href="javascript:void(0)" class="edit-item" data-itemid="${itemId}">
                    <i class="ri-pencil-line"></i>
                  </a>
                </li>
                <!-- Coming Soon -->
                <li>
                  <a href="javascript:void(0)" onclick="deleteItem('${author}', '${itemId}')">
                    <i class="ri-delete-bin-line"></i>
                  </a>
                </li>
              </ul>
              <div class="card-footer row">
                <div class="col-4 col-sm-4">
                  <h6>View</h6>
                  <h3 class="counter">${formattedView}</h3>
                </div>
                <!-- Coming Soon --
                <div class="col-4 col-sm-4">
                  <h6>Following</h6>
                  <h3><span class="counter">${item.visibility}</span></h3>
                </div>
                <div class="col-4 col-sm-4">
                  <h6>Total Post</h6>
                  <h3><span class="counter">96</span>M</h3>
                </div>
                <!-- Coming Soon -->
              </div>
            </div>
          </div>
        `;

        html += itemHtml;
      });

      // Render tampilan HTML setelah semua item ditambahkan
      itemsContainer.innerHTML = html;

      // Event listener untuk klik ikon pensil
      const editItemIcons = document.getElementsByClassName('edit-item');
      for (let i = 0; i < editItemIcons.length; i++) {
        editItemIcons[i].addEventListener('click', function(event) {
          const itemId = this.dataset.itemid;
          editItem(itemId);
        });
      }

      // Perbarui view counter secara real-time menggunakan objek itemDataMap
      Object.keys(itemDataMap).forEach((itemId) => {
        const itemData = itemDataMap[itemId];
        const viewCounter = document.getElementById(`${itemId}`).querySelector(".counter");
        const formattedView = formatNumber(itemData.view); // Ubah format angka
        viewCounter.textContent = formattedView;

        // Tambahkan listener realtime untuk view counter pada item
        db.collection(`items`)
          .doc(itemId)
          .onSnapshot((itemSnapshot) => {
            const updatedItemData = itemSnapshot.data();
            const updatedView = updatedItemData.view || 0;
            const formattedUpdatedView = formatNumber(updatedView); // Ubah format angka
            // Perbarui view counter hanya jika nilainya berbeda
            if (itemData.view !== updatedView) {
              itemData.view = updatedView;
              viewCounter.textContent = formattedUpdatedView;
            }
          });
      });
    }, (error) => {
      console.log("Error getting items:", error);
    });
}

// Event listener untuk klik ikon pensil
const editItemIcons = document.getElementsByClassName('edit-item');
for (let i = 0; i < editItemIcons.length; i++) {
  editItemIcons[i].addEventListener('click', function(event) {
    const itemId = this.dataset.itemid;
    editItem(itemId);
  });
}

// Fungsi untuk mengedit item berdasarkan itemId
function editItem(itemId) {
  // Lakukan operasi yang diperlukan untuk menuju form edit item
  // Misalnya, alihkan pengguna ke halaman form edit item dengan mengirim itemId sebagai parameter
  window.location.href = `edit/?itemId=${itemId}`;
}

// Fungsi untuk menghapus item dan memperbarui tampilan
function deleteItem(author, itemId) {
  // Tampilkan loading overlay
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";

  // Hapus item dari koleksi 'items'
  db.collection("items")
    .doc(itemId)
    .get()
    .then((doc) => {
      const itemData = doc.data();
      const fileName = itemData.fileName;

      // Pengecekan fileName
      if (fileName) {
        // Hapus item dari Firebase Storage
        const storageRef = firebase.storage().ref().child(`items/${author}/${fileName}`);
        storageRef.delete()
          .then(() => {
            console.log("File successfully deleted from Firebase Storage!");

            // Hapus item dari koleksi 'items'
            db.collection("items")
              .doc(itemId)
              .delete()
              .then(() => {
                console.log("Item successfully deleted from 'koraa/items/<categoryitems>' collection!");

                // Hapus item dari koleksi 'users/<displayName>/items'
                db.collection(`users/${author}/items`)
                  .doc(itemId)
                  .delete()
                  .then(() => {
                    console.log("Item successfully deleted from 'users/<displayName>/items' collection!");

                    // Hapus item dari tampilan HTML
                    const itemElement = document.getElementById(itemId);
                    if (itemElement) {
                      itemElement.remove();
                    }

                    // Sembunyikan loading overlay setelah selesai menghapus
                    overlay.style.display = "none";
                  })
                  .catch((error) => {
                    console.error("Error deleting item from 'users/<displayName>/items' collection:", error);
                    // Sembunyikan loading overlay jika terjadi kesalahan
                    overlay.style.display = "none";
                  });
              })
              .catch((error) => {
                console.error("Error deleting item from 'koraa/items/<categoryitems>' collection:", error);
                // Sembunyikan loading overlay jika terjadi kesalahan
                overlay.style.display = "none";
              });
          })
          .catch((error) => {
            console.error("Error deleting file from Firebase Storage:", error);
            // Sembunyikan loading overlay jika terjadi kesalahan
            overlay.style.display = "none";
          });
      } else {
        console.error("Invalid fileName:", fileName);
        // Sembunyikan loading overlay jika terjadi kesalahan
        overlay.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error retrieving item data:", error);
      // Sembunyikan loading overlay jika terjadi kesalahan
      overlay.style.display = "none";
    });
}