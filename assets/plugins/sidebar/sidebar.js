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
                    <a class="sidebar-link sidebar-title link-nav" href="/upload">
                      <i data-feather="upload"></i>
                      <span>Upload Items</span>
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
                    <a class="sidebar-link sidebar-title link-nav" href="/p/items">
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