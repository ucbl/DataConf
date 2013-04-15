/**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Beno�t DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This object contains a json definition of all the commands that will prepare all the queries we want to send on the DuckDuckGo endpoint.
*				 Each one of those commands declare the datatype, the method, the query string it is supposed to use on the endpoint and provide the Callback function used to parse the results.		
*				 To declare a request, each commands can use the parameters declared for the route they are called in (see Configuration.js). This parameter can be a name or an uri and represents
*				 the entity which we want information on. After calling a command, the results are parsed with it own callback function. It is the role of the router to call those commands according to the configuration file.
*   Version: 0.8
*   Tags:  JSON, SPARQL, AJAX
**/
 var DDGoCommandStore = {
 
	getResultOrganization : {
		dataType : "JSONP",
		method : "GET",
		getQuery : function(parameters){ 
			var searchValue = parameters.id.split('_').join(' ');
			var  ajaxData = { q : searchValue, format : "json",pretty : 1, no_redirect : 1  , output : "json"};
			return ajaxData ; 
		},
		ModelCallBack : function (dataJSON){

													
			if(dataJSON.Heading !== undefined)			    $("[data-role = page]").find(".content").prepend('<h3>'+dataJSON.Heading+' </h3>').trigger("create");	
			if(dataJSON.Image !== undefined)			    $("[data-role = page]").find(".content").prepend('<img src="'+ dataJSON.Image+'" alt="OrganizationLogo" height="100" width="100" style="box-shadow: 8px 8px 12px #aaa;">').trigger("create");	
															$("[data-role = page]").find(".content").append('<h2>Abstract Text</h2>').trigger("create");	
			if(dataJSON.AbstractText !== undefined)	        $("[data-role = page]").find(".content").append('<h4>'+dataJSON.AbstractText+'</h4>').trigger("create");	
															$("[data-role = page]").find(".content").append('<h2>Official Site</h2>').trigger("create");	
			if(dataJSON.Results[0] !== undefined) {									
				if(dataJSON.Results[0].FirstURL !== undefined)    $("[data-role = page]").find(".content").append('<a href="'+ dataJSON.Results[0].FirstURL+'" >' + dataJSON.Results[0].FirstURL+'</a>').trigger("create");	
			}
		}
	},

	getResultAuthor : {
		dataType : "JSONP",
		method : "GET",
		getQuery : function(parameters){ 
			var searchValue = parameters.id.split('_').join(' ');
			var query = searchValue+'&format=json&pretty=1&no_redirect=1';//Put in URL (get method)
			var  ajaxData = { q : searchValue, format : "json",pretty : 1, no_redirect : 1  , output : "json"};
			return ajaxData ; 
		},
		ModelCallBack : function (dataJSON){
			if(dataJSON.Heading !== undefined)	$("[data-role = page]").find(".content").prepend('<h3>Author  '+dataJSON.Heading+'</h3>').trigger("create");	
			//Due to privacy issues, we prefr not to show persona images on the interface.
			//if(dataJSON.Image !== undefined)	$("[data-role = page]").find(".content").prepend('<img src="'+ dataJSON.Image+'" alt="OrganizationLogo" height="60" width="60" style="box-shadow: 8px 8px 12px #aaa;">').trigger("create");	
		}
	}                      

};//End DDGoCommandStore file


   
