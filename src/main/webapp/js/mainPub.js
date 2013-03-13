/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster
 *   Version: 1
 *   Tags: Sparql, CORS, JSONP , Graph visualization, Meta-data
 **/

$(document).ready(function() {          
            /* Model */
            var swdfManager     = new SWDFManager().setTrackUri('${typeSearch}');
            var dblpManager     = new DBLPManager();
            var ddGoManager     = new DuckDuckGoManager();
            var ecMananger      = new EventCalendarManager();

            /* View */
            var layout          = new CompositeView("Poster Pages","poster");
            /* Presenter */
            var posterPresenter = new PublicationPresenter();

            /* Set view and model to presenter */
            posterPresenter.setSWDFManager(swdfManager);
            posterPresenter.setDBLPManager(dblpManager);
            posterPresenter.setDDGoManager(ddGoManager);
            posterPresenter.setECManager(ecMananger);
            posterPresenter.setLayout(layout);

            /**
             *  Add components(pages) to layout
             *  Paramaters : ID of <section> => it's also value of hash which is before ~ , view correspond
             **/
            layout.add("#search"        ,new SearchView('#searchPaperResult'));
            layout.add("#conference"    ,new PubSWDFView('#paper'));
            layout.add("#person"        ,new PersonView('#author'));
            layout.add("#conf"          ,new PubDBLPView('#confPublication'));
            layout.add("#journals"      ,new PubDBLPView('#journalPublication'));
            layout.add("#organization"  ,new OrganizationView('#organization'));
            layout.add("#keyword"       ,new KeywordView());
            layout.add("#recommendation",new RecommendationView('#recommend'));
            /* another layout : graph layout */
            var graphView = new GraphView();
            layout.add("#graph"         ,graphView);
            graphView.add("#conference" ,new PubSWDFGraphView());
            graphView.add("#person"     ,new PersonGraphView());
            graphView.add("#conf"       ,new PubDBLPGraphView());
            graphView.add("#journals"   ,new PubDBLPGraphView());
            graphView.add("#organization",new OrganizationGraphView());

            /* Init layout */
            layout.setLoader()
                  .resizeMenuBars()
                  .resizeFooter();
            layout.addHashChangeListener(posterPresenter);  
});
