package tp1gcc252;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.Scanner;

public class TP1GCC252 {

    private static final ArrayList<String> mapeamentosUtilizados   = new ArrayList<>();
    private static final ArrayList<String> mapeamentosConfigurados = new ArrayList<>();

    private static final Path arquivosAppService  = Paths.get("D:\\Projetos\\Projetos\\DDD_011\\DDD_011\\src\\Aptum.SIVI.Application.Impl\\AppServices");
    private static final Path arquivosMapeamentos = Paths.get("D:\\Projetos\\Projetos\\DDD_011\\DDD_011\\src\\Aptum.SIVI.Application.Impl\\AutoMapper");
    private static final Diretorio mappers = new Diretorio();
    private static final Diretorio configs = new Diretorio();

    
    public static void main(String[] args) {
        
        int opcao, sair;
        do{
            System.out.println("****************************************************************");
            System.out.println("*                       MENU INICIAL                           *");
            System.out.println("*                                                              *");
            System.out.println("*                  <1> IMPRIMIR ANALISE                        *");
            System.out.println("*                  <2> IMPRIMIR ANALISE COMPLETA               *");
            System.out.println("*                  <3> IMPRIMIR ARQUIVOS ANALISADOS            *");
            System.out.println("*                  <0> SAIR                                    *");
            System.out.println("*                                                              *");
            System.out.println("****************************************************************\nOpcao: ");
            
            Scanner kb = new Scanner(System.in);
            opcao = kb.nextInt();
            

            switch(opcao){
                case 1:
                    ImprimirAnalise();
                break;

                case 2:
                    ImprimirAnaliseCompleta();
                break;

                case 3:
                    ImprimirArquivosAnalisados();
                break;

                case 0:
                    System.out.print("Deseja sair do sistema ?\n<1>Sim        <2>Nao\nOpcao: ");
                    sair = kb.nextInt();
                    if(sair == 1)
                    {
                        
                    }
                    else
                    {
                        opcao = -1;
                    }
                break;
            }
        }while(opcao != 0);
    }

    
    private static void ImprimirAnalise(){
        RealizarAnalise();
        System.out.println("** Mapeamentos utilizados e não configurados **\n");
        
        for(String mapeamentoUtilizado : mapeamentosUtilizados)
        {
            if(!mapeamentoUtilizado.startsWith("??")){
                if(!mapeamentosConfigurados.contains(mapeamentoUtilizado))
                {
                    System.out.print(mapeamentoUtilizado + "\n");
                }
            }
        }
    }
    
    private static void ImprimirAnaliseCompleta(){
        RealizarAnalise();
        System.out.println("** Mapeamentos utilizados e não configurados ***");
        System.out.println("OBS: Mapeamentos iniciados de \"??\" não foram encontrados a classe de origem!\n\n");
        
        for(String mapeamentoUtilizado : mapeamentosUtilizados)
        {
            if(!mapeamentosConfigurados.contains(mapeamentoUtilizado))
            {
                System.out.print(mapeamentoUtilizado + "\n");
            }
        }
    }

    
    private static void ImprimirArquivosAnalisados(){
        try {
            mappers.setImprimirDiretorio(true);
            configs.setImprimirDiretorio(true);
            
            Files.walkFileTree(arquivosAppService, mappers);
            Files.walkFileTree(arquivosMapeamentos, configs);
            
            mappers.setImprimirDiretorio(false);
            configs.setImprimirDiretorio(false);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    private static void RealizarAnalise(){
        
        try {
            Files.walkFileTree(arquivosAppService, mappers);
            Files.walkFileTree(arquivosMapeamentos, configs);
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        for(String path : mappers.getArquivos()){
            Arquivo arquivo = new Arquivo(path);
            
            ArrayList<String> linhasEncontradas = arquivo.BuscarTexto("Mapper.Map<");
            if(linhasEncontradas.size() > 0)
                TrataStringMapperMap(linhasEncontradas);
        }
        
        for(String path : mappers.getArquivos()){
            Arquivo arquivo = new Arquivo(path);
            
            ArrayList<String> linhasEncontradas = arquivo.BuscarTexto("To<");
            if(linhasEncontradas.size() > 0)
                TrataStringMapperTo(linhasEncontradas);
        }
        
        for(String path : configs.getArquivos()){
            Arquivo arquivo = new Arquivo(path);

            ArrayList<String> linhasEncontradas = arquivo.BuscarTexto("CreateMap<");
             if(linhasEncontradas.size() > 0)
                TrataStringCreateMap(linhasEncontradas);
        }
    }

    private static void TrataStringMapperMap(ArrayList<String> linhasEncontradas) {

        for(String linha : linhasEncontradas)
        {
            String a1[] = linha.split("Mapper.Map<");

            if(!a1[1].contains("IEnumerable"))
            {
                String a2[] = a1[1].split(">");
                String a3[] = a2[0].split(",");
                if(a3.length > 1)
                {
                    if(!mapeamentosUtilizados.contains(a3[0].replaceAll(" ", "") + ">>" + a3[1].replaceAll(" ", "")))
                        mapeamentosUtilizados.add(a3[0].replaceAll(" ", "") + ">>" + a3[1].replaceAll(" ", ""));
                }
            }else{
                String a2[] = a1[1].split(">>");
                String a3[] = a2[0].split(",");
                if(a3.length > 1)
                {
                    String from = a3[0].substring(a3[0].indexOf("<")+1, a3[0].lastIndexOf(">"));
                    String to = a3[1].substring(a3[1].indexOf("<")+1);
                    
                    if(!mapeamentosUtilizados.contains(from + ">>" + to))
                        mapeamentosUtilizados.add(from + ">>" + to);

                }else{                    
                    if(!mapeamentosUtilizados.contains("??" + ">>" + a3[0].substring(a3[0].indexOf("<")+1).replaceAll(" ", "")))
                        mapeamentosUtilizados.add("??" + ">>" + a3[0].substring(a3[0].indexOf("<")+1).replaceAll(" ", ""));
                }

            }
        }
    }


    private static void TrataStringMapperTo(ArrayList<String> linhasEncontradas) {

        for(String linha : linhasEncontradas)
        {
            String a1[] = linha.split("To<");

            if(!a1[1].contains("IEnumerable"))
            {
                String a2[] = a1[1].split(">");
                if(a2.length > 0)
                {
                    if(!mapeamentosUtilizados.contains("??" + ">>" + a2[0].replaceAll(" ", "")))
                        mapeamentosUtilizados.add("??" + ">>" + a2[0].replaceAll(" ", ""));
                }
            }else{
                String a2[] = a1[1].split("<");
                String a3[] = a2[1].split(">");
                if(a3.length > 0)
                {
                    if(!mapeamentosUtilizados.contains("??" + ">>" + a3[0].replaceAll(" ", "")))
                        mapeamentosUtilizados.add("??" + ">>" + a3[0].replaceAll(" ", ""));
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
                if(!mapeamentosConfigurados.contains(a3[0].replaceAll(" ", "") + ">>" + a3[1].replaceAll(" ", "")))
                    mapeamentosConfigurados.add(a3[0].replaceAll(" ", "") + ">>" + a3[1].replaceAll(" ", ""));
            }
        }
    }
    
}
