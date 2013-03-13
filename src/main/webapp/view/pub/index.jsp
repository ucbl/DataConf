<article class="poster">
                <section id="search">
                        <header> 
                             <span><a href="${pageContext.request.contextPath}/" class="shortTitle" style="background:url(${sessionScope.logoUri}) no-repeat;"></a></span>
                        </header>

                        <!-- Poster Bar -->
                        <nav class="poster-bar gradWhite">
                            <ul>
                                <li><a href="${pageContext.request.contextPath}/" class="tab-active"><span>Home</span></a></li>       
                                <li><a href="${pageContext.request.contextPath}/" id="navSearchPoster"><span>Search a Publication</span></a></li>
                                       
                                <li><a href="#recommendation"><span>Poster recommendation</span></a></li>
                            </ul>
                        </nav>  
                        
                        <div>                          
                               <h1>Search results</h1>
                               <h3 id="valueSearch">${sessionScope.valueSearch}</h3>
                               <ul id="searchPaperResult" class="list gradWhite">            
                                    <li>Not Found!</li>
                               </ul>
                        </div> 
                </section>
                <section id="recommendation">
                        <header> 
                             <span><a href="${pageContext.request.contextPath}/" class="longTitle" style="background:url(${sessionScope.logoUri}) no-repeat;"></a></span>
                        </header>

                        <!-- Poster Bar -->
                        <nav class="poster-bar gradWhite">
                            <ul>
                                <li><a href="${pageContext.request.contextPath}/" class="tab-active"><span>Home</span></a></li>       
                                <li><a href="${pageContext.request.contextPath}/" id="navSearchPoster"><span>Search a Publication</span></a></li>                                       
                                <li><a href="#recommendation"><span>Poster recommendation</span></a></li>
                            </ul>
                        </nav>  
                        
                        <div>        
                               <h1>Recommendation</h1>
                               <h2>Posters</h2> 
                               <ul id="recommendposterWWW2012" class="list gradWhite">            
                                   <li id="posternotFound">Not Found!</li>
                               </ul>                                                           
                                                    
                               <h2>Papers</h2> 
                               <ul id="recommendpaperWWW2012" class="list gradWhite">            
                                   <li id="papernotFound">Not Found!</li>
                               </ul>                                                           
                          
                        </div> 
                </section>
                <section id="conference">
                    <header> 
                             <span><a href="${pageContext.request.contextPath}/" class="shortTitle" style="background:url(${sessionScope.logoUri}) no-repeat;"></a></span>
                    </header>

                    <!-- Poster Bar -->
                    <nav class="poster-bar gradWhite">
                        <ul>
                            <li><a href="${pageContext.request.contextPath}/" class="tab-active"><span>Home</span></a></li>       
                            <li><a href="${pageContext.request.contextPath}/" id="navSearchPoster"><span>Search a Publication</span></a></li>
                                   
                            <li><a href="#recommendation"><span>Poster recommendation</span></a></li>
                        </ul>
                    </nav>   
                   
                   <div  class="content">
                            <div id="paperNumber"><h1></h1></div>
                            <div id="paperGraph" class="graphViewAS"></div>                                
                            <h2>Title</h2>
                            <div id="paperTitle"></div>

                            <h2>Author</h2>
                            <div id="paperAuthor"> </div>

                            <h2>Keyword</h2>
                            <div id="paperKeyword"> </div>

                            <h2>Abstract</h2>
                            <div id="paperAbstract"></div>
                            
                           <h2 id="LabelPubliEvent">Publication presentation</h2>
                            <div id="paperEvent"></div>

                      
                   </div>            
                </section>

                <section id="person">
                    <header> 
                             <span><a href="${pageContext.request.contextPath}/" class="shortTitle" style="background:url(${sessionScope.logoUri}) no-repeat;"></a></span>
                    </header>

                    <!-- Poster Bar -->
                    <nav class="poster-bar gradWhite">
                        <ul>
                            <li><a href="${pageContext.request.contextPath}/" class="tab-active"><span>Home</span></a></li>       
                            <li><a href="${pageContext.request.contextPath}/" id="navSearchPoster"><span>Search a Publication</span></a></li>
                                   
                            <li><a href="#recommendation"><span>Poster recommendation</span></a></li>
                        </ul>
                    </nav>     
                    
                    <div  class="content">
                        <h1>Author</h1>	
                            <div id="authorGraph" class="graphViewAS"></div> 
                            <h2>Name </h2>
                            <div id="authorName"></div>

                            <h2>Homepage </h2>
                            <div id="authorSite"></div>

                            <h2 id="labelAuthorOrganization">Organization </h2>
                            <div id="authorOrganization"></div>                              

                            <h2 id="labelAuthorPublication">Conference publications</h2>
                            <div id="authorPublication"></div>

                            <h2>Other publications </h2>
                            <div id="authorOtherPublication"></div> 

                            <h2>Co-authors </h2>
                            <div id="authorCoAuthors"></div>                           
                     </div>           
                </section>

                <section id="organization">
                        <header> 
                             <span><a href="${pageContext.request.contextPath}/" class="shortTitle" style="background:url(${sessionScope.logoUri}) no-repeat;"></a></span>
                        </header>

                         <!-- Poster Bar -->
                        <nav class="poster-bar gradWhite">
                            <ul>
                                <li><a href="${pageContext.request.contextPath}/" class="tab-active"><span>Home</span></a></li>       
                                <li><a href="${pageContext.request.contextPath}/" id="navSearchPoster"><span>Search a Publication</span></a></li>
                                       
                                <li><a href="#recommendation"><span>Poster recommendation</span></a></li>
                            </ul>
                       </nav>     
                       
                       <div  class="content">
                           <h1> Organization </h1>		                                
                                <div id="organizationGraph" class="graphViewAS"></div> 
                                <div id="organizationLogo"></div>
                                <h2>Name </h2>
                                <div id="organizationName"></div>                        

                                <h2>Homepage </h2>
                                <div id="organizationSite"></div>
                               
                                <h2>Member </h2>
                                <div id="organizationMember"></div>
                       </div>                  
                </section>

                <section id="conf">	
                       <header> 
                             <span><a href="${pageContext.request.contextPath}/" class="longTitle" style="background:url(${sessionScope.logoUri}) no-repeat;"></a></span>
                        </header>

                         <!-- Poster Bar -->
                        <nav class="poster-bar gradWhite">
                            <ul>
                                <li><a href="${pageContext.request.contextPath}/" class="tab-active"><span>Home</span></a></li>       
                                <li><a href="${pageContext.request.contextPath}/" id="navSearchPoster"><span>Search a Publication</span></a></li>
                                       
                                <li><a href="#recommendation"><span>Poster recommendation</span></a></li>
                            </ul>
                       </nav>    
                       
                       <div  class="content">
                           <h1>Conference publication</h1>			
                                <div id="confPublicationGraph" class="graphViewAS"></div>
                                <h2>Title </h2>
                                <div id="confPublicationTitle"></div>

                                <h2>Url </h2>
                                <div id="confPublicationUrl"></div>

                                <h2>Year </h2>
                                <div id="confPublicationYear"></div>

                                <h2>Authors </h2>
                                <div id="confPublicationAuthor"></div>

                                <h2>Conference </h2>
                                <div id="confPublicationConference"></div>

                                <h2>Publisher </h2>
                                <div id="confPublicationPublisher"></div>
                          </div>      
                </section>

                <section id="journals">
                        <header> 
                             <span><a href="${pageContext.request.contextPath}/" class="longTitle" style="background:url(${sessionScope.logoUri}) no-repeat;"></a></span>
                        </header>

                         <!-- Poster Bar -->
                        <nav class="poster-bar gradWhite">
                            <ul>
                                <li><a href="${pageContext.request.contextPath}/" class="tab-active"><span>Home</span></a></li>       
                                <li><a href="${pageContext.request.contextPath}/" id="navSearchPoster"><span>Search a Publication</span></a></li>
                                       
                                <li><a href="#recommendation"><span>Poster recommendation</span></a></li>
                            </ul>
                       </nav>                         
                       <div  class="content">
                          <h1>Journal publication</h1>		
                                <div id="journalPublicationGraph" class="graphViewAS"></div>
                                <h2>Publication </h2>
                                <div id="journalPublicationTitle"></div>

                                <h2>Url </h2>
                                <div id="journalPublicationUrl"></div>

                                <h2>Year </h2>
                                <div id="journalPublicationYear"></div>

                                <h2>Authors </h2>
                                <div id="journalPublicationAuthor"></div>

                                <h2>Journal </h2>
                                <div id="journalPublicationJournal"></div>				
                      </div>            
                </section>
    
                 <section id="topicDetail">	
                       <header> 
                             <span><a href="${pageContext.request.contextPath}/" class="longTitle" style="background:url(${sessionScope.logoUri}) no-repeat;"></a></span>
                        </header>

                         <!-- Poster Bar -->
                        <nav class="poster-bar gradWhite">
                            <ul>
                                <li><a href="${pageContext.request.contextPath}/" class="tab-active"><span>Home</span></a></li>       
                                <li><a href="${pageContext.request.contextPath}/" id="navSearchPoster"><span>Search a Publication</span></a></li>
                                       
                                <li><a href="#recommendation"><span>Poster recommendation</span></a></li>
                            </ul>
                       </nav>  
                     <div  class="content">
                     
                          
                      <h1> Topic </h1>	
                      
                                <h2> Label </h2>
                                <div id="topicLabel"></div>

                                <h2> Publication </h2>
                                <div id="topicPublication"></div>
                     </div>           
                 </section>
                 <section id="keyword">	
                      <header> 
                             <span><a href="${pageContext.request.contextPath}/" class="shortTitle" style="background:url(${sessionScope.logoUri}) no-repeat;"></a></span>
                      </header>

                      <!-- Poster Bar -->
                      <nav class="poster-bar gradWhite">
                        <ul>
                            <li><a href="${pageContext.request.contextPath}/" class="tab-active"><span>Home</span></a></li>       
                            <li><a href="${pageContext.request.contextPath}/" id="navSearchPoster"><span>Search a Publication</span></a></li>
                                   
                            <li><a href="#recommendation"><span>Poster recommendation</span></a></li>
                        </ul>
                      </nav>
                      <div  class="content">                                                                   
                                <h1> Keyword </h1>	                      
                                    <h2> Keyword </h2>
                                    <div id="keywordLabel"></div>
                                    <h2> Conference publications </h2>
                                    <div id="keywordPublication"></div>
                                    <h2> Equivalent keywords </h2>
                                    <div id="equiKeyword"></div>   
                                    <h2> More specific Keywords </h2>
                                    <div id="subKeyword"></div>   
                                    <h2> Upper level keywords </h2>
                                    <div id="upperKeyword"></div>   
                      </div>            
                 </section>
                 <section id="graph">	
                        <header> 
                             <span><a href="${pageContext.request.contextPath}/" class="shortTitle" style="background:url(${sessionScope.logoUri}) no-repeat;"></a></span>
                        </header>

                         <!-- Poster Bar -->
                        <nav class="poster-bar gradWhite">
                            <ul>
                                <li><a href="${pageContext.request.contextPath}/" class="tab-active"><span>Home</span></a></li>       
                                <li><a href="${pageContext.request.contextPath}/" id="navSearchPoster"><span>Search a Publication</span></a></li>
                                       
                                <li><a href="#recommendation"><span>Poster recommendation</span></a></li>
                            </ul>
                       </nav> 
                      
                      <div  class="content">
                          <h1> Graph </h1>	                                                      
                                <div id="viewAsText"></div>                                
                                <div id="currentNode"></div>                                
                                <div id="infovis"></div>                                                                                                                                
                      </div>
                 </section>
                 <section id="workshopDetail">	
                        <header> 
                                <span><a href="${pageContext.request.contextPath}/" class="shortTitle" style="background:url(${sessionScope.logoUri}) no-repeat;"></a></span>
                        </header>

                        <!-- Poster Bar -->
                        <nav class="poster-bar gradWhite">
                            <ul>
                                <li><a href="${pageContext.request.contextPath}/" class="tab-active"><span>Home</span></a></li>       
                                <li><a href="${pageContext.request.contextPath}/" id="navSearchPoster"><span>Search a Publication</span></a></li>

                                <li><a href="#recommendation"><span>Poster recommendation</span></a></li>
                            </ul>
                        </nav>   

                    <div  class="content">
                                <div id="paperNumber"><h1></h1></div>
                                <div id="graphPoster" class="graphViewAS"></div>                                
                                <h2>Title</h2>
                                <div id="paperTitle"></div>

                                <h2>Author</h2>
                                <div id="paperAuthor"> </div>

                                <h2>Keyword</h2>
                                <div id="paperKeyword"> </div>

                                <h2>Abstract</h2>
                                <div id="paperAbstract"></div>
                    </div>            
                 </section>               
                 <div style="clear:both;"></div>   
                  
</article>

   