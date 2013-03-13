<!doctype html>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
    <head>

            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            <title>www2012 - The Posters</title>
            <!-- CSS & JQUERY UI && JQUERY VALIDATION-->
            <link rel="stylesheet" href="css/jquery-ui.css" type="text/css">
            <link rel="stylesheet" href="css/layout-scan.css" type="text/css">

            <link rel="stylesheet" href="css/validationEngine.jquery.css" type="text/css"/>
            <link rel="shortcut icon" href="images/www-ico.png" />
            <!-- CDN JQUERY & JQUERY UI Lib -->
            <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
            <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js" type="text/javascript"></script>
            <!-- Validation Lib -->
            <script src="js/lib/jquery.validationEngine-en.js" type="text/javascript" charset="utf-8"></script>
            <script src="js/lib/jquery.validationEngine.js" type="text/javascript" charset="utf-8"></script>
            <!-- HashChange Lib -->
            <script src="js/lib/hashchange.min.js" type="text/javascript"></script>
            <!-- Model -->
            <script src="js/application/model/SparqlEndpoint.js" type="text/javascript"></script>
            <script src="js/application/model/SparqlEndpointBuilder.js" type="text/javascript"></script>
            <script src="js/application/model/SWDFBuilder.js" type="text/javascript"></script>
            <script src="js/application/model/SWDFManager.js" type="text/javascript"></script>

            <!-- View -->
            <script src="js/application/view/CompositeView.js" type="text/javascript"></script>
            <script src="js/application/view/home/HomeView.js" type="text/javascript"></script>
            <!-- Controller -->
            <script src="js/application/presenter/HomePresenter.js" type="text/javascript"></script>
            <!-- Main -->
            <script src="js/mainHome.js" type="text/javascript"></script>

    </head>
<body>


<img src="images/loader.gif" alt=""  id="ajax-loader" style="display: none" />

