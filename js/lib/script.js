tid = 1;	
function calcSize(){
		
		if(pageHeight()<400) i = pageHeight()-100;
		else i = pageHeight() - 210;

	for(az=1;az<=5;az++){
		document.getElementById('incomingMessages'+ az +'').style.height = i + 'px';
	}
}

var resizeTimer = null;
$(window).bind('resize', function() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(calcSize, 200);
});

$(function(){

$('body').bind('orientationchange',function(event){
	calcSize()
})

})

function actionSwipeLeft(){
	if(tid!=5){
		var temptid=tid+1;
		$("#linkRoom"+ tid +"").removeClass("ui-btn-active");
		$("#linkRoom"+ temptid +"").addClass("ui-btn-active");
		$('#incomingMessages'+ tid +'').hide();
		$('#incomingMessages'+ temptid +'').show();
		$('#title'+ tid +'').hide();
		$('#title'+ temptid +'').show();
		tid++;
	}
}

function actionSwipeRight(){
	if(tid!=1){
		var temptid=tid-1;
		$("#linkRoom"+ tid +"").removeClass("ui-btn-active");
		$("#linkRoom"+ temptid +"").addClass("ui-btn-active");
		$('#incomingMessages'+ tid +'').hide();
		$('#incomingMessages'+ temptid +'').show();
		$('#title'+ tid +'').hide();
		$('#title'+ temptid +'').show();
		tid--;
	}
}


function initPage(){


	$('#incomingMessages2').hide();
	//$('#navBack').hide();
	$('#linkHide').hide();
	$('#linkSettings2').hide();
	for(i=2;i<=5;i++){
		$('#title'+i+'').hide();
		$('#incomingMessages'+i+'').hide();
	}

	$("#linkRoom1").on('click',function(){
	tid=1;
	for(i=0;i<=5;i++){
		if(i!=1){
			$('#incomingMessages'+ i +'').hide();
			$('#title'+ i +'').hide();
		}
	}
		$('#incomingMessages'+ tid +'').show();
		$('#title'+ tid +'').show();
	});	
	
	$("#linkRoom2").on('click',function(){
	tid=2;
	for(i=0;i<=5;i++){
		if(i!=2){
			$('#incomingMessages'+ i +'').hide();
			$('#title'+ i +'').hide();
		}
	}
		$('#incomingMessages'+ tid +'').show();
		$('#title'+ tid +'').show();
	});
	
	$("#linkRoom3").on('click',function(){
	tid=3;
	for(i=0;i<=5;i++){
		if(i!=3){
			$('#incomingMessages'+ i +'').hide();
			$('#title'+ i +'').hide();
		}
	}	
		$('#incomingMessages'+ tid +'').show();
		$('#title'+ tid +'').show();
	});	
	
		
	$("#linkRoom4").on('click',function(){
	tid=4;
	for(i=0;i<=5;i++){
		if(i!=4){
			$('#incomingMessages'+ i +'').hide();
			$('#title'+ i +'').hide();
		}
	}
		$('#incomingMessages'+ tid +'').show();
		$('#title'+ tid +'').show();
	});
	
	$("#linkRoom5").on('click',function(){
	tid=5;
	for(i=0;i<=5;i++){
		if(i!=5){
			$('#incomingMessages'+ i +'').hide();
			$('#title'+ i +'').hide();
		}
	}
		$('#incomingMessages'+ tid +'').show();
		$('#title'+ tid +'').show();
	});
	

	$("#linkCloseRoom").click(function(){
	if(tid!=1){
		$('#incomingMessages'+ tid +'').hide();
		$('#linkRoom'+ tid +'').parent().remove();
		$('#title'+ tid +'').hide();
		if(tid==1) tid++;
		else tid=1;
		$('#incomingMessages'+ tid +'').show();
		$('#title'+ tid +'').show();
		$("#linkRoom"+ tid +"").addClass("ui-btn-active");
	}
		$("#linkCloseRoom").removeClass("ui-btn-active");
  	});
  	
	$(".backButton").on('click',function(){
		$(".backButton").removeClass("ui-btn-active");
	});
	
	calcSize();
	
		
  // Reset Font Size
	var originalFontSize = $('.msgContainerDiv').css('font-size');
    
    $(".resetFont").click(function(){
    	$('.msgContainerDiv').css('font-size', originalFontSize);
	});
	
  // Increase Font Size
	$(".increaseFont").click(function(){
		var currentFontSize = $('.msgContainerDiv').css('font-size');
    	var currentFontSizeNum = parseFloat(currentFontSize, 10);
    	var newFontSize = currentFontSizeNum*1.2;
    	$('.msgContainerDiv').css('font-size', newFontSize);
    	return false;
  	});
  	
  // Decrease Font Size
 	$(".decreaseFont").click(function(){
    	var currentFontSize = $('.msgContainerDiv').css('font-size');
    	var currentFontSizeNum = parseFloat(currentFontSize, 10);
    	var newFontSize = currentFontSizeNum*0.8;
    	$('.msgContainerDiv').css('font-size', newFontSize);
    	return false;
  	});
  	
	$(".msgContainerDiv").swipeleft(function() {
		actionSwipeLeft();
	});
    
	$(".msgContainerDiv").swiperight(function() {
		actionSwipeRight();
	});
	
	}
