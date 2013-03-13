package ucbl.application.filter;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;

/** Permet de filtrer les demandes pour envoyer sur initController et charger les configurations si on lance la page d'accueil mappée à "/" **/
public class InitFilter implements javax.servlet.Filter {
  public FilterConfig filterConfig;                               

  public void doFilter(final ServletRequest request, final ServletResponse response,FilterChain chain) throws java.io.IOException, javax.servlet.ServletException { 
	       
	  HttpServletRequest req = (HttpServletRequest) request;
	  String userPath = req.getRequestURI();
	  System.out.print("Filter : ");
	  System.out.println(userPath);

	  if(userPath.endsWith("/")){
		  //Forward to the init controller
		  request.getRequestDispatcher("/init").forward(request, response);
		  return;
	  }else{
		  //Forward to the front controller
		  request.getRequestDispatcher("/index.html").forward(request, response);
	  }
    
  } 

  public void init(final FilterConfig filterConfig) {               
	  this.filterConfig = filterConfig;
  } 

  public void destroy() {                                    
  }
}
