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
					"uri" : "http://dblp.l3s.de/d2r/sparql",
					"crossDomainMode" : "JSONP",
					"commands" : DBLPCommandStore,
				},

				"webDatasource" : {   
					"uri" : "http://api.duckduckgo.com/",
					"crossDomainMode" : "JSONP",
					"commands" : "conferenceDatasourceCommands",
				},
				
				"eventDatasource" : {

					"uri" : "http://calendar.labs.idci.fr/api/schedule_event.jsonp?",
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
			    "Proceedings-search-author" : { 
					"hash" : "proceedings-search/author-:author",
					"view" : "#searchFormAuthorProceedings",
					"commands" : [
					    {
							"datasource" : "conferenceDatasource",
							"name" : "getAuthorsProceedings",
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
							"name" : "getEvent",
						},
						{
							"datasource" : "conferenceDatasource",
							"name" : "getSubEvent",
						
						},
						{
							"datasource" : "conferenceDatasource",
							"name" : "getEventPublications",
						}
					]
				},
				"Publication" : { 
					"hash" : "publication/:id",
					"view" : "#publication",
					"commands" : [
						{
							"datasource" : "conferenceDatasource",
							"name" : "getPublicationInfo",
						},
						{
							"datasource" : "conferenceDatasource",
							"name" : "getPublicationAuthor",
						},	
						{
							"datasource" : "conferenceDatasource",
							"name" : "getPublicationKeywords",
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
				},
				"Author" : {
					"hash" : "author/:id",
					"view" : "#author",
					"commands" : [
					    {
							"datasource" : "publicationDatasource",
							"name" : "getAuthor",
						},
						{
							"datasource" : "conferenceDatasource",
							"name" : "getAuthorsProceedings",
						},
						{
							"datasource" : "conferenceDatasource",
							"name" : "getAuthorOrganization",
						}
					]
				},
				"ExternPublication" : {
					"hash" : "externPublication/:id",
					"view" : "#externPublication",
					"commands" : [
					    {
							"datasource" : "publicationDatasource",
							"name" : "getExternPublicationInfo",
						}
					]
				},
				"Keyword" : {
					"hash" : "keyword/:id",
					"view" : "#keyword",
					"commands" : [
					    {
							"datasource" : "conferenceDatasource",
							"name" : "getPublicationsByKeyword",
						}
					]
				},
				"Organization" : {
					"hash" : "organization/:id",
					"view" : "#organization",
					"commands" : [
					    {
							"datasource" : "conferenceDatasource",
							"name" : "getOrganization",
						}
					]
				}
			}
		};
