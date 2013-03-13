/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster
 *   Version: 1
 *   Tags: Sparql, CORS, JSONP , Graph visualization, Meta-data
 **/

/* the controller listens for actions and reacts */
$(document).ready(function() {    
	
	  		/* Local Storage of configurations */
    		ConfigurationManager.getInstance().InitConference("${applicationScope.conferenceDatasource.serviceUri}","${applicationScope.baseUri}","${applicationScope.confId}",'${applicationScope.dblpUri}','${applicationScope.ddgoUri}');
    
            /* Model */
            var swdfManager    = new SWDFManager();
          
            /* View */
            var layout     = new CompositeView("Home Pages","index");
            var homeView   = new HomeView();
            
            /* Add pages to layout */
            $('section').each(function(){                   
                   var pageID = '#'+$(this).attr("id");
                   layout.add(pageID,homeView);
            });

            /* Presenter */
            var homePresenter     = new HomePresenter();
             /* Set view and model to presenter */
            homePresenter.setModel(swdfManager);
            homePresenter.setLayout(layout);
            homePresenter.setView(homeView);
            /* Init view */
            layout.setLoader()
                    .resizeMenuBars()
                    .resizeFooter()
                    .setValidationForm();
            layout.addHashChangeListener(homePresenter);
            homeView.addSearchEventListener(homePresenter);       
});
