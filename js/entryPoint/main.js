 /**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This is the entry point of the application, after retrieving all the templates, the router is started with a given configuration file
*	Version: 1.1				   
*   Tags:  ROUTER, TEMPLATE
**/
 $(document).ready(function() {
	
	//Loading templates from /templates directory
	tpl.loadTemplates(['header', 'footer', 'navBar', 'home', 'qrcScan'], 
	
	function () {
		//Instantiate the router with configuration (see Configuration.js)
		var app_router = new AppRouter({configuration : Configuration});
		Backbone.history.start();
	});


  
});


