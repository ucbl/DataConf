/**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags:  Sparql ,Semantic Web Dog Food
 **/

/* Concrete Builder*/ 
function SWDFBuilder(uriSWDF){
    
    /* Inheritance */
    SparqlEndpointBuilder.call(this);

    this.conferenceYear    = '';
    this.prefix            = ' PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' + 
                             ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>      ' +
                             ' PREFIX owl: <http://www.w3.org/2002/07/owl#>              ' +
                             ' PREFIX dc: <http://purl.org/dc/elements/1.1/>             ' +
                             ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>                 ' +
                             ' PREFIX swrc: <http://swrc.ontoware.org/ontology#>         ' +
                             ' PREFIX swrc-ext: <http://www.cs.vu.nl/~mcaklein/onto/swrc_ext/2005/05#> ' +
                             ' PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>    ' +
                             ' PREFIX ical: <http://www.w3.org/2002/12/cal/ical#>        ' +
                             ' PREFIX dcterms: <http://purl.org/dc/terms/>               ' +
                             ' PREFIX iswm: <http://poster.www2012.org/ontologies/2012/3/KeywordsOntologyWithoutInstance.owl#> '+
                             ' PREFIX swc: <http://data.semanticweb.org/ns/swc/ontology#>' ;
             
   // this.sparqlEndPointURL = 'http://posters.www2012.org:8080/sparql/';
   
    this.sparqlEndPointURL = uriSWDF;
    
    this.setCORSEnabled = function(){
        
             /**		
              * Cross domain Problem -  work with IE 8, IE 9
              * CORS is a specification that enables truly open access across domain boundaries : http://www.w3.org/wiki/CORS_Enabled
              * Cross-site scripting : http://en.wikipedia.org/wiki/Cross-site_scripting#Exploit_scenarios
              **/							
              jQuery.support.cors = true;	  
              this.sparqlEndpoint.setDataType('xml');
//            this.sparqlEndpoint.setOutput('xml');  // set output if SWDF Sparql Enpoint
              this.sparqlEndpoint.setOutput('');     // do  not set output if 4store Sparql Endpoint : output did not implement
              this.sparqlEndpoint.setMethod('GET');
              this.sparqlEndpoint.setPrefix(this.prefix);
              this.sparqlEndpoint.setsparqlEndPointURL(this.sparqlEndPointURL);
              
              return this;
    
    }	
    

}