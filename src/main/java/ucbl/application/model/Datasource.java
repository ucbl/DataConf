package ucbl.application.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "datasource")
public class Datasource {

	@XmlAttribute(required = true)
    private String name;
	
	@XmlElement(required = true)
    private String serviceUri;
	
	@XmlElement(required = true)
    private String sparqlVersion;
	
	@XmlElement(required = true)
    private String managerName;
	
	@XmlElement(required = true)
    private String method;
	
	@XmlElement(required = true)
    private String dataType;
	
	@XmlElement(required = true)
    private String corsEnable;

	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getServiceUri() {
		return serviceUri;
	}

	public void setServiceUri(String serviceUri) {
		this.serviceUri = serviceUri;
	}

	public String getSparqlVersion() {
		return sparqlVersion;
	}

	public void setSparqlVersion(String sparqlVersion) {
		this.sparqlVersion = sparqlVersion;
	}

	public String getManagerName() {
		return managerName;
	}

	public void setManagerName(String managerName) {
		this.managerName = managerName;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getCorsEnable() {
		return corsEnable;
	}

	public void setCorsEnable(String corsEnable) {
		this.corsEnable = corsEnable;
	}
	
	
}
