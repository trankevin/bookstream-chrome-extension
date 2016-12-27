// DB init
var lib = new localStorageDB("my_db", localStorage);

// Check if the database was just created. Useful for initial database setup
if( lib.isNew() ) {
	
    // rows for pre-population
    // var rows = [
    //     {url: "http://movietv.pro/creed/", title: "Watch Creed", html: '<iframe src="https://openload.co/embed/5trRdH6mujU/Creed.2015.DVDScr.XVID.AC3.HQ.Hive-CM8.avi.mp4" scrolling="no" frameborder="0" width="800" height="430" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>'}
    // ];

    // create table 
    lib.createTable("my_videos", ["url", "title", "html"]);
    
    if (lib.commit()) {
        console.log('DB created.');
    }
}

// MESSAGE LISTENERS

//Load Listener
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.method == 'load') {
        var data = {};
        data = initLoad();
        sendResponse(data);
      }
  });

// CRUD Listener
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.method == "save" && request.data != null) {
        var rowId = insert(request.data);
        if(rowId){
            sendResponse({videoId: rowId});
        }
        else {
            //sendResponse({videoId})
        }
    }
    else if (request.method == "update") {

    }
    else if (request.method == "delete" && request.data != null) {
        var res = deleteVid(request.data);
        if(res){
            sendResponse({res: true});
        }
        else {
            sendResponse({res: false});
        }
    }
  });

function initLoad() {
    return lib.queryAll('my_videos', {});
}
function insert(obj) {
    var rowId = lib.insert("my_videos", obj);
    if (lib.commit()) {
        console.log('Video inserted.');  
        return rowId;
    }
    else {
        console.log('Error inserting record.')
        return false;
    }
}

function update(data) {
    lib.update("my_videos", {}, function(row) {
        row.html = data.html;
        // the update callback function returns to the modified record
        return row.ID;
    });

    if (lib.commit()) {
        console.log('Updated.');  
    }
    else {
        console.log('Error updating record.')
    }
    
}

function deleteVid(id) {
    lib.deleteRows("my_videos", {ID: id});

    if (lib.commit()) {
        return true;
        console.log('Deleted.');  
    }
    else {
        return false;
        console.log('Error deleting record.')
    }
}

