/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, , Graph visualization
 **/
var TopicGraphView = {	
	idCurrentNode:'',
        labelCurrentNode:'',
        graphJSON : new GraphJSON(),
        init: function(idCurrentNode,labelCurrentNode){
            TopicGraphView.idCurrentNode = idCurrentNode;
            TopicGraphView.labelCurrentNode = labelCurrentNode;
            TopicGraphView.graphJSON.setRootNode(TopicGraphView.idCurrentNode,TopicGraphView.labelCurrentNode);    //PersonGraphView.idCurrentNode : uriAuthor SWDF                                                 
        },
        render : function(dataXML){
            //GraphView.idCurrentNode : uriAuthor SWDF     
            $(dataXML).find("sparql > results > result > binding").each(function(){                               
                            var key  = $(this).attr("name");				
                            var value = $(this).find(":first-child").text(); // uri
                            if(key == 'Publication'){                                  
                                var title = $(this).next().find(":first-child").text(); // label paper                                                                              
                                TopicGraphView.graphJSON.setChildNode(value, title, TopicGraphView.idCurrentNode, key);                                                        
                            }                                
            });

        }
    
    


}