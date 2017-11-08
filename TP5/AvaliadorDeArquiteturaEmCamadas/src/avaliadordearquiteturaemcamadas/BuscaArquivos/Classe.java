package avaliadordearquiteturaemcamadas.BuscaArquivos;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


public class Classe {

    private String path;
    private List<String> dependencias;
    private String packageOfClass;

    public Classe(String path) {
        this.path = path;
        this.dependencias = new ArrayList<>();
    }
    
    public void LerLinha()
    {
        try{
            BufferedReader br = new BufferedReader(new FileReader(path));
            while(br.ready()){
            String linha = br.readLine();
            System.out.println(linha);
        }
            br.close();
        }catch(IOException ioe){
            ioe.printStackTrace();
        }
    }
    
    public ArrayList<String> BuscarTexto(String busca){
        
        ArrayList<String> ret = new ArrayList<>();
        
        try{
            BufferedReader br = new BufferedReader(new FileReader(path));
            while(br.ready()){
                String linha = br.readLine();
                if(linha.contains(busca))
                    ret.add(linha);
            }
            br.close();
        }catch(IOException ioe){
            ioe.printStackTrace();
        }
        
        return ret;
    }

    public String getPath() {
        return path;
    }

    public void setPackageOfClass(String packageOfClass) {
        String[] split = packageOfClass.split("package");
        this.packageOfClass = split[1];
    }
    
    public String getPackageOfClass() {
        return packageOfClass;
    }

    public List<String> getDependencias() {
        return dependencias;
    }

    public void setDependencias(List<String> dependencias) {
        this.dependencias = dependencias;
    }
}
