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
function HomePresenter(){
    /* Layout */
    this.posterModel   = null;
    this.container     = null;
    this.layout        = null;
    this.currentSearch = '';
    var self = this;

    /* Setters */
    this.setModel    = function(model){
        this.model   = model;
    }

    this.setLayout   = function(layout){
        this.layout  = layout;
    }
    this.setView     = function(view){
        this.view    = view;
    }

    /* User action : handle hashChange */
    this.updateStates   = function(currentPage){
            /* Set current Page */
            if(currentPage == ''){                
                    currentPage = '#home';
                    this.layout.setCurrentPage(currentPage).show();  /* Set current Page and display current view */                     
            }else if(currentPage != ''){
            	 console.log("currentPage :"+currentPage);
                    this.layout.setCurrentPage(currentPage).show();  /* Set current Page and display current view */                               
            }else{
                    this.forward('/');
            }
    }
    
     /* User action : Handle event of input search by Event  */
    this.handleSearchByAuthor = function(searchValue,trackId){
    
            this.model.setTrackUri(trackId).getAuthorSuggestion(searchValue,this.propertyChange);
    }

    this.handleSearchByKeyword = function(searchValue,trackId){
             //self.currentSearch = currentSearch;
             this.model.setTrackUri(trackId).getKeywordSuggestion(searchValue,this.propertyChange);
    }

    this.handleSearchByTitle = function(searchValue,trackId){
             //self.currentSearch = currentSearch;
    	 this.model.setTrackUri(trackId).getTitleSuggestion(searchValue,this.propertyChange);
             //this.model.setTrackUri(trackId).getTitleSuggestion(searchValue,this.propertyChange);
    }


    /* Property change */
    this.propertyChange  = function(dataXML){
             self.layout.getCurrentPage().render(dataXML);
    }
      
    this.forward = function(hashPath){        
             window.location.href = hashPath;
    }
    
    this.currentPage = function(){
             return  window.location.hash.split(1);
    }            
}