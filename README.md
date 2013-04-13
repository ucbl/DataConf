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
    * SWDF: fully functional, configured for the ISWC’2012 dataset
    * DBLP: fully functional, but the endpoint seems to experiment latency issues
