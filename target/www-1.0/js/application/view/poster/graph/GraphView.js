/**
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2012 
 *   Author: Lionnel MEDINI(supervisor) and NGUYEN Hoang Duy Tan
 *   Description: meta-data for poster 
 *   Version: 1
 *   Tags: Sparql, Graph visualization , Thejit
 **/
/**
 * Jit.js bug: missing function  viz.labels.clearLabels(); on line  5285
 **/

 function GraphView (){ 
     
    this.containers = {};
    this.oldPage = null;
    this.currentPage  = null;  
    
    this.graphJSON        = null;
    this.idRootNode       = '';
    this.idCurrentNode    = '';
    this.labelCurrentNode = '';
    this.hyperTree        = null;
    var self              = this;
    
    this.currentPage  = null;
        
    this.add = function(pageID,composantPage){
        this.containers[pageID] = composantPage;
        return this;
    }
    
    this.getCurrentPage = function(){
        console.log("Graphe view CURRENT PAGE: " +this.currentPage);    
        return this.containers[this.currentPage];
    }
  
    this.getCurrent = function(){
        return this.currentPage;
    }
    
    
    this.getComponent = function(componentName){          
        return this.containers[componentName];
    }
    this.getOldPage = function(oldPage){
         return this.oldPage;
       
    }
    this.setOldPage = function(oldPage){
        this.oldPage = oldPage;
        return this;
    }

    this.setCurrentPage = function(currentPage){        
        this.currentPage = currentPage;
        return this;
    }
    
    this.initView = function(currentHash){		                    					                      
        $('#viewAsText').append('<span><a href="#'+currentHash+'" id="viewAs">View as Text</a></span>');
        return this;
    }   
    this.render = function(graph,presenter){
                                            
           
            var infovis = document.getElementById('infovis');
            var w = infovis.offsetWidth - 50, h = infovis.offsetHeight - 50;

            //init Hypertree
            self.hyperTree = new $jit.Hypertree({
              //id of the visualization container
              injectInto: 'infovis',
              //canvas width and height
              width: w,
              height: h,   
              //Change node and edge styles such as
              //color, width and dimensions.
              Node: {
                  dim: 9,
                  color: "#DC107C"                 
              },
              Edge: {
                  lineWidth: 2,                                   
                  color: "#E89900"
              },             
              //Attach event handlers and add text to the
              //labels. This method is only triggered on label
              //creation
              onCreateLabel: function(domElement, node){
                  domElement.innerHTML = node.name;
                  $jit.util.addEvent(domElement, 'click', function () {
                      //Animates the Hypertree to center the node specified by id.
                        self.hyperTree.onClick(node.id);
                        self.idRootNode       = self.hyperTree.graph.getClosestNodeToOrigin('start').id;
                        self.idCurrentNode    = node.id;
                        self.labelCurrentNode = node.name;                       

                        presenter.updateNodesStates(node.id,node.name);
                        $('#viewAsText').empty();
                        $('#currentNode').empty();
                       
                  });
              },
              //Change node styles when labels are placed
              //or moved.
              onPlaceLabel: function(domElement, node){  
             
                 // alert("on place"+node.id);
                  var style = domElement.style;
                  style.display = '';
                  style.cursor = 'pointer';
                  
                  node.setDataset(['current'], {                                 
                          'color': ['#FF00FF']  
                  });
                  
                  if (node._depth <= 1) {
                      style.fontSize = "0.9em";
                      style.color = "#2F84CA";                      

                  } else if(node._depth == 2){
                      style.fontSize = "0.7em";
                      style.color = "#60A3DA";

                  } else {
                      style.display = 'none';
                  }

                  var left = parseInt(style.left);
                  var w = domElement.offsetWidth;
                  style.left = (left - w / 2) + 'px';
              },             
              onAfterCompute: function(){  
                  /* Delete all nodes if they are not root node */
                  if((self.idRootNode != '') && !(self.notFound)){                           
                         var arrNodeDeleted = [];   
                         self.hyperTree.graph.eachNode(function(node) {  
                             if(node.id != self.idCurrentNode && node.id != self.idRootNode){
                                 arrNodeDeleted.push(node.id);
                             }
                         });
                         /* Options for animation  */
                         var options = {
                            type: 'fade:con',
                            duration: 2000,
                            hideLabels: false,
                            transition: $jit.Trans.Quart.easeOut
                         };
                         /* Remove node that we dont need */
                         self.hyperTree.op.removeNode(arrNodeDeleted,options);
                   }
              }
            });
            //load JSON data.
            self.hyperTree.loadJSON(graph);
            //compute positions and plot.
            self.hyperTree.refresh();
    }
    
    this.loadNewGraph = function(){
            setTimeout(function(){
                    var graph  = self.getCurrentPage().getGraph();              
                    self.hyperTree.loadJSON(graph.rootNode);
                    self.hyperTree.refresh();
                    self.idRootNode = '';
               },4000
            );
           
    }
};
    
  