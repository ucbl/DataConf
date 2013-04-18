/**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This file provide simple function to build jquery mobile element such as button or sorted list plus some graph first attempt
*   Version: 0.8
*   Tags:  Backbone Jquery-ui-mobile Adapter 
**/
 (function(){

var ViewAdapter;
var root = this;
ViewAdapter = root.ViewAdapter = {};


    /*
    var theUI = {
      nodes:{uri:{color:"red", shape:"dot", alpha:1}, 
      
             demos:{color:CLR.branch, shape:"dot", alpha:1}, 
             halfviz:{color:CLR.demo, alpha:0, link:'/halfviz'},
             atlas:{color:CLR.demo, alpha:0, link:'/atlas'},
             echolalia:{color:CLR.demo, alpha:0, link:'/echolalia'},

             docs:{color:CLR.branch, shape:"dot", alpha:1}, 
             reference:{color:CLR.doc, alpha:0, link:'#reference'},
             introduction:{color:CLR.doc, alpha:0, link:'#introduction'},

             code:{color:CLR.branch, shape:"dot", alpha:1},
             github:{color:CLR.code, alpha:0, link:'https://github.com/samizdatco/arbor'},
             ".zip":{color:CLR.code, alpha:0, link:'/js/dist/arbor-v0.92.zip'},
             ".tar.gz":{color:CLR.code, alpha:0, link:'/js/dist/arbor-v0.92.tar.gz'}
            },
      edges:{
        uri:{
          demos:{length:.8},
          docs:{length:.8},
          code:{length:.8}
        },
        demos:{halfviz:{},
               atlas:{},
               echolalia:{}
        },
        docs:{reference:{},
              introduction:{}
        },
        code:{".zip":{},
              ".tar.gz":{},
              "github":{}
        }
      }
    }*/

// option { option.theme a|b|c , option.tiny : bool, option.align : right,option.prepend }
var appendButton = ViewAdapter.appendButton = function(el,href,label,option){
    if(!href)return;
    if(!option)var option={}
    var newButton = 
        $(  '<a href="'+href+'" data-role="button" ' +
            (option.tiny?'data-inline="true"':'data-icon="arrow-r" data-iconpos="right"') +
            (option.theme?'data-theme="'+option.theme+'"':'') +
			(option.align?'style="float:'+option.align+';"':'') +
            '>'+(label==""?href:label) +'</a>'); 
	el.append(newButton);
    return newButton;
};
 

//TODO make it free from swdf
/** append filter list to current view using '$("[data-role = page]").find(".content")' selector (backbone)
  * @param dataXML : SWDF sparql result
  * @param baselink : string url pattern for dynamic link generation (i.e. "#publication/")
  * @param bindingName : string pattern to match with sparql result 'binding[name="'+bindingName+'"]'
  * @param optional option : object {
  *         autodividers : boolean add jquerymobileui autodividers
  *         count : boolean add count support for sparql endpoint 1.0 : require "ORDER BY ASC(?bindingName)" in the sparql query.
  *         parseUrl : parsing lat function => " parseUrl:function(url){return url.replace('foo',"")}
  *         show : array of object {  key=bindingName => Shown 'binding[name="'+bindingName+'"]'
  *             alt : binding name if label is empty
  *             parseAlt : parsing alt function (see parseUrl param)
  *          
  */ 
var appendFilterList = ViewAdapter.appendFilterList = function(dataXML,baseLink,bindingName,option){
    if(!option)option={};
    var Uldiv= $('<ul  id="SearchByAuthorUl" '+(option.autodividers?'data-autodividers="true"':'')+' data-role="listview" data-filter="true" data-filter-placeholder="filter ..." class="ui-listview ui-corner-all ui-shadow"> ');
    var bubble= option.count  ?   '<span class="ui-li-count">1</span>'    :   ''  ; 
    var parseUrl= option.parseUrl ? option.parseUrl:function(text){return text.split(' ').join('_') };
    var text, counter, previousText, current, label, currentlabel;
    $(dataXML).find('sparql results > result').each(function(i,currentResult){
        label = text = $(currentResult).find('binding[name="'+bindingName+'"] :first-child').text();
        
        //change shown label
        if(option.show){
            label ="";
            for (var key in option.show) {
                currentlabel="";
                //console.log(option.show[key]);
                currentlabel =  $(currentResult).find('binding[name="'+key+'"] :first-child').text();
                if(currentlabel=="" && option.show[key].alt){  
                    currentlabel =  $(currentResult).find('binding[name="'+option.show[key].alt+'"] :first-child').text();
                    if(option.show[key].parseAlt) currentlabel=  option.show[key].parseAlt(currentlabel);
                }
                label+=currentlabel;
            }
        };
            
        //count
        if(option.count && i!=0 ){  
            if(text==$(currentResult.previousElementSibling).find('binding[name="'+bindingName+'"] :first-child').text()){
                console.log(text);
                //increment bubble
                counter=parseInt(Uldiv.find(' li:last-child span').html());  
                Uldiv.find(' li:last-child span').html(counter+1); 
                text=false;
            }  
        }
        //show
        if(text){ 
            Uldiv.append(
                    $('<li></li>').append(
                        $('<a href='+baseLink+parseUrl(text)+'>'+label+'</a>')
                                   .append($(bubble)))) ;
        }
    });  
    ViewAdapter.appendToBackboneView(Uldiv)
};

var appendToBackboneView = ViewAdapter.appendToBackboneView=function(div){
    if(!div)return;
    var el=$(div)
    $("[data-role = page]").find(".content").append(el).trigger("create"); 
    return el;
};

var prependToBackboneView = ViewAdapter.prependToBackboneView=function(div){
    if(!div)return;
    var el=$(div)
    $("[data-role = page]").find(".content").prepend(el).trigger("create");
    return el;
};
}).call(this);
