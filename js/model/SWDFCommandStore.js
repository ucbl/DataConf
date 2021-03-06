/**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Beno�t DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This object contains a json definition of all the commands that will prepare all the queries we want to send on the SemanticWebDogFood sparql endpoint.
*				 Each one of those commands declare the datatype, the method, the query string it is supposed to use on the endpoint and provide a model Callback to store results, a view CallBack to render data stored.		
*				 To declare a request, each commands can use the parameters declared for the route they are called in (see Configuration.js). Those parameters can be a name, an uri or both and represents
*				 the entity which we want informations on. After calling a command, the results are stored using the localStorageManager (see localStorage.js) and rendered when needed. It is the role of the router to call those commands according to the configuration file.
*   Version: 1.1
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
			
			//Building sparql query with prefix
			var query =   'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/>            ' +
								'SELECT DISTINCT ?authorName  ?authorUri ?uriPubli WHERE  {                                                         ' +
								'   ?uriPubli swc:isPartOf  <'+parameters.conferenceUri+"/proceedings"+'>.										       ' + 
								'   ?authorUri foaf:made ?uriPubli.                           											   ' +
								'   ?authorUri foaf:name ?authorName.                               									   ' +
								'} ORDER BY ASC(?authorName) '; 
			//Encapsulating query in json object to return it
			var  ajaxData = { query : query };
			return ajaxData;
		},
		//Declaring the callback function to use when sending the command
		ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
			
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.authorUri =  $(this).find("[name = authorUri]").text();
					JSONToken.authorName =  $(this).find("[name = authorName]").text(); 	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getAllAuthors",JSONfile);
			}
		},
		
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata;
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getAllAuthors")){
					var authorList = JSONdata.getAllAuthors;
					if(_.size(authorList) > 0 ){
			      ViewAdapter.appendList(authorList,
			                             {baseHref: '#author/',
			                             hrefCllbck:function(str){return Encoder.encode(str["authorName"])+'/'+Encoder.encode(str["authorUri"])}
			                             },
			                             "authorName",
			                             parameters.contentEl,
			                             {type:"Node",labelCllbck:function(str){return "Name : "+str["authorName"];}},
			                             {autodividers:true,count :true});
					}
				}
			}
		}
    },
                                        
	/******** Command used to get and display the title of the conference's publications *********/
    getAllTitle : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){

            var query = 'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
	                      'PREFIX dc: <http://purl.org/dc/elements/1.1/>                                                        ' +
	                      'SELECT DISTINCT ?publiTitle ?publiUri WHERE {                                                        ' +
	                      '  	 ?publiUri swc:isPartOf  <'+parameters.conferenceUri+"/proceedings"+'> .                                     ' +
	                      '  	 ?publiUri dc:title     ?publiTitle.  ' + 
						  '}ORDER BY ASC(?publiTitle) '; 
	             
			var  ajaxData = { query : query };
			return ajaxData;
		},
        ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){ 
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.publiUri =  $(this).find("[name = publiUri]").text();
					JSONToken.publiTitle =  $(this).find("[name = publiTitle]").text(); 	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getAllTitle",JSONfile);
			} 
		},
		
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata;

			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getAllTitle")){
					var publicationList= JSONdata.getAllTitle;
					if(_.size(publicationList) > 0 ){
						ViewAdapter.appendList(publicationList,
			                             {baseHref: '#publication/',
			                             hrefCllbck:function(str){return Encoder.encode(str["publiTitle"])+'/'+Encoder.encode(str["publiUri"])},
			                             },
			                             "publiTitle",
			                             parameters.contentEl,
			                             {type:"Node",labelCllbck:function(str){return "Publication : "+str["publiTitle"];}},
			                             {autodividers:true});
						
					}

				}
			}
		}
	},
        
    /** Command used to get and display all keywords of the conference's publications **/
    getAllKeyword : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){

            var query = 	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/>   ' +
							'PREFIX key:<http://www.w3.org/2004/02/skos/core#>                                                      ' +
							'PREFIX dc: <http://purl.org/dc/elements/1.1/>                                                          ' +
							'SELECT DISTINCT  ?keyword ?publiUri  WHERE {                                                            ' +
							'  	 ?publiUri       swc:isPartOf  <'+parameters.conferenceUri+"/proceedings"+'> .                                   ' +
							'  	 ?publiUri       dc:subject    ?keyword.                                                            ' +
							'}ORDER BY ASC(?keyword) '; 
							
			var  ajaxData = { query : query };
			return ajaxData;
				     
		},
        ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){ 
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.keyword =  $(this).find("[name = keyword]").text();	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getAllKeyword",JSONfile);
			} 
		},
		
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata;
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getAllKeyword")){
					var keywordList = JSONdata.getAllKeyword;
					if(_.size(keywordList) > 0 ){
					  ViewAdapter.appendList(keywordList,
											 {baseHref:'#keyword/',
											  hrefCllbck:function(str){return Encoder.encode(str["keyword"])},
											  },
											 "keyword",
											 parameters.contentEl,
											 {type:"Node",labelCllbck:function(str){return "Publication : "+str["keyword"];}},
											 {autodividers:true,count:true});

					}
				}
			} 
		}
	},
        
    /** Command used to get and display all proceedings of the conference's publications **/     
    getAuthorsProceedings : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){
            var conferenceUri = parameters.conferenceUri;  
            var authorUri = parameters.uri;
            var query = 	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
							'PREFIX dc: <http://purl.org/dc/elements/1.1/>                                                        ' +
							'SELECT DISTINCT ?publiTitle ?publiUri WHERE  { 					                                  ' + 
							'   ?publiUri swc:isPartOf  <'+conferenceUri+'/proceedings>.										  ' + 
							'    <'+authorUri+'> foaf:made ?publiUri.    														  ' +
							'  	?publiUri dc:title     ?publiTitle.        													      ' + 
							
							'}'; 
			var  ajaxData = { query : query };
			return ajaxData;
		},
        ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){ 
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.publiTitle =  $(this).find("[name = publiTitle]").text();
					JSONToken.publiUri =  $(this).find("[name = publiUri]").text();				
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getAuthorsProceedings",JSONfile);
			} 
		},
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata;
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getAuthorsProceedings")){
					var publiList = JSONdata.getAuthorsProceedings;
					if(_.size(publiList) > 0 ){
						parameters.contentEl.append($('<h2>Conference publications</h2>'));
						$.each(publiList, function(i,publication){
							ViewAdapter.Graph.addNode("Publication : "+publication.publiTitle,'#publication/'+Encoder.encode(publication.publiTitle)+'/'+Encoder.encode(publication.publiUri));
							ViewAdapter.appendButton(parameters.contentEl,'#publication/'+Encoder.encode(publication.publiTitle)+'/'+Encoder.encode(publication.publiUri),publication.publiTitle);
						});
					}
				}
			}
		}
		
		
	},  
	

                                      
	/** Command used to get and display the title and the abstract of a publication  **/
    getPublicationInfo : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){
			var conferenceUri = parameters.conferenceUri;
		    var prefix =	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>         ' +
						    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>               ' +
						    'PREFIX dc: <http://purl.org/dc/elements/1.1/>                      ' +
						    'PREFIX swrc: <http://swrc.ontoware.org/ontology#>                  ' +
						    'PREFIX foaf: <http://xmlns.com/foaf/0.1/>            		        ' ;
						
		    var query  =	'SELECT DISTINCT   ?publiTitle ?publiAbstract WHERE  {              ' +
						    '   <'+parameters.uri+'>  dc:title ?publiTitle.                           ' +
						    '	OPTIONAL {<'+parameters.uri+'>  swrc:abstract ?publiAbstract.   }     ' +
						    '}';
							
			var  ajaxData = { query : prefix+query };
			return ajaxData;
		},
        ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.publiTitle =  $(this).find("[name = publiTitle]").text();
					JSONToken.publiAbstract =  $(this).find("[name = publiAbstract]").text(); 	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getPublicationInfo",JSONfile);
			} 
			
		},
		
		ViewCallBack : function(parameters){
			
			var JSONdata = parameters.JSONdata;

			if(JSONdata != null ){
				if(JSONdata.hasOwnProperty("getPublicationInfo")){
					var publicationInfo = JSONdata.getPublicationInfo;
					if(_.size(publicationInfo) > 0 ){
						var publiAbstract  = publicationInfo[0].publiAbstract;				
						var publiTitle  = publicationInfo[0].publiTitle;	
						
						if(publiTitle!=""){
							ViewAdapter.Graph.addLeaf("Title :"+publiTitle);
							parameters.contentEl.append('<h2>Title</h2>');
							parameters.contentEl.append('<p>'+publiTitle+'</p>');		
						}
						if(publiAbstract!=""){
							ViewAdapter.Graph.addLeaf("Abstract :"+publiAbstract);
							parameters.contentEl.append('<h2>Abstract</h2>');
							parameters.contentEl.append('<p>'+publiAbstract+'</p>'); 
							
						}	
					}
				}
			}
		}
	},
     
	/** Command used to get the auhors of a publication  **/
    getPublicationAuthor : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){
		    var conferenceUri = parameters.conferenceUri;
		    var prefix =	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>                  ' +
						    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>                        ' +
						    'PREFIX dc: <http://purl.org/dc/elements/1.1/>                               ' +
						    'PREFIX swrc: <http://swrc.ontoware.org/ontology#>                           ' +
						    'PREFIX foaf: <http://xmlns.com/foaf/0.1/>            		                 ' ;
						
		    var query =		'SELECT DISTINCT ?authorUri   ?authorName  WHERE { ' +
						    '	<'+parameters.uri+'>   dc:title ?publiTitle.                              ' +
						    '	<'+parameters.uri+'>  dc:creator ?authorUri.                      	      ' +
						    '	?authorUri   foaf:name     ?authorName   .                                ' +
						    '}';
		    var  ajaxData ={ query : prefix + query };
			return ajaxData;
		},

        ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.authorUri =  $(this).find("[name = authorUri]").text();
					JSONToken.authorName =  $(this).find("[name = authorName]").text(); 	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getPublicationAuthor",JSONfile);
			}
		},
		
		ViewCallBack : function(parameters){
		
			var JSONdata = parameters.JSONdata;
			var conferenceUri = parameters.conferenceUri;

			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getPublicationAuthor")){
					var authorList = JSONdata.getPublicationAuthor;
					if(_.size(authorList) > 0 ){
						parameters.contentEl.append($('<h2>Authors</h2>'));
						$.each(authorList, function(i,author){
							ViewAdapter.Graph.addNode("Author : "+author.authorName,'#author/'+Encoder.encode(author.authorName)+'/'+Encoder.encode(author.authorUri));
							ViewAdapter.appendButton(parameters.contentEl,'#author/'+Encoder.encode(author.authorName)+'/'+Encoder.encode(author.authorUri),author.authorName,{tiny:true});
						});
					}
				}
			}
		}
    }, 
    
	/** Command used to get all session's sub event of a given event  **/
    getSessionSubEvent : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){

		    var conferenceUri = parameters.conferenceUri;
		
		    var prefix =	' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>   ' +
							'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>    ' +
						    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>         ' ;
						
						
		    var query = 	'SELECT DISTINCT ?eventUri ?eventLabel  WHERE {                ' +
						    '	<'+parameters.uri+'> swc:isSuperEventOf  ?eventUri. ' +
							'	?eventUri  rdf:type 	swc:SessionEvent.                  ' +
						    '	OPTIONAL { ?eventUri rdfs:label ?eventLabel.} 			   ' +
							'} ORDER BY DESC(?eventLabel)';
							
			var  ajaxData = { query : prefix + query };
			return ajaxData;
		
	    },
	    
	    ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.eventUri =  $(this).find("[name = eventUri]").text();
					JSONToken.eventLabel =  $(this).find("[name = eventLabel]").text(); 	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getSessionSubEvent",JSONfile);
			}                                            
		
		},
		
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata;

			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getSessionSubEvent")){
					var subSessions = JSONdata.getSessionSubEvent;
					if(_.size(subSessions) > 0 ){
						parameters.contentEl.append($('<h2>Sub Sessions</h2>')); 
						$.each(subSessions, function(i,session){
							ViewAdapter.Graph.addNode("Sub session : "+session.eventLabel,'#event/'+Encoder.encode(session.eventUri));
							ViewAdapter.appendButton(parameters.contentEl,'#event/'+Encoder.encode(session.eventUri),session.eventLabel);
						});
					}
				}
			}
		}
                                         
    },
	
		/** Command used to get all session's sub event of a given event  **/
    getTrackSubEvent : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){

		    var prefix =	' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>   ' +
							'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>     ' +
						    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>         ' ;
						
						
		    var query = 	'SELECT DISTINCT ?eventUri ?eventLabel  WHERE {                ' +
						    '	<'+parameters.uri+'> swc:isSuperEventOf  ?eventUri. ' +
							'	?eventUri  rdf:type 	swc:TrackEvent.                    ' +
						    '	OPTIONAL { ?eventUri rdfs:label ?eventLabel.} 			   ' +
							'} ORDER BY DESC(?eventLabel)';
							
			var  ajaxData = { query : prefix + query };
			return ajaxData;
		
	    },
	    
	    ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
		
	        var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.eventUri =  $(this).find("[name = eventUri]").text();
					JSONToken.eventLabel =  $(this).find("[name = eventLabel]").text(); 	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getTrackSubEvent",JSONfile);
			}
		
		},
		
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata;
			var conferenceUri = parameters.conferenceUri;
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getTrackSubEvent")){
					var subTracks = JSONdata.getTrackSubEvent;
					if(_.size(subTracks) > 0 ){
						parameters.contentEl.append($('<h2>Sub tracks</h2>')); 
						$.each(subTracks, function(i,track){
							 ViewAdapter.Graph.addNode("Sub track : "+track.eventLabel,'#event/'+Encoder.encode(track.eventUri));
							ViewAdapter.appendButton(parameters.contentEl,'#event/'+Encoder.encode(track.eventUri),track.eventLabel);
						});
					}
				}
			}
		}
                                         
    },
       
    /** Command used to get and display the name, the start and end time and location of a given event  **/ 
    getEvent : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){

		
		    var prefix =	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>' +
						    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
							'PREFIX dc: <http://purl.org/dc/elements/1.1/>             ' +
							'PREFIX swrc: <http://swrc.ontoware.org/ontology#>         ' +
						    'PREFIX iCal: <http://www.w3.org/2002/12/cal/ical#>        ' ;
						
		    var query = 	'SELECT DISTINCT ?eventLabel ?eventDescription ?eventAbstract  ?locationName ?eventStart ?eventEnd ?eventStartCal ?eventEndCal WHERE {                   ' +
						    '	OPTIONAL { <'+parameters.uri+'> rdfs:label ?eventLabel.} ' +
							'	OPTIONAL { <'+parameters.uri+'> dc:description  ?eventDescription.}' +
							'	OPTIONAL { <'+parameters.uri+'> swrc:abstract ?eventAbstract. } '+
						    '	OPTIONAL { <'+parameters.uri+'> swc:hasLocation ?eventLocation. ' +
						    '	?eventLocation  rdfs:label ?locationName.}  ' +
						    '	OPTIONAL { <'+parameters.uri+'> <http://www.w3.org/2002/12/cal/icaltzd#dtstart> ?eventStart.}' +
						    '	OPTIONAL { <'+parameters.uri+'> <http://www.w3.org/2002/12/cal/icaltzd#dtend> ?eventEnd.}' +
							'	OPTIONAL { <'+parameters.uri+'> iCal:dtStart ?eventStartCal.} ' +
						    '	OPTIONAL { <'+parameters.uri+'> iCal:dtEnd   ?eventEndCal.}' +
						    '}';
		    var  ajaxData = { query : prefix+query };
			return ajaxData;
		
	    },
	    ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
		
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
			
					
				JSONfile["eventLabel"] =  $(dataXML).find("[name = eventLabel]").text();
				JSONfile["eventLocation"] =  $(dataXML).find("[name = eventLocation]").text(); 
				JSONfile["eventDescription"] =  $(dataXML).find("[name = eventDescription]").text(); 
				JSONfile["eventAbstract"] =  $(dataXML).find("[name = eventAbstract]").text(); 
				JSONfile["eventLocationName"] =  $(dataXML).find("[name = locationName]").text();
				if($(dataXML).find("[name = eventStart]").text() != ""){
					JSONfile["eventStart"] =  $(dataXML).find("[name = eventStart]").text(); 
					JSONfile["eventEnd"] =  $(dataXML).find("[name = eventEnd]").text();
				}else{
					JSONfile["eventStart"] =  $(dataXML).find("[name = eventStartCal]").text(); 
					JSONfile["eventEnd"] =  $(dataXML).find("[name = eventEndCal]").text();
				}
				

				StorageManager.pushToStorage(currentUri,"getEvent",JSONfile);
			}
		}, 

		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata;
			var conferenceUri = parameters.conferenceUri;

			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getEvent")){
					var eventInfo = JSONdata.getEvent;
					
					if(_.size(eventInfo) > 0 ){
								  
						var eventLabel  = eventInfo.eventLabel;				
						var eventLocation  = eventInfo.eventLocation;
						var eventDescription  = eventInfo.eventDescription;
						var eventAbstract  = eventInfo.eventAbstract;							
						var locationName  = eventInfo.eventLocationName;	
						var eventStart  = eventInfo.eventStart;	
						var eventEnd  = eventInfo.eventEnd;
					
						if(eventDescription != ""){ 
							ViewAdapter.Graph.addLeaf("Description :"+eventDescription);
							parameters.contentEl.append($('<h2>Description</h2>')); 
							parameters.contentEl.append($('<p>'+eventDescription+'</p>'));   
						}
						if(eventAbstract != ""){ 
							ViewAdapter.Graph.addLeaf("Abstract :"+eventAbstract);
							parameters.contentEl.append($('<h2>Abstract</h2>')); 
							parameters.contentEl.append($('<p>'+eventAbstract+'</p>'));   
						}
						if(eventStart != ""){ 
							parameters.contentEl.append($('<h2>Schedule</h2>')); 
							ViewAdapter.Graph.addLeaf("Starts at :"+moment(eventStart).format('MMMM Do YYYY, h:mm:ss a'));
							parameters.contentEl.append($('<p>Starts at : '+moment(eventStart).format('MMMM Do YYYY, h:mm:ss a')+'</p>'));
						}
						if(eventEnd != ""){
							ViewAdapter.Graph.addLeaf("Ends at :"+moment(eventEnd).format('MMMM Do YYYY, h:mm:ss a'));
							parameters.contentEl.append($('<p>Ends at : '+moment(eventEnd).format('MMMM Do YYYY, h:mm:ss a')+'</p>'));  
						} 
						if(locationName != ""){ 
							ViewAdapter.Graph.addLeaf("Location :"+locationName);
							parameters.contentEl.append($('<p>Location : '+locationName+'</p>'));   
						}
						if(eventLabel !=""){ 
							ViewAdapter.Graph.addLeaf("Label :"+eventLabel);
							$("[data-role = page]").find("#DataConf").html(eventLabel);
						}			  
					}
				}
			}
		}
    },

	/** Command used to get and display the documents linked to an event **/ 
    getEventPublications : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){
		    var conferenceUri = parameters.conferenceUri;
		
		    var prefix =	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>    ' +
						    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>          ' +
						    'PREFIX dc: <http://purl.org/dc/elements/1.1/>                 ' ;
						
		    var query = 	'SELECT DISTINCT ?publiUri ?publiTitle WHERE {                 ' +
							'	<'+parameters.uri+'> swc:isSuperEventOf  ?eventUri. ' +
						    '	?eventUri swc:hasRelatedDocument ?publiUri.                ' +
						    '	?publiUri dc:title ?publiTitle.                            ' +
						    '}ORDER BY ASC(?publiTitle)';
		    var  ajaxData ={ query : prefix+query };
			return ajaxData;
		
	    },
	    ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri,callback){
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.publiUri =  $(this).find("[name = publiUri]").text();
					JSONToken.publiTitle =  $(this).find("[name = publiTitle]").text(); 	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getEventPublications",JSONfile);
				
			}
		},
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata; 
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getEventPublications")){
					var publications = JSONdata.getEventPublications;
					if(_.size(publications) > 0 ){
						parameters.contentEl.append($('<h2>Publications</h2>')); 
						ViewAdapter.appendList(publications,
											 {baseHref:'#publication/',
											  hrefCllbck:function(str){return Encoder.encode(str["publiTitle"])+'/'+Encoder.encode(str["publiUri"])},
											  },
											 "publiTitle",
											 parameters.contentEl,
											 {type:"Node",labelCllbck:function(str){return "Publication : "+str["publiTitle"];}});

					}
				}
			} 
		}
    },
	
	
	
	
	/** Command used to get the track events of a given conference **/ 
    getConferenceMainTrackEvent : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){	
		    var conferenceUri = parameters.conferenceUri;
		    var prefix =	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>   ' +
							'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>    ' +
						    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>         ' ;
					     
		    var query = 	'SELECT DISTINCT ?eventUri ?eventLabel WHERE {                ' +
						    '	<'+conferenceUri+'> swc:isSuperEventOf  ?eventUri.        ' +
						    '	?eventUri rdf:type swc:TrackEvent.                        ' +
						    '	?eventUri rdfs:label ?eventLabel                          ' +
							'}ORDER BY ASC(?eventLabel)';
		    var  ajaxData = { query : prefix+query };
			return ajaxData;
	    },
	    ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
			
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.eventLabel =  $(this).find("[name = eventLabel]").text();
					JSONToken.eventUri =  $(this).find("[name = eventUri]").text(); 	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getConferenceMainTrackEvent",JSONfile);
			}
		},
			
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata; 
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getConferenceMainTrackEvent")){
					var tracks = JSONdata.getConferenceMainTrackEvent;
					if(_.size(tracks) > 0 ){
						parameters.contentEl.append($('<h2>Browse conference tracks</h2>')); 
					  ViewAdapter.appendList(tracks,
											 {baseHref:'#event/',
											  hrefCllbck:function(str){return Encoder.encode(str["eventUri"])},
											  },
											 "eventLabel",
											 parameters.contentEl,
											 {type:"Node",labelCllbck:function(str){return "Track : "+str["eventLabel"];}});

					}
				}
			} 
		}
    },
	
	/** Command used to get the session events of a given publication **/ 
    getEventRelatedPublication : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){	
		  
		    var prefix =	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>   ' +
							'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>    ' +
						    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>         ' ;
					     
		    var query = 	'SELECT DISTINCT ?eventUri ?eventLabel WHERE {                ' +
							'	?event swc:hasRelatedDocument  <'+parameters.uri+'>  .        ' +
						    '	 ?event            swc:isSubEventOf  ?eventUri.        ' +
						    '	 ?eventUri rdfs:label ?eventLabel.                          ' +
							' FILTER (?eventUri != <'+parameters.conferenceUri+'>) '+
							'}';
		    var  ajaxData = { query : prefix + query };
			return ajaxData;
	    },
	    ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
			
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.eventLabel =  $(this).find("[name = eventLabel]").text();
					JSONToken.eventUri =  $(this).find("[name = eventUri]").text(); 	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getEventRelatedPublication",JSONfile);
			}
		},
			
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata; 
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getEventRelatedPublication")){
					var tracks = JSONdata.getEventRelatedPublication;
					if(_.size(tracks) > 0 ){
						parameters.contentEl.append($('<h2>Related Sessions</h2>')); 
					    ViewAdapter.appendList(tracks,
											 {baseHref:'#event/',
											  hrefCllbck:function(str){return Encoder.encode(str["eventUri"])},
											  },
											 "eventLabel",
											 parameters.contentEl,
											 {type:"Node",labelCllbck:function(str){return "presentation : "+str["eventLabel"];}});

					}
				}
			} 
		}
    },
	/** Command used to get the Session events of a given conference that are not subEvent of any trackEvent**/ 
    getConferenceMainSessionEvent : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){	
		     var prefix =	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>   ' +
							'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>    ' +
						    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>         ' ;
					     
		    var query = 	 'SELECT DISTINCT ?sessionEvent  ?sessionEventLabel WHERE {  ' +
							 '<'+parameters.uri+'/proceedings>  swc:hasPart ?publiUri .  ' +
							 '?talkEvent swc:hasRelatedDocument ?publiUri. ' +
							' ?talkEvent swc:isSubEventOf ?sessionEvent.' +
							 '?sessionEvent rdf:type swc:SessionEvent.' +
							' ?sessionEvent rdfs:label ?sessionEventLabel.' +
							'}ORDER BY ASC(?sessionEventLabel)';
		    var  ajaxData = { query : prefix+query };
			return ajaxData;
	    },
	    ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.sessionEvent =  $(this).find("[name = sessionEvent]").text();
					JSONToken.sessionEventLabel =  $(this).find("[name = sessionEventLabel]").text(); 	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getConferenceMainSessionEvent",JSONfile);
			}
		},
		
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata; 
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getConferenceMainSessionEvent")){
					var sessions = JSONdata.getConferenceMainSessionEvent;
					if(_.size(sessions) > 0 ){
						parameters.contentEl.append($('<h2>Sub sessions</h2>')); 
					  ViewAdapter.appendList(sessions,
											 {baseHref:'#event/',
											  hrefCllbck:function(str){return Encoder.encode(str["sessionEvent"])},
											  },
											 "sessionEventLabel",
											 parameters.contentEl,
											 {type:"Node",labelCllbck:function(str){return "Track : "+str["sessionEvent"];}});

					}
				}
			} 
		}
    },
	
	/** Command used to get the Keynotes events of a given conference**/  
    getConferenceKeynoteEvent : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){	
		    var conferenceUri = parameters.conferenceUri;
		    var prefix =	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>   ' +
							'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>    ' +
						    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>         ' ;
					     
		    var query = 	'SELECT DISTINCT ?eventUri ?eventLabel WHERE {                ' +
						    '	?eventUri rdf:type swc:TalkEvent.                      ' +
						    '	OPTIONAL {?eventUri rdfs:label ?eventLabel .  }                       ' +
							' FILTER regex(str(?eventUri), "'+conferenceUri+'","i") .'+
							' FILTER regex(str(?eventLabel), "keynote","i") .'+
							'}ORDER BY ASC(?eventLabel)';
		    var  ajaxData = { query : prefix+query };
			return ajaxData;
	    },
	    ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
			
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.eventLabel =  $(this).find("[name = eventLabel]").text();
					JSONToken.eventUri =  $(this).find("[name = eventUri]").text(); 	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getConferenceKeynoteEvent",JSONfile);
			}
		},
			
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata; 
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getConferenceKeynoteEvent")){
					var tracks = JSONdata.getConferenceKeynoteEvent;
					if(_.size(tracks) > 0 ){
						parameters.contentEl.append($('<h2>Browse conference keynotes</h2>')); 
					  ViewAdapter.appendList(tracks,
											 {baseHref:'#event/',
											  hrefCllbck:function(str){return Encoder.encode(str["eventUri"])},
											  },
											 "eventLabel",
											 parameters.contentEl,
											 {type:"Node",labelCllbck:function(str){return "Keynote : "+str["eventLabel"];}});

					}
				}
			} 
		}
    },
 
	/** Command used to get the keywords linked to a publication  **/ 
	getPublicationKeywords : {
		dataType : "XML",
		method : "GET",
		getQuery : function(parameters){

			var prefix = 	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>  ' +
							'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>        ' +
							'PREFIX dc: <http://purl.org/dc/elements/1.1/>               ' +
							'PREFIX swrc: <http://swrc.ontoware.org/ontology#>           ' +
							'PREFIX foaf: <http://xmlns.com/foaf/0.1/>                   ' ;

			var query =  'SELECT DISTINCT ?keyword ?publiTitle  WHERE { ' +
						'	<'+parameters.uri+'>   dc:title  ?publiTitle. ' +
						' 	<'+parameters.uri+'>      dc:subject     ?keyword .                          ' +
						'}';

			var  ajaxData = { query : prefix + query };
			return ajaxData;
		},
		ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
				
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.keyword =  $(this).find("[name = keyword]").text();
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getPublicationKeywords",JSONfile);
			}
		},
		
		ViewCallBack : function(parameters){
		
			var JSONdata = parameters.JSONdata;

			if(JSONdata != null ){
				if(JSONdata.hasOwnProperty("getPublicationKeywords")){
					var keywordList = JSONdata.getPublicationKeywords;
					if(_.size(keywordList) > 0 ){
						parameters.contentEl.append($('<h2>Keywords</h2> '));
						$.each(keywordList, function(i,keyword){
							
							ViewAdapter.Graph.addNode("Keyword : "+keyword.keyword,'#keyword/'+Encoder.encode(keyword.keyword));
							ViewAdapter.appendButton(parameters.contentEl,'#keyword/'+Encoder.encode(keyword.keyword),keyword.keyword,{tiny:true});
						});
					}
				}
			}
		}
	} ,
	
	/** Command used to get all publications linked to a keyword  **/ 
	getPublicationsByKeyword : {
		dataType : "XML",
		method : "GET",
		getQuery : function(parameters){
			var conferenceUri = parameters.conferenceUri;  
			var keyword = parameters.uri.split('_').join(' ');
			
			var prefix =   	'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/>   ' +
							'PREFIX dc: <http://purl.org/dc/elements/1.1/>                                                          ' ;
			var query =   	'SELECT DISTINCT ?publiUri ?publiTitle  WHERE {                                 ' +
							'    ?publiUri       swc:isPartOf  <'+conferenceUri+'/proceedings>.            ' +
							'    ?publiUri       dc:subject     "'+keyword+'".                              ' +
							'    ?publiUri       dc:title     ?publiTitle.                                  ' +
							'}ORDER BY ASC(?publiTitle) ';
			var  ajaxData = { query : prefix + query };
			return ajaxData;
		},
		ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){ 
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.publiUri =  $(this).find("[name = publiUri]").text();
					JSONToken.publiTitle =  $(this).find("[name = publiTitle]").text(); 	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getPublicationsByKeyword",JSONfile);
			}
		},
		
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata; 
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getPublicationsByKeyword")){
					var publiList = JSONdata.getPublicationsByKeyword;
					if(_.size(publiList) > 0 ){
						parameters.contentEl.append($('<h2>Publications</h2>')); 
					  ViewAdapter.appendList(publiList,
											 {baseHref:'#publication/',
											  hrefCllbck:function(str){return Encoder.encode(str["publiTitle"])+'/'+Encoder.encode(str["publiUri"])},
											  },
											 "publiTitle",
											 parameters.contentEl,
											 {type:"Node",labelCllbck:function(str){return "Publication : "+str["publiTitle"];}});

					}
				}
			} 
		}
	 },
	
	/** Command used to get the organizations linked to an author  **/ 
	getAuthorOrganization : {
		dataType : "XML",
		method : "GET",
		getQuery : function(parameters){
			var conferenceUri = parameters.conferenceUri;
			var prefix =	'PREFIX foaf: <http://xmlns.com/foaf/0.1/>                   ' ;

			var query = 	'SELECT DISTINCT ?OrganizationName ?OrganizationUri  ?authorName WHERE {  ' +
							'  <'+parameters.uri+'>    foaf:name  ?authorName.           ' +
							'   ?OrganizationUri       foaf:member  <'+parameters.uri+'> .'+
							'   ?OrganizationUri       foaf:name   ?OrganizationName.    ' +
							'}';
												
			var  ajaxData = { query : prefix + query };
			return ajaxData;
		},

		ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.OrganizationName =  $(this).find("[name = OrganizationName]").text();
					JSONToken.OrganizationUri =  $(this).find("[name = OrganizationUri]").text(); 	
					JSONToken.authorName =  $(this).find("[name = authorName]").text();
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getAuthorOrganization",JSONfile);
			}
		},
		
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata;

			if(JSONdata != null ){
				if(JSONdata.hasOwnProperty("getAuthorOrganization")){
					var organizationList = JSONdata.getAuthorOrganization;
					if(_.size(organizationList) > 0 ){
						parameters.contentEl.append($('<h2>Organizations</h2>'));
						$.each(organizationList, function(i,organization){
							
							ViewAdapter.Graph.addNode("Organization : "+organization.OrganizationName,'#organization/'+Encoder.encode(organization.OrganizationName)+'/'+Encoder.encode(organization.OrganizationUri));
							ViewAdapter.appendButton(parameters.contentEl,'#organization/'+Encoder.encode(organization.OrganizationName)+'/'+Encoder.encode(organization.OrganizationUri),organization.OrganizationName,{tiny:true});

						});

					}
				}
			}
		}

	},
		
	
    /** Command used to get and display all members linked to an organization   **/                  
	getOrganization : {
		dataType : "XML",
		method : "GET",
		getQuery : function(parameters){
			
			var organizationUri = parameters.uri;
			var prefix =	' PREFIX foaf: <http://xmlns.com/foaf/0.1/>                              ' ;
			var query =  	' SELECT DISTINCT ?MemberName ?MemberUri ?organizationName  WHERE {      ' +												   
							'  <'+organizationUri+'>  foaf:member ?MemberUri.      		             ' +
							'   ?MemberUri         foaf:name   ?MemberName.     	                 ' +
							'}';   															 
			var  ajaxData = { query : prefix + query };
			return ajaxData;
		},
		ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.MemberName =  $(this).find("[name = MemberName]").text();
					JSONToken.MemberUri =  $(this).find("[name = MemberUri]").text(); 	
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getOrganization",JSONfile);
			}
		},
		
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata;

			if(JSONdata != null ){
				if(JSONdata.hasOwnProperty("getOrganization")){
					var memberList = JSONdata.getOrganization;
					if(_.size(memberList) > 0 ){
						parameters.contentEl.append($('<h2>Members</h2>'));
						$.each(memberList, function(i,author){
							ViewAdapter.Graph.addNode("Member : "+author.MemberName,'#author/'+Encoder.encode(author.MemberName)+'/'+Encoder.encode(author.MemberUri));
							ViewAdapter.appendButton(parameters.contentEl,'#author/'+Encoder.encode(author.MemberName)+'/'+Encoder.encode(author.MemberUri),author.MemberName,{tiny:true});
						});

					}
				}
			}
			
		}
	}


   
};
 

