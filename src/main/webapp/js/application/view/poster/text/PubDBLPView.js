/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster
 *   Version: 1
 *   Tags: Sparql, DBLP Computer Science Bibliography
 **/
function PubDBLPView(prefix) {
        this.prefix  = prefix;
        this.graph = null;
        this.urlDBLP        = 'http://dblp.l3s.de/d2r/resource/publications/';
        this.uriPublication = '';
        this.hashGraph      = '';
        var self            = this;
	this.initView = function(paramJournalPublication){
                this.uriPublication = this.urlDBLP + paramJournalPublication;
                this.hashGraph = 'graph~' + paramJournalPublication.replace(/\/+/g, '~');
                $('.longTitle').css('padding-right',"4%");
                this.graph =  new GraphJSON();
                return this;
	}
	this.render = function(dataJSON,presenter){
                var publicationTitle;
                $.each(dataJSON.results.bindings,function(i,item){
                    $.each(item, function(key, valueArr) {
                        if(key == 'Title'){
                            publicationTitle = valueArr.value;
                        }
                    });
                });
                this.graph.setRootNode(this.uriPublication,publicationTitle);
		$.each(dataJSON.results.bindings,function(i,item){
                        $.each(item, function(key, valueArr) {
                                var idContent    = self.prefix + key;
                                switch(key){
                                    case 'Author':
                                        var paramDogFoodName = 'person~' + (valueArr.value).toLowerCase();
                                        var nameToSpace  = paramDogFoodName.replace(/\.+/g, ' ');
                                        var nameSWDFtoDash = nameToSpace.replace(/\s+/g, '-');
                                        var nameDBLPtoDash = (valueArr.value).replace(/\s+/g, '~');
                                        self.graph.setChildNode('http://data.semanticweb.org/person/'+nameSWDFtoDash, valueArr.value, self.uriPublication, key);
                                        $(idContent).append('<span><a href="#'+ nameSWDFtoDash +'~~'+ nameDBLPtoDash +'">' + valueArr.value +'</a></span>, ');
                                        break;
                                    case 'Url':
                                        self.graph.setChildNode(valueArr.value, valueArr.value, self.uriPublication, key);
                                        $(idContent).append('<div><a href="'+ valueArr.value +'" >' + valueArr.value +'</a></div>');
                                        break;
                                    default:
                                        if($(idContent).text() == '')
                                                $(self.prefix + key).append(valueArr.value);
                                            if(key != 'Title') self.graph.setChildNode(valueArr.value, valueArr.value, self.uriPublication, key);
                                        break;
                                }
                        });
		});
                /* toString Paper's Graph */
                var graphJSON    = JSON.stringify(self.graph.getInstance());
                var keyGraphStorage = self.uriPublication.replace("http://dblp.l3s.de/d2r/resource/publications/","");
                /* store Paper's Graph with jstorage */
                presenter.storeGraph("graph/"+keyGraphStorage,graphJSON);
                /* Set link */
                $(self.prefix+'Graph').append('<span><a href="#' + self.hashGraph + '" id="viewAs">View As Graph</a></span>');
    }

}