<article wwww2012="index">
    <!-- Home Page -->
    <section id="home">   

        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="longTitle"></a></span>
        </header>

        <div class="none">
            <h1>WWW2012 Posters</h1> 
            <h2 style="text-align: center">Welcome to the WWW'2012 poster track mobile app</h2>
            <h3 style="text-align: center">From here, you can:</h3>
               <ul  class="list gradWhite">                   
                    <li><a href="scan" >Scan a QRcode</a></li>            
                    <li><a href="#searchPoster" >Search a Poster</a></li>
                    <li><a href="#searchEvent"  >Search By Event</a></li>
               </ul>
        </div>     
    </section>

    <!-- Search Poster by Author,by Keyword,by Title... -->
    <section id="searchPoster">		
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle"></a></span>
        </header>    
        <div class="none">
            <h1>Poster</h1> 
            <ul class="list gradWhite">                 
                        <li><a href="#searchPosterByAuthor"  data-transition="slide">Search By Author</a></li>
                        <li><a href="#searchPosterByKeyword" data-transition="slide">Search By Keyword</a></li>
                        <li><a href="#searchPosterByNumber"  data-transition="slide">Search By Number</a></li>
                        <li><a href="#searchPosterByTitle"   data-transition="slide">Search By Title </a></li>                                        
            </ul>                    
        </div>          
    </section>
    
    <!-- Search Poster By Author-->
    <section id="searchPosterByAuthor">		
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle"></a></span>
        </header>
        <!-- Poster Bar -->
        <nav class="poster-bar gradWhite">
            <ul>
                <li><a href="/" class="tab-active"><span>Home</span></a></li>       
                <li><a href="#searchPoster" id="navSearchPoster"><span>Search Poster</span></a></li>                       
                <li><a href="#chatPage"><span>Recommend Poster</span></a></li>
            </ul>
        </nav>         
        <div class="form">
            <h1>Paper</h1>
            <h3>Search By Author</h3>
            <form class="searchform" id="formSearchPosterByAuthor"  action="poster#search~author" method="post">
                    <input class="searchfield"  data-role="none" data-validation-engine="validate[required]" id="inputSearchPosterByAuthor" type="text" name="valueSearch"/>                                    
                    <input data-role="none" type="hidden" name="typeSearch" value="author" />
                    <input class="searchbutton" data-role="none" name="author" type="submit" value="Go" />
            </form>
       </div>        
    </section>                    


    <!-- Search Poster By Keyword Page -->
    <section id="searchPosterByKeyword">		
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle"></a></span>
        </header>
        <!-- Poster Bar -->
        <nav class="poster-bar gradWhite">
            <ul>
                <li><a href="/" class="tab-active"><span>Home</span></a></li>       
                <li><a href="#searchPoster" id="navSearchPoster"><span>Search Poster</span></a></li>
                       
                <li><a href="#chatPage"><span>Recommend Poster</span></a></li>
            </ul>
        </nav>        
        <div class="form">
            <h1>Poster</h1> 
            <h3>Search By Keyword</h3>  
            <form class="searchform" action="poster#search~keyword" method="post">
                    <input class="searchfield"  data-role="none" data-validation-engine="validate[required,custom[onlyLetterSp]]" id="inputSearchPosterByKeyword" type="text" name="valueSearch"/>
                    <input data-role="none" type="hidden" name="typeSearch" value="keyword" />
                    <input class="searchbutton" data-role="none" name="keyword" type="submit" value="Go" />
            </form>

        </div>                 
    </section>

    <!-- Search Poster By Number Page -->
    <section id="searchPosterByNumber">		
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle"></a></span>
        </header>
        <!-- Poster Bar -->
        <nav class="poster-bar gradWhite">
            <ul>
                <li><a href="/" class="tab-active"><span>Home</span></a></li>       
                <li><a href="#searchPoster" id="navSearchPoster"><span>Search Poster</span></a></li>
                       
                <li><a href="#chatPage"><span>Recommend Poster</span></a></li>
            </ul>
        </nav>            
        <div class="form">
               <h1>Poster</h1> 
               <h3>Search By Number</h3>  

               <form action="pub" class="searchform" id="formSearchNumber" method="post">           
                    <input class="searchfield"  data-role="none" data-validation-engine="validate[required,custom[integer]]" id="inputSearchPosterByNumber" type="text" name="idPaper"/>    
                    <input class="searchbutton" data-role="none" name="number" type="submit" value="Go" />
               </form>  
          </div>    
    </section>


    <!-- Search Poster By Title Page -->
    <section id="searchPosterByTitle">		
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle"></a></span>
        </header>
        <!-- Poster Bar -->
        <nav class="poster-bar gradWhite">
            <ul>
                <li><a href="/" class="tab-active"><span>Home</span></a></li>       
                <li><a href="#searchPoster" id="navSearchPoster"><span>Search Poster</span></a></li>
                       
                <li><a href="#chatPage"><span>Recommend Poster</span></a></li>
            </ul>
        </nav>        
        <div class="form">
            <h1>Poster</h1>         
            <h3>Search By Title</h3>  
             <form class="searchform" action="poster#search~title" method="post">
                    <input class="searchfield"  data-role="none" data-validation-engine="validate[required]" id="inputSearchPosterByTitle" type="text" name="valueSearch"/>    
                    <input data-role="none" type="hidden" name="typeSearch" value="title" />
                    <input class="searchbutton" data-role="none" name="title" type="submit" value="Go" />
            </form>
        </div>   

    </section> 

    <!-- Search By Event -->
    <section id="searchEvent">
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle"></a></span>
        </header>    
        <div class="none">
            <h1>Event</h1>
            <ul class="list gradWhite">

