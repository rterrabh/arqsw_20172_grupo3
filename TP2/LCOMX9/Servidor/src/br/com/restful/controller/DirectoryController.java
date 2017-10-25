package br.com.restful.controller;

import java.io.IOException;
import java.nio.file.*;

import br.com.restful.model.Diretorio;

public class DirectoryController {
	
	public Diretorio diretorio(String path)
	{
    	Path arquivos = Paths.get(path);
    	Diretorio diretorio = new Diretorio();
    	
		try {
            Files.walkFileTree(arquivos, diretorio);
        } catch (IOException e) {
            e.printStackTrace();
        }
		
		return diretorio;
	}
	
}
