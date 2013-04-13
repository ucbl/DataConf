  /**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2013
 *   Author: Lionnel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
 *   Description: Interface of a Datasource model
 *   Version: 1
 *   Tags:  
 **/
//SWDF commands file


var SWDFCommandStore = { 

  getAllAuthors : {
            dataType : "XML",
            method : "GET", 
            getQuery : function(parameters) { 
                var conferenceUri = parameters.conferenceUri;  
                return 'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
                            ' SELECT DISTINCT ?name  ?uriPaper  WHERE  { '+
                            '   ?author foaf:name ?name.         '+
                            '   ?author foaf:made ?uriPaper.     '+
                            '   ?uriPaper swc:isPartOf  <'+conferenceUri+'/proceedings>.'+ 
                            ' } ORDER BY ASC(?name) '; 
            },
            ModelCallBack : function(dataXML){
			    ViewAdapter.prependToBackboneView('<h2>Search By Author</h2>');  
                                ViewAdapter.appendFilterList(dataXML,'#proceedings-search/author-','name',{count:true,autodividers:true});

			}
    },
                                        
     //Command getAllTitle       
    getAllTitle : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){ //JSON file parameters 
            var conferenceUri = parameters.conferenceUri; 
            var title = parameters.title;  
            return '  PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/>   ' +
                        '  PREFIX dc: <http://purl.org/dc/elements/1.1/>   ' +
                        '  SELECT DISTINCT ?title WHERE {   ' +
                        '  	 ?uriPaper swc:isPartOf  <'+conferenceUri+'/proceedings> .' +
                        '  	 ?uriPaper dc:title     ?title.         ' + 
                        ' }  '; 
             },
        ModelCallBack : function(dataXML){ 
			    ViewAdapter.prependToBackboneView('<h2>Search By Title</h2>'); 
			ViewAdapter.appendFilterList(dataXML,'#publication/','title');
		}
	},
        
     //Command getAllKeyword
    getAllKeyword : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){ //JSON file parameters 
            var conferenceUri = parameters.conferenceUri; 
            var title = parameters.title;  
            return '  PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/>   ' +
                     ' PREFIX key:<http://www.w3.org/2004/02/skos/core#> ' +
                     ' PREFIX dc: <http://purl.org/dc/elements/1.1/> ' +
                     '  SELECT DISTINCT ?uriPaper ?keyword  WHERE { ' +
                     '  	 ?uriPaper       swc:isPartOf  <'+ conferenceUri+'/proceedings> .' +
                     '  	 ?uriPaper       dc:subject    ?keyword.         ' +
                     ' }ORDER BY ASC(?keyword) ';  
				     
             },
        ModelCallBack : function(dataXML){ 
			    ViewAdapter.prependToBackboneView('<h2>Search By Keyword</h2>');
			ViewAdapter.appendFilterList(dataXML,'#keyword/','keyword',{count:true,autodividers:true}); 
		}
	},
        
         
    getAuthorsProceedings : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){ //JSON file parameters 
            var conferenceUri = parameters.conferenceUri;  
            var authorName = parameters.id.split('_').join(' ');
            return 'PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
                     ' PREFIX dc: <http://purl.org/dc/elements/1.1/> ' +
                        ' SELECT DISTINCT ?title WHERE  { '+
                        '   ?author foaf:name "'+ authorName +'".         '+
                        '   ?author foaf:made ?uriPaper.     '+
                        '  	 ?uriPaper dc:title     ?title.         ' + 
                        '   ?uriPaper swc:isPartOf  <'+conferenceUri+'/proceedings>.'+ 
                        ' }  '; 
             },
        ModelCallBack : function(dataXML){ 
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
        }  ,
                                      

    getPublicationInfo : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){	
            var publiTitle = parameters.id; 
		    var prefix =	' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>' +
						    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
						    ' PREFIX dc: <http://purl.org/dc/elements/1.1/>             ' +
						    ' PREFIX swrc: <http://swrc.ontoware.org/ontology#>         ' +
						    ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>            		' ;
						
		    var query =		'SELECT DISTINCT ?publiUri  ?publiTitle ?publiAbstract WHERE  '  +
						    '{ ?publiUri dc:title  "'+publiTitle.split('_').join(' ') +'".' +
						    'OPTIONAL {?publiUri dc:title ?publiTitle .                    }'+ 
						    'OPTIONAL {?publiUri  swrc:abstract ?publiAbstract.            ' +
						    ' }} ' ;
				       
		       return prefix + query;	
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
     
    getPublicationAuthor : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){
		     
            var publiTitle = parameters.id; 
		    var prefix =	' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>' +
						    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
						    ' PREFIX dc: <http://purl.org/dc/elements/1.1/>             ' +
						    ' PREFIX swrc: <http://swrc.ontoware.org/ontology#>         ' +
						    ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>            		' ;
						
		    var query =		'SELECT DISTINCT ?publiUri  ?publiAbstract ?authorUri   ?authorName  WHERE  ' +
						    '{ ?publiUri dc:title  "'+ publiTitle.split('_').join(' ') +'".' +
						    ' ?publiUri dc:creator    ?authorUri.                      	 ' +
						    ' ?authorUri   foaf:name     ?authorName   .                 ' +
						    ' } ' ;
				       
		       return prefix + query;	
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
    } , 
    
    ///////////////// BUILD GRAPH VIEW QUERY 
    ///////////////// BUILD GRAPH VIEW QUERY 
    ///////////////// BUILD GRAPH VIEW QUERY 
    ///////////////// BUILD GRAPH VIEW QUERY 
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
				       
		       return prefix + query;	
            },
        ModelCallBack : function(dataXML,option){
	                        var result = $(dataXML).find("sparql > results> result");
	                        if( result.text() != ""){
	                            console.log(option);
	                            ViewAdapter.showAsGraph( result.find("[name = publiUri]").text(), option.conferenceUri,SWDFCommandStore.getRdfLink ); 
	                        }
                        }
		                        
    },
    getRdfLink : {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){
		     
            var entity = parameters.entity; 
		    var prefix =	' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>' +
						    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
						    ' PREFIX dc: <http://purl.org/dc/elements/1.1/>             ' +
						    ' PREFIX swrc: <http://swrc.ontoware.org/ontology#>         ' +
						    ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>            		' ;
						
		    var query =		'SELECT DISTINCT ?link ?to  WHERE  { ' +
						    '<'+entity.replace('\n','').replace('\t','')+'> ?link  ?to.' +  
						    ' } ' ;
				       
		       return prefix + query;	
            },
        ModelCallBack : function(dataXML,option){
	                        var result = $(dataXML).find("sparql > results> result");
	                        if( result.text() != ""){
	                            console.log(result);
	                            console.log(option);
	                        }
                        }
		                        
    },
    
    ///////////////// END BUILD GRAPH VIEW QUERY 
    ///////////////// END BUILD GRAPH VIEW QUERY 
    
    getSubEvent : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){ //JSON file parameters 

		    var eventId = parameters.id;  
		    var conferenceUri = parameters.conferenceUri;
		
		    var prefix =	' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>' +
						    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' ;
						
						
		    var query = 	'SELECT DISTINCT ?eventUri ?eventLabel  WHERE {'+
						    '<'+conferenceUri+eventId+'> swc:isSuperEventOf  ?eventUri. '+
							'?eventUri  rdf:type 	swc:SessionEvent.            '+
						    'OPTIONAL {'+
						    '?eventUri rdfs:label ?eventLabel.}} '+
							'ORDER BY DESC(?eventLabel)';
		    return prefix + query ; 
		
	    },
	    
	    ModelCallBack : function(dataXML, conferenceUri){
	                                         
			var result = $(dataXML).find("sparql > results> result");
			var textResult= result.text();
			if( textResult == "")return;
			var nBresult= result.length;
			
			$("[data-role = page]").find(".content").append($('<h2>SubEvent</h2>'));
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
		},
                                         
    },
       
       
    getEvent : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){ //JSON file parameters 

		    var eventId = parameters.id;  
		    var conferenceUri = parameters.conferenceUri;
		
		    var prefix =	' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>' +
						    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
						    ' PREFIX ical: <http://www.w3.org/2002/12/cal/ical#>        ' ;
						
		    var query = 	'SELECT DISTINCT ?eventLabel ?eventLocation ?locationName ?eventStart ?eventEnd  WHERE {'+
						    'OPTIONAL { <'+conferenceUri+eventId+'> rdfs:label ?eventLabel.'+'}'+
						    'OPTIONAL { <'+conferenceUri+eventId+'> swc:hasLocation ?eventLocation.'+
						    '?eventLocation  rdfs:label ?locationName.'+'}'+
						    'OPTIONAL { <'+conferenceUri+eventId+'> ical:dtStart ?eventStart.'+'}'+
						    'OPTIONAL { <'+conferenceUri+eventId+'> ical:dtEnd ?eventEnd.'+'}'+
						
						    '}';
		    return prefix + query ; 
		
	    },
	    ModelCallBack : function(dataXML, option){

	                        var result = $(dataXML).find("sparql > results> result").text();
	                        if( result != ""){ 
		                        $(dataXML).find("sparql > results > result").each(function(){                  
			                        var eventLabel  = $(this).find("[name = eventLabel]").text();				
			                        var eventLocation  = $(this).find("[name = eventLocation]").text();
			                        var locationName  = $(this).find("[name = locationName]").text();
			                        var eventStart  = $(this).find("[name = eventStart] :first-child").text();
			                        var eventEnd  = $(this).find("[name = eventEnd] :first-child").text();  
			                        if(eventEnd != ""){  
				                        ViewAdapter.prependToBackboneView('<h3>Ends at : '+moment(eventEnd).format('MMMM Do YYYY, h:mm:ss a')+'</h3>');  
			                        } 
			                        if(eventStart != ""){ 
				                        ViewAdapter.prependToBackboneView('<h3>Starts at : '+moment(eventStart).format('MMMM Do YYYY, h:mm:ss a')+'</h3>');
			                        }
			                        if(eventLocation != ""){ 
				                        ViewAdapter.prependToBackboneView('<h3>Location : '+(locationName!=""?locationName:eventLocation)+'</h3>');   
			                        }
			                        if(eventLabel != ""){ 
				                        ViewAdapter.prependToBackboneView('<h2>'+eventLabel+'</h2>');
			                        }
		                        });            
	                        }
                        },
                                         
    },


    getEventPublications : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){ //JSON file parameters 

		    var eventId = parameters.id;  
		    var conferenceUri = parameters.conferenceUri;
		
		    var prefix =	' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>' +
						    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
						    ' PREFIX dc: <http://purl.org/dc/elements/1.1/>             ' ;
						
		    var query = 	'SELECT DISTINCT ?publiUri ?publiTitle WHERE {'+
							'<'+conferenceUri+eventId+'> swc:isSuperEventOf  ?eventUri. '+
						    '?eventUri swc:hasRelatedDocument ?publiUri.'+
						    '?publiUri dc:title ?publiTitle.'+
						    '}';
		    return prefix + query ; 
		
	    },
	    ModelCallBack : function(dataXML,option){
		
	                        var result = $(dataXML).find("sparql > results> result");
	                        var textResult= result.text();
	                        if( textResult == "")return;
                            var nBresult= result.length;
                            
                            ViewAdapter.appendToBackboneView('<h2>Publications</h2>'); 
	                        if(nBresult>5)ViewAdapter.appendFilterList(dataXML,'#publication/','publiTitle');
	                        else{
	                            $(dataXML).find("sparql > results > result").each(function(){                  
		                            var publiUri  = $(this).find("[name = publiUri]").text().replace(option.conferenceUri,"");			
		                            var publiTitle  = $(this).find("[name = publiTitle]").text();
			                        ViewAdapter.appendButton('#publication/'+publiTitle.split(' ').join('_'),publiTitle);
	                            });  
	                        }   
                        },
                                         
    },
	
    getConferenceMainEvent : {
	    dataType : "XML",
	    method : "GET", 
	    getQuery : function(parameters){	
		    var conferenceUri = parameters.conferenceUri;
		    var prefix =	' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>' +
						    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' ;
					     
		    var query = 'SELECT DISTINCT ?eventUri ?eventLabel WHERE {     '+
						    '<'+conferenceUri+'> swc:isSuperEventOf  ?eventUri. '+
						    '?eventUri rdf:type swc:TrackEvent.            '+
						    '?eventUri rdfs:label ?eventLabel}';
		    return prefix + query ; 
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
 
getPublicationKeywords : {
    dataType : "XML",
    method : "GET",
    getQuery : function(parameters){

            var publiTitle = parameters.id; 
            var prefix = ' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>' +
                        ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
                        ' PREFIX dc: <http://purl.org/dc/elements/1.1/>             ' +
                        ' PREFIX swrc: <http://swrc.ontoware.org/ontology#>         ' +
                        ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>              ' ;

            var query =  'SELECT DISTINCT ?keyword  WHERE  ' +
                        '{ ?publiUri dc:title  "'+ publiTitle.split('_').join(' ') +'".' +
                        '  ?publiUri       dc:subject     ?keyword .                   ' +
                        ' } ' ;

            return prefix + query; 
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
	
getPublicationsByKeyword : {
    dataType : "XML",
    method : "GET",
    getQuery : function(parameters){ //JSON file parameters 
        var conferenceUri = parameters.conferenceUri;  
        var keyword = parameters.id.split('_').join(' ');
        return   '  PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#> PREFIX foaf: <http://xmlns.com/foaf/0.1/>   ' +
                 ' PREFIX dc: <http://purl.org/dc/elements/1.1/> ' +
                 '  SELECT DISTINCT ?publiUri ?publiTitle  WHERE { ' +
                 '    ?publiUri       swc:isPartOf  <'+ conferenceUri+'/proceedings>       .' +
                 '    ?publiUri       dc:subject     "'+keyword+'".' +
                 '    ?publiUri       dc:title     ?publiTitle.      ' +
                 ' }ORDER BY ASC(?publiTitle) ';  
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
	
	
 getAuthorOrganization : {
	      dataType : "XML",
	      method : "GET",
	      getQuery : function(parameters){ //JSON file parameters 
				var conferenceUri = parameters.conferenceUri;
				var authorName = parameters.id.split('_').join(' ');   
				
				var prefix =	' PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' ;

				var query =    ' SELECT DISTINCT ?OrganizationName ?OrganizationUri WHERE     ' +
									' { ' +
									'   ?AuthorUri      foaf:name  "'+ authorName +'"  . '  +
									'   ?OrganizationUri       foaf:member ?AuthorUri  . '  +
									'   ?OrganizationUri       foaf:name   ?OrganizationName.     '  +
									' } '
													
							   return prefix+query;
						},

	      ModelCallBack :  function(dataXML,conferenceUri){
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
	
	
	  //Command getOrganization                               
getOrganization : {
					  dataType : "XML",
					  method : "GET",
					  getQuery : function(parameters){ //JSON file parameters 
									var prefix =	' PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' ;
									var OrganizationName = parameters.id.split('_').join(' ');
									var query =  ' SELECT DISTINCT ?MemberName ?MemberUri ?OrganizationUri  WHERE     '+
													   ' {   ' +
													   '   ?OrganizationUri   foaf:name   "'+OrganizationName +'".  '+															   
													   '    ?OrganizationUri  foaf:member ?MemberUri.      		     '+
													   '    ?MemberUri         foaf:name   ?MemberName.     	     '+
													   ' }  ';   															 
											   return prefix+query;
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
}
   
};  

                                      
                                  /* 
                                  
///////////////////////////////////// useless requests/////////////////////////////////////
///////////////////////////////////// useless requests/////////////////////////////////////
///////////////////////////////////// useless requests/////////////////////////////////////

                
    //Command getAuthor                                
   

 //Command getAuthorSuggestion 
  getAuthorSuggestion : {
                                  dataType : "XML",
                                  method : "GET", 
                                  getQuery : function(parameters){ //JSON file parameters 
                                                var trackUri = parameters.trackUri;
												
                                                var author = parameters.author;
                                                var query = 'SELECT DISTINCT ?name WHERE  { '+
                                                            '   ?author foaf:name ?name.         '+
                                                            '   ?author foaf:made ?uriPaper.     '+
                                                            '   ?uriPaper swc:isPartOf  <'+trackUri+'>.'+ 
                                                            ' }  ';
                                                   return query ; 
                                           },
                                  ModelCallBack : "TODO",
                                     

                                  },
                                  
                                  
  getPublicationKeyword= {
        dataType : "XML",
        method : "GET",
        getQuery : function(parameters){
	
            var conferenceUri = parameters.conferenceUri; 
            var publiTitle = parameters.id; 
		    /*var prefix =	' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>' +
						    ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
						    ' PREFIX dc: <http://purl.org/dc/elements/1.1/>             ' +
						    ' PREFIX swrc: <http://swrc.ontoware.org/ontology#>         ' +
						    ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>            		' ;
						
		    var query =		'SELECT DISTINCT ?publiUri  ?publiAbstract ?authorUri   ?authorName  WHERE  ' +
						    '{ ?publiUri dc:title  "'+ publiTitle.split('_').join(' ') +'".' +
						    'OPTIONAL {  ?publiUri  swrc:abstract ?publiAbstract.      }' +
						    'OPTIONAL{ ?publiUri dc:creator    ?authorUri.           ' +
						    '			?authorUri   foaf:name     ?authorName   .   ' +
						    ' }} ' ;
				       
		       return prefix + query;	
            },
        ModelCallBack : getPublicationKeywordCallback,
    }
     //Command getKeywordSuggestion      
     getKeywordSuggestion = {
                                      name: "getAuthorSuggestion",
                                      dataType : "XML",
                                      method : "GET",
                                      getQuery : function(parameters){ //JSON file parameters 
                                                    var trackUri = parameters.trackUri;
                                                    var keyword = parameters.keyword;  
                                                    return  ' PREFIX key:<http://www.w3.org/2004/02/skos/core#> ' 
                                                                  +
                                                                 '  SELECT DISTINCT ?keyword WHERE {{ ' +
                                                                 '  	 ?uriPaper       swc:isPartOf  <'+ trackUri+'> .' +
                                                                 '  	 ?uriPaper       foaf:topic    ?uriKeywork.         ' +
                                                                 '  	 ?uriKeywork     key:prefLabel ?keywork. 	         ' +
                                                                 '           FILTER REGEX(?keywork , "'+ keyword +'","i").'+
                                                                 ' } UNION '+
                                                                 ' {       '+
                                                                 '  	       ?uriPaper       swc:isPartOf  <'+trackUri+'> .' +
                                                                 '           ?uriPaper       dc:subject    ?keywork.      '+
                                                                 '           FILTER REGEX( ?keywork , "'+ keyword +'","i").'+
                                                                 ' }} LIMIT 5 '; 
                                                  },
                                       ModelCallBack : "TODO"
                                      }
                                      
     //Command getTitleSuggestion       
    getTitleSuggestion= {
                                      name: "getTitleSuggestion",
                                      dataType : "XML",
                                      method : "GET",
                                      getQuery : function(parameters){ //JSON file parameters 
                                                    var trackUri = parameters.trackUri;
                                                    var title = parameters.title;  
                                                    var query = '  SELECT DISTINCT ?title WHERE {   ' +
                                                                '  	 ?uriPaper swc:isPartOf  <'+trackUri+'> .' +
                                                                '  	 ?uriPaper dc:title     ?title.         ' +
                                                                '   FILTER REGEX( ?title , "'+ title +'","i").'+
                                                                ' } LIMIT 5 ';
                                                        return query;
                                                     },
                                      ModelCallBack : "TODO"
                                      }
                                      

     //Command getPosterSearchByKeyword       
    getPosterSearchByKeyword = {
                                      name: "getPosterSearchByKeyword",
                                      dataType : "XML",
                                      method : "GET",
                                      getQuery : function(parameters){ //JSON file parameters 
                                                    var trackUri = parameters.trackUri;
                                                    var keyword = parameters.keyword;  
                                                    var query ='	PREFIX key: <http://www.w3.org/2004/02/skos/core#> ' +
                                                               '  SELECT DISTINCT ?uriPaper ?title  WHERE { {  ' +
                                                               '           ?uriPaper swc:isPartOf  <'+trackUri+'> .' +
                                                               '           ?uriPaper   dc:title     ?title.         ' +
                                                               '  	 ?uriPaper   foaf:topic    ?uriKeywork.         ' +
                                                               '  	 ?uriKeywork key:prefLabel ?keywork. 	         ' +
                                                               '           FILTER REGEX( ?keywork , "'+ keyword +'","i").'+
                                                               ' } UNION '+
                                                               ' { ' +
                                                               '  	 ?uriPaper   swc:isPartOf  <'+trackUri+'> .' +
                                                               '           ?uriPaper   dc:title     ?title.         ' +
                                                               '           ?uriPaper   dc:subject    ?keywork.      '+
                                                               '           FILTER REGEX( ?keywork , "'+ keyword +'","i").'+
                                                               ' }} ';
                                                               return query;
                                                   },
                                      ModelCallBack : getPosterSearchByKeywordByAuthorByTitle,
                                      }
                                 
    //Command getPosterSearchByTitle                                 
    getPosterSearchByTitle = {
                                      name: "getPosterSearchByTitle",
                                      dataType : "XML",
                                      method : "GET",
                                      getQuery : function(parameters){ //JSON file parameters 
                                                    var trackUri = parameters.trackUri;
                                                    var title = parameters.title;  
                                                    var query = '  SELECT DISTINCT ?uriPaper ?title WHERE {   ' +
                                                                '  	 ?uriPaper swc:isPartOf  <'+trackUri+'> .' +
                                                                '  	 ?uriPaper dc:title     ?title.         ' +
                                                                '   FILTER REGEX( ?title , "'+ title +'","i").'+
                                                                ' } ' ;
                                                             return query;
                                                  },
                                      ModelCallBack : getPosterSearchByKeywordByAuthorByTitle
                                      }
                                 
                                      
    //Command getPosterSearchByAuthor                                 
    var getPosterSearchByAuthor = getPosterSearchByAuthor = {
                                      name: "getPosterSearchByAuthor",
                                      dataType : "XML",
                                      method : "GET",
                                      getQuery : function(parameters){ //JSON file parameters 
                                                    var trackUri = parameters.trackUri;
                                                    var author = parameters.keyword;  
                                                    var query ='SELECT DISTINCT ?uriPaper ?title  WHERE  {     '+
                                                               '   ?author foaf:name "'+ author +'".         '+
                                                               '   ?author foaf:made ?uriPaper.     '+
                                                               '   ?uriPaper swc:isPartOf  <'+trackUri+'>.      '+
                                                               '   ?uriPaper dc:title     ?title.         ' +
                                                               ' } ';
                                                               return query;
                                                   },
                                      ModelCallBack : getPosterSearchByKeywordByAuthorByTitle
                                      }
                                      
                        /*              
    //Command getAuthorSearchByName                               
    getAuthorSearchByName :     new Command({
                                      name: "getAuthorSearchByName",
                                      dataType : "XML",
                                      method : "GET",
                                      getQuery : function(parameters){ //JSON file parameters 
                                                    var trackUri = parameters.trackUri;
                                                    var author = parameters.author;  
                                                    var query = 'SELECT DISTINCT ?uriAuthor ?name WHERE  {     '+
                                                                '   ?uriAuthor foaf:name ?name.         '+
                                                                '   ?uriAuthor foaf:made ?uriPaper.     '+
                                                                '   ?uriPaper  swc:isPartOf  <'+trackUri+'> .     '+      
                                                                '   FILTER REGEX( ?name , "'+ author +'","i").'+
                                                                     ' } ';
                                                                     return query;
                                                  },
                                      ModelCallBack : getAuthorSearchByName
                                      })
                                      
     ,                                 /*
    //Command getPaper                               
    getPaper :                  new Command({
                                      name: "getPaper",
                                      dataType : "XML",
                                      method : "GET",
                                      getQuery : function(parameters){ //JSON file parameters 
                                                    var uriPaper = parameters.uriPaper;
                                                    var query ='SELECT DISTINCT ?Title  ?Abstract ?PDF  ?Author ?uriAuthor ?Keyword ?KeywordLabel WHERE  ' +
                                                               '{{ <'+ uriPaper +'>  dc:title      ?Title;    ' +
                                                               '   swrc:abstract ?Abstract. ' +
                                                               '   OPTIONAL {  '+
                                                               '              <'+ uriPaper +'> owl:sameAs    ?uirPosterWWW2012 .  '+
                                                               '              ?uirPosterWWW2012 iswm:hasPDF     ?PDF   .  '+
                                                               '                     }   ' +
                                                               ' } ' +
                                                               'UNION ' +
                                                               ' { <'+ uriPaper +'> dc:creator    ?uriAuthor. ' +
                                                               '     ?uriAuthor    foaf:name     ?Author   . ' +
                                                               ' } ' +
                                                                                       'UNION ' +
                                                               ' { ' +
                                                               '     <'+ uriPaper +'> dc:subject    ?KeywordLabel. ' +
                                                               ' } ' +
                                                               'UNION ' +
                                                               ' {   <'+ uriPaper +'> foaf:topic    ?Keyword. ' +
                                                               '     ?Keyword         rdfs:label    ?KeywordLabel. ' +
                                                               ' }} ' ;
                                                               return query;
                                                     },
                                      ModelCallBack : getPaperModelCallBack
                                      })
                                      
  
                                                              
    ,                                  
    //Command getTopic                                 
    getTopic : 				 new Command({
                                      name: "getTopic",
                                      dataType : "XML",
                                      method : "GET",
                                      getQuery : function(parameters){ //JSON file parameters 
                                                    var uriTopic = parameters.uriTopic; 
                                                    var query =' SELECT DISTINCT * WHERE {      '+
                                                               ' {   																 '+
                                                               '    <'+uriTopic+'>   rdfs:label      ?Label.       '+
                                                               ' } UNION{ '+
                                                               '    ?Publication     foaf:topic <'+uriTopic+'> ;   '+
                                                               '                     dc:title      ?Title.         '+
                                                               ' }} ';
                                                               return query;
                                                      },
                                      ModelCallBack : getTopicModelCallBack
                                      })
                                      
                                      
                                     
     ,                                 
    //Command getKeyword               
    getKeyword : 			new Command({
                                      name: "getKeyword",
                                      dataType : "XML",
                                      method : "GET",
                                      getQuery : function(parameters){ //JSON file parameters 
                                                    var trackUri = parameters.trackUri;
                                                    var paramKeyword = parameters.paramKeyword;  
                                                    var query = ' SELECT DISTINCT ?Publication ?title WHERE { '+
                                                                '  ?Publication      dc:subject          ?keywordLabel . '+
                                                                '  ?Publication      dc:title          ?title . '+
                                                                '  ?Publication      swc:isPartOf     <'+trackUri+'> .     '+
                                                                '  FILTER REGEX( ?keywordLabel , "'+paramKeyword+'","i"). '+
                                                                ' } ';
                                                                return query;
                                                      },
                                      ModelCallBack : getKeywordModelCallBack
                                      })
                                      
     ,                                 
    //Command getPublicationKeyword                                   
    getPublicationKeyword : 	new Command({
                                      name: "getPublicationKeyword ",
                                      dataType : "XML",
                                      method : "GET",
                                      getQuery : function(parameters){ //JSON file parameters 
                                                    var subKeywordClass = parameters.subKeywordClass; 
                                                    var query = ' SELECT DISTINCT ?posterWWW2012  ?title WHERE {      '+
                                                                ' { '+
                                                                '    ?subUriKeyword           rdf:type               iswm:'+subKeywordClass.slice(1)+'           .       '+
                                                                '    ?posterWWW2012        iswm:hasKeyword           ?subUriKeyword              .       '+
                                                                '    ?uriPosterSWDF        owl:sameAs                ?posterWWW2012              .       '+
                                                                '    ?uriPosterSWDF           dc:title                  ?title                   .       '+
                                                                ' }}';
                                                                return query;
                                                  },
                                      ModelCallBack : getPublicationKeywordMethodCallBack
                                      })
                                      
     ,                                 
     //Command getKeywordGraphView         
    getKeywordGraphView : 		 new Command({
                                      name: "getKeywordGraphView",
                                      dataType : "XML",
                                      method : "GET",
                                      getQuery : function(parameters){ //JSON file parameters 
                                                    var keywordLabel = parameters.keywordLabel; 
                                                    var uriKeyword = parameters.uriKeyword;
                                                    var query =  ' PREFIX iswm: <http://poster.www2012.org/ontologies/2012/3/KeywordsOntologyWithoutInstance.owl#>      '+
                                                                 ' SELECT DISTINCT ?uriPoster ?titlePoster ?equiUriKeyword ?equiKeywordLabel ?subUriKeyword ?subKeywordLabel ?upperUriKeyword ?upperKeywordLabel WHERE { '+
                                                                 ' { '+
                                                                 '    ?uriPoster     dc:subject      "'+keywordLabel+'" .'+
                                                                 '    ?uriPoster     dc:title        ?titlePoster  .   '+
                                                                 ' } UNION{ '+
                                                                 '    <'+uriKeyword+'>  rdf:type                ?keywordClass     .       '+        // Equivalent keywords
                                                                 '    ?keywordClass     iswm:equivalentClass     ?equiClass        .       '+
                                                                 '    ?equiUriKeyword   rdf:type                ?equiClass        .       '+
                                                                 '    ?equiClass        iswm:hasLabel           ?equiKeywordLabel .       '+
                                                                 ' } UNION{ '+
                                                                 '    <'+uriKeyword+'>  rdf:type                ?keywordClass     .       '+        // More specific Keywords
                                                                 '    ?subKeywordClass  rdfs:subClassOf         ?keywordClass     .       '+
                                                                 '    ?subUriKeyword    rdf:type                ?subKeywordClass  .       '+
                                                                 '    ?subUriKeyword    iswm:hasLabel           ?subKeywordLabel  .       '+
                                                                 ' } UNION{ '+
                                                                 '    <'+uriKeyword+'>  rdf:type                ?keywordClass     .       '+        // Upper level keywords
                                                                 '    ?keywordClass     rdfs:subClassOf         ?upperClass       .       '+
                                                                 '    ?upperUriKeyword  rdf:type                ?upperClass       .       '+
                                                                 '    ?upperUriKeyword  iswm:hasLabel           ?upperKeywordLabel .      '+
                                                                 ' }}';
                                                                 return query;
                                                        },
                                      ModelCallBack : getKeywordGraphViewMethodCallBack
                                      })
                                      
                                      
     ,                                 
     //Command getTopicGraphView                                 
    getTopicGraphView : 		new Command({
                                      name: "getTopicGraphView ",
                                      dataType : "XML",
                                      method : "GET",
                                      getQuery : function(parameters){ //JSON file parameters 
                                                    var uriTopic = parameters.uriTopic; 
                                                    var query =  ' SELECT DISTINCT * WHERE {      '+
                                                                 ' { '+
                                                                 '    ?Publication     foaf:topic <'+uriTopic+'> ;   '+
                                                                 '                     dc:title      ?Title.         '+
                                                                 ' }} LIMIT 10 ';
                                                                 return query;
                                                    },
                                      ModelCallBack : getTopicGraphViewMethodCallBack
                                      }) 
                                  
///////////////////////////////////// useless callback/////////////////////////////////////
///////////////////////////////////// useless callback/////////////////////////////////////
///////////////////////////////////// useless callback/////////////////////////////////////
    //CallBack for the command getPaper on SWDF     
    function getPaperModelCallBack(dataXML,presenter){
        	          
            var titlePaper = $(dataXML).find('sparql > results > result > binding[name="Title"]').find(":first-child").text();                  
            if(titlePaper != ''){
     
                //  Add root node 
                this.paperGraph.setRootNode(this.uriPaper,titlePaper);
                //   Parsing XML 
                $(dataXML).find("sparql > results > result > binding").each(function(){
                    var key          = $(this).attr("name");
                    var value        = $(this).find(":first-child").text();    // Label ressource
                    var idContent    = self.prefix + key;
                              
                    // Add content 
                    switch(key){                                    
                        case 'Author':
                            var nameToDash = value.replace(/\s+/g, '~');
                            var uriAuthor =  $(this).next().find(":first-child").text();
                            var paramater = uriAuthor.replace(ConfigurationManager.getInstance().getConfBaseUri(),'');
                            var paramaterToDash = paramater.replace(/\/+/g, '~');
                            //  Add to DOM and to Graph 
                            $(idContent).append('<span><a href="#'+ paramaterToDash +'~~'+ nameToDash +'">' + value +'</a></span>, ');
                            self.paperGraph.setChildNode(uriAuthor, value, self.uriPoster, key);
                            break;
                        case 'Title' :
                            var pdf =  $(this).next().next().find(":first-child").text();
                            //  Add to DOM and to Graph 
                            if(pdf != '') $('#paperNumber').append('<h1><a href='+pdf+' style="text-decoration: underline;">'+self.poster.capitalizeFirstLetter()+'</a></h1>');
                            else          $('#paperNumber').append('<h1>'+self.poster.capitalizeFirstLetter()+'</h1>');                                           
                            $(idContent).append(value);
                            break;
                        case 'Keyword':
                            if(value == 'http://dbpedia.org/resource/World_Wide_Web') var theme = 'topic~world-wide-web';
                            else                                                      var theme = Dash.getValue(value,ConfigurationManager.getInstance().getConfBaseUri());
                            var KeywordLabel =  $(this).next().find(":first-child").text();
                            //  Add to DOM and to Graph 
                            $(idContent).append('<span><a href="#'+ theme + '"> ' + KeywordLabel +'</a></span>,');
                            self.paperGraph.setChildNode(value, KeywordLabel, self.uriPaper, key);
                            break;
                        case 'KeywordLabel' :
                            var uriKeyword  =  'http://poster.www2012.org/ontologies/2012/3/KeywordsOntologyWithoutInstance.owl#keyword_'+value.toLowerCase().replace(/\s+/g,'_');
                            var keywordClass = '#KeywordClass_'+value.toLowerCase().replace(/\s+/g,'_');
                            // Storage 
                            presenter.storeKeyword(keywordClass, value);
                            //  Add to DOM and to Graph 
                            $(self.prefix + 'Keyword').append('<span><a href="#keyword~' + value.replace(/\s+/g,'-') +'"> '+ value.capitalizeFirstLetter() +'</a></span>,');
                            self.paperGraph.setChildNode(uriKeyword, value, self.uriPaper, "hasKeyword");
                            break;
                        default:
                            $(idContent).append(value+' ');
                            break;
                    }
                });
                // toString Paper's Graph 
                var graphJSON    = JSON.stringify(self.paperGraph.getInstance());
                var keyGraphStorage = self.uriPaper.replace("http://data.semanticweb.org/","");
                // store Paper's Graph with jstorage 
                presenter.storeGraph("graph/"+keyGraphStorage,graphJSON);
                // Set link 
                $(self.prefix+'Graph').append('<span><a href="#' + self.hashGraph + '" id="viewAs">View As Graph</a></span>');
            }
            else{
                $('#paperDetail > div').empty();
                $('#paperDetail > div').append('<h3>Search result not found!</h3>')
            }
        }
                                     
     
     //CallBack for the command getAuthor on SWDF                                  
    function getAuthorModelCallBack(dataXML,presenter){ 
                      //  Set root node of author's graph 
                     this.authorGraph.setRootNode(this.uriAuthorSWDF,this.authorName);
                      //  Parsing XML 
                     $(dataXML).find("sparql > results > result > binding").each(function(){

                                var key          = $(this).attr("name");
                                var value        = $(this).find(":first-child").text();    // Label ressource
                                var idContent    = self.prefix + key;
                                switch(key){
                                        case 'Publication':
                                                //  Publication > uriPublication > uriKeyword  > urlPDF  
                                                var uriResource    = $(this).next().find(":first-child").text(); // URI Resource
                                               
                                                
                                                //Catch the publication id
                                                var split = uriResource.split("/");
                                                var publiId = split[split.length-1]; 
                                                console.log("publi IDD : "+ publiId);
                                                
                                              	//Catch the track id
                                                var locationId = uriResource.replace(ConfigurationManager.getInstance().getConfBaseUri()+ConfigurationManager.getInstance().getConfId(),"");
                                                locationId = locationId.replace(publiId,"");	
                                                locationId = locationId.slice(1,locationId.length-1);	
                                                locationId =  Dash.setValue(locationId,"");	
                                                console.log("track id : "+ locationId);
                                                
                                                //Construction of the navigation Uri
                                                var constructedUri =  Dash.setValue(ConfigurationManager.getInstance().getConfId(),"" );
                                                constructedUri = constructedUri +"~"+locationId +"~"+ publiId;
                                                console.log("publication Dash : "+ constructedUri);
                                                
                                                constructedUri = constructedUri.replace("conference-","conference~");
                                                
                                                var pdf            = $(this).next().next().find(":first-child").text(); // URI Resource
                                                var keyPublication = value.toLowerCase().replace(/\s+/g,'_');
                                                //  Publications added 
                                                self.arrPublicationsSWDF[keyPublication] = true;                                 
                                                // Add child node Graph JSON                                             
                                                if(pdf == '') $(idContent).append('<div><a  href="#'+ constructedUri  +'">' + value  +'</a></div>');
                                                else          $(idContent).append('<div><a  href="#'+ constructedUri  +'">' + value  +'</a> <a  href='+pdf+'> (PDF) </a> </div>');
                                                self.authorGraph.setChildNode(uriResource,value , self.uriAuthorSWDF , key);
                                                break;
                                        case 'Organization':
                                                var uriResource   = $(this).next().find(":first-child").text();
                                                // Add child node Graph JSON 
                                                self.authorGraph.setChildNode(uriResource, value, self.uriAuthorSWDF, key);
                                                $(idContent).append('<div><a  href="#'+ Dash.getValue(uriResource, ConfigurationManager.getInstance().getConfBaseUri()) +'">' + value   +'</a></div>');
                                                break;
                                        case 'keywordLabel':
                                                var keywordLabel   =  value;
                                                var uriKeyword     = 'http://poster.www2012.org/ontologies/2012/3/KeywordsOntologyWithoutInstance.owl#keyword_'+keywordLabel.toLowerCase().replace(/\s+/g,'_');
                                                var keywordClass   = '#KeywordClass_' + keywordLabel.toLowerCase().replace(/\s+/g,'_');
                                                // Storage 
                                                presenter.storeKeyword(keywordClass, value);
                                }
                     });
                     if($('#authorPublication').text() == '') $('#labelAuthorPublication').hide();
                     if($('#authorOrganization').text() == '') $('#labelAuthorOrganization').hide();
                     return this;
	    }                               
        /*                              
    //CallBack for the command getOrganization on SWDF
    function getOrganizationModelCallBack(dataXML,presenter){
                    
                    var organizationName = $(dataXML).find('sparql > results > result > binding[name="Name"]').find(":first-child").text();                  
                    //  Add root node                 
                    this.grahp.setRootNode(this.uriOrganization,organizationName);
                    
		    $(dataXML).find("sparql > results > result > binding").each(function(){                   
                            var key  = $(this).attr("name");				
                            var value = $(this).find(":first-child").text();
                            var idContent    = self.prefix + key;

                            var toDashValue = value.replace(/\s+/g, '~');
                            if(key == 'Name'){                                    
                                $(idContent).append(value);
                            }
                            else if (key == 'Member'){                                    
                                var nameToDash = value.replace(/\s+/g, '~');
                                var uriAuthor =  $(this).next().find(":first-child").text();
                                var paramater = uriAuthor.replace('http://data.semanticweb.org/','');					
                                var paramaterToDash = paramater.replace(/\/+/g, '~');	
                                self.grahp.setChildNode(uriAuthor, value, self.uriOrganization, key);
                                $(idContent).append('<div><a href="#'+ paramaterToDash +'~~'+ nameToDash +'">' + value +'</a></div>');							
                            }     
		      });
                      
                      //toString Paper's Graph
                      var graphJSON       = JSON.stringify(this.grahp.getInstance());
                      var keyGraphStorage = this.uriOrganization.replace("http://data.semanticweb.org/","");
                      //store Paper's Graph with jstorage    
                      presenter.storeGraph("graph/"+keyGraphStorage,graphJSON);
                      //Set link
                      $(self.prefix+'Graph').append('<span><a href="#' + this.hashGraph + '" id="viewAs">View As Graph</a></span>');                                    
                      // Search on DuckDuckGo
                      var organizationName = $('#organizationName').text().replace(/\s+/g, '+');
                      if(organizationName.indexOf(",") != -1) presenter.search(organizationName.split(",")[0]);
                      else presenter.search(organizationName);

                      return this;
                    
        }                                
     
     
     //CallBack for the command getTopic on SWDF                                 
    function getTopicModelCallBack(dataXML){           
                $(dataXML).find("sparql > results > result > binding").each(function(){                               
                                var key  = $(this).attr("name");				
                                var value = $(this).find(":first-child").text();

<<<<<<< HEAD
//Callback for  title search by  
function getAllKeywordCallback(dataXML){ 
    appendFilterList(dataXML,'#keyword/','keyword',{bubbles:true,autodividers:true}); 
}
=======
                                if(key == 'Label'){                         
                                    $('#topic'+key).append(value);
                                }else if(key == 'Publication'){                                  
                                    var title = $(this).next().find(":first-child").text();
                                    var publication = Dash.getValue(value, 'http://data.semanticweb.org/');                              
                                    $('#topic'+key).append('<div><a href="#'+ publication +'">' + title +'</a></div>');
                                }                                
                });	
           }                                 
       
       
     //CallBack for the command getKeyword on SWDF                                 
    function getKeywordModelCallBack(dataXML,presenter){
            // Store current Keyword 
            presenter.storeKeyword(this.keywordClass,this.paramKeyword);
            // Parsing 
            $(dataXML).find("sparql > results > result > binding").each(function(){                               
                var key          = $(this).attr("name");				
                var value        = $(this).find(":first-child").text();
                var idContent    = self.prefix + key;
                
                if(key == 'Publication'){                                                              
                    var title  =  $(this).next().find(":first-child").text();					
                  //Catch the publication id
                    var split = value.split("/");
                    var publiId = split[split.length-1]; 
                    console.log("publi IDD : "+ publiId);
                    
                  	//Catch the track id
                    var locationId = value.replace(ConfigurationManager.getInstance().getConfBaseUri()+ConfigurationManager.getInstance().getConfId(),"");
                    locationId = locationId.replace(publiId,"");	
                    locationId = locationId.slice(1,locationId.length-1);	
                    locationId =  Dash.setValue(locationId,"");	
                    console.log("track id : "+ locationId);
                    
                    //Construction of the navigation Uri
                    var constructedUri =  Dash.setValue(ConfigurationManager.getInstance().getConfId(),"" );
                    constructedUri = constructedUri +"~"+locationId +"~"+ publiId;
                    console.log("publication Dash : "+ constructedUri);
                    
                    constructedUri = constructedUri.replace("conference-","conference~");
                  
                    $('#keyword'+key).append('<div><a href="#'+ constructedUri +'">' + title +'</a></div>');
                }                                
            });                 
            var ontology = jsw.owl.xml.parseUrl('http://poster.www2012.org/onto/KeywordClasses.owl');
            this.reasoner = new jsw.owl.BrandT(ontology);           
            var classeArray  = this.reasoner.classHierarchy;
>>>>>>> 5a612f69d1822a3a953fbbc1b6981a97d178815b

            var ThingClassJSON   = classeArray[0];
            // ThingClasseJSON.name[0]  // http://www.w3.org/2002/07/owl#Thing
            var KeywordClassJSON = ThingClassJSON.children[0];
            // KeywordClassJSON.names[0] //#Keyword
            var arrayChildrenKeyword = KeywordClassJSON.children;
            this.loadTree(arrayChildrenKeyword);
        }                                  


     //CallBack for the command getKeywordGraphView on SWDF  
     
    function getKeywordGraphViewMethodCallBack(dataXML) {                         
                         var  KeywordGraphView = {
                               
                            idCurrentNode:'',
                            labelCurrentNode:'',
                            graphJSON : new GraphJSON(),
                            init : function(idCurrentNode,labelCurrentNode){
                                KeywordGraphView.idCurrentNode = idCurrentNode;
                                KeywordGraphView.labelCurrentNode = labelCurrentNode;
                                KeywordGraphView.graphJSON.setRootNode(KeywordGraphView.idCurrentNode,KeywordGraphView.labelCurrentNode);    //PersonGraphView.idCurrentNode : uriAuthor SWDF                                                 
                                $('#currentNode').append('<h3>Keyword  : '+labelCurrentNode+'</h3>');
                            },
                            render : function(dataXML){
                               
                                  // upperUriKeyword  > subUriKeyword > uriPoster
                                  $(dataXML).find("sparql > results > result > binding").each(function(){                               
                                                var key  = $(this).attr("name");				
                                                var value = $(this).find(":first-child").text(); // uri                       
                                                if(key == 'upperUriKeyword'){                             
                                                    var label = $(this).next().find(":first-child").text(); // label paper                                                                              
                                                    KeywordGraphView.graphJSON.setChildNode(value, label, KeywordGraphView.idCurrentNode, key);                                                        
                                                }
                                                else if (key == 'subUriKeyword'){                            
                                                    var label = $(this).next().find(":first-child").text(); // label paper                                                                              
                                                    KeywordGraphView.graphJSON.setChildNode(value, label, KeywordGraphView.idCurrentNode, key);                                                        
                                                }
                                                else if (key == 'uriPoster'){                            
                                                    var label = $(this).next().find(":first-child").text(); // label paper                                                                              
                                                    KeywordGraphView.graphJSON.setChildNode(value, label, KeywordGraphView.idCurrentNode, key);                                                        
                                                }
                                                else if (key == 'equiUriKeyword'){                            
                                                    var label = $(this).next().find(":first-child").text(); // label paper                                                                              
                                                    KeywordGraphView.graphJSON.setChildNode(value, label, KeywordGraphView.idCurrentNode, key);                                                        
                                                }
                                  });  
                            }
                        }                                 
                                                          
                    }               
     
     //CallBack for the command getTopicGraphView on SWDF  
    function getTopicGraphViewMethodCallBack(dataXml){                                 
                           var TopicGraphView = {	
                            idCurrentNode:'',
                                  labelCurrentNode:'',
                                  graphJSON : new GraphJSON(),
                                  init: function(idCurrentNode,labelCurrentNode){
                                      TopicGraphView.idCurrentNode = idCurrentNode;
                                      TopicGraphView.labelCurrentNode = labelCurrentNode;
                                      TopicGraphView.graphJSON.setRootNode(TopicGraphView.idCurrentNode,TopicGraphView.labelCurrentNode);    //PersonGraphView.idCurrentNode : uriAuthor SWDF                                                 
                                  },
                                  render : function(dataXML){
                                      //GraphView.idCurrentNode : uriAuthor SWDF     
                                      $(dataXML).find("sparql > results > result > binding").each(function(){                               
                                                      var key  = $(this).attr("name");				
                                                      var value = $(this).find(":first-child").text(); // uri
                                                      if(key == 'Publication'){                                  
                                                          var title = $(this).next().find(":first-child").text(); // label paper                                                                              
                                                          TopicGraphView.graphJSON.setChildNode(value, title, TopicGraphView.idCurrentNode, key);                                                        
                                                      }                                
                                      });

                                  }
                            }
        }                                                     
             
      //CallBack for the command getPublicationKeyword on SWDF       
    function getPublicationKeywordMethodCallBack(dataXML){              
            $(dataXML).find("sparql > results > result > binding").each(function(){                               
                var key  = $(this).attr("name");				
                var value = $(this).find(":first-child").text(); // uri   
                if(key == 'posterWWW2012'){   
                     $('#posternotFound').remove();        
                    var title = $(this).next().find(":first-child").text(); // title paper 
                    var paramater = value.replace("http://poster.www2012.org/ontologies/2012/3/KeywordsOntologyWithoutInstance.owl#","");                          
                    if($('#'+paramater).val() != ''){
                        $('#recommend'+key).append('<li><a href="#'+ paramater + '" id="' + paramater + '"><span>'+title+'</span></a></li> ');                                                                                                                 
                    }                                                                                                                                                            
                }                            
            });                                  
        }   
        
        
    //CallBack for the command getAuthorSearchByName on SWDF       
    function getAuthorSearchByName(dataXML){
             var result = $(dataXML).find("sparql > results> result").text();
             if( result != ""){
                  $(dataXML).find("sparql > results > result > binding").each(function(){                  
                        var key  = $(this).attr("name");				
                        var value = $(this).find(":first-child").text();
                        if(key == 'uriAuthor'){
                            var name = $(this).next().find(":first-child").text();
                            var nameToDash = name.replace(/\s+/g, '~');
                            var paramaterToDash = Dash.getValue(value, 'http://data.semanticweb.org/');                                                   
                            $(self.prefix).append('<li><a  href="#'+ paramaterToDash+'~~'+ nameToDash +'">'+name+'</a></li> '); 
                        }
                  }); 
             }else{
                 $(self.prefix).append('<li>Search result not found!</li>');
             }
        }    


      // search poster by author, title, keyword 
    function getPosterSearchByKeywordByAuthorByTitle(dataXML){
            
             var result = $(dataXML).find("sparql > results> result").text();
             if( result != ""){
                  $(dataXML).find("sparql > results > result > binding").each(function(){                  
                        var key  = $(this).attr("name");				
                        var value = $(this).find(":first-child").text();
                        if(key == 'uriPaper'){
                            var title = $(this).next().find(":first-child").text();
                            
                            //Preparing the Uri
                           
                            
                            //Catch the publication id
                            var split = value.split("/");
                            var publiId = split[split.length-1]; 
                            console.log("publi IDD : "+ publiId);
                            
                          	//Catch the track id
                            var locationId = value.replace(ConfigurationManager.getInstance().getConfBaseUri()+ConfigurationManager.getInstance().getConfId(),"");
                            locationId = locationId.replace(publiId,"");	
                            locationId = locationId.slice(1,locationId.length-1);	
                            locationId =  Dash.setValue(locationId,"");	
                            console.log("track id : "+ locationId);
                            
                            //Construction of the navigation Uri
                            var constructedUri =  Dash.setValue(ConfigurationManager.getInstance().getConfId(),"" );
                            constructedUri = constructedUri +"~"+locationId +"~"+ publiId;
                            console.log("publication Dash : "+ constructedUri);
                            
                            constructedUri = constructedUri.replace("conference-","conference~");
                     
                            $(self.prefix).append('<li><a href="#'+ constructedUri + '"><span>'+title+'</span></a></li> ');
                           
                        }
<<<<<<< HEAD
                    }                                 
                                                      
                }               
 
 //CallBack for the command getTopicGraphView on SWDF  
function getTopicGraphViewMethodCallBack(dataXml){                                 
                       var TopicGraphView = {	
                        idCurrentNode:'',
                              labelCurrentNode:'',
                              graphJSON : new GraphJSON(),
                              init: function(idCurrentNode,labelCurrentNode){
                                  TopicGraphView.idCurrentNode = idCurrentNode;
                                  TopicGraphView.labelCurrentNode = labelCurrentNode;
                                  TopicGraphView.graphJSON.setRootNode(TopicGraphView.idCurrentNode,TopicGraphView.labelCurrentNode);    //PersonGraphView.idCurrentNode : uriAuthor SWDF                                                 
                              },
                              render : function(dataXML){
                                  //GraphView.idCurrentNode : uriAuthor SWDF     
                                  $(dataXML).find("sparql > results > result > binding").each(function(){                               
                                                  var key  = $(this).attr("name");				
                                                  var value = $(this).find(":first-child").text(); // uri
                                                  if(key == 'Publication'){                                  
                                                      var title = $(this).next().find(":first-child").text(); // label paper                                                                              
                                                      TopicGraphView.graphJSON.setChildNode(value, title, TopicGraphView.idCurrentNode, key);                                                        
                                                  }                                
                                  });

                              }
                        }
    }                                                     
         
  //CallBack for the command getPublicationKeyword on SWDF       
function getPublicationKeywordMethodCallBack(dataXML){              
        $(dataXML).find("sparql > results > result > binding").each(function(){                               
            var key  = $(this).attr("name");				
            var value = $(this).find(":first-child").text(); // uri   
            if(key == 'posterWWW2012'){   
                 $('#posternotFound').remove();        
                var title = $(this).next().find(":first-child").text(); // title paper 
                var paramater = value.replace("http://poster.www2012.org/ontologies/2012/3/KeywordsOntologyWithoutInstance.owl#","");                          
                if($('#'+paramater).val() != ''){
                    $('#recommend'+key).append('<li><a href="#'+ paramater + '" id="' + paramater + '"><span>'+title+'</span></a></li> ');                                                                                                                 
                }                                                                                                                                                            
            }                            
        });                                  
    }   
    
    
//CallBack for the command getAuthorSearchByName on SWDF       
function getAuthorSearchByName(dataXML){
         var result = $(dataXML).find("sparql > results> result").text();
         if( result != ""){
              $(dataXML).find("sparql > results > result > binding").each(function(){                  
                    var key  = $(this).attr("name");				
                    var value = $(this).find(":first-child").text();
                    if(key == 'uriAuthor'){
                        var name = $(this).next().find(":first-child").text();
                        var nameToDash = name.replace(/\s+/g, '~');
                        var paramaterToDash = Dash.getValue(value, 'http://data.semanticweb.org/');                                                   
                        $(self.prefix).append('<li><a  href="#'+ paramaterToDash+'~~'+ nameToDash +'">'+name+'</a></li> '); 
                    }
              }); 
         }else{
             $(self.prefix).append('<li>Search result not found!</li>');
         }
    }    


  // search poster by author, title, keyword 
function getPosterSearchByKeywordByAuthorByTitle(dataXML){
        
         var result = $(dataXML).find("sparql > results> result").text();
         if( result != ""){
              $(dataXML).find("sparql > results > result > binding").each(function(){                  
                    var key  = $(this).attr("name");				
                    var value = $(this).find(":first-child").text();
                    if(key == 'uriPaper'){
                        var title = $(this).next().find(":first-child").text();
                        
                        //Preparing the Uri
                       
                        
                        //Catch the publication id
                        var split = value.split("/");
                        var publiId = split[split.length-1]; 
                        console.log("publi IDD : "+ publiId);
                        
                      	//Catch the track id
                        var locationId = value.replace(ConfigurationManager.getInstance().getConfBaseUri()+ConfigurationManager.getInstance().getConfId(),"");
                        locationId = locationId.replace(publiId,"");	
                        locationId = locationId.slice(1,locationId.length-1);	
                        locationId =  Dash.setValue(locationId,"");	
                        console.log("track id : "+ locationId);
                        
                        //Construction of the navigation Uri
                        var constructedUri =  Dash.setValue(ConfigurationManager.getInstance().getConfId(),"" );
                        constructedUri = constructedUri +"~"+locationId +"~"+ publiId;
                        console.log("publication Dash : "+ constructedUri);
                        
                        constructedUri = constructedUri.replace("conference-","conference~");
                 
                        $(self.prefix).append('<li><a href="#'+ constructedUri + '"><span>'+title+'</span></a></li> ');
                       
                    }
              });            
        }else{             
              $(self.prefix).append('<li>Search result not found!</li>');
        }
}*/
