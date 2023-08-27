

// Memeriksa status login pengguna saat ini
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var uid = user.uid; // Menggunakan displayName pengguna sebagai username
        getFileInfo(uid);
    } else {
        console.log('Pengguna belum login');
        window.location.href = '/auth/login/'; // Mengarahkan pengguna ke halaman login
    }
});

// Mendapatkan ukuran dan metadata file
function getFileInfo(uid) {

    var userDocRef = firebase.firestore().collection('users').doc(uid);

    // Get user document data
    userDocRef.get().then(function (userDocSnapshot) {
        if (userDocSnapshot.exists) {
            var userInfo = userDocSnapshot.data();

            if (userInfo.hasOwnProperty('status') && statusHandlers.hasOwnProperty(userInfo.status)) {
                statusHandlers[userInfo.status]();
            }


            var storageRef = firebase.storage().ref('/items/' + uid);
            storageRef.listAll().then(function (res) {
                if (res.items.length > 0) {
                    var filePromises = res.items.map(function (itemRef) {
                        return itemRef.getMetadata().then(function (metadata) {
                            // Mengakses metadata file
                            var dpen = metadata.name.split('.')[0];
                            var namaFile = dpen.slice(0, 6) + '.' + metadata.name.split('.').pop();

                            var ukuranFile = metadata.size;
                            var tanggalUpload = new Date(metadata.timeCreated).toLocaleDateString();

                            var ukuranFormatted = formatSize(ukuranFile);
                            var fileInfoHTML =
                                '<li class="folder-box d-flex align-items-center">' +
                                '<div class="d-flex align-items-center files-list">' +
                                '<div class="flex-shrink-0 file-left"><i data-feather="image"></i></div>' +
                                '<div class="flex-grow-1 ms-3">' +
                                '<h6>' + namaFile + '</h6>' +
                                '<p>' + tanggalUpload + ', ' + ukuranFormatted + '</p>' +
                                '</div>' +
                                '</div>' +
                                '</li>';

                            return {
                                fileInfoHTML: fileInfoHTML,
                                ukuranFile: ukuranFile,
                                timeCreated: metadata.timeCreated
                            };
                        });
                    });

                    Promise.all(filePromises).then(function (fileInfoArray) {
                        // Mengurutkan fileInfoArray berdasarkan tanggal unggahan (timeCreated)
                        fileInfoArray.sort(function (a, b) {
                            var dateA = new Date(a.timeCreated);
                            var dateB = new Date(b.timeCreated);
                            return dateB - dateA; // Urutan menurun (dari yang terbaru ke yang terlama)
                        });

                        var fileInfoHTML = fileInfoArray.map(function (fileInfoObj) {
                            return fileInfoObj.fileInfoHTML;
                        }).join('');

                        var totalSize = fileInfoArray.reduce(function (acc, fileInfoObj) {
                            return acc + fileInfoObj.ukuranFile;
                        }, 0);
                        var totalSizeFormatted = formatSize(totalSize);

                        // Mendapatkan informasi plan pengguna dari Firestore
                        getPlanFromFirestore(uid).then(function (plan) {
                            var userPlan = plan || 'free'; // Jika plan kosong, asumsikan sebagai "free"

                            var planStorageLimit = getPlanStorageLimit(userPlan);
                            var usedStoragePercentage = ((totalSize / convertSizeToBytes(planStorageLimit)) * 100).toFixed(2);

                            var totalSizeInfo =
                                '<ul>' +
                                '<li>' +
                                '<div class="btn btn-outline-primary"><i data-feather="database"></i>Storage</div>' +
                                '<div class="m-t-15">' +
                                '<div class="progress sm-progress-bar mb-3">' +
                                '<div class="progress-bar bg-primary" role="progressbar" style="width: ' + usedStoragePercentage + '%" ' +
                                'aria-valuenow="' + usedStoragePercentage + '" aria-valuemin="0" aria-valuemax="100"></div>' +
                                '</div>' +
                                '<h6 class="f-w-500">' + totalSizeFormatted + ' of ' + planStorageLimit + ' used</h6>' +
                                '</div>' +
                                '</li>' +
                                '</ul>' +
                                '<hr>' +
                                '<ul>' +
                                '<li>' +
                                '<div class="btn btn-outline-primary"><i data-feather="grid"></i>Pricing plan</div>' +
                                '</li>' +
                                '<li> </li>' +
                                '<div class="pricing-plan">' +
                                '<h6>Trial Version </h6>' +
                                '<h5>' + userPlan.toUpperCase() + '</h5>' +
                                '<p>' + planStorageLimit + ' Space</p>' +
                                '<a href="/p/pricing" class="btn btn-outline-primary btn-xs">Selected</a>' +
                                '<img class="bg-img" src="../assets/images/dashboard/folder.png" alt="">' +
                                '</div>' +
                                '</ul>';

                            document.getElementById('fileList').innerHTML = fileInfoHTML;
                            document.getElementById('totalSizeInfo').innerHTML = totalSizeInfo;

                            // Memuat ikon Feather Icons
                            feather.replace();
                        }).catch(function (error) {
                            console.error('Error:', error);
                            var totalSizeInfo =
                                '<ul>' +
                                '<li>' +
                                '<div class="btn btn-outline-primary"><i data-feather="database"></i>Storage</div>' +
                                '<div class="m-t-15">' +
                                '<div class="progress sm-progress-bar mb-3">' +
                                '<div class="progress-bar bg-primary" role="progressbar" style="width: 0%" ' +
                                'aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>' +
                                '</div>' +
                                '<h6 class="f-w-500">Unknown of Unknown used</h6>' +
                                '</div>' +
                                '</li>' +
                                '</ul>' +
                                '<hr>' +
                                '<ul>' +
                                '<li>' +
                                '<div class="btn btn-outline-primary"><i data-feather="grid"></i>Pricing plan</div>' +
                                '</li>' +
                                '<li> </li>' +
                                '<div class="pricing-plan">' +
                                '<h6>Trial Version </h6>' +
                                '<h5>Unknown</h5>' +
                                '<p>Unknown space</p>' +
                                '<a href="/p/pricing" class="btn btn-outline-primary btn-xs">Selected</a>' +
                                '<img class="bg-img" src="../assets/images/dashboard/folder.png" alt="">' +
                                '</div>' +
                                '</ul>';

                            document.getElementById('fileList').innerHTML = fileInfoHTML;
                            document.getElementById('totalSizeInfo').innerHTML = totalSizeInfo;

                            // Memuat ikon Feather Icons
                            feather.replace();
                        });
                    }).catch(function (error) {
                        console.error('Error:', error);
                    });
                } else {
                    console.log('Tidak ada file yang ditemukan');

                    // Mendapatkan informasi plan pengguna dari Firestore
                    getPlanFromFirestore(uid).then(function (plan) {
                        var userPlan = plan || 'free'; // Jika plan kosong, asumsikan sebagai "free"
                        var planStorageLimit = getPlanStorageLimit(userPlan);

                        var totalSizeInfo =
                            '<ul>' +
                            '<li>' +
                            '<div class="btn btn-outline-primary"><i data-feather="database"></i>Storage</div>' +
                            '<div class="m-t-15">' +
                            '<div class="progress sm-progress-bar mb-3">' +
                            '<div class="progress-bar bg-primary" role="progressbar" style="width: 0%" ' +
                            'aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>' +
                            '</div>' +
                            '<h6 class="f-w-500">0 bytes of ' + planStorageLimit + ' used</h6>' +
                            '</div>' +
                            '</li>' +
                            '</ul>' +
                            '<hr>' +
                            '<ul>' +
                            '<li>' +
                            '<div class="btn btn-outline-primary"><i data-feather="grid"></i>Pricing plan</div>' +
                            '</li>' +
                            '<li> </li>' +
                            '<div class="pricing-plan">' +
                            '<h6>Trial Version </h6>' +
                            '<h5>' + userPlan.toUpperCase() + '</h5>' +
                            '<p>' + planStorageLimit + ' Space</p>' +
                            '<div class="btn btn-outline-primary btn-xs">Selected</div>' +
                            '<img class="bg-img" src="../assets/images/dashboard/folder.png" alt="">' +
                            '</div>' +
                            '</ul>';

                        document.getElementById('totalSizeInfo').innerHTML = totalSizeInfo;
                        document.getElementsByClassName('author-mail')[0].textContent = userData.email;
                        // Memuat ikon Feather Icons
                        feather.replace();
                    }).catch(function (error) {
                        console.error('Error:', error);
                    });
                }
            }).catch(function (error) {
                console.error('Error:', error);
            });
        }

        // Fungsi untuk mengubah ukuran file menjadi KB, MB, atau GB
        function formatSize(size) {
            if (size < 1024) {
                return size + ' bytes';
            } else if (size < 1024 * 1024) {
                return (size / 1024).toFixed(2) + ' KB';
            } else if (size < 1024 * 1024 * 1024) {
                return (size / (1024 * 1024)).toFixed(2) + ' MB';
            } else {
                return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
            }
        }

        // Fungsi untuk mengubah ukuran penyimpanan dalam byte menjadi satuan yang lebih besar
        function convertSizeToBytes(size) {
            var numericValue = parseFloat(size);
            var unit = size.match(/[a-zA-Z]+/)[0].toLowerCase();

            switch (unit) {
                case 'kb':
                    return numericValue * 1024;
                case 'mb':
                    return numericValue * 1024 * 1024;
                case 'gb':
                    return numericValue * 1024 * 1024 * 1024;
                default:
                    return numericValue;
            }
        }

        // Fungsi untuk mendapatkan informasi plan pengguna dari Firestore
        function getPlanFromFirestore(uid) {
            return new Promise(function (resolve, reject) {
                var usersCollection = firebase.firestore().collection('users');
                var userDoc = usersCollection.doc(uid);
                userDoc.get().then(function (doc) {
                    if (doc.exists) {
                        resolve(doc.data().plan);
                    } else {
                        resolve(null);
                    }
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
    })
}


