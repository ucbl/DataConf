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
  
		/***************** HANDLE DATASOURCES CONFIGURATIONS ****************************/
		/* Store a datasource as a json array */
		this.storeDatasource = function(datasourceName,serviceUri,sparqlVersion,method,dataType,corsEnable,managerName){
			
			var datasource = {datasourceName: datasourceName,serviceUri:serviceUri,
							sparqlVersion:sparqlVersion,method:method,dataType:dataType,
							corsEnable:corsEnable,managerName:managerName};
			
			$.jStorage.set(datasourceName, datasource);
			
			return this;				
		}
		
		
		this.getDatasourceByName = function (datasourceName){
			return $.jStorage.get(datasourceName);
		}
		
		this.getDatasourceServiceUri = function (datasourceName){
			var datasource = $.jStorage.get(datasourceName);
			return datasource["serviceUri"];
		}
		
		this.getDatasourceSparlVersion = function (datasourceName){
			var datasource = $.jStorage.get(datasourceName);
			return datasource["sparqlVersion"];
		}
		
		this.getDatasourceMethod = function (datasourceName){
			var datasource = $.jStorage.get(datasourceName);
			return datasource["method"];
		}
		
		this.getDatasourceCorsEnable = function (datasourceName){
			var datasource = $.jStorage.get(datasourceName);
			var isEnable = datasource["corsEnable"];
			if(isEnable == "YES"){
				return true;
			}else{
				return false;
			}
		}
		
		this.getDatasourceDataType = function (datasourceName){
			var datasource = $.jStorage.get(datasourceName);
			return datasource["dataType"];
		}
		

		/******************** HANDLE CURRENT CONFERENCE CONFIGURATIONS ******************************/
		this.InitConference = function(confBaseUri,confId){
			$.jStorage.set("confBaseUri", confBaseUri);
			$.jStorage.set("confId", confId);

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
		

	}  
		  
		// propriété statique qui contient l'instance unique  
	ConfigurationManager.instance = null;  
		  
	ConfigurationManager.getInstance = function() {  
		if (this.instance == null) {  
			this.instance = new ConfigurationManager();  
		}  
		return this.instance;  
	}  
	
	
	