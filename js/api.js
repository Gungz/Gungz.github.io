var base_url = "https://api.football-data.org/v2/";
var token = "d2104bfe0dd54ccab24184d74d6c0872";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log(`Error : ${response.status}`);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
  document.getElementById("loader").style.display = "none";
}

// Blok kode untuk melakukan request data json
function getStanding() {
  document.getElementById("loader").style.display = "block";
  
  fetch(base_url + "competitions/2021/standings?standingType=TOTAL", { 
    headers: {
      'X-Auth-Token': token
    }
  })
    .then(status)
    .then(json)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card club secara dinamis
      var standingHTML = `
                <table class="highlight responsive-table">
                  <thead>
                    <tr>
                      <th>Pos.</th>
                      <th>Club</th>
                      <th>P</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>Last 5</th>
                      <th>GF</th>
                      <th>GA</th>
                      <th>GD</th>
                      <th>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
              `;
      data.standings[0].table.forEach(function(standing) {
        standingHTML += `
              <tr>
                <td>${standing.position}</td>
                <td><a href="./club.html?id=${standing.team.id}">${standing.team.name}</a></td>
                <td>${standing.playedGames}</td>
                <td>${standing.won}</td>
                <td>${standing.draw}</td>
                <td>${standing.lost}</td>
                <td>${standing.form}</td>
                <td>${standing.goalsFor}</td>
                <td>${standing.goalsAgainst}</td>
                <td>${standing.goalDifference}</td>
                <td>${standing.points}</td>
              </tr>
            `;
      });
      standingHTML += "</tbody></table>";
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("table").innerHTML = standingHTML;
      document.getElementById("loader").style.display = "none";
    })
    .catch(error);
}

function getClubById() {
  return new Promise(function(resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    
    document.getElementById("loader").style.display = "block";

    fetch(base_url + "teams/" + idParam, {
      headers: {
        'X-Auth-Token': token
      }
    })
      .then(status)
      .then(json)
      .then(function(data) {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        // console.log(data);
        // Menyusun komponen card club secara dinamis
        var clubHTML = `
          <div class="row">
            <div class="col s12 m8 offset-m2">
              <div class="card">
                <div class="card-image">
                  <img src="${data.crestUrl}" style="max-height: 240.63px">
                </div>
                <div class="card-title center-align"><strong>${data.shortName}</strong></div>
                <div class="card-content">
                  <div class="row">
                    <div class="col s4"><strong>Address:</strong></div>
                    <div class="col s8">${data.address}</div>
                    <div class="col s4"><strong>Phone:</strong></div>
                    <div class="col s8">${data.phone}</div>
                    <div class="col s4"><strong>Website:</strong></div>
                    <div class="col s8">${data.website}</div>
                    <div class="col s4"><strong>Founded:</strong></div>
                    <div class="col s8">${data.founded}</div>
                    <div class="col s4"><strong>Colors:</strong></div>
                    <div class="col s8">${data.clubColors}</div>
                    <div class="col s4"><strong>Venue:</strong></div>
                    <div class="col s8">${data.venue}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = clubHTML;
        document.getElementById("loader").style.display = "none";
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      }).catch(error);
  });
}

function getSavedClubs() {
  getAll().then(function(clubs) {
    console.log(clubs);
    var clubsHTML = "";
    // Menyusun komponen card club secara dinamis
    if (clubs.length == 0) {
      clubsHTML = "<p>Belum ada data club yang disimpan.</p>";
    } else {
      clubsHTML = `<div class="row" style="display: flex; flex-wrap: wrap;">`;
      clubs.forEach(function(club) {
        clubsHTML += `
                  <div class="col s12 m4">
                    <div class="card">
                      <div class="card-image">
                        <a href="./club.html?id=${club.id}&saved=true">
                          <img src="${club.crestUrl}" style="max-height: 240.63px;">
                          <a onclick="deleteSavedClub(${club.id})" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">delete</i></a>
                        </a>
                      </div>
                    </div>
                  </div>
                  `;
      });
      clubsHTML += "</div>";
    }
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("clubs").innerHTML = clubsHTML;
  });
}

function getSavedClubById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  
  getById(parseInt(idParam)).then(function(data) {
    var clubHTML = `
      <div class="row">
        <div class="col s12 m8 offset-m2">
          <div class="card">
            <div class="card-image">
              <img src="${data.crestUrl}" style="max-height: 240.63px">
            </div>
            <div class="card-title center-align"><strong>${data.shortName}</strong></div>
            <div class="card-content">
              <div class="row">
                <div class="col s4"><strong>Address:</strong></div>
                <div class="col s8">${data.address}</div>
                <div class="col s4"><strong>Phone:</strong></div>
                <div class="col s8">${data.phone}</div>
                <div class="col s4"><strong>Website:</strong></div>
                <div class="col s8">${data.website}</div>
                <div class="col s4"><strong>Founded:</strong></div>
                <div class="col s8">${data.founded}</div>
                <div class="col s4"><strong>Colors:</strong></div>
                <div class="col s8">${data.clubColors}</div>
                <div class="col s4"><strong>Venue:</strong></div>
                <div class="col s8">${data.venue}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = clubHTML;
  });
}

function deleteSavedClub(id) {
  deleteById(parseInt(id)).then(() => {
    M.toast({html: 'Saved club is successfully deleted!'});
    getSavedClubs();
  }).catch((err) => {
    console.log(err);
    M.toast({html: err});
  });
}

function requestPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(function (result) {
      if (result === "denied") {
        console.log("Fitur notifikasi tidak diijinkan.");
        return;
      } else if (result === "default") {
        console.error("Pengguna menutup kotak dialog permintaan ijin.");
        return;
      }
      
      if (('PushManager' in window)) {
        navigator.serviceWorker.getRegistration().then(function(registration) {
          registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array("BDnQG89pRW8LX64kEooJMjDjXVZORhdpDjNBP0vfmaTVyp6sHZjUl4BFc3ILPIT8V03uZHigGvKAE1bDru6KWmo")
          }).then(function(subscribe) {
              console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
              console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                  null, new Uint8Array(subscribe.getKey('p256dh')))));
              console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                  null, new Uint8Array(subscribe.getKey('auth')))));
          }).catch(function(e) {
              console.error('Tidak dapat melakukan subscribe ', e.message);
          });
        });
      }
    });
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(function() {
        console.log("Pendaftaran ServiceWorker berhasil");
      })
      .catch(function() {
        console.log("Pendaftaran ServiceWorker gagal");
      });
  });
  requestPermission();
} else {
  console.log("ServiceWorker belum didukung browser ini.");
}