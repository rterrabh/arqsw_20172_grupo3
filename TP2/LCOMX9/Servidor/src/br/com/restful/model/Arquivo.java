package br.com.restful.model;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Arquivo {
	  private String path;
	  private String code;
	  private int numLinhas;

	    public Arquivo(String path) {
	        this.path = path;
	        this.code = "";
	        this.numLinhas = 0;
	        LerArquivo();
	    }
	    
	    
	    public void LerArquivo()
	    {
	        try{
	            BufferedReader br = new BufferedReader(new FileReader(path));
	            while(br.ready()){
	            String linha = br.readLine();
	            this.code = code.concat(linha+"\n");
	            this.numLinhas++;
	        }
	            br.close();
	        }catch(IOException ioe){
	            ioe.printStackTrace();
	        }
	    }
	    
	    public ArrayList<Linha> BuscarTexto(String busca){
	        
	        ArrayList<Linha> ret = new ArrayList<>();
	        
	        try{
	            BufferedReader br = new BufferedReader(new FileReader(path));
	            int numLinha = 1;
	            while(br.ready()){
	                String textoLinha = br.readLine();
	                if(textoLinha.contains(busca))
	                {
	                    Linha linha = new Linha(textoLinha, numLinha, path);
	                    ret.add(linha);
	                }
	                numLinha++;
	            }
	            br.close();
	        }catch(IOException ioe){
	            ioe.printStackTrace();
	        }
	        
	        return ret;
	    }

	    public void setPath(String path)
	    {
	    	this.path = path;
	    }
	    
	    public String getPath() {
	        return path;
	    }
}
