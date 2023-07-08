// Mengambil referensi Firestore
const db = firebase.firestore();

// Mendapatkan ID item dari URL
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('id');

// Define the deleteMail function
function deleteMail() {
  // Mendapatkan ID pengguna saat ini
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      const userId = user.uid;

      // Mendapatkan referensi dokumen Firestore yang akan dihapus
      const docRef = db.collection(`users/${userId}/mails`).doc(itemId);

      // Menghapus dokumen dari Firestore
      docRef.delete()
        .then(function() {
          console.log('Document successfully deleted.');
          window.location.href = '/p/mail/';
          // Lakukan tindakan lain setelah menghapus dokumen, jika diperlukan.
        })
        .catch(function(error) {
          console.error('Error removing document: ', error);
          // Lakukan penanganan kesalahan, jika diperlukan.
        });
    } else {
      console.log('User not logged in');
    }
  });
}

// Mendapatkan ID pengguna saat ini
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    const userId = user.uid;

    // Mendapatkan referensi koleksi Firestore
    const collectionRef = db.collection(`users/${userId}/mails`);

    // Mendapatkan detail item dari Firestore berdasarkan ID
    collectionRef.doc(itemId).get()
      .then(function(doc) {
        if (doc.exists) {
          const mail = doc.data();

          document.title = mail.subject;

          // Menampilkan konten surat pada halaman
          const mailContentElements = document.getElementsByClassName('mail-content');
          for (let i = 0; i < mailContentElements.length; i++) {
            const mailContentElement = mailContentElements[i];
            mailContentElement.innerHTML = `
              <div class="box-col-70">
                <div class="email-right-aside">
                  <div class="card email-body">
                    <div class="email-profile">                                                                     
                      <div class="email-right-aside">
                        <div class="email-body">
                          <div class="email-content">
                            <div class="email-top">
                              <div class="row">
                                <div class="col-xl-12">
                                  <div class="d-flex align-items-center">
                                    <img class="me-3 rounded-circle" src="${mail.img || '/assets/img/mail/user.png'}" alt="" style="width: 48px; height: 48px;">
                                    <div class="flex-grow-1">
                                      <h6 class="d-block">${mail.username}</h6>
                                      <p>${mail.subject}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="email-wrapper">
                              <div class="emailread-group">
                                <div class="read-group">
                                  <p>From</p>
                                  <p>${mail.email},</p>
                                </div>
                                <div class="read-group">
                                  <h5>Description</h5>
                                  <p>${mail.description}</p>
                                </div
                              </div>
                              <div class="emailread-group">
                                <div class="action-wrapper">
                                  <ul class="actions">
                                    <li>
                                      <a class="btn btn-primary" href="mailto:${mail.email}">
                                        <i class="ri-reply-fill me-2"></i>Reply
                                      </a>
                                    </li>
                                    <li>
                                      <a class="btn btn-danger" href="javascript:void(0)" onclick="deleteMail()">
                                        <i class="ri-delete-bin-line  me-2"></i>Delete
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }
        } else {
          console.log('Document not found');
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  } else {
    console.log('User not logged in');
  }
});