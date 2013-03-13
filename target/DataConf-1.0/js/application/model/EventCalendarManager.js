/**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan and Florian BACLE
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: DuckDuckGo, Sparql ,DBLP Computer Science Bibliography
 **/
function EventCalendarManager(){
       
	
	this.dataSourceUri = ConfigurationManager.getInstance().getDatasourceServiceUri("eventDatasource");
	this.dataType = ConfigurationManager.getInstance().getDatasourceDataType("eventDatasource");
	this.method = ConfigurationManager.getInstance().getDatasourceMethod("eventDatasource");
   
    
    this.executeQuery = function(parameters,callback) {                  
     
        $.ajax({
                url: this.dataSourceUri ,
                type: this.method,
                cache: false,
                dataType: this.dataType,
                data: parameters,	
                jsonpCallback: "handleEventCalendar",
                success: callback,
                error: function(jqXHR, textStatus, errorThrown) {
                        // alert('For user IE, try to activate Tools -> Internet Options -> Security -> Custom Level -> "Access data sources across domains"');                                
                         alert(errorThrown);
                }
        });
        
        return this;
    }     
    
	this.getEvent = function(idLocation,idPublication,callback){
        console.log(" call event :"+idLocation);
        
        var uriPublication = ConfigurationManager.getInstance().getConfUri() + idLocation + idPublication;
        var parameters ={xproperty_value :  uriPublication};
       
        this.executeQuery(parameters,callback);
	
	}

};