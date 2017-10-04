package tp1gcc252;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;


public class Arquivo {

    private String path;

    public Arquivo(String path) {
        this.path = path;
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

    public String getPath() {
        return path;
    }
    
    
}
