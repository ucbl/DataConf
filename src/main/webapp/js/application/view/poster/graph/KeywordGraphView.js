/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql,
 **/
var  KeywordGraphView = {
       
    idCurrentNode:'',
    labelCurrentNode:'',
    graphJSON : new GraphJSON(),
    init : function(idCurrentNode,labelCurrentNode){
        KeywordGraphView.idCurrentNode = idCurrentNode;
        KeywordGraphView.labelCurrentNode = labelCurrentNode;
        KeywordGraphView.graphJSON.setRootNode(KeywordGraphView.idCurrentNode,KeywordGraphView.labelCurrentNode);    //PersonGraphView.idCurrentNode : uriAuthor SWDF                                                 
        $('#currentNode').append('<h3>Keyword  : '+labelCurrentNode+'</h3>');
    },
    render : function(dataXML){
       
          // upperUriKeyword  > subUriKeyword > uriPoster
          $(dataXML).find("sparql > results > result > binding").each(function(){                               
                        var key  = $(this).attr("name");				
                        var value = $(this).find(":first-child").text(); // uri                       
                        if(key == 'upperUriKeyword'){                             
                            var label = $(this).next().find(":first-child").text(); // label paper                                                                              
                            KeywordGraphView.graphJSON.setChildNode(value, label, KeywordGraphView.idCurrentNode, key);                                                        
                        }
                        else if (key == 'subUriKeyword'){                            
                            var label = $(this).next().find(":first-child").text(); // label paper                                                                              
                            KeywordGraphView.graphJSON.setChildNode(value, label, KeywordGraphView.idCurrentNode, key);                                                        
                        }
                        else if (key == 'uriPoster'){                            
                            var label = $(this).next().find(":first-child").text(); // label paper                                                                              
                            KeywordGraphView.graphJSON.setChildNode(value, label, KeywordGraphView.idCurrentNode, key);                                                        
                        }
                        else if (key == 'equiUriKeyword'){                            
                            var label = $(this).next().find(":first-child").text(); // label paper                                                                              
                            KeywordGraphView.graphJSON.setChildNode(value, label, KeywordGraphView.idCurrentNode, key);                                                        
                        }
          });  
    }
}