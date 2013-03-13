/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan and Bacle Florian
 *   Description: Configuration manager
 *   Version: 1
 *   Tags: Jstorage
 **/
	function ConfigurationManager() {  
		  
		if ( ConfigurationManager.caller != ConfigurationManager.getInstance ) {  
			throw new Error("This object cannot be instanciated");  
		}  
  
		this.InitDatasource = function(managerName,serviceUri,sparqlVersion,method,dataType,corsEnable){
			
			var datasource = {
			          test:'test 1',
			          testData: [ 
			                {testName: 'do',testId:''}
			           ],
			           testRcd:'value'   
			};
			$.jStorage.set("confServiceUri", confServiceUri);
			$.jStorage.set("confBaseUri", confBaseUri);
			$.jStorage.set("confId", confId);
			$.jStorage.set("dblpUri", dblpUri);
			$.jStorage.set("ddgoUri", ddgoUri);
			
			return this;				
		}
		
		this.InitConference = function(confServiceUri,confBaseUri,confId,dblpUri,ddgoUri){
			$.jStorage.set("confServiceUri", confServiceUri);
			$.jStorage.set("confBaseUri", confBaseUri);
			$.jStorage.set("confId", confId);
			$.jStorage.set("dblpUri", dblpUri);
			$.jStorage.set("ddgoUri", ddgoUri);
			return this;				
		}
		
		this.getConfServiceUri = function(){
			return $.jStorage.get("confServiceUri");
		}
				
		this.getConfBaseUri = function(){
			return $.jStorage.get("confBaseUri");
		}
		
		this.getConfId = function(){
			return $.jStorage.get("confId");
		}
		
		this.getConfUri = function (){
			return $.jStorage.get("confBaseUri")+$.jStorage.get("confId");
			
		}
		
		this.getDblpUri = function(){
			return $.jStorage.get("dblpUri");
		}
		
		this.getDdgoUri = function(){
			return $.jStorage.get("ddgoUri");
		}
	}  
		  
		// propriété statique qui contient l'instance unique  
	ConfigurationManager.instance = null;  
		  
	ConfigurationManager.getInstance = function() {  
		if (this.instance == null) {  
			this.instance = new ConfigurationManager();  
		}  
		return this.instance;  
	}  
	
	
	