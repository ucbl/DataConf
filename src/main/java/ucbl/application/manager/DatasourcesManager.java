package ucbl.application.manager;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;


import ucbl.application.model.Datasource;
import ucbl.application.model.DatasourcesLibrary;

public class DatasourcesManager {
	
	private static DatasourcesManager instance;
	private  ArrayList<Datasource> listDatasources;
	private static final String CONFIGURATIONS = "config.xml";
	
	
	public DatasourcesManager(){
   	 
		
		try{	
			
			URL fileURL = getClass().getClassLoader().getResource("/"+this.CONFIGURATIONS);
			File configFile = new File(fileURL.getFile());
			
			
			// create JAXB context and instantiate unmarshaller
			JAXBContext context = JAXBContext.newInstance(DatasourcesLibrary.class);
			Unmarshaller um = context.createUnmarshaller();
			DatasourcesLibrary datasourceLib= (DatasourcesLibrary) um.unmarshal(configFile);
			this.listDatasources = datasourceLib.getListDatasources();
			
			
		}catch (Exception e){
			e.printStackTrace();
		}
     }
	
	public static DatasourcesManager getInstance(){
		if(instance == null){
		       instance = new DatasourcesManager();             
        }  
        return instance;
	}

	public ArrayList<Datasource> getListDatasources() {
		return listDatasources;
	}

	public void setListDatasources(ArrayList<Datasource> listDatasources) {
		this.listDatasources = listDatasources;
	}
	
	
	public Datasource getDatasourceByName(String name){
		Datasource temp = null;
		for(int i = 0; i < listDatasources.size(); i++){
			if(listDatasources.get(i).getName().equals(name)){
				temp = listDatasources.get(i);
			}
		}
		return temp;
	}
	
	

	
}
