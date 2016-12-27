//$(document).ready(function($) {
	// RECIEVE MESSAGE
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.method == 'play'){
    	console.log(JSON.stringify(request));
    	injectVideo(request)
    	sendResponse({msg: 'receieved'});
 	}
  });
//});

function injectVideo(request) {
		$('#video-title').text(request.title);
    	$('.embed-responsive').append(decodeURI(request.html));
      	
}