var link = document.createElement('link');
link.rel = 'icon';
link.href = '/assets/img/icons/koraa.png';
document.head.appendChild(link);

var linkCanonical = document.createElement('link');
linkCanonical.rel = 'canonical';
linkCanonical.href = 'https://admin.koraa.my.id/assets/img/icons/koraa.png';
document.head.appendChild(linkCanonical);



var metaDescription = document.createElement('meta');
metaDescription.setAttribute('name', 'description');
metaDescription.content = 'Koraa merupakan salah satu e-commerce di Indonesia yang menawarkan berbagai macam source code, design, dll';
document.head.appendChild(metaDescription);

var metaKeywords = document.createElement('meta');
metaKeywords.setAttribute('name', 'keywords');
metaKeywords.content = 'admin koraa, koraa';
document.head.appendChild(metaKeywords);



var metaUrl = document.createElement('meta');
metaUrl.setAttribute('property', 'og:url');
metaUrl.content = 'https://admin.koraa.my.id/';
document.head.appendChild(metaUrl);

var metaTitle = document.createElement('meta');
metaTitle.setAttribute('property', 'og:title');
metaTitle.content = 'Admin | Koraa';
document.head.appendChild(metaTitle);

var metaDescriptionOG = document.createElement('meta');
metaDescriptionOG.setAttribute('property', 'og:description');
metaDescriptionOG.content = 'Koraa merupakan salah satu e-commerce di Indonesia yang menawarkan berbagai macam source code, design, dll';
document.head.appendChild(metaDescriptionOG);

var metaImage = document.createElement('meta');
metaImage.setAttribute('property', 'og:image');
metaImage.content = 'https://admin.koraa.my.id/assets/img/icons/koraa.png';
document.head.appendChild(metaImage);

var metaSiteName = document.createElement('meta');
metaSiteName.setAttribute('property', 'og:site_name');
metaSiteName.content = 'admin koraa';
document.head.appendChild(metaSiteName);

var metaTtl = document.createElement('meta');
metaTtl.setAttribute('property', 'og:ttl');
metaTtl.content = '3600';
document.head.appendChild(metaTtl);
