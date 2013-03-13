<article wwww2012="index">

     <section id="home">   

        <header> 
            <span><a href="${pageContext.request.contextPath}/" class="longTitle" style="background:url(${applicationScope.logoUri}) no-repeat;"></a></span>
        </header>

        <div class="none">
            <h1>${applicationScope.confName} Publications</h1> 
            <h2 style="text-align: center">Welcome to the ${applicationScope.confName} poster track mobile app</h2>
            <h3 style="text-align: center">From here, you can:</h3>
               <ul  class="list gradWhite">                                
                         <li><a href="scan" >Scan a QRcode</a></li>    
                   		 <li><a href="#searchPaper" class="event" data-controller="${applicationScope.tracksList[0].controller}"  id="${applicationScope.tracksList[0].trackId}">${applicationScope.tracksList[0].name}</a></li>
						 <li><a href="#searchByTrack" >Search by track</a></li>
					
               </ul>
        </div>     
    </section>
    
    <!-- Search a publication  By Track -->
    <section id="searchByTrack">
        <header>
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle" style="background:url(${sessionScope.confConfig.logoUri}) no-repeat;"></a></span>
        </header>
        <div class="none">
            <h1></h1>
            <ul class="list gradWhite">
                     <c:forEach var="track" items="${applicationScope.tracksList}">
                   		 <li><a href="#searchPaper" class="event" data-controller="${track.controller}"  id="${track.trackId}">${track.name}</a></li>
					</c:forEach> 
            </ul>
        </div>
    </section>   
    
	
  
    <!-- Search a publication  by Author,by Keyword,by Title... -->
    <section id="searchPaper">
        <header>
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle" style="background:url(${applicationScope.logoUri}) no-repeat;"></a></span>
        </header>
        <div class="none">
            <h1 class="searchTrack"></h1>
            <ul class="list gradWhite">
                       
                        <li><a href="#searchByAuthor"  data-transition="slide">Search By Author</a></li>
                        <li><a href="#searchByKeyword" data-transition="slide">Search By Keyword</a></li>
                        <li><a href="#searchByNumber"   data-transition="slide">Search By Number</a></li>
                        <li><a href="#searchByTitle"   data-transition="slide">Search By Title</a></li>
            </ul>
        </div>
    </section> 
       <!-- Search a publication  By Number -->
    <section id="searchByNumber">		
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle" style="background:url(${applicationScope.logoUri}) no-repeat;"></a></span>
        </header>
        <!-- Publication Bar -->
        <nav class="poster-bar gradWhite">
            <ul>
                <li><a href="/" class="tab-active"><span>Home</span></a></li>       
                <li><a href="#searchPoster" id="navSearchPoster"><span>Search Poster</span></a></li>
                       
                <li><a href="#chatPage"><span>Recommend Poster</span></a></li>
            </ul>
        </nav>            
        <div class="form">
               <h1 class="searchTrack"></h1> 
               <h3>Search By Number</h3>  

               <form action="pub" class="searchform" id="formSearchNumber" method="post">           
                    <input class="searchfield"  data-role="none" data-validation-engine="validate[required,custom[integer]]" id="inputSearchByNumber" type="text" name="idPaper"/>    
                    <input data-role="none" type="hidden" name="typeSearch" value="" />
                    <input class="searchbutton" data-role="none" name="number" type="submit" value="Go" />
               </form>  
          </div>    
    </section>    
        
     <!-- Search a publiation By Author-->
    <section id="searchByAuthor">
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle" style="background:url(${applicationScope.logoUri}) no-repeat;"></a></span>
        </header>
        <!-- Publication Bar -->
        <nav class="poster-bar gradWhite">
            <ul>
                <li><a href="/" class="tab-active"><span>Home</span></a></li>       
                <li><a href="#searchPoster" id="navSearchPoster"><span>Search Poster</span></a></li>                       
                <li><a href="#chatPage"><span>Recommend Poster</span></a></li>
            </ul>
        </nav>         
        <div class="form">
            <h1 class="searchTrack"></h1>
            <h3>Search By Author</h3>
            <form action="/index.html" id="formSearchAuthor" class="searchform"   method="post">
                    <input class="searchfield"  data-role="none" data-validation-engine="validate[required]" id="inputSearchByAuthor" type="text" name="valueSearch"/>
                    <input data-role="none" type="hidden" name="typeSearch" value="" />
                    <input class="searchbutton" data-role="none" name="author" type="submit" value="Go" />
            </form>
       </div>        
    </section>                    


    <!-- Search a publiation By Keyword  -->
    <section id="searchByKeyword">
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle" style="background:url(${applicationScope.logoUri}) no-repeat;"></a></span>
        </header>
        <!-- Publication Bar -->
        <nav class="poster-bar gradWhite">
            <ul>
                <li><a href="/" class="tab-active"><span>Home</span></a></li>       
                <li><a href="#searchPoster" id="navSearchPoster"><span>Search Poster</span></a></li>
                       
                <li><a href="#chatPage"><span>Recommend Poster</span></a></li>
            </ul>
        </nav>        
        <div class="form">
            <h1 class="searchTrack"></h1> 
            <h3>Search By Keyword</h3>  
            <form action="/index.html" id="formSearchKeyword" class="searchform"  method="post">
                    <input class="searchfield"  data-role="none" data-validation-engine="validate[required,custom[onlyLetterSp]]" id="inputSearchByKeyword" type="text" name="valueSearch"/>
                    <input data-role="none" type="hidden" name="typeSearch" value="" />
                    <input class="searchbutton" data-role="none" name="keyword" type="submit" value="Go" />
            </form>

        </div>                 
    </section>
   

    <!-- Search a publiation By Title -->
    <section id="searchByTitle">
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="shortTitle" style="background:url(${applicationScope.logoUri}) no-repeat;"></a></span>
        </header>
        <!-- Publication Bar -->
        <nav class="poster-bar gradWhite">
            <ul>
                <li><a href="/" class="tab-active"><span>Home</span></a></li>       
                <li><a href="#searchPoster" id="navSearchPoster"><span>Search Poster</span></a></li>
                       
                <li><a href="#chatPage"><span>Recommend Poster</span></a></li>
            </ul>
        </nav>        
        <div class="form">
            <h1 class="searchTrack"></h1>         
            <h3>Search By Title</h3>  
             <form action="/index.html" id="formSearchTitle" class="searchform"  method="post">
                    <input class="searchfield"  data-role="none" data-validation-engine="validate[required]" id="inputSearchByTitle" type="text" name="valueSearch"/>
                    <input data-role="none" type="hidden" name="typeSearch" value="title" />
                    <input class="searchbutton" data-role="none" name="title" type="submit" value="Go" />
            </form>
        </div>   

    </section>  
        
   
        
        
     <!-- Default Page -->
    <section id="defaultPage">		
        <header> 
             <span><a href="${pageContext.request.contextPath}/" class="longTitle" style="background:url(${applicationScope.logoUri}) no-repeat;"></a></span>
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
