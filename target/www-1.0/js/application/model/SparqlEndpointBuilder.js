/**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags:  Sparql
 **/

/* Abstract Builder */
function SparqlEndpointBuilder(){
    
    this.sparqlEndpoint = new SparqlEndpoint();

    this.getEndpoint = function(){
        return this.sparqlEndpoint;
    }
    /* Abstract method*/ 
    this.setCORSEnabled = function(){
        throw new Error('Unsupported method on an abstract class.');
    }
    
    this.setJSONEnabled = function(){
        throw new Error('Unsupported method on an abstract class.');
    }

    this.getSparqlEndpoint = function(){
        return this.sparqlEndpoint;
    }
}





