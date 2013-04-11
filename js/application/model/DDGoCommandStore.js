  /**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2013
 *   Author: Lionnel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
 *   Description: Interface of a Datasource model
 *   Version: 1
 *   Tags:  
 **/
 
//First Part SWDF commands file, Second Part : ModelCallBack function definition 
//Web Service REST
 var DDGoCommandStore = {};
 
 //Command getAuthorSuggestion 
DDGoCommandStore.getResult= {
                                  name: "getResult",
                                  dataType : "JSON",
                                  method : "GET",
                                  getQuery : function(parameters){ //JSON file parameters 
                                                var dataSourceUri = "http://api.duckduckgo.com/"; 
                                                var searchValue = parameters.searchValue;
                                                var query = dataSourceUri+'?q='+searchValue+'&format=json&pretty=1&no_redirect=1',;//Put in URL (method get)
                                                   return query ; 
                                           },
                                  ModelCallBack : getResultMethodCallBack 
                                  })
                               


//.......................ModelCallBack................................

//CallBack for the command getResult on DDGo     
function getResultMethodCallBack(dataJSON){
               $(self.prefix+'Site').append('<span><a href="'+ dataJSON.Redirect +'" >' + dataJSON.Redirect +'</a></span>');
    }