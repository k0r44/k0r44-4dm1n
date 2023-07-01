var primary = localStorage.getItem("primary") || '#5c61f2';
var secondary = localStorage.getItem("secondary") || '#eeb82f';
var success = localStorage.getItem("success") || '#61ae41';
var info = localStorage.getItem("info") || '#4faad5';
var warning = localStorage.getItem("warning") || '#e6c830';
var danger = localStorage.getItem("danger") || '#f81f58';
window.TivoAdminConfig = {
	// Theme Primary Color
	primary: primary,
	// theme secondary color
	secondary: secondary,
	// theme success color
	success: success,
	// theme info color
	info: info,
	// theme warning color
	warning: warning,
	// theme danger color
	danger: danger,
};

fetch('/config/storage/main.js')
  .then(response => response.text())
  .then(scriptContent => {
    const scriptElement = document.createElement('script');
    scriptElement.textContent = scriptContent;
    document.head.appendChild(scriptElement);
  })
  .catch(error => {
    console.error('Error fetching script:', error);
  });
