/**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This object contains a json definition of all the commands that will prepare all the queries we want to send on the Google endpoint.
*				 Each one of those commands declare the datatype, the method, the query string it is supposed to use on the endpoint and provide the Callback function used to parse the results.		
*				 To declare a request, each commands can use the parameters declared for the route they are called in (see Configuration.js). This parameter can be a name or an uri and represents
*				 the entity which we want informations on. After calling a command, the results are parsed with it own callback function. It is the role of the router to call those commands according to the configuration file.
*   Version: 0.8
*   Tags:  JSON, AJAX
**/
 var GoogleCommandStore = {

	/** Command used to get and display the most probable homepage of a given author**/
	getAuthorPersonalPage : {
		dataType : "JSONP",
		method : "GET",
		getQuery : function(parameters){ 
			var searchValue = parameters.id.split('_').join(' ');
			var  ajaxData = { q : searchValue, v : "1.0" };
			return ajaxData ; 
		},
		ModelCallBack : function (dataJSON){									
			$("[data-role = page]").find(".content").append('<h2>Personal Page</h2>').trigger("create");	
			$("[data-role = page]").find(".content").append('<a href="'+ dataJSON.responseData.results[0].url+'" >' + dataJSON.responseData.results[0].url+'</a>').trigger("create");					
		}
	}

};//End GoogleCommandStore file


   
