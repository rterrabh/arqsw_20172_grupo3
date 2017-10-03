package tp1gcc252;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.HashMap;

public class TP1GCC252 {

    public static void main(String[] args) {
        HashMap<String, String> dictionaryAppService = new HashMap<String, String>();
        HashMap<String, String> dictionaryMappers = new HashMap<String, String>();


        Path arquivosAppService = Paths.get("C:\\Projetos\\DDD_011\\src\\Aptum.SIVI.Application.Impl\\AppServices");
        Path arquivosMapeamentos = Paths.get("C:\\Projetos\\DDD_011\\src\\Aptum.SIVI.Application.Impl\\AutoMapper");
        
        Diretorio appService = new Diretorio();
        Diretorio mappers = new Diretorio();
        
        try {
            Files.walkFileTree(arquivosAppService, appService);
            Files.walkFileTree(arquivosMapeamentos, mappers);
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        
        for(String path : appService.getArquivos()){
            Arquivo arquivo = new Arquivo(path);
            
            /*String encontrado1 = arquivo.BuscarTexto("TO<");
            if(encontrado1 != null)
            {
                TrataStringMapper(encontrado1);
            }*/
            
            ArrayList<String> encontrado2 = arquivo.BuscarTexto("Mapper.Map<");
            if(encontrado2.size() > 0)
                TrataStringMapperMap(encontrado2);
        }
        
        /*for(String path : mappers.getArquivos()){
            Arquivo arquivo = new Arquivo(path);

            ArrayList<String> linhasEncontradas = arquivo.BuscarTexto("CreateMap<");
             if(linhasEncontradas.size() > 0)
                TrataStringCreateMap(linhasEncontradas);

        }*/
        
    }

    private static void TrataStringMapperMap(ArrayList<String> linhasEncontradas) {

        for(String linha : linhasEncontradas)
        {
            String a1[] = linha.split("Mapper.Map<");

            if(!a1[0].contains("IEnumerable"))
            {
                String a2[] = a1[1].split(">");
                String a3[] = a2[0].split(",");
                if(a3.length > 1)
                {
                    System.out.print(a3[0].replaceAll(" ", "") + " >>> " + a3[1].replaceAll(" ", "") + "\n");
                }
            }
        }
    }

    private static void TrataStringCreateMap(ArrayList<String> linhasEncontradas) {
        
        for(String linha : linhasEncontradas)
        {
            String a1[] = linha.split("CreateMap<");
            String a2[] = a1[1].split(">");
            String a3[] = a2[0].split(",");
            if(a3.length > 1){
                System.out.print(a3[0].replaceAll(" ", "") + " >>> " + a3[1].replaceAll(" ", "") + "\n");
            }
        }
    }
    
}
