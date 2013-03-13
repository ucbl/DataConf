package ucbl.application.manager;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;

import ucbl.application.model.Conference;
import ucbl.application.model.ConferencesLibrary;
import ucbl.application.model.Datasource;



public class ConferencesManager {
	
	private static ConferencesManager instance;
	private  ArrayList<Conference> listConferences;
	private static final String CONFIGURATIONS = "config.xml";
	
	/** Constructeur du ConferenceManager qui gère la génération des classes encapsulants les champs du fichier xml précisé concernant la conférence**/
	public ConferencesManager(){
    	 

		try{	
			
			URL fileURL = getClass().getClassLoader().getResource("/"+this.CONFIGURATIONS);
			File configFile = new File(fileURL.getFile());
			
			
			// create JAXB context and instantiate unmarshaller
			JAXBContext context = JAXBContext.newInstance(ConferencesLibrary.class);
			Unmarshaller um = context.createUnmarshaller();
			ConferencesLibrary confLib= (ConferencesLibrary) um.unmarshal(configFile);
			this.listConferences = confLib.getListConferences();
			
		}catch (Exception e){
			e.printStackTrace();
		}
     }
	
	public static ConferencesManager getInstance(){
		if(instance == null){
		       instance = new ConferencesManager();             
        }  
        return instance;
	}

	public ArrayList<Conference> getListConference() {
		return listConferences;
	}

	public void setListConference(ArrayList<Conference> listConference) {
		this.listConferences = listConference;
	}
	
	
	public Conference getConferenceByName(String name){
		Conference temp = null;
		for(int i = 0; i < listConferences.size(); i++){
			if(listConferences.get(i).getName().equals(name)){
				temp = listConferences.get(i);
			}
		}
		return temp;
	}
	
	
}
