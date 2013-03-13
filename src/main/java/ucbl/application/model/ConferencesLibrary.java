package ucbl.application.model;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;


@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "configuration")
public class ConferencesLibrary {

	@XmlElementWrapper(name = "conferences")
	@XmlElement(name = "conference", required = true)
	private ArrayList<Conference> listConferences;

	public ArrayList<Conference> getListConferences() {
		return listConferences;
	}

	public void setListConferences(ArrayList<Conference> listConferences) {
		this.listConferences = listConferences;
	}


}
