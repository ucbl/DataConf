/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, Meta-Search
 **/
/* Home view */
function  HomeView (){
    /* variables */
    this.currentSearch = '';
    this.currentTrackSearch   = '';
    this.controller = '';
    var self           = this;
 
    this.addSearchEventListener = function(presenter){
             console.log("SET Search by Event LISTENER");            
             $("#inputSearchByAuthor").keyup(function () {            
                    var authorName = $(this).val();  self.currentSearch = $(this).attr('id');
                    if( authorName != '')            presenter.handleSearchByAuthor(authorName,self.currentTrackSearch);
             }).keyup();

             $("#inputSearchByKeyword").keyup(function () {
                    var keyword = $(this).val();     self.currentSearch = $(this).attr('id');
                    if( keyword != '')               presenter.handleSearchByKeyword(keyword,self.currentTrackSearch);

            }).keyup();
            $("#inputSearchByTitle").keyup(function () {
                    var title = $(this).val();       self.currentSearch = $(this).attr('id');
                    if( ((title.length % 2) != 1) && title != '') presenter.handleSearchByTitle(title,self.currentTrackSearch);

            }).keyup();
            
            $("#inputSearchByNumber").keyup(function () {
                    var number = $(this).val();	     self.currentSearch = $(this).attr('id');	          
                    var controller = $('#formSearchNumber').attr('action');
                    $('#formSearchNumber').get(0).setAttribute('action',  self.controller+'.html#'+self.controller+number);
            }).keyup();
            
            $(".event").click(function() {           
            	
                   self.currentTrackSearch = $(this).attr('id');
                   console.log("current search event : " +self.currentTrackSearch);
                   self.controller = $(this).attr('data-controller');
                   console.log('controller :'+self.controller);                   
                   self.setController();
                   self.setSearchEvent();
                   self.setTitle();
            });
            return this;
    }
    this.setController = function(){
            document.getElementById('formSearchNumber').setAttribute('action', self.controller); //solution for Jquery setAttribute problem -;)
            document.getElementById('formSearchAuthor').setAttribute('action',self.controller+'.html#search~author');
            document.getElementById('formSearchKeyword').setAttribute('action', self.controller+'.html#search~keyword');                   
            document.getElementById('formSearchTitle').setAttribute('action', self.controller+'.html#search~title');
            return this;
    }
    this.setSearchEvent = function(){
            $('#formSearchNumber input:nth-child(2)').get(0).setAttribute('value' , self.currentTrackSearch);                                     
            $('#formSearchAuthor input:nth-child(2)').get(0).setAttribute('value' , self.currentTrackSearch);
            $('#formSearchKeyword input:nth-child(2)').get(0).setAttribute('value' , self.currentTrackSearch);
            $('#formSearchTitle input:nth-child(2)').get(0).setAttribute('value' , self.currentTrackSearch);
            return this;
    }
    
    this.setTitle = function(){
    	$(".searchTrack").empty();
    	$(".searchTrack").append(self.controller+" track");
    }

    /* render SWDf metadata*/
    this.render = function(dataXML){
        
            var valueArr = [];
            $(dataXML).find("sparql > results > result > binding").each(function()
            {
                        var key  = $(this).attr("name");				
                        var value = $(this).find(":first-child").text();

                        valueArr.push(value);                
            });
            $('#'+this.currentSearch).autocomplete({
                    autoFocus: true,
                    source: valueArr,
                    delay: 0,
                    minLength: 0,
                    maxLength: 15
            });           
    }
    
}
