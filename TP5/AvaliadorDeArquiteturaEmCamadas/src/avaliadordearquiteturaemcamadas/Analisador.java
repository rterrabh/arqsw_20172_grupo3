package avaliadordearquiteturaemcamadas;

import avaliadordearquiteturaemcamadas.BuscaArquivos.Classe;
import avaliadordearquiteturaemcamadas.BuscaArquivos.Diretorio;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;


public class Analisador {
    private static Path diretorio  = null;
    private static final Diretorio classesJava = new Diretorio();

    public static boolean ExecutarAnalise(String path) throws Exception{
        diretorio = Paths.get(path);
        BuscarClasses();
        try {
            for(Classe classe : classesJava.getClasses())
            {
                AnalisarEstrutura(classe);
            }
            
            return true;
        } catch (Exception e) {
            throw e;
        }
    }
    
    private static void BuscarClasses(){
      try {
            Files.walkFileTree(diretorio, classesJava);
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        for(String path : classesJava.getArquivos()){
            Classe classe = new Classe(path);
            ArrayList<String> packageArquivo = classe.BuscarTexto("package");
            classe.setPackageOfClass(packageArquivo.get(0).replace(";", ""));
            classesJava.getClasses().add(classe);
            
            ArrayList<String> linhasEncontradas = classe.BuscarTexto("import");
            if(linhasEncontradas.size() > 0)
                TrataStringClasses(linhasEncontradas, classe);
        }
    }
    
     private static void TrataStringClasses(ArrayList<String> linhasEncontradas, Classe classe) {
        for(String linha : linhasEncontradas)
        {
            if(!linha.startsWith("\"") ||
               !linha.startsWith("/*") ||
               !linha.startsWith("//"))
            {
                String aa = linha.split("import")[1].replace(";", "");
                
                    String[] split = aa.split("[.]");
                    String dep = "";
                    for(int i=0; i < split.length-1; i++)
                    {
                        dep = dep + split[i] + ".";
                    }
                    classe.getDependencias().add(dep.substring(0, dep.length() - 1));
            }
        }
     }

    
    private static void AnalisarEstrutura(Classe classe) throws Exception{
        Configuracao conf = new Configuracao();
        List<Mapper<String, String>> restricoes = conf.getRestricoes();
        
        for(String dependencia : classe.getDependencias())
        {
            Mapper<String, String> d =  new Mapper<>(classe.getPackageOfClass().replaceAll(" ",""), dependencia.replaceAll(" ",""));
            System.out.println(d.getObj1() + " >> " + d.getObj2());
            if(restricoes.contains(d))
            {
                throw new Exception("Dependencia não permitida encontrada entre os pacotes: " + 
                        d.getObj1() + " >> " + d.getObj2() + " \nArquivo: " + classe.getPath());
            }
        }
    }
}