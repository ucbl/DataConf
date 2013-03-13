/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster
 *   Version: 1
 *   Tags: DuckDuckGo, Sparql , Semantic Web Dog Food ,DBLP Computer Science Bibliography
 **/
function PersonGraphView () {
        /* Variables */
        var self                 = this;
        this.graphJSON           = null;
	this.idCurrentNode       = '';
        this.labelCurrentNode    = '';
        this.hashPublicationSWDF = {};
        /* Init View */
        this.initView =  function(idCurrentNode,labelCurrentNode){
            this.graphJSON        = new GraphJSON();
            this.idCurrentNode    = idCurrentNode;
            this.labelCurrentNode = labelCurrentNode;
            /* Set new root node */
            this.graphJSON.setRootNode(this.idCurrentNode,this.labelCurrentNode);    //PersonGraphView.idCurrentNode : uriAuthor SWDF      
            var nameToDash = labelCurrentNode.replace(/\s+/g, '~');                              
            var paramater  = idCurrentNode.replace('http://data.semanticweb.org/','');					
            var paramaterToDash = paramater.replace(/\/+/g, '~');
            $('#viewAsText').append('<span><a href="#'+ paramaterToDash +'~~'+ nameToDash +'" id="viewAs">View as Text</a></span>');
            $('#currentNode').append('<h3>Author : '+labelCurrentNode+'</h3>');
            return this;
        }
        
        this.renderSWDF =  function(dataXML){
                                        
            $(dataXML).find("sparql > results > result").each(function(){
                    var firstNode = $(this).find(":first-child");
                    var key   = firstNode.attr("name");				
                    var value = firstNode.find(":first-child").text();  //URI Resource
                    //uriPublication > Publication > KeywordLabel
                    if(key == 'uriPublication'){                                   
                            var labelResource  = firstNode.next().find(":first-child").text(); // URI Resource                                                                                                
                            var keywordLabel  = firstNode.next().next().find(":first-child").text();                             
                            var uriKeyword    = 'keyword_'+ keywordLabel.replace(/\s+/g,"_");

                            // Publication SWDF of author  
                            self.hashPublicationSWDF[value] = labelResource;                                 
                            // add this publication into graph : author has a publication
                            self.graphJSON.setChildNode(value,labelResource , self.idCurrentNode , key);                                                                                    
                            // keyword of this publication
                            var node = self.graphJSON.initChildNode(uriKeyword,keywordLabel,value,"hasKeyword");                                 
                            $.each(self.graphJSON.rootNode.children,function(i,poster){
                                if(poster.id == value) poster.children.push(node);                                     
                            });                                 
                    }else if(key == 'Organization'){
                            //Organization SWDF
                            var uriResource   = firstNode.next().find(":first-child").text();                                                                                                          
                            //Add child node Graph JSON : author has a organization                                
                            self.graphJSON.setChildNode(uriResource, value, self.idCurrentNode, key);                              
                    }			
            });
            return this;
        }
        this.renderDBLP = function(dataJSON){
                // OtherPublication   > UriOtherPublication
                $.each(dataJSON.results.bindings,function(i,item){
                    $.each(item, function(key, valueArr) {
                        if(key == 'OtherPublication'){                                                                                         
                            self.graphJSON.setChildNode(item.UriOtherPublication.value, valueArr.value, self.idCurrentNode, "hasPublication");                                
                        }
                    });
                });             
            return this;
        }

        this.getGraph = function(){
                return self.graphJSON;
        }
 }   