// var to hold db connection 
let dataBase;

// Establish a connection to IndexedDB
const request = indexedDB.open("budget" , 1); 

request.onupgradeneeded = function (event) {
    let db = event.target.result;
    console.log('This is db', db);
    db.createObjectStore("budget", {
        autoIncrement: true
    })
}
request.onsuccess= function (event) {
    dataBase = event.target.result
    if(navigator.onLine) {
        addToDataBase()
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// save record
function saveRecord(record) {
    const transaction = db.transaction(['budget'], 'readwrite');
    
    const budgetObjectStore = transaction.ObjectStore('budget');

    budgetObjectStore.add(record);
}

// addToDataBase
function addToDataBase() {
    const transaction = dataBase.transaction(['budget'], 'readwrite');
    const budgetObjectStore = transaction.ObjectStore('budget');
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        if(getAll.result.length > 0) {
        fetch ('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
            Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          const transaction = db.transaction(['budget'], 'readwrite');
          const budgetObjectStore = transaction.ObjectStore('budget');
          budgetObjectStore.clear();

          alert('All saved transactions have been submitted!')
    })
    .catch(err => {
        console.log(err);
        });
    }
    }
}

// listen for app coming back online
window.addEventListener('online', addToDataBase);


