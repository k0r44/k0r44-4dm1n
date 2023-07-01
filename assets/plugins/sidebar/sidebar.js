// Mendapatkan kategori pengguna dari Firestore saat halaman dimuat
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const userUID = user.uid;
    firebase.firestore().collection('users').doc(userUID).get().then((doc) => {
      if (doc.exists) {
        const userCategory = doc.data().category;

        // Sesuaikan tampilan navbar berdasarkan kategori pengguna
        if (userCategory === 'color') {
          document.getElementById('dashboards').style.display = 'block';
          document.getElementById('calendar').style.display = 'block';
          document.getElementById('color').style.display = 'block';
          document.getElementById('uxdesign').style.display = 'none';
          document.getElementById('code').style.display = 'none';
          document.getElementById('starter-kit').style.display = 'block';
        } else if (userCategory === 'design') {
          document.getElementById('dashboards').style.display = 'block';
          document.getElementById('calendar').style.display = 'block';
          document.getElementById('color').style.display = 'none';
          document.getElementById('uxdesign').style.display = 'block';
          document.getElementById('code').style.display = 'none';
          document.getElementById('starter-kit').style.display = 'block';
        } else if (userCategory === 'source-code') {
          document.getElementById('dashboards').style.display = 'block';
          document.getElementById('calendar').style.display = 'block';
          document.getElementById('color').style.display = 'none';
          document.getElementById('uxdesign').style.display = 'none';
          document.getElementById('code').style.display = 'block';
          document.getElementById('starter-kit').style.display = 'block';
        } else {
          document.getElementById('dashboards').style.display = 'block';
          document.getElementById('calendar').style.display = 'block';
          document.getElementById('color').style.display = 'block';
          document.getElementById('uxdesign').style.display = 'block';
          document.getElementById('code').style.display = 'block';
          document.getElementById('starter-kit').style.display = 'block';
        }
      }
    }).catch((error) => {
      console.log("Error getting user category:", error);
    });
  } else {
    // Pengguna tidak masuk, lakukan sesuatu (misalnya, arahkan ke halaman masuk)
  }
});

// filter array 
let filterarray = [];

// gallery card array

let galleryarray = [
    {
        id: 1
    },

];

showgallery(galleryarray);

// create function to show card
function showgallery(curarra) {
    document.getElementById("sidebar").innerText = "";

    for (var i = 0; i < curarra.length; i++) {
        document.getElementById("sidebar").innerHTML += `
        <div class="sidebar-wrapper">
          <div>
            <div class="logo-wrapper">
              <a href="/">
                <img class="img-fluid for-light" src="/assets/img/logo/kora.png" alt=""></a>
              <div class="back-btn"><i data-feather="x"></i></div>
            </div>

            <div class="logo-icon-wrapper">
              <a href="/">
                <div class="icon-box-sidebar">
                  <i data-feather="grid"></i>
                </div>
              </a>
            </div>

            <nav class="sidebar-main">
              <div class="left-arrow" id="left-arrow"><i data-feather="arrow-left"></i></div>
              <div id="sidebar-menu">
                <ul class="sidebar-links" id="simple-bar">
                  <li class="back-btn">
                    <div class="mobile-back text-end">
                      <span>Back</span>
                      <i class="fa fa-angle-right ps-2" aria-hidden="true"></i>
                    </div>
                  </li>
                  <li class="pin-title sidebar-list">
                    <h6>Pinned</h6>
                  </li>
                  <hr>

                  <li class="sidebar-list" id="dashboards">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title link-nav" href="/">
                      <i data-feather="home"></i>
                      <span>Dashboards</span>
                    </a>
                  </li>

                  <li class="sidebar-list" id="calendar">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title link-nav" href="/p/calendar">
                      <i data-feather="calendar"></i>
                      <span>Calendar</span>
                    </a>
                  </li>

                  <li class="sidebar-list" id="color">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title link-nav" href="/items/mobile">
                      <i data-feather="smartphone"></i>
                      <span>Mobile</span>
                    </a>
                  </li>

                  <li class="sidebar-list" id="color">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title link-nav" href="/items/logo">
                      <i data-feather="edit-3"></i>
                      <span>Logo</span>
                    </a>
                  </li>

                  <li class="sidebar-list" id="color">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title link-nav" href="/items/product-design">
                      <i data-feather="shopping-bag"></i>
                      <span>Product Design</span>
                    </a>
                  </li>

                  <li class="sidebar-list" id="color">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title link-nav" href="/items/web-design">
                      <i data-feather="layout"></i>
                      <span>Web Design</span>
                    </a>
                  </li>

                  <!-- Error --
                  <li class="sidebar-list" id="uxdesign">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title" href="javascript:void(0)">
                      <i data-feather="image"></i>
                      <span class="lan-6">UX Design</span>
                    </a>
                    <ul class="sidebar-submenu">
                      <li><a href="/items/design/ux-design/application">Application</a></li>
                      <li><a href="/items/design/ux-design/web-design">Web Design</a></li>
                    </ul>
                  </li>
                  <!-- Error -->

                  <li class="sidebar-list">
                    <a class="sidebar-link sidebar-title link-nav">
                      <span>File</span>
                    </a>
                  </li>

                  <li class="sidebar-list" id="starter-kit">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title link-nav" href="/p/profile/items">
                      <i data-feather="file"></i>
                      <span>Items Upload</span>
                    </a>
                  </li>

                  <li class="sidebar-list" id="starter-kit">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title link-nav" href="/p/file-manager">
                      <i data-feather="database"></i>
                      <span>File Storage</span>
                    </a>
                  </li>

                  <li class="sidebar-list">
                    <a class="sidebar-link sidebar-title link-nav">
                      <span>Help</span>
                    </a>
                  </li>

                  <li class="sidebar-list" id="starter-kit">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title link-nav" href="">
                      <i data-feather="file-text"></i>
                      <span>Starter Kit</span>
                    </a>
                  </li>

                </ul>
              </div>
              <div class="right-arrow" id="right-arrow"><i data-feather="arrow-right"></i></div>
            </nav>
          </div>
        </div>
               `
    }

}