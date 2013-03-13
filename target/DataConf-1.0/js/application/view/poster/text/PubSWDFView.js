/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, , Graph visualization
 **/
function PubSWDFView(prefix) {
    /* Variables */
    this.prefix  = prefix;
    this.paperGraph = null;
    this.uriPaper   = '';
    this.hashGraph  = '';
    this.poster     = '';
    this.storageKey = ''
    var self = this;
    /* Init view */
    this.initView = function(locationId,entityId){          	
        /* set parameter */
        this.uriPaper   =  ConfigurationManager.getInstance().getConfUri() + locationId + entityId;
        this.hashGraph  = 'graph~' + ConfigurationManager.getInstance().getConfId().replace(/\/+/g, '~');
        this.poster     =  locationId.replace("/","");
        this.poster     =  this.poster + entityId;
        this.paperGraph =  new GraphJSON();  
       
        return this;
    }
    /* render the metadata */
    this.render = function(dataXML,presenter){
    	          
        var titlePaper = $(dataXML).find('sparql > results > result > binding[name="Title"]').find(":first-child").text();                  
        if(titlePaper != ''){
 
            /*  Add root node */
            this.paperGraph.setRootNode(this.uriPaper,titlePaper);
            /*   Parsing XML */
            $(dataXML).find("sparql > results > result > binding").each(function(){
                var key          = $(this).attr("name");
                var value        = $(this).find(":first-child").text();    // Label ressource
                var idContent    = self.prefix + key;
                          
                /* Add content */
                switch(key){                                    
                    case 'Author':
                        var nameToDash = value.replace(/\s+/g, '~');
                        var uriAuthor =  $(this).next().find(":first-child").text();
                        var paramater = uriAuthor.replace(ConfigurationManager.getInstance().getConfBaseUri(),'');
                        var paramaterToDash = paramater.replace(/\/+/g, '~');
                        /*  Add to DOM and to Graph */
                        $(idContent).append('<span><a href="#'+ paramaterToDash +'~~'+ nameToDash +'">' + value +'</a></span>, ');
                        self.paperGraph.setChildNode(uriAuthor, value, self.uriPoster, key);
                        break;
                    case 'Title' :
                        var pdf =  $(this).next().next().find(":first-child").text();
                        /*  Add to DOM and to Graph */
                        if(pdf != '') $('#paperNumber').append('<h1><a href='+pdf+' style="text-decoration: underline;">'+self.poster.capitalizeFirstLetter()+'</a></h1>');
                        else          $('#paperNumber').append('<h1>'+self.poster.capitalizeFirstLetter()+'</h1>');                                           
                        $(idContent).append(value);
                        break;
                    case 'Keyword':
                        if(value == 'http://dbpedia.org/resource/World_Wide_Web') var theme = 'topic~world-wide-web';
                        else                                                      var theme = Dash.getValue(value,ConfigurationManager.getInstance().getConfBaseUri());
                        var KeywordLabel =  $(this).next().find(":first-child").text();
                        /*  Add to DOM and to Graph */
                        $(idContent).append('<span><a href="#'+ theme + '"> ' + KeywordLabel +'</a></span>,');
                        self.paperGraph.setChildNode(value, KeywordLabel, self.uriPaper, key);
                        break;
                    case 'KeywordLabel' :
                        var uriKeyword  =  'http://poster.www2012.org/ontologies/2012/3/KeywordsOntologyWithoutInstance.owl#keyword_'+value.toLowerCase().replace(/\s+/g,'_');
                        var keywordClass = '#KeywordClass_'+value.toLowerCase().replace(/\s+/g,'_');
                        /* Storage */
                        presenter.storeKeyword(keywordClass, value);
                        /*  Add to DOM and to Graph */
                        $(self.prefix + 'Keyword').append('<span><a href="#keyword~' + value.replace(/\s+/g,'-') +'"> '+ value.capitalizeFirstLetter() +'</a></span>,');
                        self.paperGraph.setChildNode(uriKeyword, value, self.uriPaper, "hasKeyword");
                        break;
                    default:
                        $(idContent).append(value+' ');
                        break;
                }
            });
            /* toString Paper's Graph */
            var graphJSON    = JSON.stringify(self.paperGraph.getInstance());
            var keyGraphStorage = self.uriPaper.replace("http://data.semanticweb.org/","");
            /* store Paper's Graph with jstorage */
            presenter.storeGraph("graph/"+keyGraphStorage,graphJSON);
            /* Set link */
            $(self.prefix+'Graph').append('<span><a href="#' + self.hashGraph + '" id="viewAs">View As Graph</a></span>');
        }
        else{
            $('#paperDetail > div').empty();
            $('#paperDetail > div').append('<h3>Search result not found!</h3>')
        }
    }
    
    /* Render data relative to the calendar */
    this.renderDataEC = function(dataJSON,presenter){
    	
        $.each(dataJSON,function(key,item){
        	
        	   $.each(item, function(item, value) {
        		
                        switch(item){
                            case 'start_at':
                                
                            	 $("#paperEvent").append('<h3>Date : '+value +'</h3>');
                                    break;
                            case 'location':
                            	
                            	$("#paperEvent").append('<h3>Location : '+ value.name +'</h3>');
                                    break;
                            case 'duration':
                                
                            	$("#paperEvent").append('<h3>Duration : '+ value +'</h3>');
                                    break;
                        }     
        	 
        	   });
        });
        if($('#paperEvent').text() == '') $('#LabelPubliEvent').hide();
    }
    

}

/* "test string" => "Test String" */
String.prototype.capitalizeFirstLetter = function() {
    return this.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    }) ;
}