<article id="index">
     <section id="home">   
        <header> 
            <span><a href="${pageContext.request.contextPath}/" class="longTitle">DataConf</a></span>
        </header>
        <div class="none">
            <h1></h1> 
            <h2 style="text-align: center">Welcome to the DataConf application</h2>
            <h3 style="text-align: center">Choose the conference you want to search in : </h3>
               <ul  class="list gradWhite">                                
  					<c:forEach var="conference" items="${applicationScope.conferencesList}">
                   		 <li><a href="conference?name=${conference.name}" class="conference" data-controller="${conference.name}"  id="${conference.name}">${conference.name}</a></li>
					</c:forEach> 
					
               </ul>
        </div>     
    </section>
</article>