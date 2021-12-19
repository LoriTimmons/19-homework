// var to hold db connection
let dataBase;

// Establish a connection to IndexedDB
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  let dataBase = event.target.result;
  dataBase.createObjectStore('new_budget', {
    autoIncrement: true,
  });
};
request.onsuccess = function (event) {
  dataBase = event.target.result;
  if (navigator.onLine) {
    addToDataBase();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

// save record
function saveRecord(record) {
  const transaction = dataBase.transaction(['new_budget'], "readwrite");

  const budgetObjectStore = transaction.objectStore('new_budget');

  budgetObjectStore.add(record);
}

// addToDataBase
function addToDataBase() {
  const transaction = dataBase.transaction(['new_budget'], "readwrite");
  const budgetObjectStore = transaction.objectStore('new_budget');
  const getAll = budgetObjectStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          const transaction = dataBase.transaction(['new_budget'], "readwrite");
          const budgetObjectStore = transaction.objectStore('new_budget');
          budgetObjectStore.clear();

          //   alert('All saved transactions have been submitted!')
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", addToDataBase);
