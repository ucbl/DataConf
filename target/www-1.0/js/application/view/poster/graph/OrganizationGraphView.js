/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, Semantic Web Dog Food 
 **/
function OrganizationGraphView () {
        /* Variables */
        var self              = this;
        this.graphJSON        = null;
        this.idCurrentNode    = '';
        this.labelCurrentNode = '';
        this.initView = function(idCurrentNode,labelCurrentNode){            
            this.graphJSON        = new GraphJSON();
            this.idCurrentNode    = idCurrentNode;
            this.labelCurrentNode = labelCurrentNode;
            /* Set new root node */
            this.graphJSON.setRootNode(this.idCurrentNode,this.labelCurrentNode);    //PersonGraphView.idCurrentNode : uriAuthor SWDF
            $('#viewAsText').append('<span><a href="#'+ (idCurrentNode.replace('http://data.semanticweb.org/',"").replace(/\/+/g, '~')) +'" id="viewAs">View as Text</a></span>');
            $('#currentNode').append('<h3>Organization  : '+labelCurrentNode+'</h3>');
            return this;
        }
        this.render = function(dataXML){
            $(dataXML).find("sparql > results > result > binding").each(function(){                    
                        var key  = $(this).attr("name");				
                        var value = $(this).find(":first-child").text();								
                        var uriAuthor =  $(this).next().find(":first-child").text();				
                        if (key == 'Member') self.graphJSON.setChildNode(uriAuthor, value, self.idCurrentNode, key);
            });                                   
                
       }
       this.getGraph = function(){
         return self.graphJSON;
       }
}