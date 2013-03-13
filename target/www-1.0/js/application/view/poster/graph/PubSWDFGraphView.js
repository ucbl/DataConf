/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, , Graph visualization
 **/

function  PubSWDFGraphView () {
        /* Variables */
        var self              = this;
        this.graphJSON        = null;
	this.idCurrentNode    = '';
        this.labelCurrentNode = '';
        /* Init View */
        this.initView =  function(idCurrentNode,labelCurrentNode){
            this.graphJSON        = new GraphJSON();
            this.idCurrentNode    = idCurrentNode;
            this.labelCurrentNode = labelCurrentNode;
            /* Set new root node */
            this.graphJSON.setRootNode(this.idCurrentNode,this.labelCurrentNode);    //idCurrentNode : uri poster SWDF
            $('#viewAsText').append('<span><a href="#'+ (idCurrentNode.replace('http://data.semanticweb.org/',"").replace(/\/+/g, '-')) +'" id="viewAs">View as Text</a></span>');
            $('#currentNode').append('<h3> WWW\'2012 Poster  : '+ labelCurrentNode +'</h3>');
            return this;
        }
	this.render = function(dataXML){
                                                                    
		 $(dataXML).find("sparql > results > result > binding").each(function(){
                     
                            var key  = $(this).attr("name");				
                            var value = $(this).find(":first-child").text();

                            if(key == "Author"){                                        
                                    var nameToDash = value.replace(/\s+/g, '~');
                                    var uriAuthor =  $(this).next().find(":first-child").text();					
                                    var paramater = uriAuthor.replace('http://data.semanticweb.org/','');					
                                    var paramaterToDash = paramater.replace(/\/+/g, '~');									
                                    // add child node                    
                                    self.graphJSON.setChildNode(uriAuthor, value, self.idCurrentNode, key);                                                                                                                      
                            }
                            else if (key == 'Keyword'){
                                    var theme = '';
                                    if(value == 'http://dbpedia.org/resource/World_Wide_Web'){
                                        theme = 'topic~world-wide-web';
                                    }                                        
                                    else{
                                        theme = Dash.getValue(value,'http://data.semanticweb.org/');
                                    }
                                    var KeywordLabel =  $(this).next().find(":first-child").text();                                       
                                    // Add child node                                 
                                    self.graphJSON.setChildNode(value, KeywordLabel, self.idCurrentNode, key);                                                                              
                            }                                                               
		});               
                return this;
        }

        this.getGraph = function(){
                return self.graphJSON;
        }

}