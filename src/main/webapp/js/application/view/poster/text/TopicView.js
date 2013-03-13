/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, , Graph visualization
 **/
var TopicView = {	
	initView:function(currentPage){               
            $('#topicDetail div').each(function(){
                    $(this).empty();
            });
            $('#'+currentPage).hide();                 
            $('#topicDetail').addClass("in slide"); $('#topicDetail').show();							               	
            
            return this;
        },       
	callbackTopic:function(dataXML){           
            $(dataXML).find("sparql > results > result > binding").each(function(){                               
                            var key  = $(this).attr("name");				
                            var value = $(this).find(":first-child").text();

                            if(key == 'Label'){                         
                                $('#topic'+key).append(value);
                            }else if(key == 'Publication'){                                  
                                var title = $(this).next().find(":first-child").text();
                                var publication = Dash.getValue(value, 'http://data.semanticweb.org/');                              
                                $('#topic'+key).append('<div><a href="#'+ publication +'">' + title +'</a></div>');
                            }                                
            });	
       }

}