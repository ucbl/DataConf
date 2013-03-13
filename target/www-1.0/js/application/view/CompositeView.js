/**
 *   http://www.adobe.com/devnet/html5/articles/javascript-design-patterns-pt1-singleton-composite-facade.html
 **/

function CompositeView(name,id){
    
    this.name  = name;
    this.id    = id;
    
    this.containers = {};
    this.presenter = null;
    
    /* Variables*/
    this.footerHeight = 0;
    this.footerTop = 0;
    this.oldPage = null;
    this.currentPage  = null;
        

    this.add = function(pageID,composantPage){
        this.containers[pageID] = composantPage;
        return this;
    }
    
    this.getCurrentPage = function(){
        console.log("CURRENT PAGE: " +this.currentPage);
      //  console.log("OBJECT  CURRENT PAGE: " +this.containers[this.currentPage]);
        return this.containers[this.currentPage];
    }
    this.getPage = function(pageID){   
        console.log("ok");
      //  console.log("OBJECT  CURRENT PAGE: " +this.containers[this.currentPage]);
        return this.containers[pageID];
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

    
    this.reset = function(){
        $(this.oldPage).addClass("translateO");
        $(this.currentPage).addClass("translateO");         /* add class tranlate for Opera */       
        $('#charBar').show();
        $(this.oldPage).hide();
        $(this.oldPage).removeClass("slide in");       
        $(this.currentPage).removeClass("slide in");        
        $(this.currentPage).css("overflow-x","visible");
        $(this.currentPage+'> div > div').empty();          /* empty content page  */      
        return this;
    }
    
    this.showCurrentPage = function(){
       $(this.currentPage).addClass("in slide"); $(this.currentPage).show();       
       return this;
    }

    this.show = function(){          
        /* Reset all containers and contents and Set current page */
        this.reset().showCurrentPage();
        this.setOldPage(this.currentPage); /* If currentPage displayed, set it to old page */
        return this;
    }
    
    /* Detect Hash Changed */
    this.addHashChangeListener = function(presenter){          
        // Detect if hash was changed
        $(window).hashchange(function(){
        	console.log("hashchange");
            presenter.updateStates(window.location.hash);
        });
        $(window).hashchange();
        return this;
    }

    this.setLoader = function(){                          
        /* Internet Explorer Cache Problem */
        $.ajaxSetup({
                 cache:false
        });
        /* Ajax-loader */
        $('#ajax-loader').ajaxStart(function(){
                $(this).css('display', 'block');
        });
        $('#ajax-loader').ajaxComplete(function(){
                $(this).css('display', 'none');
        });

        return this;
    }
    this.positionFooter = function() {
       /**
        *   http://css-tricks.com
        *   Author: Chris Coyier
        **/
        this.footerHeight = $("footer").height();
        this.footerTop = ($(window).scrollTop()+$(window).height()-this.footerHeight)+"px";

        if ( ($(document.body).height()+this.footerHeight) < $(window).height()) {
            $("footer").css({position: "absolute"}).animate({top: this.footerTop},0);
        } else {
            $("footer").css({position: "static"});
        }
    }
    this.resizeFooter = function(){                   
        this.positionFooter();
        $(window).scroll(this.positionFooter).resize(this.positionFooter);
        return this;
    }
    
    this.resizeMenuBars = function(){                                
        $('nav > ul').each(function(){
            var lengthWidth = parseFloat((100 / $(this).find('li').length)).toFixed(2);
            $(this).find('li').each(function(){
                $(this).css('width',lengthWidth+'%');
            });
        });
        return this;
    }

    this.setValidationForm = function(){           
        $(".searchform").validationEngine({autoHidePrompt:true, autoHideDelay:1000,promptPosition:"bottomLeft"});  
        return this;
    }
    
    
}