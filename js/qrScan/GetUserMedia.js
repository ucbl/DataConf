/**   
* Copyright <c> Claude Bernard - University Lyon 1 -  2013
*  License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This file provide simple function to build jquery mobile element such as button or sorted list plus some graph first attempt
*   Version: 1.1
*   Tags: html5 canvas videos qrcode scanner barcode reader
**/


var gCtx = null;
var gCanvas = null;
var imageData = null;
var c=0;
var stype=0;
var gUM=false;
var webkit=false;
var v=null; 

//if html5 isnt supported, try flash !
var camhtml='  	<object  id="iembedflash" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0"  style="max-width:90%;" '+
  		'<param name="movie" value="js/lib/camcanvas.swf" />'+
  		'<param name="quality" value="high" />'+
		'<param name="allowScriptAccess" value="always" />'+
  		'<embed  allowScriptAccess="always"  id="embedflash" src="js/lib/camcanvas.swf" quality="high" style="max-width:90%;" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" mayscript="true"  />'+
    '</object>'; 

var vidhtml = '<video id="v" autoplay  style="max-width:90%;" ></video>'; 

function initCanvas(ww,hh)
{
    gCanvas = document.getElementById("qr-canvas");
    var w = ww;
    var h = hh;
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
    imageData = gCtx.getImageData( 0,0,w,h);
}

//copy img then try to decode qrcode
function captureToCanvas() {
    if(stype!=1)
        return;
    if(gUM)
    {
        gCtx.drawImage(v,0,0);
        try{
            qrcode.decode();
        }
        catch(e){       
            console.log(e);
            setTimeout(captureToCanvas, 500);
        };
    }
    else
    {
        flash = document.getElementById("embedflash");
        try{
            flash.ccCapture();
        }
        catch(e)
        {
            console.log(e);
            setTimeout( captureToCanvas,  1000);
        }
    }
}
 
function read(a)
{  
    var html='<a href="'+a+'" data-role="button" data-icon="arrow-r" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="b">Found ! => '+a+'</a>';   
    $('#command-btn').html(html).trigger("create");
    stype=1; 
    $('#outdiv').remove();
    $('#v').remove();
}	

function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
} 

function load()
{
	if(isCanvasSupported() && window.File && window.FileReader)
	{
		initCanvas(800,600);
		qrcode.callback = read; 
	}
	else
	{ 
		document.getElementById("qrcscan").innerHTML='<br><p id="mp2">sorry your browser is not supported</p><br><br>';
	}
}

function mediaError(evt) {
  document.getElementById('message').innerHTML = 'Error in retrieving user media stream';
}

function setwebcam()
{ 
	  load();
    $('#camBtn').fadeOut("slow");
    if(stype==1)
    {
        setTimeout(captureToCanvas, 500);    
        return;
    }
    
    
    var requestMedia = false;
    //Fonction mediaSuccess : callback qui affiche le flux de la caméra dans la balise HTML5 "video"
    var mediaSuccess;
    var n=navigator;
    //Opera > 12  https://dev.opera.com/articles/view/playing-with-html5-video-and-getusermedia-support/
    document.getElementById("outdiv").innerHTML = vidhtml;
    v=document.getElementById("v");
    if (n.getUserMedia) {
	    requestMedia = function(constraints, successCallback, errorCallback) {
		    return n.getUserMedia(constraints, successCallback, errorCallback);
	    };
	    mediaSuccess = function(stream) { 
        gUM=true; 
		    v.src = stream;
		    v.onerror = function () {
			    stream.stop();
		    };
		    stream.onended = mediaError;
        setTimeout( captureToCanvas , 500);
        $(window).one('hashchange', function() {  
          stream.stop();
          stype=0;
        });
	    }

    // Chrome > 22 (tested on Chrome Canary, version : 28.0.1459.0)  http://stackoverflow.com/questions/12442864/chrome-webkitgetusermedia
    } else if (n.webkitGetUserMedia) {
	    requestMedia =  function(constraints, successCallback, errorCallback) {
		    return n.webkitGetUserMedia(constraints, successCallback, errorCallback);
	    };
	    mediaSuccess = function(stream) { 
        gUM=true; 
		    v.src = window.webkitURL.createObjectURL(stream);
		    v.onerror = function () {
			    stream.stop();
		    };
		    stream.onended = mediaError;
        setTimeout( captureToCanvas , 500); 
        window.onhashchange = function() {  
          stream.stop();
          stype=0;
        };
	    }

    // FF Nightly > 18 (tested on 22a.01)  https://developer.mozilla.org/en-US/docs/WebRTC/Taking_webcam_photos
    } else if (n.mozGetUserMedia) { 
	    requestMedia =  function(constraints, successCallback, errorCallback) {
		    return n.mozGetUserMedia(constraints, successCallback, errorCallback);
	    };
	    mediaSuccess = function(stream) {
        gUM=true;
		    v.mozSrcObject  = stream;
		    //L'attribut autoplay de la balise video n'est pas reconnu par Nightly
		    v.play();
		    v.onerror = function () {
			    stream.stop();
		    };
		    stream.onended = mediaError;
        setTimeout( captureToCanvas , 500);
        window.onhashchange = function() {  
          stream.stop();
          stype=0;
        };
	    }

    // IE > 9. should work, /_!_\ IE10 doesnt know msGetUserMedia http://html5labs.interoperabilitybridges.com/prototypes/media-capture-api-%282nd-updated%29/media-capture-api-%282nd-update%29/documentation
    
    } else if (n.msGetUserMedia != undefined) {
	    requestMedia = function(constraints, successCallback, errorCallback) {
		    return n.msGetUserMedia(constraints, successCallback);
	    };
	    mediaSuccess = function(stream) { 
        gUM=true;
		    document["v"].src = URL.createObjectURL(stream);
		    v.onerror = function () {
			    stream.stop();
		    };
        setTimeout( captureToCanvas , 500);
        window.onhashchange = function() {  
          stream.stop();
          stype=0;
        };
		    stream.onended = mediaError;
	    }
    }else{ document.getElementById("outdiv").innerHTML = camhtml;}
    
    if(requestMedia) {
	  // camera activation prompt  http://dev.w3.org/2011/webrtc/editor/getusermedia.html#navigatorusermedia 
	  requestMedia({video:true}, mediaSuccess, mediaError);
	  stype=1;
  } else {
	  document.getElementById("message").innerHTML = 'getUserMedia() is not supported in your browser';
  } 
}





