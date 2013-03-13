/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster
 *   Version: 1
 *   Tags:  Sparql ,Semantic Web Dog Food
 **/

	/* Concrete Builder*/
	function SWDFManager(){
	
	    this.swdfEndPoint        = new SWDFBuilder(ConfigurationManager.getInstance().getConfServiceUri()).setCORSEnabled();
	    this.trackUri			 = "";
	    this.resultPaperTrack = {};
	    this.paperTrackTitleSuggestion = [];
	    this.paperTrackTitleSuggestion = [];
	    this.paperTrackAuthorSuggestion = [];
	    
	    self = this;
		
		
		this.setTrackUri=function(trackId){
			
			var confBaseUri=ConfigurationManager.getInstance().getConfBaseUri();
			var confId=ConfigurationManager.getInstance().getConfId();
			this.trackUri=  confBaseUri + confId +trackId;
			
			return this;
		}
		

    this.getAuthorSuggestion = function(author,callback){
    	
            
            var query  = 'SELECT DISTINCT ?name WHERE  {     '+
					 '   ?author foaf:name ?name.         '+
					 '   ?author foaf:made ?uriPaper.     '+
                                         '   ?uriPaper swc:isPartOf  <'+this.trackUri+'>.      '+
					 '   FILTER REGEX( ?name , "'+ author +'","i").'+
                                         ' } LIMIT 5 ';
            
            this.swdfEndPoint.getEndpoint().executeQuery(query,callback);
    }

    this.getKeywordSuggestion = function(keywork,callback){
    		
            var query  =             '	PREFIX key: <http://www.w3.org/2004/02/skos/core#> ' +
                                     '  SELECT DISTINCT ?keywork WHERE {{ ' +
                                     '  	 ?uriPaper       swc:isPartOf  <'+this.trackUri+'> .' +
                                     '  	 ?uriPaper       foaf:topic    ?uriKeywork.         ' +
                                     '  	 ?uriKeywork     key:prefLabel ?keywork. 	         ' +
                                     '           FILTER REGEX(?keywork , "'+ keywork +'","i").'+
                                     ' } UNION '+
                                     ' {       '+
                                     '  	 ?uriPaper       swc:isPartOf  <'+this.trackUri+'> .' +
                                     '           ?uriPaper       dc:subject    ?keywork.      '+
                                     '           FILTER REGEX( ?keywork , "'+ keywork +'","i").'+
                                     ' }} LIMIT 5 ';
            this.swdfEndPoint.getEndpoint().executeQuery(query,callback);
    }
    
    
  /*  this.getTitleSuggestion = function(title, callback){
    	
    	 this.launchSearchSubEventPaperTitle("http://data.semanticweb.org/conference/eswc/2008/track/research",title,this.paperTrackTitleSuggestion);
    alert("title! "+title);	
    }
    
    this.launchSearchSubEventPaperTitle = function(trackUri,title, resultTab){
    	
    	 var query  =    'SELECT DISTINCT ?subEvent ?uriPaper ?title WHERE {  '+
    		 			' <'+trackUri+'> swc:isSuperEventOf	?subEvent.  ' +
    		 			' OPTIONAL { ?subEvent swc:hasRelatedDocument  ?uriPaper.' +
    		 			'            ?uriPaper dc:title     ?title.  ' +
    		 			 '   FILTER REGEX( ?title , "'+ title +'","i").'+
                                 ' }} ';
    	self.swdfEndPoint.getEndpoint().executeQuery(query,self.handleSearchSubEventPaperTitle(title,resultTab));
    	
    }
    
    this.handleSearchSubEventPaperTitle = function (title,resultTab){
    		
    		return function(dataXML){
	    	   $(dataXML).find("sparql > results > result > binding").each(function(){
	               var key          = $(this).attr("name");
	               var value        = $(this).find(":first-child").text();    // Label ressource


	               switch(key){                                    
	                   case 'subEvent':
	                	   console.log("track :" + value);
	                	   self.launchSearchSubEventPaperTitle(value,title,resultTab);
	                       break;
	                   case 'uriPaper' :
	                	   resultTab.push(value);
	                	   console.log("URI: "+value);
	                       break;
	                
	                   default:
	                      
	                       break;
	               }
	           });
    		}
    }*/
    

    this.getTitleSuggestion = function(title,callback){
    	
        var query  =             '  SELECT DISTINCT ?title WHERE {   ' +
                                 '  	 ?uriPaper swc:isPartOf  <'+this.trackUri+'> .' +
                                 '  	 ?uriPaper dc:title     ?title.         ' +
                                 '   FILTER REGEX( ?title , "'+ title +'","i").'+
                                 ' } LIMIT 5 ';
        this.swdfEndPoint.getEndpoint().executeQuery(query,callback);

    }
    
     // Poster Search
    this.getPosterSearchByKeyword = function(keyword, callback){
            var query  =             '	PREFIX key: <http://www.w3.org/2004/02/skos/core#> ' +
                                     '  SELECT DISTINCT ?uriPaper ?title  WHERE { {  ' +
                                     '           ?uriPaper swc:isPartOf  <'+this.trackUri+'> .' +
                                     '           ?uriPaper   dc:title     ?title.         ' +
                                     '  	 ?uriPaper   foaf:topic    ?uriKeywork.         ' +
                                     '  	 ?uriKeywork key:prefLabel ?keywork. 	         ' +
                                     '           FILTER REGEX( ?keywork , "'+ keyword +'","i").'+
                                     ' } UNION '+
                                     ' { ' +
                                     '  	 ?uriPaper   swc:isPartOf  <'+this.trackUri+'> .' +
                                     '           ?uriPaper   dc:title     ?title.         ' +
                                     '           ?uriPaper   dc:subject    ?keywork.      '+
                                     '           FILTER REGEX( ?keywork , "'+ keyword +'","i").'+
                                     ' }} ';
             this.swdfEndPoint.getEndpoint().executeQuery(query,callback);
        }

       this.getPosterSearchByTitle = function(title, callback){
            var query  =         '  SELECT DISTINCT ?uriPaper ?title WHERE {   ' +
                                    '  	 ?uriPaper swc:isPartOf  <'+this.trackUri+'> .' +
                                    '  	 ?uriPaper dc:title     ?title.         ' +
                                    '   FILTER REGEX( ?title , "'+ title +'","i").'+
                                    ' } ';
            this.swdfEndPoint.getEndpoint().executeQuery(query,callback);
       }

       this.getPosterSearchByAuthor = function(author, callback){

            var query  = 'SELECT DISTINCT ?uriPaper ?title  WHERE  {     '+
					 '   ?author foaf:name "'+ author +'".         '+
					 '   ?author foaf:made ?uriPaper.     '+
                                         '   ?uriPaper swc:isPartOf  <'+this.trackUri+'>.      '+
					 '   ?uriPaper dc:title     ?title.         ' +
                                         ' } ';
           this.swdfEndPoint.getEndpoint().executeQuery(query,callback);
       }
       this.getAuthorSearchByName = function(author, callback){

            var query  = 'SELECT DISTINCT ?uriAuthor ?name WHERE  {     '+
					 '   ?uriAuthor foaf:name ?name.         '+
					 '   ?uriAuthor foaf:made ?uriPaper.     '+
                     '   ?uriPaper  swc:isPartOf  <'+this.trackUri+'> .     '+
                                         
					 '   FILTER REGEX( ?name , "'+ author +'","i").'+
                                         ' } ';
            this.swdfEndPoint.getEndpoint().executeQuery(query,callback);
      }

      this.getPaper = function(trackId,paperId,callback){
    	  //problem uripaper de la forme : ttp://data.semanticweb.org/conference/www/2011/demo/a-demo-search-engine-for-products donc parser en ttp://data.semanticweb.org/conference/www/2011/demo/a-demosearch/engine/for/products
    	  		var uriPaper = ConfigurationManager.getInstance().getConfUri() + trackId + paperId;
                console.log(uriPaper);
                var query =        'SELECT DISTINCT ?Title  ?Abstract ?PDF  ?Author ?uriAuthor ?Keyword ?KeywordLabel WHERE  ' +
				   '{{ <'+ uriPaper +'>                  dc:title      ?Title;    ' +
				   '                                     swrc:abstract ?Abstract. ' +
                                   '   OPTIONAL {  '+
                                   '              <'+ uriPaper +'>       owl:sameAs    ?uirPosterWWW2012 .  '+
                                   '              ?uirPosterWWW2012      iswm:hasPDF     ?PDF   .  '+
                                   '                     }   ' +
				   ' } ' +
				   'UNION ' +
				   ' { <'+ uriPaper +'>                  dc:creator    ?uriAuthor. ' +
				   '     ?uriAuthor                      foaf:name     ?Author   . ' +
				   ' } ' +
                                   'UNION ' +
				   ' { ' +
				   '     <'+ uriPaper +'>               dc:subject    ?KeywordLabel. ' +
				   ' } ' +
				   'UNION ' +
				   ' {   <'+ uriPaper +'>               foaf:topic    ?Keyword. ' +
				   '     ?Keyword                       rdfs:label    ?KeywordLabel. ' +
				   ' }} ' ;
		 this.swdfEndPoint.getEndpoint().executeQuery(query,callback);
	}

        this.getAuthor = function(entityId, authorId,callback){
        	var uriAuthor = ConfigurationManager.getInstance().getConfBaseUri() + entityId + authorId;
                /*  Preparing SPARQL query against  SEMANTIC WEB DOG FOOD */
		var query  = ' SELECT DISTINCT ?Publication  ?uriPublication ?keywordLabel ?PDF   ?Organization ?uriOrganization WHERE {     ' +
					 ' { ' +
					 '   ?uriOrganization       foaf:member <'+ uriAuthor +'>  . '  +
					 '   ?uriOrganization       foaf:name   ?Organization .      '  +
					 ' } UNION ' 							+       /* Auhtor's publication */
					 ' { ' +
					 '   ?uriPublication    swc:isPartOf  <'+this.trackUri+'> ;  ' +
                                         '                      foaf:maker    <'+ uriAuthor +'> ;          ' +
                                         ' 			dc:title      ?Publication .               ' +  /* Auhtor's publication */
                                         '   OPTIONAL {  '+
                                         '              ?uriPublication       owl:sameAs    ?uirPosterWWW2012 .  '+
                                         '              ?uirPosterWWW2012     iswm:hasPDF     ?PDF   .  '+
                                         '             }  '+
                                         ' } UNION ' +
                                         ' { ' +
                                         '   ?uri               swc:isPartOf  <'+this.trackUri+'> ;  ' +  /* a poster has many keywords...*/
                                         '                      foaf:maker    <'+ uriAuthor +'> ;          ' +
					 '                      dc:subject    ?keywordLabel .              ' +  /* Recommendation */
					 ' }} ORDER BY ?Organization ';
		 this.swdfEndPoint.getEndpoint().executeQuery(query,callback);
	}
        this.getOrganization = function(organizationId,callback){
		var uriOrganization = ConfigurationManager.getInstance().getConfBaseUri() + organizationId;
		console.log
                var query  = ' SELECT DISTINCT ?Member ?UriPerson ?Name WHERE {      '+
					 ' {   																 '+
					 '   <'+uriOrganization+'> foaf:member ?UriPerson.      			 '+
					 '    ?UriPerson           foaf:name   ?Member.     				 '+
					 ' }     															 '+
					 ' UNION 															 '+
					 ' {     															 '+
					 '   <'+uriOrganization+'> foaf:name   ?Name.                        '+
					 ' }} ';
                this.swdfEndPoint.getEndpoint().executeQuery(query,callback);
	}

        this.getTopic = function(paramKeyword,callback){

            if(paramKeyword == 'topic/world-wide-web') var uriTopic = 'http://dbpedia.org/resource/World_Wide_Web';
            else var uriTopic = this.baseURL.concat(paramKeyword);

	    var query  = ' SELECT DISTINCT * WHERE {      '+
					 ' {   																 '+
					 '    <'+uriTopic+'>   rdfs:label      ?Label.       '+
					 ' } UNION{ '+
                                         '    ?Publication     foaf:topic <'+uriTopic+'> ;   '+
					 '                     dc:title      ?Title.         '+
                                         ' }} ';
             this.swdfEndPoint.getEndpoint().executeQuery(query,callback);

        }

        this.getKeyword = function(paramKeyword,callback){
             var query  =   ' SELECT DISTINCT ?Publication ?title WHERE { '+
                            '  ?Publication      dc:subject          ?keywordLabel . '+
                            '  ?Publication      dc:title          ?title . '+
                            '  ?Publication      swc:isPartOf     <'+this.trackUri+'> .     '+
                            '  FILTER REGEX( ?keywordLabel , "'+paramKeyword+'","i"). '+
                            ' } ';
             this.swdfEndPoint.getEndpoint().executeQuery(query,callback);
        }

        this.getPublicationKeyword = function(subKeywordClass,callback){
             console.log("SWD "+subKeywordClass);
             var query  = ' SELECT DISTINCT ?posterWWW2012  ?title WHERE {      '+
                          ' { '+
                          '    ?subUriKeyword           rdf:type               iswm:'+subKeywordClass.slice(1)+'           .       '+
                          '    ?posterWWW2012        iswm:hasKeyword           ?subUriKeyword              .       '+
                          '    ?uriPosterSWDF        owl:sameAs                ?posterWWW2012              .       '+
                          '    ?uriPosterSWDF           dc:title                  ?title                   .       '+
                          ' }}';
            this.swdfEndPoint.getEndpoint().executeQuery(query,callback);
        }
        this.getKeywordGraphView = function(uriKeyword,keywordLabel,callback){
            var query  =     ' PREFIX iswm: <http://poster.www2012.org/ontologies/2012/3/KeywordsOntologyWithoutInstance.owl#>      '+
                             ' SELECT DISTINCT ?uriPoster ?titlePoster ?equiUriKeyword ?equiKeywordLabel ?subUriKeyword ?subKeywordLabel ?upperUriKeyword ?upperKeywordLabel WHERE {      '+
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
            this.swdfEndPoint.getEndpoint().executeQuery(query,callback);
        }
        this.getTopicGraphView = function(uriTopic,callback){
    	    var query  = ' SELECT DISTINCT * WHERE {      '+
					 ' { '+
                                         '    ?Publication     foaf:topic <'+uriTopic+'> ;   '+
					 '                     dc:title      ?Title.         '+
                                         ' }} LIMIT 10 ';
            this.swdfEndPoint.getEndpoint().executeQuery(query,callback);
        }
}