/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, , Graph visualization
 **/

/*  Singleton Object to store Graph JSON */

var GraphStore = {

    set:function(key,value){
       $.jStorage.set(key,value);
    },
    get:function(key){
       console.log("Graph Store :"+$.jStorage.get(key));
       return $.parseJSON($.jStorage.get(key)); 
    }
   
}

