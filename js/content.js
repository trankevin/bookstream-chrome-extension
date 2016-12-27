// 
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	var data = {};
    if (request.element == 'iframe') {
		data.html = $("iframe").get(0).outerHTML;
		if ($('h1').text()) {
			data.title = $('h1').text();
		}
		else {
			data.title = document.title;
		}
      	sendResponse(data);
      }
  });
