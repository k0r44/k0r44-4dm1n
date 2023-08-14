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

          // Mendapatkan data birthday dari dokumen pengguna
          const birthdayString = doc.data().birthday; // Misalnya "2023-07-07"
          const birthday = new Date(birthdayString);

          // Mendapatkan waktu saat ini
          const currentTime = new Date();
          currentTime.setHours(0, 0, 0, 0); // Menghapus jam, menit, detik, dan milidetik

          // Mendapatkan waktu birthday pada tahun ini
          const currentYear = currentTime.getFullYear();
          const birthdayThisYear = new Date(currentYear, birthday.getMonth(), birthday.getDate());
          birthdayThisYear.setHours(0, 0, 0, 0); // Menghapus jam, menit, detik, dan milidetik

          // Menghitung selisih waktu antara saat ini dan waktu ulang tahun
          const timeDiff = currentTime.getTime() - birthdayThisYear.getTime();
          const oneDay = 24 * 60 * 60 * 1000; // Satu hari dalam milidetik

          // Memeriksa apakah waktu saat ini ada di antara waktu ulang tahun dan waktu ulang tahun + satu hari terkirim
          if (timeDiff > oneDay) {
            categoryRef.update({
              birthdaySent: false
            })
              .then(function() {
                console.log("Informasi pengiriman ulang tahun diperbarui: false");
              })
              .catch(function(error) {
                console.log("Error memperbarui informasi pengiriman ulang tahun:", error);
              });
          } else if (timeDiff >= 0 && timeDiff <= oneDay) {

            const img = "https://www.koraa.my.id/assets/img/logo/koraa.png";
            const username = "Koraa";
            const email = "koraa.spprt@gmail.com";
            const subject = "Selamat Ulang Tahun! Hari Bahagia untukmu," + " " + doc.data().username;
            const description = `
Kepada ${doc.data().username},
<br><br>
Selamat ulang tahun yang istimewa! Hari ini adalah momen yang tak terlupakan karena kita merayakan kelahiranmu. Inilah saatnya untuk menghormati dan mengapresiasi keberadaanmu di dunia ini.
<br><br>
Pada hari ini yang penuh sukacita, izinkan aku mengucapkan selamat ulang tahun dengan tulus. Semoga setiap tahun yang berlalu menambah kebijaksanaan, kebahagiaan, dan kesuksesan dalam hidupmu. Harapanku adalah bahwa tahun ini membawa kegembiraan, pencapaian baru, dan petualangan tak terduga yang membawa senyum di wajahmu.
<br><br>
${doc.data().username}, engkau adalah orang yang luar biasa dan berarti banyak bagi banyak orang di sekitarmu. Setiap langkah yang telah kau ambil dalam hidup ini, setiap tantangan yang telah kau hadapi, telah membentukmu menjadi pribadi yang kuat, bijaksana, dan inspiratif. Teruslah mengikuti impianmu dengan semangat yang tak tergoyahkan dan jadilah cahaya bagi mereka yang beruntung mendekatimu.
<br><br>
Pada hari ulang tahunmu ini, aku berharap agar cinta, kebahagiaan, dan kesejahteraan melimpah dalam hidupmu. Jadikan setiap momen berharga, isi hari-harimu dengan tawa, canda, dan kehangatan persahabatan. Jangan lupa merayakan pencapaianmu dan menghargai segala kebaikan yang telah diberikan kepadamu.
<br><br>
Terakhir, tetaplah menjadi dirimu yang menginspirasi dan terus berusaha untuk mencapai impianmu. Dunia ini membutuhkan keunikan dan bakat yang hanya engkau miliki. Dalam perjalanan hidupmu, aku berharap bahwa semua pintu yang kau ketuk akan terbuka, semua mimpi yang kau impikan akan menjadi nyata, dan setiap langkah yang kau ambil akan membawamu menuju kebahagiaan yang abadi.
<br><br>
Selamat ulang tahun sekali lagi, ${doc.data().username}! Semoga hari ini menjadi awal yang indah untuk tahun yang luar biasa di depanmu.
<br><br>
Selamat merayakan dan semoga semua harapanmu terkabul!
<br><br>
Dengan penuh kasih sayang,
<br><br>
Koraa
`;


            // Memeriksa apakah data ulang tahun sudah terkirim sebelumnya
            const birthdaySent = doc.data().birthdaySent;

            if (!birthdaySent) {
              // Mengirim data ke koleksi "mails"
              db.collection(`users/${author}/mails`).add({
                img: img,
                username: username,
                email: email,
                subject: subject,
                description: description,
                time: firebase.firestore.FieldValue.serverTimestamp() // Menggunakan waktu ulang tahun
              })
                .then(function(docRef) {
                  console.log("Data berhasil dikirimkan ke koleksi 'mails'");

                  // Memperbarui birthdaySent menjadi true
                  categoryRef.update({
                    birthdaySent: true
                  })
                    .then(function() {
                      console.log("Informasi pengiriman ulang tahun diperbarui: true");
                    })
                    .catch(function(error) {
                      console.log("Error memperbarui informasi pengiriman ulang tahun:", error);
                    });
                })
                .catch(function(error) {
                  console.log("Error mengirim data:", error);
                });
            }
          }
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
              <img class="me-3 rounded-circle" src="${item.img || '/assets/img/mail/user.png'}" alt="">
            </div>
            <div class="flex-grow-1">
              <h6>${item.username}</h6>
              <p>${item.subject}</p>
              <span>${formattedTime}, ${item.status || '✖'}</span>
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
          // Update status item menjadi "✔" jika belum ada field status
          itemRef.update({ status: "✔" })
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