<!--                        <li><a href="#searchPaperByEvent" class="event" id="http://data.semanticweb.org/conference/www/2012/poster/proceedings"  data-controller="poster">Poster track</a></li>
                        <li><a href="#searchPaperByEvent" class="event" id="http://data.semanticweb.org/conference/www/2012/dev/proceedings"     data-controller="poster">Developers track</a></li>
                        <li><a href="#searchPaperByEvent" class="event" id="http://data.semanticweb.org/conference/www/2012/demo/proceedings"    data-controller="demo">Demo track</a></li>
                        <li><a href="#searchPaperByEvent" class="event" id="http://data.semanticweb.org/conference/www/2012/phd/proceedings"     data-controller="php">PhD symposium</a></li>-->
                         <c:forEach var="event" items="${config}"> 
                              <c:forEach var="property" items="${event.value}"> 
                                   <li><a href="#searchPaperByEvent" class="event" data-controller="${event.key}"  id="${property.key}">${property.value}</a></li>
                              </c:forEach>   
                         </c:forEach>  
            </ul>                    
        </div>          
    </section>    
    <!-- Search Paper by Event and by Author,by Keyword,by Title... -->
    <section id="searchPaperByEvent">
        <header>
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle"></a></span>
        </header>
        <div class="none">
            <h1>Paper</h1>
            <ul class="list gradWhite">
                        <li><a href="#searchByAuthor"  data-transition="slide">Search By Author</a></li>
                        <li><a href="#searchByKeyword" data-transition="slide">Search By Keyword</a></li>
                        <li><a href="#searchByTitle"   data-transition="slide">Search By Title</a></li>
            </ul>
        </div>
    </section> 
           
     <!-- Search Paper By Author-->
    <section id="searchByAuthor">
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle"></a></span>
        </header>
        <!-- Poster Bar -->
        <nav class="poster-bar gradWhite">
            <ul>
                <li><a href="/" class="tab-active"><span>Home</span></a></li>       
                <li><a href="#searchPoster" id="navSearchPoster"><span>Search Poster</span></a></li>                       
                <li><a href="#chatPage"><span>Recommend Poster</span></a></li>
            </ul>
        </nav>         
        <div class="form">
            <h1>Paper</h1>
            <h3>Search By Author</h3>
            <form id="formSearchAuthor" class="searchform"  action="" method="post">
                    <input class="searchfield"  data-role="none" data-validation-engine="validate[required]" id="inputSearchByAuthor" type="text" name="valueSearch"/>
                    <input data-role="none" type="hidden" name="typeSearch" value="author" />
                    <input class="searchbutton" data-role="none" name="author" type="submit" value="Go" />
            </form>
       </div>        
    </section>                    


    <!-- Search Paper By Keyword Page -->
    <section id="searchByKeyword">
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle"></a></span>
        </header>
        <!-- Poster Bar -->
        <nav class="poster-bar gradWhite">
            <ul>
                <li><a href="/" class="tab-active"><span>Home</span></a></li>       
                <li><a href="#searchPoster" id="navSearchPoster"><span>Search Poster</span></a></li>
                       
                <li><a href="#chatPage"><span>Recommend Poster</span></a></li>
            </ul>
        </nav>        
        <div class="form">
            <h1>Paper</h1> 
            <h3>Search By Keyword</h3>  
            <form id="formSearchKeyword" class="searchform" action="" method="post">
                    <input class="searchfield"  data-role="none" data-validation-engine="validate[required,custom[onlyLetterSp]]" id="inputSearchByKeyword" type="text" name="valueSearch"/>
                    <input data-role="none" type="hidden" name="typeSearch" value="keyword" />
                    <input class="searchbutton" data-role="none" name="keyword" type="submit" value="Go" />
            </form>

        </div>                 
    </section>
   

    <!-- Search Paper By Title Page -->
    <section id="searchByTitle">
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle"></a></span>
        </header>
        <!-- Poster Bar -->
        <nav class="poster-bar gradWhite">
            <ul>
                <li><a href="/" class="tab-active"><span>Home</span></a></li>       
                <li><a href="#searchPoster" id="navSearchPoster"><span>Search Poster</span></a></li>
                       
                <li><a href="#chatPage"><span>Recommend Poster</span></a></li>
            </ul>
        </nav>        
        <div class="form">
            <h1>Paper</h1>         
            <h3>Search By Title</h3>  
             <form id="formSearchTitle" class="searchform" action="" method="post">
                    <input class="searchfield"  data-role="none" data-validation-engine="validate[required]" id="inputSearchByTitle" type="text" name="valueSearch"/>
                    <input data-role="none" type="hidden" name="typeSearch" value="title" />
                    <input class="searchbutton" data-role="none" name="title" type="submit" value="Go" />
            </form>
        </div>   

    </section>  
        
        
     <!-- Default Page -->
    <section id="defaultPage">		
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="longTitle"></a></span>
        </header>

        <!-- Poster Bar -->
        <nav class="poster-bar gradWhite">
            <ul>
                <li><a href="/" class="tab-active"><span>Home</span></a></li>       
                <li><a href="#searchPoster" id="navSearchPoster"><span>Search Poster</span></a></li>
                       
                <li><a href="#chatPage"><span>Recommend Poster</span></a></li>
            </ul>
        </nav>        
        <div class="none">
            <h1>Under Construction</h1>
            <h2>Please come back later</h2>            
       </div>     

    </section>      
    
</article>                

<footer>
    <nav class="footer-poster-bar gradBlack">
	<ul>
                <li><a href="http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=www2012-posters-app"><span>About</span></a></li>
                <li><a href="http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=www2012-posters-app#development_team"><span>Development Team</span></a></li>
	</ul>

    </nav>

</footer>

</body>
 </html>