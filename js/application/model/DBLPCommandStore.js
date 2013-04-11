  /**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2013
 *   Author: Lionnel MEDINI(supervisor), Florian BACLE, Fiona LE PEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
 *   Description: Interface of a Datasource model
 *   Version: 1
 *   Tags:  
 **/
 //DBLP commands file 
 
//First Part SWDF commands file, Second Part : ModelCallBack function definition 
 var DBLPCommandStore = {}:
 //Command getAuthor 
DBLPCommandStore.getAuthor = {
                            name: "getAuthor",
                            dataType : "JSONP",
                            method : "GET",
                            getQuery : function(parameters){ //JSON file parameters 
                                                var authorName = parameters.authorName; 
                                                var query =  ' SELECT DISTINCT ?uriAuthor  ?Site  ?CoAuthors  ?OtherPublication ?UriOtherPublication ?Years  WHERE {      ' +
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
                                                             return query;
                                                  },
                                      ModelCallBack : getAuthorMethodCallBack
                                         
                                  }
,
                                  
 //Command getConfPublication                                  
DBLPCommandStore.getConfPublication = {
                              name: "getConfPublication ",
                              dataType : "JSONP",
                              method : "GET",
                              getQuery : function(parameters){ //JSON file parameters 
                                                var uriPublication = parameters.uriPublication; 
                                                var query =  ' SELECT DISTINCT ?Title ?Author ?Url ?Year ?Conference ?Publisher WHERE {      '+
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
                                                             return query;
                                                 },
                                        ModelCallBack : getConfPublicationMethodCallBack
                                           
                                  })

,
 //Command getJournalPublication  
 //.............TODO Method CallBack....................                                 
