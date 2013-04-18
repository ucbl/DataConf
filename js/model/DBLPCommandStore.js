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
		getQuery : function(parameters){ 
			var authorName = parameters.name.split("_").join(" ");
				
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
	
		ModelCallBack : function(dataJSON,conferenceUri,datasourceUri, currentUri){ 
			var result = dataJSON.results.bindings.length;
			if( result != 0){
				var JSONfile = {};
				$.each(dataJSON.results.bindings,function(i,item){  
					var JSONToken = {};
					JSONToken.publiUri  = this.OtherPublicationUri.value;
					JSONToken.publiTitle  = this.OtherPublicationTitle.value;
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getAuthor",JSONfile);
			}
		},
		
		ViewCallBack : function(parameters){ 
			var JSONdata = parameters.JSONdata;
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getAuthor")){
					var publicationList = JSONdata.getAuthor;
					if(_.size(publicationList) > 0 ){
						parameters.contentEl.append('<h2>Other Publications</h2>');
						$.each(publicationList, function(i,publication){
							ViewAdapter.appendButton(parameters.contentEl,'#externPublication/'+publication.publiTitle.split(" ").join("_")+'/'+publication.publiUri,publication.publiTitle);
						});
					}
				}
			}
		}
	},
                                
                                
	getExternPublicationInfo : {
		dataType : "JSONP",
		method : "GET",
		getQuery : function(parameters){ //JSON file parameters 
			var publicationTitle = parameters.name.split("_").join(" ");
			var  type  = "^^xsd:string";//DBLP ontology
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
		ModelCallBack : function(dataJSON,conferenceUri,datasourceUri, currentUri){
			var result = dataJSON.results.bindings.length;
			if( result != 0){
				var JSONfile = {};
				$.each(dataJSON.results.bindings,function(i,item){  
					var JSONToken = {};
					JSONToken.title       = this.Title.value;
					JSONToken.conf        = this.Conference.value;
					JSONToken.year        = this.Year.value;
					JSONToken.publisher   = this.Publisher.value;
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getExternPublicationInfo",JSONfile);
			}
		},
		
		ViewCallBack : function(parameters){
	
		var JSONdata = parameters.JSONdata;
		var conferenceUri = parameters.conferenceUri;

			if(JSONdata.hasOwnProperty("getExternPublicationInfo")){
				var publiInfo = JSONdata.getExternPublicationInfo;
				if(_.size(eventInfo) > 0 ){
							  
					var title  = publiInfo[0].title;				
					var conf  = publiInfo[0].conf;	
					var year  = publiInfo[0].year;	
					var publisher  = publiInfo[0].publisher;	
					
				
					if(title != ""){  
						parameters.contentEl.append('<h2>Title</h2>');
						parameters.contentEl.find(".content").append('<p>'+title+'</p>'); 
					} 
					if(conf != ""){ 
						parameters.contentEl.find(".content").append('<h2>Conference</h2>');
						parameters.contentEl.find(".content").append('<p>'+conf+'</p>');
					}
					if(year != ""){ 
						parameters.contentEl.find(".content").append('<h2>Year</h2>');
						parameters.contentEl.find(".content").append('<p>'+year+'</p>'); 
					}
					if(publisher !=""){ 
						parameters.contentEl.find(".content").append('<h2>Publisher</h2>');
						parameters.contentEl.find(".content").append('<p>'+publisher+'</p>'); 
					}			  
				}
			}
		}
	}

};//End DBLPCommandStore JSON file  
                                  
                                
 


    
 