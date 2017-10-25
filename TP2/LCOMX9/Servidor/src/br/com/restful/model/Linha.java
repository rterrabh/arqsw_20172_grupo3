package br.com.restful.model;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Linha {
	 private String texto;
	    private int numLinha;
	    private String diretorio;

	    public Linha(String texto, int numLinha, String diretorio) {
	        this.texto = texto;
	        this.numLinha = numLinha;
	        this.diretorio = diretorio;
	    }

	    public String getTexto() {
	        return texto;
	    }

	    public void setTexto(String texto) {
	        this.texto = texto;
	    }

	    public int getNumLinha() {
	        return numLinha;
	    }

	    public void setNumLinha(int numLinha) {
	        this.numLinha = numLinha;
	    }

	    public String getDiretorio() {
	        return diretorio;
	    }

	    public void setDiretorio(String diretorio) {
	        this.diretorio = diretorio;
	    }
}
