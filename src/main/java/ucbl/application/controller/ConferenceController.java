/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package ucbl.application.controller;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletContext;
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
public class ConferenceController extends HttpServlet {

    public String url;
    public String userPath;

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
          
    	System.out.println("ConferenceController");
    	
    	ServletContext context = getServletContext();
    	HttpSession session = request.getSession();
    	
		ConferencesManager conferencesManager = ConferencesManager.getInstance();
		
		//Catch the first one (there is only one for the moment
		Conference currentConf = conferencesManager.getConferenceByName(request.getParameter("name"));
		
		session.setAttribute("tracksList",currentConf.getTrackList());
		session.setAttribute("baseUri",currentConf.getBaseUri());
		session.setAttribute("confId",currentConf.getConfId());
		session.setAttribute("confName",currentConf.getName());
		session.setAttribute("logoUri",currentConf.getLogoUri());

		System.out.println("\n*****************CONFERENCE*****************");
		System.out.println("Name : "+ currentConf.getName());
		System.out.println("baseUri :"+ currentConf.getBaseUri());
		System.out.println("confId :"+ currentConf.getConfId());
		System.out.println("baseUri :"+ currentConf.getBaseUri());
		System.out.println("logoUri :"+ currentConf.getLogoUri());
		System.out.println("********************************************");
		
		String url = "/Conference.jsp";
		
		request.getRequestDispatcher(url).forward(request, response);
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
