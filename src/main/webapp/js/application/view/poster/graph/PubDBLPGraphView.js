/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster
 *   Version: 1
 *   Tags: Sparql, DBLP Computer Science Bibliography
 **/
function  PubDBLPGraphView() {
    /* Variables */
    var self              = this;
    this.graphJSON        = null;
    this.idCurrentNode    = '';
    this.labelCurrentNode = '';
    this.initView = function(idCurrentNode,labelCurrentNode){
        this.graphJSON        = new GraphJSON();
        this.idCurrentNode    = idCurrentNode;
        this.labelCurrentNode = labelCurrentNode;
        /* Set new root node */
        this.graphJSON.setRootNode(this.idCurrentNode,this.labelCurrentNode);    //PersonGraphView.idCurrentNode : uriAuthor SWDF
        $('#viewAsText').append('<span><a href="#'+ (idCurrentNode.replace("http://dblp.l3s.de/d2r/resource/publications/","")).replace(/\/+/g, '~') +'" id="viewAs">View as Text</a></span>');
        $('#currentNode').append('<h3> Conference Publication  : '+ labelCurrentNode +'</h3>');
        return this;
    }
    this.render = function(dataJSON){               
        $.each(dataJSON.results.bindings,function(i,item){
            $.each(item, function(key, valueArr) {
                if(key == 'Author'){
                    var paramDogFoodName = 'person~' + (valueArr.value).toLowerCase();
                    var nameToSpace      = paramDogFoodName.replace(/\.+/g, ' ');
                    var uriAuthoSWDF     = 'http://data.semanticweb.org/person/'+nameToSpace.replace(/\s+/g, '-');
                    self.graphJSON.setChildNode(uriAuthoSWDF  , valueArr.value, self.idCurrentNode, key);
                }else if(key == 'Url'){			
                    self.graphJSON.setChildNode(valueArr.value, valueArr.value, self.idCurrentNode, key);
                }
                else {	
                    self.graphJSON.setChildNode(valueArr.value, valueArr.value, self.idCurrentNode, key);
                }

            });	
        });
        return this;
    }
    this.getGraph = function(){
        return self.graphJSON;
    }

}