/**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This object contains a json definition of all the commands that will prepare all the queries we want to send on the DBLP sparql endpoint.
*				 Each one of those commands declare the datatype, the method, the query string it is supposed to use on the endpoint and provide the Callback function used to parse the results.		
*				 To declare a request, each commands can use the parameters declared for the route they are called in (see Configuration.js). This parameter can be a name or an uri and represents
*				 the entity which we want informations on. After calling a command, the results are parsed with it own callback function. It is the role of the router to call those commands according to the configuration file.
*   Version: 0.8
*   Tags:  JSON, SPARQL, AJAX
**/
 var DBLPCommandStore = {
 
	getAuthor : {
		dataType : "JSONP",
		method : "GET",
		getQuery : function(parameters){ //JSON file parameters 
			var authorName = parameters.id.split("_").join(" ");
			var prefix =   ' PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' + 
								' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
								' PREFIX owl: <http://www.w3.org/2002/07/owl#>              ' +
								' PREFIX dc: <http://purl.org/dc/elements/1.1/>             ' +
								' PREFIX foaf: <http://xmlns.com/foaf/0.1/>                 ' +
								' PREFIX swrc: <http://swrc.ontoware.org/ontology#>         ' +
								' PREFIX dcterms: <http://purl.org/dc/terms/>               ';  
								
			var query =    ' SELECT DISTINCT  ?Site ?OtherPublicationTitle ?OtherPublicationUri ?Year  WHERE      ' +
								 ' {?uriAuthor foaf:name "'+ authorName +'" . ' +
								 '   OPTIONAL {?uriAuthor foaf:homepage ?Site . }    '  +
								 '   ?OtherPublicationUri foaf:maker ?uriAuthor  .  '+						
								 '   ?OtherPublicationUri dc:title ?OtherPublicationTitle  .    '+
								 '   ?OtherPublicationUri dcterms:issued ?Years .      '+
								 ' } ORDER BY (?OtherPublicationTitle )  DESC  (?Year)';
			var  ajaxData = { query : prefix+query , output : "json"};
			return ajaxData;
	},
	 ModelCallBack : function(dataJSON){ 
		$("[data-role = page]").find(".content").append("<div id='otherPublication'><h2>Other Publications</h2></div>");
		$.each(dataJSON.results.bindings,function(i,item){
							var publiUri  = this.OtherPublicationUri.value;
							var publiTitle  = this.OtherPublicationTitle.value;
						   var newButton = $('<a href="#externPublication/'+publiTitle.split(' ').join('_')+'" data-role="button" data-icon="arrow-r" data-iconpos="right" >'+publiTitle+'</a>'); 
						  $("[data-role = page]").find(".content").append(newButton).trigger("create");                             
				  });

		}
	  },    
                                
                                
	getExternPublicationInfo : {
		dataType : "JSONP",
		method : "GET",
		getQuery : function(parameters){ //JSON file parameters 
			var publicationTitle = parameters.id.split('_').join(' '); 
			var  type  = "^^xsd:string";
			var prefix =   ' PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' + 
								' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
								' PREFIX owl: <http://www.w3.org/2002/07/owl#>              ' +
								' PREFIX dc: <http://purl.org/dc/elements/1.1/>             ' +
								' PREFIX foaf: <http://xmlns.com/foaf/0.1/>                 ' +
								' PREFIX swrc: <http://swrc.ontoware.org/ontology#>         ' +
								' PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' +
								' PREFIX dcterms: <http://purl.org/dc/terms/>               ';  
								
			var query = 'SELECT DISTINCT   ?Year ?Conference ?Publisher ?Title WHERE      '+
						 ' {   																            '+
						 '    ?publicationUri dc:title "'+publicationTitle+'"'+type+'.'+
						 '    ?publicationUri dc:title ?Title ;                                '+
						 '              		   dcterms:issued ?Year .                  '+
						 '   ?publicationUri dcterms:partOf ?uriConf.                 '+	
						 '    ?uriConf 	dc:title  ?Conference .                           '+
						 '    ?uriConf 	 dc:publisher ?Publisher.                       '+			
						 ' }';
						 
			var  ajaxData = { query : prefix+query , output : "json"};
			return ajaxData;
		},
		ModelCallBack : function(dataJSON){
			$("[data-role = page]").find(".content").append("<div id='externPublication'><h2>Extern Publication</h2></div>");
				$.each(dataJSON.results.bindings,function(i,item){
				var title       = this.Title.value;
				var conf        = this.Conference.value;
				var year        = this.Year.value;
				var publisher = this.Publisher.value;
					
				$("[data-role = page]").find(".content").append('<h2>Titre</h2>').trigger("create");	
				$("[data-role = page]").find(".content").append('<p>'+title+'</p>').trigger("create");
				$("[data-role = page]").find(".content").append('<h2>Year</h2>').trigger("create");
				$("[data-role = page]").find(".content").append('<p>'+year+'</p>').trigger("create"); 
				$("[data-role = page]").find(".content").append('<h2>Conference</h2>').trigger("create");
				$("[data-role = page]").find(".content").append('<p>'+conf+'</p>').trigger("create"); 
				$("[data-role = page]").find(".content").append('<h2>Publisher</h2>').trigger("create");
				$("[data-role = page]").find(".content").append('<p>'+publisher+'</p>').trigger("create"); 
																								  
			});
		}										  
	}

};//End DBLPCommandStore JSON file  
                                  
                                
 


    
 