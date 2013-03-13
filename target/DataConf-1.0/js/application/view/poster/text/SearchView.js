/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, , Graph visualization
 **/
function SearchView(prefix){
    this.prefix  = prefix;
    var self     = this; 
     /* Init view */
    this.initView = function(){
            $('#search > div > h3 > span').empty();    /* empty search value  */
            $('#search > div > ul').empty();           /* empty search result */
            return this;
    }  
    /* search poster by author, title, keyword */
    this.render = function(dataXML){
        
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
    }
    
    // Pas util ----->
    this.callbackSearchPaperByAuthor = function(dataXML){
         var result = $(dataXML).find("sparql > results> result").text();
         if( result != ""){
              $(dataXML).find("sparql > results > result > binding").each(function(){                  
                    var key  = $(this).attr("name");				
                    var value = $(this).find(":first-child").text();
                    if(key == 'uriPaper'){
                        var title = $(this).next().find(":first-child").text();
                        var publication = Dash.setValue(value, 'http://data.semanticweb.org/');  
                     
                        $(self.prefix).append('<li><a href="#'+ publication+ '"><span>'+title+'</span></a></li> '); 
                    }
              });             
         }
         // If poster is not found, search approximatively author's name
         else{    
              //if(SearchView.typeSearch == '/poster/view') SWDFPosterManager.getAuthorSearchByName(SearchView.valueSearch, [SearchView.callbackSearchAuthor]);         
              //else if(SearchView.typeSearch == '/paper/view') SWDFPaperManager.getAuthorSearchByName(SearchView.valueSearch, [SearchView.callbackSearchAuthor]);         
              $(self.prefix).append('<li>Search result not found!</li>');
         }
    }
    this.callbackSearchAuthor = function(dataXML){
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

}