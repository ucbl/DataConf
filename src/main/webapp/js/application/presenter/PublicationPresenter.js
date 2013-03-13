/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, CORS, JSONP , Graph visualization,Meta-data
 **/

/**
 *  MVP :http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailmvp
 *  MVVM : http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailmvvm
 **/


/*  Presenter is also a mediator */
function PublicationPresenter(){
    
            /* Variables */
            this.swdfManager   = null;
            this.dblpManager    = null;
            this.ecManager      = null;
            this.locationId     = '';
            this.entityIdSwdf		= '';
            this.entityIdDblp		= '';
            this.uriRessource   ='';
            this.labelRessource ='';
            var self = this;

            /* Setter */
            this.setSWDFManager    = function(swdfManager){
                this.swdfManager  = swdfManager;
            }
            this.setDBLPManager    = function(dblpManager){
                this.dblpManager   = dblpManager;
            }
            this.setDDGoManager    = function(ddGoManager){
                this.ddGoManager   = ddGoManager;
            }
            this.setECManager    = function(ecManager){
                this.ecManager   = ecManager;
            }
            this.setLayout   = function(layout){
                this.layout  = layout;
            }            
            
            /* User action : handle hashChange */
            this.updateStates   = function(hashPath){                
            	console.log("HASH PATH :"+hashPath); 
                var currentPage = (hashPath.split("~"))[0];  
                var paramaters  = hashPath.slice(1);            /* delete hash*/               
                var hashArr     = paramaters.split("~~");
                
                 /* Set current Page and display current view */ 
                if(/#[a-z]*[0-9]+/.test(currentPage)) this.layout.setCurrentPage("#conference").show();
                else                                 this.layout.setCurrentPage(currentPage).show();
                console.log("USER ACTION :"+currentPage);                
                switch(true){   
                        /* Search Poster */
                        case /#search/.test(currentPage)    :
                                /* Search type */
                                var typeSearch = (hashPath.split("~"))[1];   
                       
                                if     (typeSearch == 'author')     this.swdfManager.getPosterSearchByAuthor($('#valueSearch').text() ,this.propertySWDFChange);
                                else if(typeSearch == 'keyword')    this.swdfManager.getPosterSearchByKeyword($('#valueSearch').text(),this.propertySWDFChange);
                                else if(typeSearch == 'title')      this.swdfManager.getPosterSearchByTitle($('#valueSearch').text()  ,this.propertySWDFChange);
                                break;
                        case /#[a-z]*[0-9]+/.test(currentPage)  :
                                console.log("paramters : keyword init");
                                KeywordStore.init();
                                /* Exploit metadata SWDF */
                                this.paramater    =  paramaters.replace(/[\~\-]/g,'/');
                                this.swdfManager.getPaper(this.paramater,this.propertyChange);
                                break;
                        /* Poster Publication */         
                        case /#conference/.test(currentPage)  :
                                console.log("conrence : keyword init");
                                KeywordStore.init();  
                                /* Exploit metadata SWDF */ 
                              
                                this.locationId = "/"+hashPath.split("~")[2] +"/";
                                this.entityIdSwdf = hashPath.split("~")[3];
                                
                                                  
                                this.ecManager.getEvent(this.locationId, this.entityIdSwdf,this.propertyECChange);
                                this.swdfManager.getPaper(this.locationId,this.entityIdSwdf,this.propertySWDFChange);
                                break;
                        /* Author */        
                        case /#person/.test(currentPage)      :
                                console.log("person : keyword init");
                                KeywordStore.init();  
                                this.locationId =hashPath.slice(1).split("~")[0] +"/";
    
                                this.entityIdSwdf = hashPath.split("~~")[0].split("~")[1];
                                
                                entityId = hashPath.split("~~")[1];   
                                this.entityIdDblp = entityId.replace("~"," ");
                                
                                /* Exploit information about author  with SWDF  */
                                this.swdfManager.getAuthor(this.locationId,this.entityIdSwdf,this.propertyAuthorSWDFChange);
                                /* Enriche information about author  with DBLP  */
                                this.dblpManager.getAuthor(this.entityIdDblp,this.propertyAuthorDBLPChange);
                                break;
                        /* Conference Publication DBLP */
                        case /#conf/.test(currentPage)        :
                                /* Exploit metadata SWDF */ 
                                this.entityDblp    =  paramaters.replace(/[\~\-]/g,'/');                                
                                this.dblpManager.getConfPublication( this.entityDblp  ,this.propertyDBLPChange);
                                break;
                        /* Journal Publication DBLP */
                        case /#journals/.test(currentPage)     :
                                /* Exploit metadata DBLP */                                
                                this.entityDblp    =  paramaters.replace(/[\~\-]/g,'/');                           
                                this.dblpManager.getJournalPublication( this.entityDblp ,this.propertyDBLPChange);
                                break;
                        /* Organization of an author */
                        case /#organization/.test(currentPage) :
                                console.log("Organization");
                                /* Exploit metadata SWDF */   
                        		this.locationId =hashPath.slice(1).split("~")[0] +"/";
                        
                        		this.entityIdSwdf = hashPath.slice(1).split("~")[1];
                        		
                                this.paramater    =  paramaters.replace(/[\~]/g,'/');                          
                                this.swdfManager.getOrganization(this.paramater,this.propertySWDFChange);
                                break;
                         /* Publication's keywords */
                        case /#keyword/.test(currentPage)      :                              
                                KeywordStore.init(); 
                        		this.locationId =hashPath.slice(1).split("~")[0] +"/";
                        
                        		this.entityIdSwdf = hashPath.slice(1).split("~")[1];
                                /* Exploit metadata SWDF */ 
                                paramater    =  paramaters.replace('keyword~','').replace(/\-/g,' ');                    
                                this.swdfManager.getKeyword(paramater,this.propertySWDFChange);
                                break;
                        case /#recommendation/.test(currentPage)      :
                                 /* Recommendation : poster 2012 */
                                KeywordStore.getMoreSpecificKeywords(function(otherKeywordClass){
                                    self.swdfManager.getPublicationKeyword(otherKeywordClass,self.propertyRecommendationPosterChange);
                                });                                
                                /* Recommendation  : paper 2012 */ 
                                KeywordStore.getKeywords(function(keywordLabel){
                                    self.swdfManager.getKeyword(keywordLabel,self.propertyRecommendationPaperChange);
                                });
                                break;   
                                
                        case /#graph/.test(currentPage)      :
                        	this.entityIdSwdf =  paramaters.replace(/\~/g,'/');
                                var graph = GraphStore.get(this.entityIdSwdf);
                                self.layout.getCurrentPage().render(graph,self);
                                break;            
                }                                       
           }
           /* User Action : Duck Duck Go search */
           this.search = function(parameter){
                   this.ddGoManager.getResult(parameter,function(dataJSON){
                        /* Property  Change */       
                        self.layout.getCurrentPage().renderDataDDGo(dataJSON,self);
                   });
           }
           this.searchSite = function(paramter){
                   this.ddGoManager.getResult(paramter,function(dataJSON){
                        /* Property  Change */                       
                        self.layout.getCurrentPage().renderSite(dataJSON);
                   });
           }
           /* User Action : Store graph and Keyword with local storage API */
           this.storeKeyword =  function(keywordClass, value){
                   KeywordStore.set(keywordClass, value);
           }
           this.storeGraph =  function(key, value){
                   GraphStore.set(key, value);
           }
           /* hashChange - Property  Change : SWDF and DBLP changed */
           this.propertySWDFChange = function(data){      
        	   
                    self.layout.getCurrentPage().initView(self.locationId,self.entityIdSwdf).render(data,self);
           }
           
           /* hashChange - Property  Change : SWDF and DBLP changed */
           this.propertyDBLPChange = function(data){      
                    self.layout.getCurrentPage().initView(self.entityDblp ).render(data,self);
           }
           
           this.propertyECChange = function(dataJSON){    
               		self.layout.getCurrentPage().renderDataEC(dataJSON,self);
           }
           this.propertyAuthorSWDFChange  = function(dataXML){                    
                    self.layout.getCurrentPage().initView(self.locationId,self.entityIdSwdf).renderDataSWDF(dataXML,self);
           }
           this.propertyAuthorDBLPChange  = function(dataJSON){                   
                    self.layout.getCurrentPage().renderDataDBLP(dataJSON,self);
           }                     
           this.propertyRecommendationPosterChange = function(dataXML){                    
                    self.layout.getCurrentPage().renderPoster(dataXML);
           }           
           this.propertyRecommendationPaperChange  = function(dataXML){                    
                    self.layout.getCurrentPage().renderPaper(dataXML);
           }
           
           
           /* User action : handle nodeChange */
            this.updateNodesStates = function (uriRessource,labelRessource){
                  self.uriRessource = uriRessource;
                  self.labelRessource = labelRessource;
                  /* get current page */
                  var graphView = self.layout.getCurrentPage();
                  switch(true){   
                        /* Search Poster */
                        case /data.semanticweb.org\/person/.test(uriRessource) :
                                graphView.setCurrentPage("#person");
                                /* Exploit information about author  with SWDF  */
                                 self.swdfManager.getAuthor(uriRessource, function(dataXML){
                                       /* Property  Change */
                                       graphView.getCurrentPage().initView(uriRessource,labelRessource).renderSWDF(dataXML,self);                                       
                                 });
                                 /* Enriche information about author  with DBLP  */
                                 self.dblpManager.getAuthorGraphView(labelRessource,function(dataJSON){
                                       /* Property  Change */
                                       graphView.getCurrentPage().renderDBLP(dataJSON); // graphView.loadNewGraph(); // Normalement on va recharger le graphe lors que la requête sur DBLP est fini,mais DBLP est souvent down, donc on va recharger le graph même si la requête ne soit pas encore fini
                                 });
                                 /* On recharge le graphe même si les metadata ne sont pas encore extraits */
                                 graphView.loadNewGraph();

                                break;   
                        /* Poster Publication */         
                        case /data.semanticweb.org\/conference/.test(uriRessource)  :
                                graphView.setCurrentPage("#conference");
                                this.swdfManager.getPaper(uriRessource,this.propertyNodeChange);
                                break;
                        case /dblp.l3s.de\/d2r\/resource\/publications\/conf/.test(uriRessource)      :
                                graphView.setCurrentPage("#conf");
                                self.dblpManager.getConfPublication(uriRessource,this.propertyNodeChange);
                                break;
                        case /dblp.l3s.de\/d2r\/resource\/publications\/journals/.test(uriRessource)  :
                                graphView.setCurrentPage("#journals");
                                self.dblpManager.getJournalPublication(uriRessource,this.propertyNodeChange);
                                break;

                       case /data.semanticweb.org\/organization/.test(uriRessource) :
                                graphView.setCurrentPage("#organization");
                                self.swdfManager.getOrganization(uriRessource,this.propertyNodeChange);
                                break;                                
                       case /#keyword/.test(uriRessource)  :
                                graphView.setCurrentPage("#journals");
                                this.swdfManager.getKeywordGraphView(uriRessource,labelRessource,this.propertyNodeChange);
                                break;
                        case /dx.doi.org/.test(uriRessource) :
                                window.open(uriRessource);
                                break;
                        case /doi.acm.org/.test(uriRessource):
                                window.open(uriRessource);
                                break;
                        default:
                               $('#currentNode').append('<h3>Information not found </h3>');         
                  }                         
           }
           /* nodeChange - Property  Change : SWDF and DBLP changed */
           this.propertyNodeChange = function(data){
               var graphView = self.layout.getCurrentPage();
               graphView.getCurrentPage().initView(self.uriRessource,self.labelRessource).render(data);
               /* reload new graph extracted */
               graphView.loadNewGraph();
           }         
}
