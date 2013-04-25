  /**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2013
 *   Author: Lionnel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan, Nicolas ARMANDO
 *   Description: Command store for the DataPaper datasource 
 *   Version: 1.1
 *   Tags:  REST, AJAX
 **/
 
//Web Service REST
 var DPCommandStore = {
 
	//Command  getResult 
	getDataPaper : {
		dataType : "JSONP",
		method : "GET",
		getQuery : function(parameters){ //JSON file parameters 
					var  ajaxData = 'key=["'+parameters.uri+'"]';
					return ajaxData
		},
										
		ModelCallBack : function (dataJSON,conferenceUri,datasourceUri, currentUri){
			//console.log(dataJSON);
			var JSONfile = {};
			var JSONToken = {};
			if(dataJSON.rows.length>0){
				JSONToken.resource  = dataJSON.rows;
			}
			JSONfile[0] = JSONToken;
			StorageManager.pushToStorage(currentUri,"getDataPaper",JSONfile);
			},
			
			
		ViewCallBack : function(parameters){
			var JSONdata = parameters.JSONdata;
			
			//Pick up data in local storage
			if( JSONdata!= null){
				
				if(JSONdata.hasOwnProperty("getDataPaper")){
					var dataPaper = JSONdata.getDataPaper;
				
					if(dataPaper[0].hasOwnProperty("resource")){
						if(dataPaper[0].resource.length>0){
							var out="<table>";
							for(i=0;i<dataPaper[0].resource.length;i++){
								out+="<tr><td>"+dataPaper[0].resource[i].value.description+"</td><td>"+'<a href="http://'+dataPaper[0].resource[i].value.url+'" data-role="button" >'+dataPaper[0].resource[i].value.type+'</a></td></tr>';
								ViewAdapter.Graph.addNode("Datapaper "+dataPaper[0].resource[i].value.type+' '+dataPaper[0].resource[i].value.description, dataPaper[0].resource[i].value.url);
							}
							out+="</table>";
							parameters.contentEl.append('<h2>Datapaper</h2>');
							parameters.contentEl.append(out);	
						}
					}
				}
			}
		}   
	}
};