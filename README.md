DataConf
========

DataConf is a mobile Web mashup application that mixes Linked Data and Service-Oriented architectures to provide access to different kinds of data. It relies on a widely used JavaScript framework and on a component-based approach to manage different datasources. It only requires static server-side contents and performs all processing on the client side.

DataConf aggregates conference metadata. It allows browsing conference publications, publication authors, authors’ organizations, but also authors’ other publications, publications related to the same keywords, conference schedule or resources related to the conference publications. For this, it queries several datasources such as the SPARQL endpoint that serves the conference dataset and other endpoints and information services that enrich these data.

DataConf is deployable for any conference with available metadata on the Web using a configuration file. During the challenge, we will demonstrate it in its ecosystem, namely the SWDF and DBLP endpoints and several Web services.

The DataConf homepage is located at: http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf

===========
Version status
===========
V. 0.7: 
Date: 2013/04/13

Fully functional:
  * Application core
  * Publication datasources:
    * SWDF: functional, configured for the ISWC’2012 dataset
    * DBLP: functional, but the endpoint seems to experiment latency issues

---------
V. 0.8:
Date: 2013/04/14

  * Refactored the view templating system
    * All view templates are now located in /templates, so that conference managers can create their own if needed
    * if a route refers to a non-existing template in the configuration file, an empty one is created
  * Added 2 datasources:
    * DuckDuckGo! to retrieve authors' organisation data
    * Google web service to solve DuckDuckGo!'s irrelevancy in retrieving authors' homepages

---------
V. 0.9:
Date: 2013/04/18

  * Completely refactored the hash structure to add URIs along with titles as route parameters
  * Model and view callbacks communicate now using JSON objects
  * Simplified the routes and reduced the number of Backbone-triggered events to speed up the interface
  * Works for the main (SWDF, even if it requests anothe endpoint), Google and DuckDuckGo! datasources
  * Added experimental graph view (may be slow, especially on mobile phones).

Currently works on our duplicate WWW'2012 dataset (SWDF seems down since the beginning of the week)
