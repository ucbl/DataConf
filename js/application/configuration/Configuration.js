 var Configuration = {
			"conference" : {
				"name": "ISWC 2012",
				"logoUri": "http://iswc2012.semanticweb.org/sites/default/files/iswc_logo.jpg",
				"baseUri": "http://data.semanticweb.org/conference/iswc/2012",
			},
			
			"datasources" : {
				"conferenceDatasource" : {

					"uri" : "http://data.semanticweb.org/sparql",
					"crossDomainMode" : "CORS",
					"commands" : SWDFCommandStore, 
				},
				
				"publicationDatasource" : {
					"Uri" : "http://dblp.l3s.de/d2r/sparql",
					"crossDomainMode" : "Cors",
					"commands" : "conferenceDatasourceCommands",
				},

				"webDatasource" : {   
					"Uri" : "http://api.duckduckgo.com/",
					"crossDomainMode" : "JSONP",
					"commands" : "conferenceDatasourceCommands",
				},
				
				"eventDatasource" : {

					"Uri" : "http://calendar.labs.idci.fr/api/schedule_event.jsonp?",
					"crossDomainMode" : "JSONP",
					"commands" : "conferenceDatasourceCommands",
				}

			}, 
			"routes" : {
			    "Home" : { 
					"hash" : "",
					"view" : "#home",
					"commands" : [ 
						{
						"datasource" : "conferenceDatasource",
						"name" : "getConferenceMainEvent",
						}
					]
				}, 
			    "Proceedings-search" : { 
					"hash" : "proceedings-search",
					"view" : "#proceedingsSearch",
					"commands" : [
					]
				},
			    "Proceedings-search-by-author" : { 
					"hash" : "proceedings-search/by-author",
					"view" : "#searchFormAuthor",
					"commands" : [
					    {
							"datasource" : "conferenceDatasource",
							"name" : "getAllAuthors",
						} 
					]
				},
			    "Proceedings-search-by-keyword" : { 
					"hash" : "proceedings-search/by-keyword",
					"view" : "#searchFormKeyword",
					"commands" : [
					    {
							"datasource" : "conferenceDatasource",
							"name" : "getAllKeyword",
						} 
					]
				},
			    "Proceedings-search-by-title" : { 
					"hash" : "proceedings-search/by-title",
					"view" : "#searchFormTitle",
					"commands" : [
					    {
							"datasource" : "conferenceDatasource",
							"name" : "getAllTitle",
						} 
					]
				},
				"Event" : { 
					"hash" : "event/*id",
					"view" : "#event",
					"commands" : [
						{
							"datasource" : "conferenceDatasource",
							"name" : "getSubEvent",
						}
					]
				},
				"Person" : {
					"hash" : "Person/:id",
					"view" : "PersonView",
					"commands" : [
					    {
							"datasource" : "conferenceDatasource",
							"name" : "getPublications",
						},
						
						{
							"datasource" : "publicationDatasource",
							"name" : "getPublications",
						},
						
						{
							"datasource" : "publicationDatasource",
							"name" : "getPublications",
						}
					]
				}
			
			}
		};
