/**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Beno�t DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This object contains a json definition of all the commands that will prepare all the queries we want to send on the SemanticWebDogFood sparql endpoint.
*				 Each one of those commands declare the datatype, the method, the query string it is supposed to use on the endpoint and provide the Callback function used to parse the results.		
*				 To declare a request, each commands can use the parameters declared for the route they are called in (see Configuration.js). This parameter can be a name or an uri and represents
*				 the entity which we want informations on. After calling a command, the results are parsed with it own callback function. It is the role of the router to call those commands according to the configuration file.
*   Version: 0.8
*   Tags:  JSON, SPARQL, AJAX
**/
var SWDFCommandStore = { 

	/** Command used to get and display  all the authors that have a publication in the conference's proceedings using the conference uri **/
	getAllAuthors : {
		//Declaration of the datatype to use when sending the query
		dataType : "XML",
		//Declaration of the method to use when sending the query
		method : "GET", 
		//Declaring the function that will build the query using the parameters (the conference informations or a specific part of the url declared in configuration.js), encapsulate it in a JSON and returns it
		getQuery : function(parameters) { 
			//Catching the uri of the conference given by
			var conferenceUri = parameters.conferenceUri;  
			//Building sparql query with prefix
			var query =   	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
							'SELECT DISTINCT ?name  ?uriPaper  WHERE  {                                                           ' +
							'   ?author foaf:name ?name.                               											  ' +
							'   ?author foaf:made ?uriPaper.                           											  ' +
							'   ?uriPaper swc:isPartOf  <'+conferenceUri+'/proceedings>.										  ' + 
							'} ORDER BY ASC(?name) '; 
			//Encapsulating query in json object to return it
			var  ajaxData = { query : query };
			return ajaxData;
		},
		//Declaring the callback function to use when sending the command
		ModelCallBack : function(dataXML){
			//Generating results with toolkit function (see view/Backbone-jQuery-ui-mobile-Adapter.js)
			ViewAdapter.prependToBackboneView('<h2>Search By Author</h2>');  
			ViewAdapter.appendFilterList(dataXML,'#proceedings-search/author-','name',{count:true,autodividers:true});
		}
    },
                                        
    /** Command used to get and display the title of the conference's publications **/
    getAllTitle : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){
            var conferenceUri = parameters.conferenceUri; 
            var title = parameters.title;  
            var query =   	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/>   ' +
							'PREFIX dc: <http://purl.org/dc/elements/1.1/>                                                          ' +
							'SELECT DISTINCT ?title WHERE {                                                                         ' +
							'  	 ?uriPaper swc:isPartOf  <'+conferenceUri+'/proceedings> .                                          ' +
							'  	 ?uriPaper dc:title     ?title.                                                                     ' + 
							'}'; 
			var  ajaxData = { query : query };
			return ajaxData;
		},
        ModelCallBack : function(dataXML){ 
			ViewAdapter.prependToBackboneView('<h2>Search By Title</h2>'); 
			ViewAdapter.appendFilterList(dataXML,'#publication/','title');
		}
	},
        
    /** Command used to get and display all keywords of the conference's publications **/
    getAllKeyword : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){
            var conferenceUri = parameters.conferenceUri; 
            var title = parameters.title;  
            var query = 	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/>   ' +
							'PREFIX key:<http://www.w3.org/2004/02/skos/core#>                                                      ' +
							'PREFIX dc: <http://purl.org/dc/elements/1.1/>                                                          ' +
							'SELECT DISTINCT ?uriPaper ?keyword  WHERE {                                                            ' +
							'  	 ?uriPaper       swc:isPartOf  <'+ conferenceUri+'/proceedings> .                                   ' +
							'  	 ?uriPaper       dc:subject    ?keyword.                                                            ' +
							'}ORDER BY ASC(?keyword) '; 
							
			var  ajaxData = { query : query };
			return ajaxData;
				     
		},
        ModelCallBack : function(dataXML){ 
			ViewAdapter.prependToBackboneView('<h2>Search By Keyword</h2>');
			ViewAdapter.appendFilterList(dataXML,'#keyword/','keyword',{count:true,autodividers:true}); 
		}
	},
        
    /** Command used to get and display all keywords of the conference's publications **/     
    getAuthorsProceedings : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){
            var conferenceUri = parameters.conferenceUri;  
            var authorName = parameters.id.split('_').join(' ');
            var query = 	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
							'PREFIX dc: <http://purl.org/dc/elements/1.1/>                                                        ' +
							'SELECT DISTINCT ?publiTitle ?publiUri WHERE  { 															  ' +
							'   ?author foaf:name "'+ authorName +'".       													  ' +
							'   ?author foaf:made ?publiUri.    																  ' +
							'  	?publiUri dc:title     ?publiTitle.        															  ' + 
							'   ?publiUri swc:isPartOf  <'+conferenceUri+'/proceedings>.										  ' + 
							'}'; 
			var  ajaxData = { query : query };
			return ajaxData;
		},
        ModelCallBack : function(dataXML,conferenceUri){ 
			var result = $(dataXML).find("sparql > results> result");
			var textResult= result.text();
			if( textResult == "")return;
			var nBresult= result.length;
			
			$("[data-role = page]").find(".content").append($('<h2>Conference publications </h2>'));
			if(nBresult>5)ViewAdapter.appendFilterList(dataXML,'#publication/','publiTitle'); 
			else{
				result.each(function(){                  
					var publiTitle  = $(this).find("[name = publiTitle]").text();				
					var publiUri  = $(this).find("[name = publiUri]").text().replace(conferenceUri,"");
					ViewAdapter.appendButton('#publication/'+publiTitle.split(" ").join("_"),publiTitle);  
				});            
			} 			
		}
	},  
	
	/** Command used to get and display all publications linked to a specific keyword **/     
	getPublicationsByKeyword : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){ 
            var conferenceUri = parameters.conferenceUri;  
            var keyword = parameters.id.split('_').join(' ');
			var query = 	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
							'PREFIX dc: <http://purl.org/dc/elements/1.1/>                                                        ' +
							'SELECT DISTINCT ?publiUri ?publiTitle  WHERE {                                                       ' +
							'  	 ?publiUri       swc:isPartOf  <'+ conferenceUri+'/proceedings>.                                  ' +
							'  	 ?publiUri       dc:subject     "'+keyword+'".                                                    ' +
							'  	 ?publiUri       dc:title     ?publiTitle.                                                        ' +
							'}ORDER BY ASC(?publiTitle) '; 
			var  ajaxData = { query : query };
			return ajaxData;
		},
        ModelCallBack : function(dataXML, conferenceUri){ 
			var result = $(dataXML).find("sparql > results> result");
			var textResult= result.text();
			if( textResult == "")return;
			var nBresult= result.length;
			 
			ViewAdapter.prependToBackboneView('<h2>Conference publications</h2>');
			
			if(nBresult>5)ViewAdapter.appendFilterList(dataXML,'#publication/','title'); 
			else{
				result.each(function(){                  
					var eventLabel  = $(this).find("[name = title]").text();
					ViewAdapter.appendButton('#publication/'+eventLabel.split(' ').join('_'),eventLabel);  
				});            
			} 
		}
     },

                                      
	/** Command used to get and display the title and the abstract of a publication  **/
    getPublicationInfo : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){	
            var publiTitle = parameters.id; 
		    var prefix =	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>         ' +
						    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>               ' +
						    'PREFIX dc: <http://purl.org/dc/elements/1.1/>                      ' +
						    'PREFIX swrc: <http://swrc.ontoware.org/ontology#>                  ' +
						    'PREFIX foaf: <http://xmlns.com/foaf/0.1/>            		        ' ;
						
		    var query  =	'SELECT DISTINCT ?publiUri  ?publiTitle ?publiAbstract WHERE  {     ' +
						    '	?publiUri dc:title  "'+publiTitle.split('_').join(' ') +'".     ' +
						    '	OPTIONAL {?publiUri dc:title ?publiTitle . }                    ' + 
						    '	OPTIONAL {?publiUri  swrc:abstract ?publiAbstract.              ' +
						    '}}';
							
			var  ajaxData = { query : prefix+query };
			return ajaxData;
		},
        ModelCallBack : function(dataXML,conferenceUri){

			var result = $(dataXML).find("sparql > results> result").text();
			if( result != ""){

				$(dataXML).find("sparql > results > result").each(function(){                  
					var publiUri  = $(this).find("[name = publiUri]").text().replace(conferenceUri,"");	
					var publiTitle  = $(this).find("[name = publiTitle]").text();
					var publiAbstract  = $(this).find("[name = publiAbstract]").text();
					
					if(publiAbstract!=""){
						ViewAdapter.prependToBackboneView('<h4>'+publiAbstract+'</h4>'); 
						ViewAdapter.prependToBackboneView('<h2>Abstract</h2>');
					}
					if(publiTitle!=""){
						ViewAdapter.prependToBackboneView('<h4>'+publiTitle+'</h4>');
						ViewAdapter.prependToBackboneView('<h2>Title</h2>');
					}

				});            
			}
		}
	},
     
	/** Command used to get the auhors of a publication  **/
    getPublicationAuthor : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){
		     
            var publiTitle = parameters.id; 
		    var prefix =	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>                  ' +
						    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>                        ' +
						    'PREFIX dc: <http://purl.org/dc/elements/1.1/>                               ' +
						    'PREFIX swrc: <http://swrc.ontoware.org/ontology#>                           ' +
						    'PREFIX foaf: <http://xmlns.com/foaf/0.1/>            		                 ' ;
						
		    var query =		'SELECT DISTINCT ?publiUri  ?publiAbstract ?authorUri   ?authorName  WHERE { ' +
						    '	?publiUri    dc:title  "'+ publiTitle.split('_').join(' ') +'".          ' +
						    '	?publiUri    dc:creator    ?authorUri.                      	         ' +
						    '	?authorUri   foaf:name     ?authorName   .                               ' +
						    '}';
		    var  ajaxData ={ query : prefix + query };
					return ajaxData;
		},

        ModelCallBack : function(dataXML,conferenceUri){
			var result = $(dataXML).find("sparql > results> result").text();
			if( result != ""){
				ViewAdapter.appendToBackboneView('<h2>Authors </h2>'); 
				$(dataXML).find("sparql > results > result").each(function(){                  
					var authorUri  = $(this).find("[name = publiAbstract]").text().replace(conferenceUri,"");	
					var authorName  = $(this).find("[name = authorName]").text();
					ViewAdapter.appendButton('#author/'+authorName.split(' ').join('_'),authorName,{tiny:true}); 
				});            
			}
		}
    }, 
    
	/** Command used to get all session's sub event of a given event  **/
    getSubEvent : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){

		    var eventId = parameters.id;  
		    var conferenceUri = parameters.conferenceUri;
		
		    var prefix =	' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>   ' +
						    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>         ' ;
						
						
		    var query = 	'SELECT DISTINCT ?eventUri ?eventLabel  WHERE {                ' +
						    '	<'+conferenceUri+eventId+'> swc:isSuperEventOf  ?eventUri. ' +
							'	?eventUri  rdf:type 	swc:SessionEvent.                  ' +
						    '	OPTIONAL { ?eventUri rdfs:label ?eventLabel.} 			   ' +
							'} ORDER BY DESC(?eventLabel)';
							
			var  ajaxData = { query : prefix + query };
			return ajaxData;
		
	    },
	    
	    ModelCallBack : function(dataXML, conferenceUri){
	                                         
			var result = $(dataXML).find("sparql > results> result");
			var textResult= result.text();
			if( textResult == "")return;
			var nBresult= result.length;
			
			$("[data-role = page]").find(".content").append($('<h2>Subtacks</h2>'));
			if(nBresult>5)ViewAdapter.appendFilterList(dataXML,'#event/','eventUri',
				{
					show:{"eventLabel":{
							alt:"eventUri",
							parseAlt:function(url){return url.replace(conferenceUri,"")}
					}},
					parseUrl:function(url){return url.replace(conferenceUri,"")}
				});
			else{
				result.each(function(){                  
					var eventLabel  = $(this).find("[name = eventLabel]").text();				
					var eventUri  = $(this).find("[name = eventUri]").text().replace(conferenceUri,"");
					ViewAdapter.appendButton('#event/'+eventUri,eventLabel);  
				});            
			} 
		}
                                         
    },
       
    /** Command used to get and display the name, the start and end time and location of a given event  **/ 
    getEvent : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){

		    var eventId = parameters.id;  
		    var conferenceUri = parameters.conferenceUri;
		
		    var prefix =	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>                              ' +
						    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>                                    ' +
						    'PREFIX ical: <http://www.w3.org/2002/12/cal/ical#>                                      ' ;
						
		    var query = 	'SELECT DISTINCT ?eventLabel ?eventLocation ?locationName ?eventStart ?eventEnd  WHERE { ' +
						    '	OPTIONAL { <'+conferenceUri+eventId+'> rdfs:label ?eventLabel.}                      ' +
						    '	OPTIONAL { <'+conferenceUri+eventId+'> swc:hasLocation ?eventLocation.               ' +
						    '	?eventLocation  rdfs:label ?locationName.'+'}                                        ' +
						    '	OPTIONAL { <'+conferenceUri+eventId+'> ical:dtStart ?eventStart.}                    ' +
						    '	OPTIONAL { <'+conferenceUri+eventId+'> ical:dtEnd ?eventEnd.}                        ' +
						    '}';
		    var  ajaxData = { query : prefix+query };
			return ajaxData;
		
	    },
	    ModelCallBack : function(dataXML, conferenceUri){
			var result = $(dataXML).find("sparql > results> result").text();
			if( result != ""){ 
				$(dataXML).find("sparql > results > result").each(function(){                  
					var eventLabel  = $(this).find("[name = eventLabel]").text();				
					var eventLocation  = $(this).find("[name = eventLocation]").text();
					var locationName  = $(this).find("[name = locationName]").text();
					var eventStart  = $(this).find("[name = eventStart] :first-child").text();
					var eventEnd  = $(this).find("[name = eventEnd] :first-child").text();  
					if(eventEnd != ""){  
						ViewAdapter.prependToBackboneView('<p>Ends at : '+moment(eventEnd).format('MMMM Do YYYY, h:mm:ss a')+'</p>');  
					} 
					if(eventStart != ""){ 
						ViewAdapter.prependToBackboneView('<p>Starts at : '+moment(eventStart).format('MMMM Do YYYY, h:mm:ss a')+'</p>');
					}
					if(eventLocation != ""){ 
						ViewAdapter.prependToBackboneView('<p>Location : '+(locationName!=""?locationName:eventLocation)+'</p>');   
					}
					if(eventLabel != ""){ 
						$("[data-role = page]").find("h1").html(eventLabel);
					}
				});            
			}
		},                                  
    },

	/** Command used to get and display the documents linked to an event **/ 
    getEventPublications : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){

		    var eventId = parameters.id;  
		    var conferenceUri = parameters.conferenceUri;
		
		    var prefix =	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>    ' +
						    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>          ' +
						    'PREFIX dc: <http://purl.org/dc/elements/1.1/>                 ' ;
						
		    var query = 	'SELECT DISTINCT ?publiUri ?publiTitle WHERE {                 ' +
							'	<'+conferenceUri+eventId+'> swc:isSuperEventOf  ?eventUri. ' +
						    '	?eventUri swc:hasRelatedDocument ?publiUri.                ' +
						    '	?publiUri dc:title ?publiTitle.                            ' +
						    '}';
		    var  ajaxData ={ query : prefix+query };
			return ajaxData;
		
	    },
	    ModelCallBack : function(dataXML,conferenceUri){
		
			var result = $(dataXML).find("sparql > results> result");
			var textResult= result.text();
			if( textResult == "")return;
			var nBresult= result.length;
			
			ViewAdapter.appendToBackboneView('<h2>Publications</h2>'); 
			if(nBresult>5)ViewAdapter.appendFilterList(dataXML,'#publication/','publiTitle');
			else{
				$(dataXML).find("sparql > results > result").each(function(){                  
					var publiUri  = $(this).find("[name = publiUri]").text().replace(conferenceUri,"");			
					var publiTitle  = $(this).find("[name = publiTitle]").text();
					ViewAdapter.appendButton('#publication/'+publiTitle.split(' ').join('_'),publiTitle);
				});  
			}   
		},                                         
    },
	
	/** Command used to get the track events of a given conference **/ 
    getConferenceMainEvent : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){	
		    var conferenceUri = parameters.conferenceUri;
		    var prefix =	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>   ' +
						    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>         ' ;
					     
		    var query = 	'SELECT DISTINCT ?eventUri ?eventLabel WHERE {                ' +
						    '	<'+conferenceUri+'> swc:isSuperEventOf  ?eventUri.        ' +
						    '	?eventUri rdf:type swc:TrackEvent.                        ' +
						    '	?eventUri rdfs:label ?eventLabel                          ' +
							'}';
		    var  ajaxData = { query : prefix+query };
			return ajaxData;
	    },
	    ModelCallBack : function(dataXML,conferenceUri){
			var result = $(dataXML).find("sparql > results> result").text();
			if( result != ""){
				$(dataXML).find("sparql > results > result").each(function(){                  
					var eventLabel  = $(this).find("[name = eventLabel]").text();
					var eventUri  = $(this).find("[name = eventUri]").text().replace(conferenceUri,""); 

					var title = $(this).next().find(":first-child").text();

					ViewAdapter.appendButton("#event/"+eventUri,eventLabel);
				});
			}
		},     
    },
 
	/** Command used to get the keywords linked to a publication  **/ 
	getPublicationKeywords : {
		dataType : "XML",
		method : "GET",
		getQuery : function(parameters){

			var publiTitle = parameters.id; 
			var prefix = 	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>  ' +
							'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>        ' +
							'PREFIX dc: <http://purl.org/dc/elements/1.1/>               ' +
							'PREFIX swrc: <http://swrc.ontoware.org/ontology#>           ' +
							'PREFIX foaf: <http://xmlns.com/foaf/0.1/>                   ' ;

			var query =  'SELECT DISTINCT ?keyword  WHERE { ' +
						'	?publiUri     dc:title  "'+ publiTitle.split('_').join(' ') +'". ' +
						' 	?publiUri     dc:subject     ?keyword .                          ' +
						'}';

			var  ajaxData = { query : prefix + query };
			return ajaxData;
		},
		ModelCallBack : function(dataXML,conferenceUri){
			var result = $(dataXML).find("sparql > results> result").text();
			if( result != ""){
				$("[data-role = page]").find(".content").append($('<h2>Keywords</h2>')).trigger("create");
				$(dataXML).find("sparql > results > result").each(function(){                  
				var keyword  = $(this).find("[name = keyword]").text(); 

				ViewAdapter.appendButton('#keyword/'+keyword.split(' ').join('_'),keyword,{tiny:true}); 
				});            
			}
		}
	} ,
	
	/** Command used to get all publications linked to a keyword  **/ 
	getPublicationsByKeyword : {
		dataType : "XML",
		method : "GET",
		getQuery : function(parameters){
			var conferenceUri = parameters.conferenceUri;  
			var keyword = parameters.id.split('_').join(' ');
			
			var prefix =   	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/>   ' +
							'PREFIX dc: <http://purl.org/dc/elements/1.1/>                                                          ' ;
			var query =   	'SELECT DISTINCT ?publiUri ?publiTitle  WHERE {                                 ' +
							'    ?publiUri       swc:isPartOf  <'+ conferenceUri+'/proceedings>.            ' +
							'    ?publiUri       dc:subject     "'+keyword+'".                              ' +
							'    ?publiUri       dc:title     ?publiTitle.                                  ' +
							'}ORDER BY ASC(?publiTitle) ';
			var  ajaxData = { query : prefix + query };
			return ajaxData;
		},
		ModelCallBack : function(dataXML, conferenceUri){ 
		
			var result = $(dataXML).find("sparql > results> result");
			var textResult= result.text();
			var nBresult= result.length;
			if( textResult < 1)return;
			
			ViewAdapter.appendToBackboneView('<h2>Keyword publication</h2>'); 
			if(nBresult>5)ViewAdapter.appendFilterList(dataXML,'#publication/','publiTitle');
			else{
				$(dataXML).find("sparql > results > result").each(function(){                  
					var publiUri  = $(this).find("[name = publiUri]").text().replace(conferenceUri,"");			
					var publiTitle  = $(this).find("[name = publiTitle]").text();
					ViewAdapter.appendButton('#publication/'+publiTitle.split(' ').join('_'),publiTitle);
				});  
			}  
		}
	 }  ,
	
	/** Command used to get the organizations linked to an author  **/ 
	getAuthorOrganization : {
		dataType : "XML",
		method : "GET",
		getQuery : function(parameters){
			var conferenceUri = parameters.conferenceUri;
			var authorName = parameters.id.split('_').join(' ');   
			
			var prefix =	'PREFIX foaf: <http://xmlns.com/foaf/0.1/>                   ' ;

			var query = 	'SELECT DISTINCT ?OrganizationName ?OrganizationUri WHERE {  ' +
							'   ?AuthorUri      foaf:name  "'+ authorName +'".           ' +
							'   ?OrganizationUri       foaf:member ?AuthorUri.           ' +
							'   ?OrganizationUri       foaf:name   ?OrganizationName.    ' +
							'}';
												
			var  ajaxData = { query : prefix + query };
			return ajaxData;
		},

		ModelCallBack : function(dataXML,conferenceUri){
			var result = $(dataXML).find("sparql > results> result").text();
			if( result != ""){
				$("[data-role = page]").find(".content").append($('<h2>Organizations </h2>')).trigger("create");
				$(dataXML).find("sparql > results > result").each(function(){                  
					var OrganizationUri  = $(this).find("[name = OrganizationUri]").text().replace(conferenceUri,"");	
					var OrganizationName  = $(this).find("[name = OrganizationName]").text();
					ViewAdapter.appendButton('#organization/'+OrganizationName.split(' ').join('_'),OrganizationName,{tiny:true}); 
				});            
			}
		}

	},
		
	
    /** Command used to get and display all members linked to an organization   **/                  
	getOrganization : {
		dataType : "XML",
		method : "GET",
		getQuery : function(parameters){
			
			var OrganizationName = parameters.id.split('_').join(' ');
			var prefix =	' PREFIX foaf: <http://xmlns.com/foaf/0.1/>                          ' ;
			var query =  	' SELECT DISTINCT ?MemberName ?MemberUri ?OrganizationUri  WHERE {   ' +
							'   ?OrganizationUri   foaf:name   "'+OrganizationName +'".          ' +															   
							'   ?OrganizationUri  foaf:member ?MemberUri.      		             ' +
							'   ?MemberUri         foaf:name   ?MemberName.     	             ' +
							'}';   															 
			var  ajaxData = { query : prefix + query };
			return ajaxData;
		},
		ModelCallBack : function(dataXML,conferenceUri){
			var result = $(dataXML).find("sparql > results> result").text();
			if( result != ""){
				$("[data-role = page]").find(".content").append($('<h2>Members</h2>')).trigger("create");
				$(dataXML).find("sparql > results > result").each(function(){                  
					var OrganizationUri  = $(this).find("[name = OrganizationUri]").text().replace(conferenceUri,"");	
					var memberName  = $(this).find("[name = MemberName]").text();
					ViewAdapter.appendButton('#author/'+memberName.split(' ').join('_'),memberName,{tiny:true}); 
				});            
			}
		}
	},

    /**********************                           GRAPH QUERY SECTION (pending....)                      *****************/
    getRdfGraphFromPublicationTitle : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){
		     
            var publiTitle = parameters.id; 
		    var prefix =	' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>' +
						    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
						    ' PREFIX dc: <http://purl.org/dc/elements/1.1/>             ' +
						    ' PREFIX swrc: <http://swrc.ontoware.org/ontology#>         ' +
						    ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>            		' ;
						
		    var query =		'SELECT DISTINCT ?publiUri  WHERE   ' +
						    '{ ?publiUri dc:title  "'+ publiTitle.split('_').join(' ') +'".' + 
						    ' } ' ;
		    var  ajaxData ={ query : prefix+query };
			return ajaxData;
		},
      
       
        ModelCallBack : function(dataXML,conferenceUri,queryUrl){
         var result = $(dataXML).find("sparql > results> result");
         if( result.text() != ""){
             var graph=new ViewAdapter.Graph(queryUrl,SWDFCommandStore.getRdfLink,conferenceUri); 
			 graph.showGraph( result.find("[name = publiUri]").text()  );
         }
        }
		                        
    },
	
	
     getRdfLink : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){
       
            var entity = parameters.entity; 
      var prefix = ' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>' +
          ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
          ' PREFIX dc: <http://purl.org/dc/elements/1.1/>             ' +
          ' PREFIX swrc: <http://swrc.ontoware.org/ontology#>         ' +
          ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>              ' ;
      
      var query =  'SELECT DISTINCT ?link ?to  WHERE  { ' +
          '<'+entity+'> ?link  ?to.' +  
          ' } ' ;
           
          var  ajaxData = { query : prefix+query };
      return ajaxData;
            },
                          
    },
    ///////////////// END BUILD GRAPH VIEW QUERY 
    ///////////////// END BUILD GRAPH VIEW QUERY 
   
 };  

                                      
                         
