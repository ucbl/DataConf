  /**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2013
 *   Author: Lionnel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
 *   Description: Interface of a Datasource model
 *   Version: 1
 *   Tags:  
 **/
Datasource = Backbone.Model.extend({

	defaults: {
		
	},
	
	initialize: function(options){
		this.url = options.uri,
		this.crossDomainMode = options.crossDomainMode,
		this.commandList = [];
	},
	
	addCommand : function(command){
		this.commandList.push(command);
	},
	
	getCommand : function(commandName){
		this.commandList.get(commandName);
	}
	
});