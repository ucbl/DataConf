 /**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This file contains the functions used to get and store all the templates found on /templates. The storing system uses an array of the template's name to load (see entryPoint/main.js)
*				 When loaded, every template are accessible by their name using the "get" method
*					   
*   Tags:  TEMPLATE
**/
var tpl = {
    // Hash of preloaded templates for the app
    templates:{},

	/** Template loader function 
	* It takes an array of name and retrieve the according template found in templates/ directory
	* names : Array of the template's name to load
	* callback : function called when the loading is done, in our case, stating the router
	**/
    loadTemplates:function (names, callback) {

        var that = this;

        var loadTemplate = function (index) {
            var name = names[index];
            console.log('Loading template: ' + name);
            $.get('templates/' + name + '.html', function (data) {
                that.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        }

        loadTemplate(0);
    },

   /** Template getter function 
	* name : name of the template to retrieve
	**/
    get:function (name) {
        return this.templates[name];
    }

};