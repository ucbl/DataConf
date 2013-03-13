package ucbl.application.model;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "configuration")
public class DatasourcesLibrary {

	@XmlElementWrapper(name = "datasources")
	@XmlElement(name = "datasource", required = true)
	private ArrayList<Datasource> listDatasources;

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
