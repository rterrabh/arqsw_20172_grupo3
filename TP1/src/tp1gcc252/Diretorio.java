package tp1gcc252;

import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;

public class Diretorio extends SimpleFileVisitor<Path>{
 
    private ArrayList<String> arquivos;
    
    public Diretorio() {
        arquivos = new ArrayList<>();
    }
    
    
    public FileVisitResult visitFile(Path path, BasicFileAttributes fileAttributes){

        if(GetExtension(path.toString()).equals("cs")){
            //System.out.println("Nome do arquivo:" + path.getFileName());
            arquivos.add(path+"");
        }
        
        return FileVisitResult.CONTINUE;
    }
    
    public FileVisitResult preVisitDirectory(Path path, BasicFileAttributes fileAttributes){
        //System.out.println("----------Nome do diretório:" + path + "----------");
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
}
