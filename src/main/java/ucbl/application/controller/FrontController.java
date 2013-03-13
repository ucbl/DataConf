/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package ucbl.application.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import ucbl.application.manager.ConferencesManager;
import ucbl.application.model.Conference;


/**
 *
 * @author NGUYEN
 */
public class FrontController extends HttpServlet {

    public String url;
    public String userPath;
    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
          	
    }

    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	System.out.println("FrontController");
    	
    	HttpSession session = request.getSession();
		userPath = request.getServletPath();
		session.setAttribute("path",userPath);
		
		ConferencesManager conferencesManager = ConferencesManager.getInstance();
		
		//Catch the first one (there is only one for the moment
		Conference currentConf = conferencesManager.getConferenceByName(request.getParameter("conferenceSearch"));
		
		session.setAttribute("confName",currentConf.getName());
		session.setAttribute("logoUri",currentConf.getLogoUri());
		
		session.setAttribute("typeSearch",request.getParameter("typeSearch"));  
		session.setAttribute("valueSearch",request.getParameter("valueSearch"));      
		
		System.out.println(" dans search -conference :"+ request.getParameter("conferenceSearch")  +" typeSearch :" +request.getParameter("typeSearch") + " valueSearch: " +request.getParameter("valueSearch") );                                      
		
		String url = "/view/pub/index.jsp";
		
		request.getRequestDispatcher(url).forward(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
    
   
    
    
}
