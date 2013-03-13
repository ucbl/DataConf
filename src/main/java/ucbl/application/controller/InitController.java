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

import ucbl.application.manager.ConferencesManager;
import ucbl.application.manager.DatasourcesManager;
import ucbl.application.model.Conference;
import ucbl.application.model.Track;





/**
 * 
 * @author Florian BACLE
 */
public class InitController extends HttpServlet {


	/**
	 * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
	 * methods.
	 * 
	 * @param request
	 *            servlet request
	 * @param response
	 *            servlet response
	 * @throws ServletException
	 *             if a servlet-specific error occurs
	 * @throws IOException
	 *             if an I/O error occurs
	 */
	protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
			String userPath = request.getServletPath();
			System.out.println("InitController");
	        System.out.println("path:"+userPath);
			
			if ((userPath.equals("/init"))) {
				
				
				 ServletContext context = getServletContext();
				
				
				ConferencesManager conferencesManager = ConferencesManager.getInstance();
				

				context.setAttribute("conferencesList",conferencesManager.getListConference());
				
			

				
				//Handle the Datasources configurations
				DatasourcesManager datasourcesManager =  DatasourcesManager.getInstance();
							
				context.setAttribute("conferenceDatasource",datasourcesManager.getDatasourceByName("conferenceDatasource"));
				context.setAttribute("publicationDatasource",datasourcesManager.getDatasourceByName("publicationDatasource"));
				context.setAttribute("webDatasource",datasourcesManager.getDatasourceByName("webDatasource"));
				context.setAttribute("eventDatasource",datasourcesManager.getDatasourceByName("eventDatasource"));
						
				System.out.println("\n*****************DATASOURCE*****************");
				System.out.println("conference :"+ datasourcesManager.getDatasourceByName("conferenceDatasource").getServiceUri());
				System.out.println("publicationDatasource :"+ datasourcesManager.getDatasourceByName("publicationDatasource").getServiceUri());
				System.out.println("webDatasource :"+ datasourcesManager.getDatasourceByName("webDatasource").getServiceUri());
				System.out.println("eventDatasource :"+ datasourcesManager.getDatasourceByName("eventDatasource").getServiceUri());
				
				request.getRequestDispatcher("Home.jsp").forward(request, response);
				
			} else {

				request.getRequestDispatcher(userPath).forward(request, response);
			}

			
	}

	// <editor-fold defaultstate="collapsed"
	// desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
	/**
	 * Handles the HTTP <code>GET</code> method.
	 * 
	 * @param request
	 *            servlet request
	 * @param response
	 *            servlet response
	 * @throws ServletException
	 *             if a servlet-specific error occurs
	 * @throws IOException
	 *             if an I/O error occurs
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		processRequest(request, response);
	}

	/**
	 * Handles the HTTP <code>POST</code> method.
	 * 
	 * @param request
	 *            servlet request
	 * @param response
	 *            servlet response
	 * @throws ServletException
	 *             if a servlet-specific error occurs
	 * @throws IOException
	 *             if an I/O error occurs
	 */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		processRequest(request, response);
	}




}
