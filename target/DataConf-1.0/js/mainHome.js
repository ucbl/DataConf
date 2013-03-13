/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster
 *   Version: 1
 *   Tags: Sparql, CORS, JSONP , Graph visualization, Meta-data
 **/

/* the controller listens for actions and reacts */
$(document).ready(function() {    
	
	  		/* Local Storage of configurations */
			ConfigurationManager.getInstance().storeDatasource("${applicationScope.conferenceDatasource.name}","${applicationScope.conferenceDatasource.serviceUri}",
																"${applicationScope.conferenceDatasource.sparqlVersion}","${applicationScope.conferenceDatasource.method}",
																"${applicationScope.conferenceDatasource.dataType}","${applicationScope.conferenceDatasource.corsEnable}",
																"${applicationScope.conferenceDatasource.managerName}");
	
			ConfigurationManager.getInstance().storeDatasource("${applicationScope.publicationDatasource.name}","${applicationScope.publicationDatasource.serviceUri}",
					"${applicationScope.publicationDatasource.sparqlVersion}","${applicationScope.publicationDatasource.method}",
					"${applicationScope.publicationDatasource.dataType}","${applicationScope.publicationDatasource.corsEnable}",
					"${applicationScope.publicationDatasource.managerName}");
			
			ConfigurationManager.getInstance().storeDatasource("${applicationScope.webDatasource.name}","${applicationScope.webDatasource.serviceUri}",
					"${applicationScope.webDatasource.sparqlVersion}","${applicationScope.webDatasource.method}",
					"${applicationScope.webDatasource.dataType}","${applicationScope.webDatasource.corsEnable}",
					"${applicationScope.webDatasource.managerName}");
			
			ConfigurationManager.getInstance().storeDatasource("${applicationScope.eventDatasource.name}","${applicationScope.eventDatasource.serviceUri}",
					"${applicationScope.eventDatasource.sparqlVersion}","${applicationScope.eventDatasource.method}",
					"${applicationScope.eventDatasource.dataType}","${applicationScope.eventDatasource.corsEnable}",
					"${applicationScope.eventDatasource.managerName}");
			
			/*ConfigurationManager.getInstance().storeConference("${applicationScope.eventDatasource.name}","${applicationScope.eventDatasource.serviceUri}",
					"${applicationScope.eventDatasource.sparqlVersion}","${applicationScope.eventDatasource.method}",
					"${applicationScope.eventDatasource.dataType}","${applicationScope.eventDatasource.corsEnable}",
					"${applicationScope.eventDatasource.managerName}");*/
    		
			/* Init view */
			var layout     = new CompositeView("Home Pages","index");
		 
            layout.setLoader().resizeMenuBars().resizeFooter();

			layout.setCurrentPage("#home").show();
    		// $("#home").show(); 

});
