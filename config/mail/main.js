// Mengambil referensi Firestore
const db = firebase.firestore();

// Get user details elements
var userfullNameText = document.getElementsByClassName('username')[0];
var itemsContainer = document.querySelector('.inbox');

// Set user details and login time
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var author = user.uid;
    var categoryRef = firebase.firestore().collection('users').doc(user.uid);

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

// Fungsi untuk mendapatkan item-item pengguna dan menambahkan listener realtime
function getUserItems(author) {
  db.collection(`users/${author}/mails`)
    .orderBy("time", "desc")
    .onSnapshot(function(querySnapshot) {
      let html = "";

      function formatTime(timestamp) {
        const itemTime = new Date(timestamp.toDate());
        const formattedTime = itemTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return formattedTime;
      }

      querySnapshot.forEach(function(doc) {
        const item = doc.data();
        const itemId = doc.id;
        const formattedTime = formatTime(item.time);

        const itemHtml = `
          <div class="d-flex ${item.status}" onclick="redirectToDetail('${itemId}')">
            <div class="flex-shrink-0">
              <img class="me-3 rounded-circle" src="/assets/img/mail/user.png" alt="">
            </div>
            <div class="flex-grow-1">
              <h6>${item.username}</h6>
              <p>${item.description}</p>
              <span>${formattedTime}, ${item.status || 'Belum dibaca'}</span>
            </div>
          </div>
        `;

        html += itemHtml;
      });

      if (html === "") {
        html = "<p>Tidak ada Mail yang tersedia</p>";
      }

      itemsContainer.innerHTML = html;
    });
}

// Fungsi untuk mengarahkan ke halaman detail dengan itemId sebagai parameter
function redirectToDetail(itemId) {
  const author = firebase.auth().currentUser.uid;
  const itemRef = db.collection(`users/${author}/mails`).doc(itemId);

  itemRef.get()
    .then(function(doc) {
      if (doc.exists) {
        const data = doc.data();

        if (!data.status) {
          // Update status item menjadi "dibaca" jika belum ada field status
          itemRef.update({ status: "dibaca" })
            .then(function() {
              console.log("Status updated successfully.");

              // Arahkan ke halaman detail setelah berhasil memperbarui status
              window.location.href = `/p/mail/inbox/?id=${itemId}`;
            })
            .catch(function(error) {
              console.log("Error updating status:", error);
            });
        } else {
          // Field status sudah ada, langsung arahkan ke halaman detail
          window.location.href = `/p/mail/inbox/?id=${itemId}`;
        }
      } else {
        console.log("Item not found.");
      }
    })
    .catch(function(error) {
      console.log("Error getting document:", error);
    });
}
