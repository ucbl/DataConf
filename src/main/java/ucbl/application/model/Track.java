package ucbl.application.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;


@XmlAccessorType(XmlAccessType.FIELD)
public class Track {
	
	 @XmlElement(required = true)
     private String name;
	 @XmlElement(required = true)
     private String controller;
	 @XmlElement(required = true)
     private String trackId;
	 
	 public Track(){
	 }
	 
	 public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getController() {
		return controller;
	}
	public void setController(String controller) {
		this.controller = controller;
	}
	public String getTrackId() {
		return trackId;
	}
	public void setUri(String uri) {
		this.trackId = uri;
	}
	
	 
	 
}
