// ref unit 18 homework last two activities 

let dataBase;

const request = indexedDB.open("budget" , 1) 
request.onupgradeneeded = function (event) {
    let db = event.target.result;
    db.creatObjectStore("pending", {
        autoIncrement: true
    })
}
request.onsuccess= function (event) {
    dataBase = event.target.result
    if(navigator.onLine) {
        addToDataBase()
    }
}

// create the function save record 
// create the function add to data base in this file 
// ref 18 unit!!! 
// add this file to index.html at the bottom aas a script 