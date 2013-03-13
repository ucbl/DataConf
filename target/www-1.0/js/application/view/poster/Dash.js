/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, , Graph visualization
 **/
var Dash = {
    getValue:function(uriResource,urlSite){
        var paramater = uriResource.replace(urlSite,'');					
        var paramaterToDash = paramater.replace(/\/+/g, '~');	
        return paramaterToDash;
    },
    setValue:function(uriResource,urlSite){
        var paramater = uriResource.replace(urlSite,'');					
        var paramaterToDash = paramater.replace(/\/+/g, '-');
        return paramaterToDash;
    }
}

