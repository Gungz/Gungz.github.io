var dbPromised = idb.open("clubs", 1, function(upgradeDb) {
  upgradeDb.createObjectStore("clubs", {
    keyPath: "id"
  });
});

function saveForLater(club) {
  return dbPromised
    .then(function(db) {
      var tx = db.transaction("clubs", "readwrite");
      var store = tx.objectStore("clubs");
      console.log(club);
      return store.put(club);
      //return tx.complete;
    });    
}

function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("clubs", "readonly");
        var store = tx.objectStore("clubs");
        return store.getAll();
      })
      .then(function(clubs) {
        resolve(clubs);
      });
  });
}

function getById(id) {
  console.log(`getById: ${id}`);
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("clubs", "readonly");
        var store = tx.objectStore("clubs");
        return store.get(id);
      })
      .then(function(club) {
        console.log(club);
        resolve(club);
      });
  });
}

function deleteById(id) {
  return dbPromised.then(function(db) {
    var tx = db.transaction('clubs', 'readwrite');
    var store = tx.objectStore('clubs');
    return store.delete(id);
  });
}