DBLPCommandStore.getJournalPublication ={
                                name: "getJournalPublication  ",
                                dataType : "JSONP",
                                method : "GET",
                                getQuery : function(parameters){ //JSON file parameters 
                                                var uriPublication = parameters.uriPublication; 
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
                                          ModelCallBack : "TODO"
                                     
                                  }
                                  
 ,                                 
 //Command getAuthorGraphView                                                          
DBLPCommandStore.getAuthorGraphView = {
                                name: "getAuthorGraphView",
                                dataType : "JSONP",
                                method : "GET",
                                getQuery : function(parameters){ //JSON file parameters 
                                                var authorName = parameters.authorName; 
                                                var query =  '  SELECT DISTINCT ?OtherPublication ?UriOtherPublication   WHERE {       ' +
                                                             ' { ?author foaf:name  "'+ authorName +'" . '+
                                                             '   ?UriOtherPublication foaf:maker ?author  .  '+                                
                                                             '   ?UriOtherPublication dc:title ?OtherPublication  .    '+                                     
                                                             ' }} ORDER BY  DESC  (?Years) LIMIT 5 ';
                                                             return query;
                                                  },
                                ModelCallBack : getAuthorGraphViewMethodCallBack
                                     
                           }
                                  

 
   
   
//.......................ModelCallBack................................   


//CallBack for the command getConfPublication on DBLP  
function getConfPublicationMethodCallBack(dataJSON,presenter){
                var publicationTitle;
                $.each(dataJSON.results.bindings,function(i,item){
                    $.each(item, function(key, valueArr) {
                        if(key == 'Title'){
                            publicationTitle = valueArr.value;
                        }
                    });
                });
                this.graph.setRootNode(this.uriPublication,publicationTitle);
		$.each(dataJSON.results.bindings,function(i,item){
                        $.each(item, function(key, valueArr) {
                                var idContent    = self.prefix + key;
                                switch(key){
                                    case 'Author':
                                        var paramDogFoodName = 'person~' + (valueArr.value).toLowerCase();
                                        var nameToSpace  = paramDogFoodName.replace(/\.+/g, ' ');
                                        var nameSWDFtoDash = nameToSpace.replace(/\s+/g, '-');
                                        var nameDBLPtoDash = (valueArr.value).replace(/\s+/g, '~');
                                        self.graph.setChildNode('http://data.semanticweb.org/person/'+nameSWDFtoDash, valueArr.value, self.uriPublication, key);
                                        $(idContent).append('<span><a href="#'+ nameSWDFtoDash +'~~'+ nameDBLPtoDash +'">' + valueArr.value +'</a></span>, ');
                                        break;
                                    case 'Url':
                                        self.graph.setChildNode(valueArr.value, valueArr.value, self.uriPublication, key);
                                        $(idContent).append('<div><a href="'+ valueArr.value +'" >' + valueArr.value +'</a></div>');
                                        break;
                                    default:
                                        if($(idContent).text() == '')
                                                $(self.prefix + key).append(valueArr.value);
                                            if(key != 'Title') self.graph.setChildNode(valueArr.value, valueArr.value, self.uriPublication, key);
                                        break;
                                }
                        });
		});
                /* toString Paper's Graph */
                var graphJSON    = JSON.stringify(self.graph.getInstance());
                var keyGraphStorage = self.uriPublication.replace("http://dblp.l3s.de/d2r/resource/publications/","");
                /* store Paper's Graph with jstorage */
                presenter.storeGraph("graph/"+keyGraphStorage,graphJSON);
                /* Set link */
                $(self.prefix+'Graph').append('<span><a href="#' + self.hashGraph + '" id="viewAs">View As Graph</a></span>');
    }    
    
    
//CallBack for the command getAuthor on DBLP     
function getAuthorMethodCallBack(dataJSON,presenter){
                var site = false;
                $.each(dataJSON.results.bindings,function(i,item){
                      $.each(item, function(key, valueArr) {
                                var idContent    = self.prefix + key;
                                switch(key){
                                    case 'OtherPublication':
                                            var keyPublication =  valueArr.value.replace(/[\.]/,'').toLowerCase().replace(/\s+/g,'_');                                          
                                            /* Eliminate publications SWDF added in DOM*/
                                            if(self.arrPublicationsSWDF[keyPublication] != true)
                                                $(idContent).append('<div><a href="#'+ Dash.getValue(item.UriOtherPublication.value, 'http://dblp.l3s.de/d2r/resource/publications/') +'">' + valueArr.value + '(' +item.Years.value + ')' +'</a></div>');
                                            break;
                                    case 'CoAuthors':
                                            var paramDogFoodName = 'person~' + (valueArr.value).toLowerCase();
                                            var nameToSpace  = paramDogFoodName.replace(/\.+/g, ' ');
                                            var nameSWDFtoDash = nameToSpace.replace(/\s+/g, '-');
                                            var nameDBLPtoDash = (valueArr.value).replace(/\s+/g, '~');
                                            // check if double author name
                                            if(valueArr.value != self.authorName ) $('#author'+key).append('<span><a href="#'+ nameSWDFtoDash +'~~'+ nameDBLPtoDash +'">' + valueArr.value +'</a></span>, ');
                                            break;
                                    case 'Site':
                                            site = true;
                                            $(idContent).append('<a href="'+ valueArr.value +'" >' + valueArr.value +'</a>');
                                            break;
                                }                               
                        });
                });
                // If homepage is not found => find it with DuckDuckGo!
                if(!site){
                    var author = '!ducky+'+this.authorName.replace(/\s+/g, '+') + '+professor' ;
                    presenter.search(author);
                }
                /* toString Paper's Graph */
                var graphJSON = JSON.stringify(this.authorGraph.rootNode);
                var keyGraphStorage = this.uriAuthorSWDF.replace("http://data.semanticweb.org/","") ;
               /*  store ontology with jstorage */
               presenter.storeGraph("graph/"+keyGraphStorage,graphJSON);
               /*  Set link */
               $(self.prefix+'Graph').append('<span><a href="#' +this.hashGraph+ '" id="viewAs">View As Graph</a></span>');
               return this;
    } 
    
    
//CallBack for the command getAuthorGraphView on DBLP      
function getAuthorGraphViewMethodCallBack(dataJSON){
 
    function render(dataJSON){               
        $.each(dataJSON.results.bindings,function(i,item){
            $.each(item, function(key, valueArr) {
                if(key == 'Author'){
                    var paramDogFoodName = 'person~' + (valueArr.value).toLowerCase();
                    var nameToSpace      = paramDogFoodName.replace(/\.+/g, ' ');
                    var uriAuthoSWDF     = 'http://data.semanticweb.org/person/'+nameToSpace.replace(/\s+/g, '-');
                    self.graphJSON.setChildNode(uriAuthoSWDF  , valueArr.value, self.idCurrentNode, key);
                }else if(key == 'Url'){			
                    self.graphJSON.setChildNode(valueArr.value, valueArr.value, self.idCurrentNode, key);
                }
                else {	
                    self.graphJSON.setChildNode(valueArr.value, valueArr.value, self.idCurrentNode, key);
                }

            });	
        });
        return this;
    }
    this.getGraph = function(){
        return self.graphJSON;
    } 
    
 }                         
 
