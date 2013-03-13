<%-- 
    Document   : error
    Created on : 29 janv. 2012, 13:13:14
    Author     : NGUYEN
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!doctype html>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!-- javaee-api and jstl 1.2 -->
<html  xmlns:c="http://java.sun.com/jsp/jstl/core">
    <head>
                  
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            <title>www2012 - The Posters</title>
            <!-- CSS & JQUERYMOBILE -->                        
            <link rel="stylesheet" href="${pageContext.request.contextPath}/css/styles.css" type="text/css">            
            <link rel="stylesheet" href="${pageContext.request.contextPath}/css/jquery.mobile.css" type="text/css">            
            <c:if test="${path != '/paper/search'}">
            <link rel="stylesheet" href="${pageContext.request.contextPath}/css/jquery-ui.css" type="text/css">
            </c:if>           
            <!-- CDN JQUERY & JQUERYMOBILE -->                                  
            <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>            
            <script src="http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.js"></script>           
            <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js" type="text/javascript"></script>                                                                                                    
    </head>
<body>

<header data-role="none"> 
     <span><a rel="home" title="www2012" href="${pageContext.request.contextPath}/" class="banner"></a></span>
</header>
<nav data-role="navbar" id="navigationbar">
    <ul>
        <li><a href="${pageContext.request.contextPath}/" class="ui-btn-active">Home</a></li>
        <li><a href="${pageContext.request.contextPath}/#scan">Scan QRcode</a></li>
        <li><a href="${pageContext.request.contextPath}/#searchPoster" id="navSearchPoster">Search Poster</a></li>
        <li><a href="${pageContext.request.contextPath}/#searchAuthor">Search Author</a></li>       
        <li><a href="#">Chat</a></li>
    </ul>
</nav>   
<session id="container" data-role="content">
    <h2>Page not found!</h2>
</session>	
        
<footer data-role="footer">
    <nav data-role="navbar" id="navigationfoot">
	<ul>
		<li><a href="#">Credits</a></li>
		<li><a href="#">The development team</a></li>
		<li><a href="#">Legal Notice</a></li>
	</ul>
    </nav>
</footer>


</body>
 </html>        