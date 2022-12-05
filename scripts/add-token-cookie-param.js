// The sendingRequest and responseReceived functions will be called for all requests/responses sent/received by ZAP, 
// including automated tools (e.g. active scanner, fuzzer, ...)

// Note that new HttpSender scripts will initially be disabled
// Right click the script in the Scripts tree and select "enable"  

// 'initiator' is the component the initiated the request:
// 		1	PROXY_INITIATOR
// 		2	ACTIVE_SCANNER_INITIATOR
// 		3	SPIDER_INITIATOR
// 		4	FUZZER_INITIATOR
// 		5	AUTHENTICATION_INITIATOR
// 		6	MANUAL_REQUEST_INITIATOR
// 		7	CHECK_FOR_UPDATES_INITIATOR
// 		8	BEAN_SHELL_INITIATOR
// 		9	ACCESS_CONTROL_SCANNER_INITIATOR
// 		10	AJAX_SPIDER_INITIATOR
// For the latest list of values see the HttpSender class:
// https://github.com/zaproxy/zaproxy/blob/main/zap/src/main/java/org/parosproxy/paros/network/HttpSender.java
// 'helper' just has one method at the moment: helper.getHttpSender() which returns the HttpSender 
// instance used to send the request.
//
// New requests can be made like this:
// msg2 = msg.cloneAll() // msg2 can then be safely changed as required without affecting msg
// helper.getHttpSender().sendAndReceive(msg2, false);
// print('msg2 response=' + msg2.getResponseHeader().getStatusCode())

function sendingRequest(msg, initiator, helper) {
	
     print('sendingRequest called for url=' + msg.getRequestHeader().getURI().toString())
     var cookies = msg.getCookieParams();
     print ("Cookies before update: " + cookies);

     var updatedCookies = modifyCookies(cookies);
     
     msg.setCookieParams(updatedCookies);
}

var COOKIE_TYPE   = org.parosproxy.paros.network.HtmlParameter.Type.cookie;
var params = {{ params | tojson | safe }}; // pass a dictionary wtih cookieName and cookieVal as keys
// cookieVal will be replaced with a token that can be obtained via 'Copy login command' menu in the console

function modifyCookies(cookies) {
    var hasAccessToken = 0
    var iterator = cookies.iterator();
    while(iterator.hasNext()) {
        var cookie = iterator.next();
        if(params.cookieName && params.cookieVal) {
            print('cookie name: ' + str(params.cookieName))
            if (cookie.getName().equals(params.cookieName)) {
                cookie.setValue(params.cookieVal)
                hasAccessToken = 1          
            }  
        }
    }
    if(hasAccessToken==0){
        var HtmlParameter = Java.type('org.parosproxy.paros.network.HtmlParameter')
        var newCookie = new HtmlParameter(COOKIE_TYPE, params.cookieName, params.cookieVal);

        cookies.add(newCookie)
    }
    return cookies;
}

function responseReceived(msg, initiator, helper) {
	// Debugging can be done using println like this
	print('responseReceived called for url=' + msg.getRequestHeader().getURI().toString())
}