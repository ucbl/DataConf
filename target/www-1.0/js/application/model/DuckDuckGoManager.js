/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster
 *   Version: 1
 *   Tags: DuckDuckGo, Sparql ,DBLP Computer Science Bibliography
 **/
function DuckDuckGoManager() {
    
    this.getResult = function(searchValue,callbackView) {
    			uri = ConfigurationManager.getInstance().getDdgoUri();
                $.ajax({
                        url: uri+'?q='+searchValue+'&format=json&pretty=1&no_redirect=1',
                        dataType:'jsonp',
                        cache:false,
                        success:callbackView
                 });
    }
};





