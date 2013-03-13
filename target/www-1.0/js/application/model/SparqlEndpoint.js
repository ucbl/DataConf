/**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags:  Sparql
 **/
function SparqlEndpoint(){
    
    /* Contructor */ 
    this.sparqlEndPointURL = '';
    this.dataType          = '';
    this.output            = '';
    this.prefix            = '';
    this.data              = null;
    var self               = this;
    /* Setter*/    
    /*  dataType       : xml,jsonp,json */
    this.setsparqlEndPointURL = function(url){	             
         this.sparqlEndPointURL = url;                
    }
    this.setDataType = function(dataType){
         this.dataType = dataType;	
    }
    /*  method : GET or POST */
    this.setMethod = function(method){	
        this.method = method;	
    }
    /*  output        : xml,json,rdf (It depends  service Sparql Endpoint */
    this.setOutput = function(output){	
        this.output = output;
    }
    this.setPrefix = function(prefix){	
        this.prefix = this.prefix + prefix;	
    }
    /* Getter */        
    this.executeQuery = function(query,callback){                   
 
            var paramaters = null;
            if(this.output != '') paramaters = { query: this.prefix + query ,output: this.output };
            else                   paramaters = { query: this.prefix + query };
            
            $.ajax({
                    url: this.sparqlEndPointURL ,
                    type: this.method,
                    cache: false,
                    dataType: this.dataType,
                    data: paramaters,							
                    success:callback,
                    error: function(jqXHR, textStatus, errorThrown) {
                            // alert('For user IE, try to activate Tools -> Internet Options -> Security -> Custom Level -> "Access data sources across domains"');                                
                             //alert(errorThrown);
                    }
            });
            
            return this;
     }     
}





