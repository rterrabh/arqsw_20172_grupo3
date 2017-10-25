package br.com.restful.model;

import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Diretorio extends SimpleFileVisitor<Path>{
	 private ArrayList<Arquivo> arquivos;
	    private boolean imprimirDiretorio;
	    
	    public Diretorio() {
	        arquivos = new ArrayList<>();
	        imprimirDiretorio = false;
	    }
	    
	    @Override
	    public FileVisitResult visitFile(Path path, BasicFileAttributes fileAttributes){

	    	if(!path.toString().contains(".min.js")){	    		
		        if(GetExtension(path.toString()).equals("js")){
		            if(imprimirDiretorio)
		                System.out.println("Nome do arquivo:" + path.getFileName());
	
		            arquivos.add(new Arquivo(path.toString()));
		        }
	        }
	        
	        return FileVisitResult.CONTINUE;
	    }
	    
	    @Override
	    public FileVisitResult preVisitDirectory(Path path, BasicFileAttributes fileAttributes){
	        if(imprimirDiretorio)
	            System.out.println("---------- Nome do diretório:" + path + " ----------");
	        return FileVisitResult.CONTINUE;
	    }
	    
	    private String GetExtension(String path)
	    {
	        int i = path.lastIndexOf('.');
	        if (i > 0) {
	            return path.substring(i+1);
	        }
	        
	        return "";
	    }

	    public ArrayList<Arquivo> getArquivos() {
	        return arquivos;
	    }

	    public void setArquivos(ArrayList<Arquivo> arquivos) {
	        this.arquivos = arquivos;
	    }

	    public boolean isImprimirDiretorio() {
	        return imprimirDiretorio;
	    }

	    public void setImprimirDiretorio(boolean imprimirDiretorio) {
	        this.imprimirDiretorio = imprimirDiretorio;
	    }
}
