"use strict";
(function() {
        'use strict';
        window.addEventListener('load', function() {
            var divs = document.getElementsByClassName('needs-validation');
            var validation = Array.prototype.filter.call(divs, function(div) {
                div.addEventListener('submit', function(event) {
                    if (div.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    div.classList.add('was-validated');
                }, false);
            });
        }, false);
})();