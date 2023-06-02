// Membuat elemen link untuk favicon
var link = document.createElement('link');
link.rel = 'icon';
link.href = 'https://admin.koraa.my.id/assets/img/icons/koraa.png';
document.head.appendChild(link);

// Membuat elemen link canonical
var linkCanonical = document.createElement('link');
linkCanonical.rel = 'canonical';
linkCanonical.href = 'https://admin.koraa.my.id/assets/img/icons/koraa.png';
document.head.appendChild(linkCanonical);

// Membuat elemen meta description
var metaDescription = document.createElement('meta');
metaDescription.setAttribute('name', 'description');
metaDescription.content = 'Koraa merupakan salah satu e-commerce di Indonesia yang menawarkan berbagai macam source code, design, dll';
document.head.appendChild(metaDescription);

// Membuat elemen meta keywords
var metaKeywords = document.createElement('meta');
metaKeywords.setAttribute('name', 'keywords');
metaKeywords.content = 'admin koraa, koraa';
document.head.appendChild(metaKeywords);

// Membuat elemen meta URL
var metaUrl = document.createElement('meta');
metaUrl.setAttribute('property', 'og:url');
metaUrl.content = 'https://admin.koraa.my.id/';
document.head.appendChild(metaUrl);

// Membuat elemen meta title
var metaTitle = document.createElement('meta');
metaTitle.setAttribute('property', 'og:title');
metaTitle.content = 'Admin | Koraa';
document.head.appendChild(metaTitle);

// Membuat elemen meta description OG
var metaDescriptionOG = document.createElement('meta');
metaDescriptionOG.setAttribute('property', 'og:description');
metaDescriptionOG.content = 'Koraa merupakan salah satu e-commerce di Indonesia yang menawarkan berbagai macam source code, design, dll';
document.head.appendChild(metaDescriptionOG);

// Membuat elemen meta image
var metaImage = document.createElement('meta');
metaImage.setAttribute('property', 'og:image');
metaImage.content = 'https://admin.koraa.my.id/assets/img/icons/koraa.png';
document.head.appendChild(metaImage);

// Membuat elemen meta site name
var metaSiteName = document.createElement('meta');
metaSiteName.setAttribute('property', 'og:site_name');
metaSiteName.content = 'admin koraa';
document.head.appendChild(metaSiteName);

// Membuat elemen meta TTL
var metaTtl = document.createElement('meta');
metaTtl.setAttribute('property', 'og:ttl');
metaTtl.content = '3600';
document.head.appendChild(metaTtl);