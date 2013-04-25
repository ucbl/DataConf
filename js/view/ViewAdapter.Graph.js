/**   
* Copyright <c> Claude Bernard - University Lyon 1 -  2013
*  License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This file provide simple functions to populate and generate a graph view (see lib/Arbor.js)
*   Version: 1.1
*   Tags:  Backbone Jquery-ui-mobile Adapter Linked-Data Graph html5 canvas
**/
var Graph = ViewAdapter.Graph = { 
    btnId : "graphBtn",
    enabled : false,
    canvas : $('<canvas style="clear:both;" id="arbor-graph-canvas">'), 
    rootNodeLabel : '',
    nodeLimit : 9,
    nodeCounter : 0,
    theUI : '',
    btnShowLabel : 'View as graph',
    btnHideLabel : 'View as text',
    sys : '', 
    
    //called once
    init: function(){
		console.log("Graph init");
		ViewAdapter.Graph.sys = arbor.ParticleSystem();
		ViewAdapter.Graph.sys.renderer = Renderer(ViewAdapter.Graph.canvas);

		//likable nodes make sys.mergeer triggers the "navigate" event move to page
		$(ViewAdapter.Graph.sys.renderer).on('navigate',function(event,data){
			if(data.href!=undefined)document.location.href = data.href;
		});
		
		
    },  
	
    initRootNode : function(rootNodeLabel){
		

		ViewAdapter.Graph["nodeCounter"]=0;
		ViewAdapter.Graph["theUI"] = {nodes:{},edges:{}}; 

		ViewAdapter.Graph.rootNodeLabel=rootNodeLabel;
		ViewAdapter.Graph.theUI.nodes[rootNodeLabel]={color:"red", alpha:1, rootNode:true, alone:true, mass:.5};
		ViewAdapter.Graph.theUI.edges[rootNodeLabel]={};
		
		
    }, 
	
    initBtn : function(el){  
		

		ViewAdapter.Graph.canvas.hide();
		var btnlabel=  ViewAdapter.Graph.btnShowLabel ; 
		var button = ViewAdapter.appendButton(el,'javascript:void(0)',btnlabel,{tiny:true,theme : "a",prepend:true, align : "right"});
		button.css("margin"," 0px");   
		button.css("z-index","20"); 
		el.append(ViewAdapter.Graph.canvas);
		var parent = el.parent();

		button.click(function(){
	
			if(ViewAdapter.Graph.enabled == false){

				ViewAdapter.Graph.enabled = true;
				if(ViewAdapter.Graph.enabled)ViewAdapter.Graph.sys.merge(ViewAdapter.Graph.theUI);
				$(this).find('.ui-btn-text').html(ViewAdapter.Graph.btnHideLabel);
				$(ViewAdapter.Graph.canvas).show("slow");
				el.siblings().hide("slow"); 
				
			}else{
			
				$(ViewAdapter.Graph.canvas).hide("slow"); 
				el.siblings().show("slow");

				$(this).find('.ui-btn-text').html(ViewAdapter.Graph.btnShowLabel);
				$(this).show();	
				ViewAdapter.Graph.enabled = false;
			}
		});
		if(ViewAdapter.Graph.enabled){ ViewAdapter.Graph.enabled = false; button.trigger('click');}
    }, 
    
    //generate clickable node
    addNode : function(label,href){
      if(ViewAdapter.Graph.nodeCounter<=ViewAdapter.Graph.nodeLimit){
        //console.log("GRAPH addNode !");
        
        var rootNodeLabel=ViewAdapter.Graph.rootNodeLabel;
        ViewAdapter.Graph.theUI.nodes[label]={color:"#0B614B", fontColor:"#F2F2F2", alpha:0.8,href:href};
        ViewAdapter.Graph.theUI.edges[rootNodeLabel][label] = {length:1};
        ViewAdapter.Graph["nodeCounter"]=ViewAdapter.Graph.nodeCounter+1;
        
          if(ViewAdapter.Graph.enabled)ViewAdapter.Graph.sys.merge(ViewAdapter.Graph.theUI);
      }
    },
    
    //generate info node
    addLeaf : function(label){
      if(ViewAdapter.Graph.nodeCounter<=ViewAdapter.Graph.nodeLimit){
        //console.log("GRAPH addLeaf !");
         
        var rootNodeLabel=ViewAdapter.Graph.rootNodeLabel;
        ViewAdapter.Graph.theUI.nodes[label]={color:"orange", fontColor:"#F2F2F2", alpha:0.7};
        ViewAdapter.Graph.theUI.edges[rootNodeLabel][label] = {length:1};
        ViewAdapter.Graph["nodeCounter"]=ViewAdapter.Graph.nodeCounter+1; 
        if(ViewAdapter.Graph.enabled)ViewAdapter.Graph.sys.merge(ViewAdapter.Graph.theUI);
        //cacher le reste
      }
    }, 
     
};




