$(document).ready(function() {
	init();
	//CLICK - Grab video from page
	$(document).on('click', '#save_btn', function() {
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
			chrome.tabs.sendMessage(tabs[0].id, {element: 'iframe'}, function(response) {
		    	saveVideo(response);
		    	//console.log(JSON.stringify(response));
		  	});
		});
	});
	//CLICK - Play button
	$(document).on('click', '.play-btn', function() {
		newTab($(this).text(), $(this).data('video-html'));
	});
	//CLICK - Delete button
	$(document).on('click', '.delete', function() {
		deleteVid($(this).data('video-id'));
	});
});
function init(){
	$(".list_playlist").empty();
	// Load my videos from db
	chrome.runtime.sendMessage({method: "load"}, function(response) {
	  if (response.length > 0) {
	  	console.log(JSON.stringify(response));
	  	loadList(response);
	  }
	  else {
	  	console.log('no videos');
	  }
	});
}
function loadList(list) {
	list.reverse();
	for (var i = list.length - 1; i >= 0; i--) {
		// var list_html = '<li class="list-group-item"><h4>'+ list[i].title +'</h4>';
		// 	list_html += '<button class="btn play-btn" type="button" class="btn btn-default" data-video-html="' + encodeURI(list[i].html) + '" data-video-title="' + list[i].title + '">Play Video</button>';
		// 	list_html += '</li>';
			var list_html = '<div class="list-group-item"><button class="play-btn" type="button" data-video-id="' + list[i].ID + '" data-video-html="' + encodeURI(list[i].html) + '">' + list[i].title +'</button><button data-video-id="' + list[i].ID + '" class="btn btn-default pull-right delete"><span class="glyphicon glyphicon-remove"></span></button></div>';
		  	$(".list_playlist").append(list_html);
	};
}
function saveVideo(data) {
	// chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
	// 	data.url = encodeURI(tabs[0].url);
	// 	console.log(data.url);
	// });

	// SAVE VIDEO TO DB
	chrome.runtime.sendMessage({method: 'save', data: data}, function(response) {
		if (response.videoId) {
			// var list_html = '<li class="list-group-item"><h4>'+ data.title +'</h4>';
			// list_html += '<button class="btn play-btn" type="button" class="btn btn-default" data-video-html="' + encodeURI(data.html) + '" data-video-title="' + data.title + '">Play Video</button>';
			// list_html += '</li>';
			
			var list_html = '<div class="list-group-item"><button class="play-btn " type="button" data-video-id="' + response.videoId + '" data-video-html="' + encodeURI(data.html) + '">' + data.title +'</button><button data-video-id="' + response.videoId + '" class="btn btn-default pull-right delete"><span class="glyphicon glyphicon-remove"></span></button></div>';
			
		  	$(".list_playlist").append(list_html);
		};
	});
}
function deleteVid(id) {
	chrome.runtime.sendMessage({method: 'delete', data: id}, function(response) {
		if (response.res) {
			init();
		}
	});
}
// Create new tab and send video data
function newTab(title, html) {
	chrome.tabs.create({url: chrome.extension.getURL('player.html'), active:false}, function(tab) {
		chrome.tabs.onUpdated.addListener(function(tabId, info)       {
	        if (tabId == tab.id && info.status == "complete")
	          chrome.tabs.sendMessage(tab.id, {method: "play", title: title, html: html}, function(response) {
			    	console.log('video recieved');
			    	chrome.tabs.update(tab.id,{active:true});
			  	});

	      });

	});
    //window.open(chrome.extension.getURL('player.html');, 'Popup Window', 'width=640,height=480,location=yes,scrollbars=yes');
}

function htmlEncode(value){
  return $('<div/>').text(value).html();
}

function htmlDecode(value){
  return $('<div/>').html(value).text();
}


