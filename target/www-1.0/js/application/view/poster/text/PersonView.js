/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster
 *   Version: 1
 *   Tags: DuckDuckGo, Sparql , Semantic Web Dog Food ,DBLP Computer Science Bibliography
 **/
function PersonView(prefix) {
        /* Variables */
        this.prefix  = prefix;
        this.authorName         = '';
        this.arrPublicationsSWDF = {};
        this.authorGraph        = null;
        this.uriAuthorSWDF      = '';
        this.uriAuthorDBLP      = '';
        this.hashGraph          = '';
        var self                = this;
	/* Init View */
        this.initView = function(locationId,entityId){

                this.authorName    = entityId.replace("-"," ").capitalizeFirstLetter();
             
                this.uriAuthorSWDF = ConfigurationManager.getInstance().getConfUri() + locationId + entityId;
                //Set Hash URL
                this.hashGraph =  'graph~' + ConfigurationManager.getInstance().getConfId().replace(/\/+/g, '~');
                $('#labelAuthorPublication').show();
                $('#labelAuthorOrganization').show();
                $('#authorName').append(unescape( this.authorName));
                this.authorGraph = new GraphJSON();

                return this;
	}
        /* render the data of  model */
	this.renderDataSWDF = function(dataXML,presenter){
                  /*  Set root node of author's graph */
                 this.authorGraph.setRootNode(this.uriAuthorSWDF,this.authorName);
                  /*  Parsing XML */
                 $(dataXML).find("sparql > results > result > binding").each(function(){

                            var key          = $(this).attr("name");
                            var value        = $(this).find(":first-child").text();    // Label ressource
                            var idContent    = self.prefix + key;
                            switch(key){
                                    case 'Publication':
                                            /*  Publication > uriPublication > uriKeyword  > urlPDF  */
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
                                            /*  Publications added */
                                            self.arrPublicationsSWDF[keyPublication] = true;                                 
                                            /* Add child node Graph JSON */                                            
                                            if(pdf == '') $(idContent).append('<div><a  href="#'+ constructedUri  +'">' + value  +'</a></div>');
                                            else          $(idContent).append('<div><a  href="#'+ constructedUri  +'">' + value  +'</a> <a  href='+pdf+'> (PDF) </a> </div>');
                                            self.authorGraph.setChildNode(uriResource,value , self.uriAuthorSWDF , key);
                                            break;
                                    case 'Organization':
                                            var uriResource   = $(this).next().find(":first-child").text();
                                            /* Add child node Graph JSON */
                                            self.authorGraph.setChildNode(uriResource, value, self.uriAuthorSWDF, key);
                                            $(idContent).append('<div><a  href="#'+ Dash.getValue(uriResource, ConfigurationManager.getInstance().getConfBaseUri()) +'">' + value   +'</a></div>');
                                            break;
                                    case 'keywordLabel':
                                            var keywordLabel   =  value;
                                            var uriKeyword     = 'http://poster.www2012.org/ontologies/2012/3/KeywordsOntologyWithoutInstance.owl#keyword_'+keywordLabel.toLowerCase().replace(/\s+/g,'_');
                                            var keywordClass   = '#KeywordClass_' + keywordLabel.toLowerCase().replace(/\s+/g,'_');
                                            /* Storage */
                                            presenter.storeKeyword(keywordClass, value);
                            }
                 });
                 if($('#authorPublication').text() == '') $('#labelAuthorPublication').hide();
                 if($('#authorOrganization').text() == '') $('#labelAuthorOrganization').hide();
                 return this;
	}
	this.renderDataDBLP = function(dataJSON,presenter){
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
    
    this.renderDataDDGo = function(dataJSON){
               $(self.prefix+'Site').append('<span><a href="'+ dataJSON.Redirect +'" >' + dataJSON.Redirect +'</a></span>');
    }
}
/* "test string" => "Test String" */
String.prototype.capitalizeFirstLetter = function() {
    return this.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    }) ;
}