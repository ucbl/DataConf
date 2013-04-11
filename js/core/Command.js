 /**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2013
 *   Author: Lionnel MEDINI(supervisor), Florian BACLE, Fiona LE PEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
 *   Description: Command class
 *   Version: 1
 *   Tags:  
 **/ 
 
 var Command = Backbone.Model.extend({

        // Default properties
       defaults: {
			name       : "",
			dataType   : "",
			method     : "",
			query      : ""
        },
        
        // Constructor with options JSON file 
        initialize: function(options) {
			this.name       = options.name,
			this.dataType   = options.dataType,
			this.method     = options.method,
			this.getQuery   = options.getQuery
        },
        // Any time a Model attribute is set, this method is called
        validate: function(attrs) {

        },
        
        //ModelCallBack : callback query fonction 
        ModelCallBack : function(){
            
        },
        
        //ViewCallBack : 
        ViewCallBack : function(){
        }

    });

