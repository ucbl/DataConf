/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster
 *   Version: 1
 *   Tags: DuckDuckGo, Sparql ,DBLP Computer Science Bibliography
 **/
function DuckDuckGoManager() {
	
	this.dataSourceUri = ConfigurationManager.getInstance().getDatasourceServiceUri("webDatasource");
	this.dataType = ConfigurationManager.getInstance().getDatasourceDataType("webDatasource");
	this.method = ConfigurationManager.getInstance().getDatasourceMethod("webDatasource");
	this.corsEnable = ConfigurationManager.getInstance().getDatasourceCorsEnable("webDatasource");
	
    this.getResult = function(searchValue,callbackView) {
    			
		jQuery.support.cors = this.corsEnable;
	
        $.ajax({
                url: this.dataSourceUri+'?q='+searchValue+'&format=json&pretty=1&no_redirect=1',
                type: this.method,
                dataType:this.dataType,
                cache:false,
                success:callbackView,
                error: function(jqXHR, textStatus, errorThrown) {
                    // alert('For user IE, try to activate Tools -> Internet Options -> Security -> Custom Level -> "Access data sources across domains"');                                
                     alert(errorThrown);
                }
         });
    }
};





