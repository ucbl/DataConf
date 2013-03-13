/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, Owlreasoner , Semantic Web Dog Food 
 **/

 function RecommendationView(){
    /* Variables */  
    this.arrKeyword      = {};
    this.reasoner        = null;  
    this.arrPosterR      = [{}];
    this.numPosterRCall  = 0;        
    this.numPaperRCall   = 0;
    var self             = this;
    
    this.initView     = function(){            
        return this;
    }      
    this.renderPoster = function(dataXML){              
        $(dataXML).find("sparql > results > result > binding").each(function(){                               
            var key  = $(this).attr("name");				
            var value = $(this).find(":first-child").text(); // uri   
            if(key == 'posterWWW2012'){   
                 $('#posternotFound').remove();        
                var title = $(this).next().find(":first-child").text(); // title paper 
                var paramater = value.replace("http://poster.www2012.org/ontologies/2012/3/KeywordsOntologyWithoutInstance.owl#","");                          
                if($('#'+paramater).val() != ''){
                    $('#recommend'+key).append('<li><a href="#'+ paramater + '" id="' + paramater + '"><span>'+title+'</span></a></li> ');                                                                                                                 
                }                                                                                                                                                            
            }                            
        });                                  
    }
    this.renderPaper = function(dataXML){                      
        $(dataXML).find("sparql > results > result > binding").each(function(){                               
            var key  = $(this).attr("name");				
            var value = $(this).find(":first-child").text();
            if(key == 'Publication'){                                                              
                var title =  $(this).next().find(":first-child").text();					                                                                              
                if(!(/conference\/www\/2012\/poster/.test(value))){
                    $('#papernotFound').remove();
                    var param = value.replace('http://data.semanticweb.org/','').replace(/\//g,"-");
                    if($('#'+param).val() != '')
                        $('#recommendpaperWWW2012').append('<li><a href="#'+ param +'" id="' + param + '">' + title +'</a></li>');
                }                            
            }                                
        });                    
    }              
}