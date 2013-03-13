/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql,
 **/
function KeywordView(prefix) {
    this.prefix       = prefix;    
    this.reasoner     = null;
    this.keywordClass = '';
    var self          = this;
    this.paramKeyword = '';
    this.initView = function(locationId,entityId){
        this.keywordClass = '#KeywordClass_'+entityId.toLowerCase().replace(/\s+/g,'_');
     
        this.paramKeyword =  entityId;    
        
        $('#keywordLabel').append(this.paramKeyword.replace("-"," ").capitalizeFirstLetter());
        return this; 
    }
    this.loadTree = function(childrenArray){           
        $.each(childrenArray,function(i,item){            
                /* keywordClass equivalent ?Class */
                if(self.reasoner.isSubClassOf(item.names[0],self.keywordClass) && self.reasoner.isSubClassOf(self.keywordClass,item.names[0]) && (self.keywordClass != item.names[0])/*doublon*/ ){
                    var keyword =  (item.names[0]).replace(/\#/g,'').replace(/\_/g,' ').replace(/KeywordClass\s/g,'');
                    $('#equiKeyword').append('<span><a href="#keyword~' + keyword.replace(/\s+/g,'-') +'"> '+ keyword.capitalizeFirstLetter() +'</a></span>,');
                }
                /* keywordClass(keywordPoster) subClassOf ?Class */
                else if(self.reasoner.isSubClassOf(self.keywordClass,item.names[0]) && (self.keywordClass != item.names[0])/*doublon*/){
                    var keyword =  (item.names[0]).replace(/\#/g,'').replace(/\_/g,' ').replace(/KeywordClass\s/g,'');
                    $('#subKeyword').append('<span><a href="#keyword~' + keyword.replace(/\s+/g,'-') +'"> '+ keyword.capitalizeFirstLetter() +'</a></span>,');
                }
                /* keywordClass(keywordPoster) upperClassOf  ?Class */
                if(self.reasoner.isSubClassOf(item.names[0],self.keywordClass) && (self.keywordClass != item.names[0])/*doublon*/){
                    var keyword =  (item.names[0]).replace(/\#/g,'').replace(/\_/g,' ').replace(/KeywordClass\s/g,'');
                    $('#upperKeyword').append('<span><a href="#keyword~' + keyword.replace(/\s+/g,'-')+'"> '+ keyword.capitalizeFirstLetter() +'</a></span>,');
                }
       
            self.loadTree(item.children);
        });
        return this;
    }
    this.render = function(dataXML,presenter){
        /* Store current Keyword */
        presenter.storeKeyword(this.keywordClass,this.paramKeyword);
        /* Parsing */
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

        var ThingClassJSON   = classeArray[0];
        // ThingClasseJSON.name[0]  // http://www.w3.org/2002/07/owl#Thing
        var KeywordClassJSON = ThingClassJSON.children[0];
        // KeywordClassJSON.names[0] //#Keyword
        var arrayChildrenKeyword = KeywordClassJSON.children;
        this.loadTree(arrayChildrenKeyword);
    }
      

}
/* "test string" => "Test String" */
String.prototype.capitalizeFirstLetter = function() {
    return this.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    }) ;
}