package ucbl.application.model;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/** This class is used to link all the elements refering to the conference node in the configuration file**/
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "Conference")
public class Conference {
	
	@XmlAttribute(required = true)
    private String name;
	
	@XmlElement(required = true)
    private String logoUri;
	
	@XmlElement(name = "baseUri", required = true)
	private String baseUri;
	
	@XmlElement(name = "confId", required = true)
	private String confId;
	
	@XmlElementWrapper(name = "tracks")
	@XmlElement(name = "track", required = true)
	private ArrayList<Track> trackList;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLogoUri() {
		return logoUri;
	}

	public void setLogoUri(String logoUri) {
		this.logoUri = logoUri;
	}

	public String getBaseUri() {
		return baseUri;
	}

	public void setBaseUri(String baseUri) {
		this.baseUri = baseUri;
	}

	public String getConfId() {
		return confId;
	}

	public void setConfId(String confId) {
		this.confId = confId;
	}

	public ArrayList<Track> getTrackList() {
		return trackList;
	}

	public void setTrackList(ArrayList<Track> trackList) {
		this.trackList = trackList;
	}
	
	
	

	
	
	
}
