  /**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2013
 *   Author: Lionnel MEDINI(supervisor), Florian BACLE, Fiona LE PEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
 *   Description: Interface of a Datasource model
 *   Version: 1
 *   Tags:  
 **/
 //DBLP commands file 
 var DBLPCommandStore = {
 
 //Command getAuthor 
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
									 return prefix+query;
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
                                
 //Command getConfPublication                                  
getExternPublicationInfo : {
		  dataType : "JSONP",
		  method : "GET",
		  getQuery : function(parameters){ //JSON file parameters 
							var publicationTitle = parameters.id.split('_').join(' '); 
							var  type  ="^^xsd:string";
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
										 
										 return prefix+query;
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

/*
 //Command getJournalPublication                               
getJournalPublication : {
                                dataType : "JSONP",
                                method : "GET",
                                getQuery : function(parameters){ //JSON file parameters 
                                                var uriPublication = parameters.id; 
                                                var query =  ' SELECT DISTINCT ?Title ?Author ?Url ?Year ?Journal  WHERE {       '+
                                                             ' {   																 '+
                                                             '   <'+uriPublication+'>  dc:title ?Title;			             '+
                                                             '              		   dcterms:issued ?Year .                    '+
                                                             '    OPTIONAL { <'+uriPublication+'> 	    foaf:homepage ?Url   .   }                       '+
                                                             ' }     															 '+
                                                             ' UNION 															 '+
                                                             ' {   														     	 '+
                                                             '   <'+uriPublication+'> dc:creator ?uriAuthor.      			     '+
                                                             '   ?uriAuthor  foaf:name ?Author.     							 '+					 																				
                                                             ' }     															 '+
                                                             ' UNION 															 '+					
                                                             ' {     															 '+ 
                                                             '   <'+uriPublication+'> swrc:journal ?uriJournal.                  '+	
                                                             '    ?uriJournal 		  dc:title ?Journal ;                     '+				
                                                             ' }} ';
                                                             return query;
                                                    },
                                          ModelCallBack :  function(dataJSON){
                                               
                                                                    $.each(dataJSON.results.bindings,function(i,item){
                                                                       var nameAuthor = item.Author;
                                                                       var url = item.Url;
                                                                       var year = item.year;
                                                                       var journal = item.journal;
                                                                       var title = item.Title;
                                                                       var newButton = $('<a href="#author/'+nameAuthor+'" data-role="button" data-inline="right" >'+nameAuthor+'</a>'); 
                                                                        
                                                                        $("[data-role = page]").find(".content").append("<h3>Title "+title+"</h3>").trigger("create"); 
                                                                        $("[data-role = page]").find(".content").append("<h3>Year "+year+"</h3>").trigger("create"); 
                                                                        $("[data-role = page]").find(".content").append(newButton).trigger("create");  
                                                                        $("[data-role = page]").find(".content").append("<h3>Journal "+journal+"</h3>").trigger("create"); 
                                                             
                                                                    });
                                           }
										   
} */

};//End DBLPCommandStore JSON file  
                                  
                                
 


    
 