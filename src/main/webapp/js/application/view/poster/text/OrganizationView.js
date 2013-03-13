/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, Semantic Web Dog Food 
 **/
function OrganizationView (prefix) {
        this.prefix  = prefix;
        this.grahp = null;
        this.hashGraph = '';
        this.uriOrganization = '';
        var self     = this;
	this.initView = function(locationId,entityId){
                this.uriOrganization =   ConfigurationManager.getInstance().getConfUri() + locationId + entityId; 
                this.hashGraph = 'graph~' + (locationId + entityId).replace(/\/+/g, '~');
                this.grahp =  new GraphJSON();
                return this;                                                      
	}
	this.render = function(dataXML,presenter){
                
                var organizationName = $(dataXML).find('sparql > results > result > binding[name="Name"]').find(":first-child").text();                  
                /*  Add root node */                
                this.grahp.setRootNode(this.uriOrganization,organizationName);
                
		$(dataXML).find("sparql > results > result > binding").each(function(){                   
                        var key  = $(this).attr("name");				
                        var value = $(this).find(":first-child").text();
                        var idContent    = self.prefix + key;

                        var toDashValue = value.replace(/\s+/g, '~');
                        if(key == 'Name'){                                    
                            $(idContent).append(value);
                        }
                        else if (key == 'Member'){                                    
                            var nameToDash = value.replace(/\s+/g, '~');
                            var uriAuthor =  $(this).next().find(":first-child").text();
                            var paramater = uriAuthor.replace('http://data.semanticweb.org/','');					
                            var paramaterToDash = paramater.replace(/\/+/g, '~');	
                            self.grahp.setChildNode(uriAuthor, value, self.uriOrganization, key);
                            $(idContent).append('<div><a href="#'+ paramaterToDash +'~~'+ nameToDash +'">' + value +'</a></div>');							
                        }     
		  });
                  
                  //toString Paper's Graph
                  var graphJSON       = JSON.stringify(this.grahp.getInstance());
                  var keyGraphStorage = this.uriOrganization.replace("http://data.semanticweb.org/","");
                  //store Paper's Graph with jstorage    
                  presenter.storeGraph("graph/"+keyGraphStorage,graphJSON);
                  //Set link
                  $(self.prefix+'Graph').append('<span><a href="#' + this.hashGraph + '" id="viewAs">View As Graph</a></span>');                                    
                  // Search on DuckDuckGo
                  var organizationName = $('#organizationName').text().replace(/\s+/g, '+');
                  if(organizationName.indexOf(",") != -1) presenter.search(organizationName.split(",")[0]);
                  else presenter.search(organizationName);

                  return this;
                
    }
    this.renderDataDDGo = function(dataJSON,presenter){
                $('#organizationLogo').append('<img src="'+ dataJSON.Image +'" />');        
                $.each(dataJSON.Results,function(i,item){                               
                    $.each(item, function(key, valueArr) {
                            if(key == 'FirstURL')
                                $('#organizationSite').append('<a href="'+ valueArr +'" >' + valueArr +'</a>');
                    });
                });

                if($('#organizationSite').text() == ''){
                    var organizationName = '!ducky+'+ $('#organizationName').text().replace(/\s+/g, '+');
                    presenter.searchSite(organizationName);
                }
                return this;
    }
    this.renderSite = function(dataJSON){
                $('#organizationSite').append('<a href="'+ dataJSON.Redirect +'" >' + dataJSON.Redirect +'</a>');
                return this;
    }
	
};