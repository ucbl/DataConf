/**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This file provide simple function to build jquery mobile element such as button or sorted list plus some graph first attempt
*   Version: 0.8
*   Tags:  Backbone Jquery-ui-mobile Adapter Linked-Data Graph html5 canvas
**/
var Graph = ViewAdapter.Graph = {
    canvasId : "graph",
    btnId : "graphBtn",
    enabled : false,
    canvas : '', 
    rootNodeLabel : '',
    nodeLimit : 20,
    nodeCounter : 0,
    theUI : '',
    btnShowLabel : 'view as graph',
    btnHideLabel : 'hide graph',
    sys: arbor.ParticleSystem(),
    
    //generate root node
    init : function(rootNodeLabel){
            console.log("-----GRAPH - INIT ------"); 
      ViewAdapter.Graph["nodeCounter"]=0;
      ViewAdapter.Graph.rootNodeLabel=rootNodeLabel;
      ViewAdapter.Graph.canvas = $('<canvas style="clear:both;" id="'+ViewAdapter.Graph.canvasId+'">');
      ViewAdapter.prependToBackboneView(ViewAdapter.Graph.canvas).hide();
      
      ViewAdapter.Graph["theUI"] = {nodes:{},edges:{}};
      ViewAdapter.Graph.theUI.nodes[rootNodeLabel]={color:"red", alpha:1, rootNode:true, alone:true, mass:.5};
      ViewAdapter.Graph.theUI.edges[rootNodeLabel]={};
      
      
      ViewAdapter.Graph.sys.parameters({stiffness:900, repulsion:2000, gravity:true, dt:0.015});
      ViewAdapter.Graph.sys.renderer = Renderer(ViewAdapter.Graph.canvas);
      
      $(ViewAdapter.Graph.sys.renderer).on('navigate',function(event,data){
            console.log("-----BROWSE RDF------"); 
            
            //move to page
            if(data.href!=undefined)document.location.href = data.href;
      });
      var btnlabel= ( ViewAdapter.Graph.enabled  ?    ViewAdapter.Graph.btnHideLabel : ViewAdapter.Graph.btnShowLabel );
      var button = ViewAdapter.appendButton($("[data-role = page]").find(".content"),'javascript:void(0)',btnlabel,{tiny:true,theme:"a",prepend:true, align : "right"});
          var parent = $(ViewAdapter.Graph.canvas).parent();
      button.toggle(function(){  
          $(this).find('.ui-btn-text').html("hide graph");
          $(ViewAdapter.Graph.canvas).show("slow");
          parent.children().not($(this)).not($(ViewAdapter.Graph.canvas)).hide("slow");
          
          ViewAdapter.Graph.enabled = true;
          
        },function(){ 
          $(ViewAdapter.Graph.canvas).hide("slow"); 
          parent.children().not($(this)).not($(ViewAdapter.Graph.canvas)).show("slow");
          
          $(this).find('.ui-btn-text').html("view as graph");
          ViewAdapter.Graph.enabled = false;
      });
      if(ViewAdapter.Graph.enabled){button.trigger('click');}
    },
    
    //generate clickable node
    addNode : function(label,href){
            console.log("-----GRAPH - ADD NODE------"); 
      if(ViewAdapter.Graph.nodeCounter<=ViewAdapter.Graph.nodeLimit){
        var rootNodeLabel=ViewAdapter.Graph.rootNodeLabel;
        ViewAdapter.Graph.theUI.nodes[label]={color:"#0B614B", fontColor:"#F2F2F2", alpha:0.8,href:href};
        ViewAdapter.Graph.theUI.edges[rootNodeLabel][label] = {length:1};
        ViewAdapter.Graph["nodeCounter"]=ViewAdapter.Graph.nodeCounter+1;
        ViewAdapter.Graph.sys.merge(ViewAdapter.Graph.theUI);
        //cacher le reste
      }
    },
    
    //generate info node
    addLeaf : function(label){
            console.log("-----GRAPH - ADD LEAF------"); 
      if(ViewAdapter.Graph.nodeCounter<=ViewAdapter.Graph.nodeLimit){
        var rootNodeLabel=ViewAdapter.Graph.rootNodeLabel;
        ViewAdapter.Graph.theUI.nodes[label]={color:"orange", fontColor:"#F2F2F2", alpha:0.7};
        ViewAdapter.Graph.theUI.edges[rootNodeLabel][label] = {length:1};
        ViewAdapter.Graph["nodeCounter"]=ViewAdapter.Graph.nodeCounter+1;
        ViewAdapter.Graph.sys.merge(ViewAdapter.Graph.theUI); 
        //cacher le reste
      }
    }, 
     
};








