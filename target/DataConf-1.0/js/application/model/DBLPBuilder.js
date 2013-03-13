/**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: DuckDuckGo, Sparql ,DBLP Computer Science Bibliography
 **/
function DBLPBuilder(urlDBLP){
        /* Inheritance */
        SparqlEndpointBuilder.call(this);
		/* Variables */
		this.prefix   = ' PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' + 
	                        ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
	                        ' PREFIX owl: <http://www.w3.org/2002/07/owl#>              ' +
	                        ' PREFIX dc: <http://purl.org/dc/elements/1.1/>             ' +
	                        ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>                 ' +
	                        ' PREFIX swrc: <http://swrc.ontoware.org/ontology#>         ' +
	                        ' PREFIX dcterms: <http://purl.org/dc/terms/>               ' ;
	        //this.sparqlEndPointURL  = 'http://dblp.l3s.de/d2r/sparql';

	    this.sparqlEndPointURL = ConfigurationManager.getInstance().getDatasourceServiceUri("publicationDatasource");
	    this.dataType          = ConfigurationManager.getInstance().getDatasourceDataType("publicationDatasource");
	    this.output            = '';
	    this.method			   = ConfigurationManager.getInstance().getDatasourceMethod("publicationDatasource");
	    this.CorsEnable    = ConfigurationManager.getInstance().getDatasourceCorsEnable("publicationDatasource");
	    
	    this.initDatasource = function (){
	    	
	    	 this.sparqlEndpoint.setCorsEnable(this.CorsEnable);
	    	  this.sparqlEndpoint.setDataType(this.dataType);
//		        this.sparqlEndpoint.setOutput('xml');  // set output if SWDF Sparql Enpoint
	         // this.sparqlEndpoint.setOutput('');     // do  not set output if 4store Sparql Endpoint : output did not implement
	          this.sparqlEndpoint.setMethod(this.method);
	          this.sparqlEndpoint.setPrefix(this.prefix);
	          this.sparqlEndpoint.setOutput('json');
	          this.sparqlEndpoint.setsparqlEndPointURL(this.sparqlEndPointURL);
	    	
	          return this;
	    }
	    
	    
        this.setJSONEnabled = function(){
        
              this.sparqlEndpoint.setDataType('jsonp');
              this.sparqlEndpoint.setOutput('json');
              this.sparqlEndpoint.setMethod('GET');
              this.sparqlEndpoint.setPrefix(this.prefix);
              this.sparqlEndpoint.setsparqlEndPointURL(this.sparqlEndPointURL);
              /**
               * IMPORTANT : refer to SWDFManager() . 
               * If there is not this line,next constructor could not be excecuted 
               * eg:new SWDFManager().setCorsEnabled('abc').setYear('def') will not be executed
               **/ 
              return this;
    
        }		
};
