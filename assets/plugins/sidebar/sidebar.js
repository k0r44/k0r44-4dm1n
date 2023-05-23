
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
              <div class="back-btn"><i data-feather="grid"></i></div>
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

                  <li class="sidebar-list">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title link-nav" href="/">
                      <i data-feather="home"></i>
                      <span>Dashboards</span>
                    </a>
                  </li>

                  <li class="sidebar-list">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title link-nav" href="/p/calendar">
                      <i data-feather="calendar"></i>
                      <span>Calendar</span>
                    </a>
                  </li>

                  <li class="sidebar-list">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title link-nav" href="/items/category/design/">
                      <i data-feather="image"></i>
                      <span>Design</span>
                    </a>
                  </li>

                  <li class="sidebar-list">
                    <i class="fa fa-thumb-tack"></i>
                    <a class="sidebar-link sidebar-title link-nav" href="/items/category/source-code/">
                      <i data-feather="code"></i>
                      <span>Source Code</span>
                    </a>
                  </li>

                  <li class="sidebar-list">
                    <a class="sidebar-link sidebar-title link-nav">
                      <span>Help</span>
                    </a>
                  </li>

                  <li class="sidebar-list">
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


function myFunction() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myinput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("378962");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}