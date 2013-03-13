/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster
 *   Version: 1
 *   Tags: Sparql, CORS, JSONP , Graph visualization, Meta-data
 **/

/* the controller listens for actions and reacts */
$(document).ready(function() {    

	  		
			ConfigurationManager.getInstance().InitConference("${baseUri}","${confId}");
            /* Model */
            var swdfManager    = new SWDFManager();
          
            /* View */
            var layout     = new CompositeView("Home Pages","index");
            var conferenceView   = new ConferenceView();
            
            /* Add pages to layout */
            $('section').each(function(){                   
                   var pageID = '#'+$(this).attr("id");
                   layout.add(pageID,conferenceView);
            });

            /* Presenter */
            var conferencePresenter     = new ConferencePresenter();
             /* Set view and model to presenter */
            conferencePresenter.setModel(swdfManager);
            conferencePresenter.setLayout(layout);
            conferencePresenter.setView(conferenceView);
            /* Init view */
            layout.setLoader()
                    .resizeMenuBars()
                    .resizeFooter()
                    .setValidationForm();
            layout.addHashChangeListener(conferencePresenter);
            conferenceView.addSearchEventListener(conferencePresenter);       
});
