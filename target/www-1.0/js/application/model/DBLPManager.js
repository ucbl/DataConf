/**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: DuckDuckGo, Sparql ,DBLP Computer Science Bibliography
 **/
function DBLPManager(){

        this.dblpEndPoint = new DBLPBuilder( ConfigurationManager.getInstance().getDblpUri()).setJSONEnabled();
        this.baseURL  = 'http://dblp.l3s.de/d2r/resource/publications/';

        this.getAuthor = function(authorName,callback){
						
		var query  = ' SELECT DISTINCT ?uriAuthor  ?Site  ?CoAuthors  ?OtherPublication ?UriOtherPublication ?Years  WHERE {      ' +
					 ' { ?uriAuthor foaf:name "'+ authorName +'" . ' +
					 '   OPTIONAL {?uriAuthor foaf:homepage ?Site . }    '  +
					 ' } UNION ' 							  +
					 ' { ?uri foaf:name "'+ authorName +'" . ' +
					 '   ?publication foaf:maker ?uri      . ' +
					 '   ?publication foaf:maker ?uriCoAuthor .' +										
					 '   ?uriCoAuthor foaf:name ?CoAuthors          ' +
					 ' } UNION ' 							  +
					 ' { ?author foaf:name  "'+ authorName +'" . '+
					 '   ?UriOtherPublication foaf:maker ?author  .  '+
                                         '   ?UriOtherPublication foaf:maker ?publication_coauthor .' +										
					 '   ?UriOtherPublication dc:title ?OtherPublication  .    '+
                                         '   ?UriOtherPublication dcterms:issued ?Years .      '+
					 ' }} ORDER BY (?uriAuthor )  DESC  (?Years)'; 
		 this.dblpEndPoint.getEndpoint().executeQuery(query,callback);
	}
	this.getConfPublication = function(paramConfPublication,callback){
		if(/dblp.l3s.de\/d2r\/resource\/publications\//.test(paramConfPublication)) var uriPublication = paramConfPublication;
		else                                                                        var uriPublication = this.baseURL.concat(paramConfPublication);
		var query  = ' SELECT DISTINCT ?Title ?Author ?Url ?Year ?Conference ?Publisher WHERE {      '+
					 ' {   																 '+
					 '   <'+uriPublication+'>  dc:title ?Title;			      			 '+
					 '              		   dcterms:issued ?Year .     				 '+
					 '      OPTIONAL {  <'+uriPublication+'>      		    foaf:homepage ?Url  } .      '+
					 ' }     															 '+
					 ' UNION 															 '+
					 ' {   														     	 '+
					 '   <'+uriPublication+'> dc:creator ?uriAuthor.      			     '+
					 '   ?uriAuthor  foaf:name ?Author.     							 '+					 																				
					 ' }     															 '+
					 ' UNION 															 '+					
					 ' {     															 '+ 
					 '   <'+uriPublication+'> dcterms:partOf ?uriConf.                   '+	
					 '    ?uriConf 		 	  dc:title ?Conference ;                     '+
					 '     		 	 		  dc:publisher ?Publisher.                   '+			
					 ' }} ';
		 this.dblpEndPoint.getEndpoint().executeQuery(query,callback);
	}
	this.getJournalPublication = function(paramJournalPublication,callback){
		if(/dblp.l3s.de\/d2r\/resource\/publications\//.test(paramJournalPublication)) var uriPublication = paramJournalPublication;
		else                                                                           var uriPublication = this.baseURL.concat(paramJournalPublication);
		
		var query  = ' SELECT DISTINCT ?Title ?Author ?Url ?Year ?Journal  WHERE {       '+
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
                                     
		 this.dblpEndPoint.getEndpoint().executeQuery(query,callback);
	}
        this.getAuthorGraphView = function(authorName,callback){                
							
		var query  = '  SELECT DISTINCT ?OtherPublication ?UriOtherPublication   WHERE {       ' +
					 ' { ?author foaf:name  "'+ authorName +'" . '+
					 '   ?UriOtherPublication foaf:maker ?author  .  '+                                
					 '   ?UriOtherPublication dc:title ?OtherPublication  .    '+                                     
					 ' }} ORDER BY  DESC  (?Years) LIMIT 5 '; 									
		this.dblpEndPoint.getEndpoint().executeQuery(query,callback);
	}        	
};
