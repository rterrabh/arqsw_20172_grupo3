package avaliadordearquiteturaemcamadas.BuscaArquivos;

import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;

public class Diretorio extends SimpleFileVisitor<Path>{
 
    private ArrayList<String> arquivos;
    private ArrayList<Classe> classes;
    private boolean imprimirDiretorio;
    
    public Diretorio() {
        arquivos = new ArrayList<>();
        classes = new ArrayList<>();
        imprimirDiretorio = false;
    }
    
    @Override
    public FileVisitResult visitFile(Path path, BasicFileAttributes fileAttributes){

        if(GetExtension(path.toString()).equals("java")){
            if(imprimirDiretorio)
                System.out.println("Nome do arquivo:" + path.getFileName());
            arquivos.add(path+"");
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

    public ArrayList<String> getArquivos() {
        return arquivos;
    }

    public void setArquivos(ArrayList<String> arquivos) {
        this.arquivos = arquivos;
    }

    public boolean isImprimirDiretorio() {
        return imprimirDiretorio;
    }

    public void setImprimirDiretorio(boolean imprimirDiretorio) {
        this.imprimirDiretorio = imprimirDiretorio;
    }

    public ArrayList<Classe> getClasses() {
        return classes;
    }

    public void setClasses(ArrayList<Classe> classes) {
        this.classes = classes;
    }
    
    
}