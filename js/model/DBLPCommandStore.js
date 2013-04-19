/**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This object contains a json definition of all the commands that will prepare all the queries we want to send on the DBLP sparql endpoint.
*				 Each one of those commands declare the datatype, the method, the query string it is supposed to use on the endpoint and provide the Callback function used to parse the results.		
*				 To declare a request, each commands can use the parameters declared for the route they are called in (see Configuration.js). This parameter can be a name or an uri and represents
*				 the entity which we want informations on. After calling a command, the results are parsed with it own callback function. It is the role of the router to call those commands according to the configuration file.
*   Version: 1.0
*   Tags:  JSON, SPARQL, AJAX
**/
 var DBLPCommandStore = {
 
	getAuthorPublications : {
		dataType : "XML",
		method : "GET",
		getQuery : function(parameters){ 
			var authorName = parameters.name.split("_").join(" ");
				
			var prefix =  '  PREFIX akt:  <http://www.aktors.org/ontology/portal#>   ';  
								
			var query =   ' SELECT DISTINCT ?publiUri ?publiTitle WHERE { '+
							'	?publiUri akt:has-author ?o       '+
							'	?o akt:full-name "'+authorName+'". '+
							'	?publiUri  akt:has-title ?publiTitle.  '+
							'}  ';
			var  ajaxData = { query : prefix + query };
			return ajaxData;
		},
	
		ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){ 
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){ 
					var JSONToken = {};
					JSONToken.publiTitle =  $(this).find("[name = publiTitle]").text();
					JSONToken.publiUri =   $(this).find("[name = publiUri]").text();			
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getAuthorPublications",JSONfile);
			}
		},
		
		ViewCallBack : function(parameters){ 
			var JSONdata = parameters.JSONdata;
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getAuthorPublications")){
					var publicationList = JSONdata.getAuthorPublications;
					if(_.size(publicationList) > 0 ){
						parameters.contentEl.append('<h2>Other Publications</h2>');
						$.each(publicationList, function(i,publication){
							ViewAdapter.Graph.addNode("OtherPubli : "+publication.publiTitle,'#externPublication/'+publication.publiUri);
							ViewAdapter.appendButton(parameters.contentEl,'#externPublication/'+publication.publiUri,publication.publiTitle);
						});
					}
				}
			}
		}
	},
	
	getExternPublicationAuthors : {
		dataType : "XML",
		method : "GET",
		getQuery : function(parameters){ 
			
			var prefix =  '  PREFIX akt:  <http://www.aktors.org/ontology/portal#>   ';  
								
			var query =   ' SELECT DISTINCT ?authorUri  ?authorName WHERE { '+
							'	<'+parameters.uri+'> akt:has-author ?authorUri       '+
							'	?authorUri  akt:full-name ?authorName. '+
							'}  ';
			var  ajaxData = { query : prefix + query };
			return ajaxData;
		},
	
		ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){ 
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){ 
					var JSONToken = {};
					JSONToken.authorName =  $(this).find("[name = authorName]").text();
					JSONToken.authorUri =   $(this).find("[name = authorUri]").text();			
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getExternPublicationAuthors",JSONfile);
			}
		},
		
		ViewCallBack : function(parameters){ 
			var JSONdata = parameters.JSONdata;
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getExternPublicationAuthors")){
					var authorList = JSONdata.getExternPublicationAuthors;
					if(_.size(authorList) > 0 ){
						parameters.contentEl.append('<h2>Authors</h2>');
						$.each(authorList, function(i,auhtor){
							ViewAdapter.Graph.addNode("Author : "+auhtor.authorName,'#author/'+auhtor.authorName.split(" ").join("_")+'/'+auhtor.authorUri);
							ViewAdapter.appendButton(parameters.contentEl,'#author/'+auhtor.authorName.split(" ").join("_")+'/'+auhtor.authorUri,auhtor.authorName,{tiny : true});
						});
					}
				}
			}
		}
	},
                                
                                
	getExternPublicationInfo : {
		dataType : "XML",
		method : "GET",
		getQuery : function(parameters){ 
			var prefix =    ' PREFIX akt:  <http://www.aktors.org/ontology/portal#>               '+ 
							' PREFIX akts: <http://www.aktors.org/ontology/support#>       '; 
								
			var query =     ' SELECT DISTINCT ?publiTitle ?publiDate ?publiJournal ?publiLink ?publiResume WHERE {  '+
							'	<'+parameters.uri+'>   akt:article-of-journal ?publiJournalUri. '+	
							'	?publiJournalUri akt:has-title ?publiJournal   . '+
							'	<'+parameters.uri+'>   akt:has-date  ?year. '+
							'   ?year				   akts:year-of ?publiDate. '+
							'	<'+parameters.uri+'>   akt:has-title ?publiTitle. '+
							
							'	<'+parameters.uri+'>  akt:cites-publication-reference ?publiResumeUri. '+
							'	?publiResumeUri akt:has-title  ?publiResume . '+
							'	<'+parameters.uri+'>   akt:has-web-address ?publiLink. '+
							' } ';
			var  ajaxData = { query : prefix+query , output : "json"};
			return ajaxData;
		},
		ModelCallBack : function(dataXML,conferenceUri,datasourceUri, currentUri){
			var result = $(dataXML).find("sparql > results > result").text();
			if( result != ""){
				var JSONfile = {};
				$(dataXML).find("sparql > results > result").each(function(i){  
					var JSONToken = {};
					JSONToken.title       = $(this).find("[name = publiTitle]").text();
					JSONToken.resume       = $(this).find("[name = publiResume]").text();
					JSONToken.year        = $(this).find("[name = publiDate]").text();
					JSONToken.publisher   = $(this).find("[name = publiJournal]").text();
					JSONToken.publiLink   = $(this).find("[name = publiLink]").text();
					JSONfile[i] = JSONToken;
				});
				StorageManager.pushToStorage(currentUri,"getExternPublicationInfo",JSONfile);
			}
		},
		
		ViewCallBack : function(parameters){
	
			var JSONdata = parameters.JSONdata;
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty("getExternPublicationInfo")){
					var publiInfo = JSONdata.getExternPublicationInfo;
					if(_.size(publiInfo) > 0 ){
								  
						var title  = publiInfo[0].title;				
						var link  = publiInfo[0].publiLink;	
						var resume  = publiInfo[0].resume;	
						var year  = publiInfo[0].year;	
						var publisher  = publiInfo[0].publisher;	
						
					
						if(title != ""){  
							ViewAdapter.Graph.addLeaf("Title :"+title);
							parameters.contentEl.append('<h2>Title</h2>');
							parameters.contentEl.append('<p>'+title+'</p>'); 
						} 
						if(resume != ""){  
							ViewAdapter.Graph.addLeaf("Reference :"+resume);
							parameters.contentEl.append('<h2>Reference</h2>');
							parameters.contentEl.append('<p>'+resume+'</p>'); 
						} 
						if(link != ""){ 
							ViewAdapter.Graph.addLeaf("Link : "+link);
							parameters.contentEl.append('<h2>Link</h2>');
							parameters.contentEl.append('<a href="'+link+'">'+link+'</p>');
						}
						if(year != ""){ 
							ViewAdapter.Graph.addLeaf("Year :"+year);
							parameters.contentEl.append('<h2>Year</h2>');
							parameters.contentEl.append('<p>'+year+'</p>'); 
						}
						if(publisher !=""){ 
							ViewAdapter.Graph.addLeaf("Publisher :"+publisher);
							parameters.contentEl.append('<h2>Publisher</h2>');
							parameters.contentEl.append('<p>'+publisher+'</p>'); 
						}			  
					}
				}
			}
		}
	}

};//End DBLPCommandStore JSON file  
                                  
                                
 


    
 