/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, Graph visualization , Thejit
 **/
function GraphJSON() {
    
    this.rootNode = null;
    
    this.getInstance = function(){
        return this.rootNode;
    }
    
    this.setRootNode = function(uriResource,labelResource){
           this.rootNode = {
                "id":uriResource,
                "name":labelResource,
                "children":[],
                "data":[]
           };
           return this;
    }
    
    this.setChildNode = function(uriObject,valueObject,uriSubject,predicat){
           var node = {
                "id":uriObject,
                "name":valueObject,
                "children":[],
                "data":{
                    "band":uriSubject,
                    "relation":predicat
                }
           };
           this.rootNode.children.push(node);
           return this;
    }
    this.initChildNode = function(uriObject,valueObject,uriSubject,predicat){
           var node = {
                "id":uriObject,
                "name":valueObject,
                "children":[],
                "data":{
                    "band":uriSubject,
                    "relation":predicat
                }
           };
           return node;
    }
}