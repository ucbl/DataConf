/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, , Graph visualization
 **/

/*  Singleton Object to store keywords */

var KeywordStore = {
    key:'recommendationStorage',
    arrKeyword:{},
    reasoner:null,  
    arrPosterR:[{}],
    numPosterRCall:0,        
    numPaperRCall:0,  
    init:function(){
        $.jStorage.set(KeywordStore.key,'');
         var strArrKeyword = $.jStorage.get(KeywordStore.key);
         console.log(strArrKeyword);
    },
    set:function(keywordClass,keywordLabel){
        if(!($.jStorage.get(KeywordStore.key))){
            var arr = {};
        }else{
            var strArrKeyword = $.jStorage.get(KeywordStore.key);
            var arr    = $.parseJSON(strArrKeyword);
        }
        arr[keywordClass] = keywordLabel ;
        $.jStorage.set(KeywordStore.key,JSON.stringify(arr));
    },
    loadTree:function(childrenArray,callback){           
            $.each(childrenArray,function(i,item){
                    $.each(KeywordStore.arrKeyword,function(keywordClass,keywordLabel){                                                                             
                           // equivalent class                                   
                           if(KeywordStore.reasoner.isSubClassOf(item.names[0],keywordClass) && KeywordStore.reasoner.isSubClassOf(keywordClass,item.names[0]) && (keywordClass != item.names[0])/*doublon*/ ){
                                //  console.log(keywordClass+' is equivalent ClassOf '+item.names[0]);                            
                                  callback(item.names[0]);
                            }
                           // keywordClass(keywordPoster) subClassOf ?Class                   
                           else if(KeywordStore.reasoner.isSubClassOf(keywordClass,item.names[0]) && (keywordClass != item.names[0])/*doublon*/){
                                // console.log(keywordClass+' is subClassOf '+item.names[0]);                                  
                                   callback(item.names[0]);
                            }
                            // keywordClass(keywordPoster) upperClassOf  ?Class    
                           if(KeywordStore.reasoner.isSubClassOf(item.names[0],keywordClass) && (keywordClass != item.names[0])/*doublon*/){
                                // console.log(keywordClass+' is upper ClassOf '+item.names[0]);                                 
                                   callback(item.names[0]);
                            }
                    });                  
                    KeywordStore.loadTree(item.children,callback);
            });           
       },
       getMoreSpecificKeywords:function(callback){   
            
            // Array Keyword Class
            var strArrKeyword = $.jStorage.get(KeywordStore.key);
            console.log("Recommendation key :"+ strArrKeyword);
            KeywordStore.arrKeyword = $.parseJSON(strArrKeyword);
            
            var ontology = jsw.owl.xml.parseUrl('http://poster.www2012.org/onto/KeywordClasses.owl');
            KeywordStore.reasoner = new jsw.owl.BrandT(ontology);                 
            var classeArray  = KeywordStore.reasoner.classHierarchy;
           // console.log(JSON.stringify(classeArray));
            var ThingClassJSON   = classeArray[0];
            // ThingClasseJSON.name[0]  // http://www.w3.org/2002/07/owl#Thing
            var KeywordClassJSON = ThingClassJSON.children[0];
            // KeywordClassJSON.names[0] //#Keyword
            var arrayChildrenKeyword = KeywordClassJSON.children;
         
            /* Recommendation for poster 2012 */
            KeywordStore.loadTree(arrayChildrenKeyword,callback);              
       },
       
       getKeywords:function(callback){
            /* Recommendation for paper 2012 */ 
            var strArrKeyword = $.jStorage.get(KeywordStore.key);
            var arrKey = $.parseJSON(strArrKeyword);
            $.each(arrKey,function(keywordClass,keywordLabel){ 
                   callback(keywordLabel);                    
            });
       }
    
}

