package tp1gcc252;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.Scanner;

public class TP1GCC252 {

    private static final ArrayList<String> mapeamentosUtilizados   = new ArrayList<>();
    private static final ArrayList<String> mapeamentosConfigurados = new ArrayList<>();

    private static final Path arquivosAppService  = Paths.get("C:\\Projetos\\DDD_011");
    private static final Path arquivosMapeamentos = Paths.get("C:\\Projetos\\DDD_011");
    private static final Diretorio mappers = new Diretorio();
    private static final Diretorio configs = new Diretorio();
    private static boolean mostrarLinhasPath = false;
    
    public static void main(String[] args) {
        
        int opcao, sair;
        do{
            System.out.println("****************************************************************");
            System.out.println("*                       MENU INICIAL                           *");
            System.out.println("*                                                              *");
            System.out.println("*                  <1>  ANALISE                                *");
            System.out.println("*                  <2>  ANALISE COMPLETA                       *");
            System.out.println("*                  <3>  ARQUIVOS ANALISADOS                    *");
            System.out.println("*                  <4>  MAPEAMENTOS CONFIGURADOS               *");
            System.out.println("*                  <5>  MAPEAMENTOS UTILIZADOS                 *");
            System.out.println("*                  <0>  SAIR                                   *");
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

                case 4:
                    ImprimirMapeamentosConfigurados();
                break;
                        
                case 5:
                    ImprimirMapeamentosUtilizados();
                break;
                            
                case 0:
                    System.out.print("Deseja sair do sistema ?\n<1>Sim        <2>Nao\nOpcao: ");
                    sair = kb.nextInt();
                    if(sair != 1)
                        opcao = -1;
                break;
            }
        }while(opcao != 0);
    }

    
    private static void ImprimirAnalise(){
        RealizarAnalise();
        PergMostrarLinhasPath();
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
                System.out.println(mapeamentoUtilizado);
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
        System.out.println("Executando Análise ...\n");
        
        try {
            Files.walkFileTree(arquivosAppService, mappers);
            Files.walkFileTree(arquivosMapeamentos, configs);
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        for(String path : mappers.getArquivos()){
            Arquivo arquivo = new Arquivo(path);
            
            ArrayList<Linha> linhasEncontradas = arquivo.BuscarTexto("Mapper.Map<");
            if(linhasEncontradas.size() > 0)
                TrataStringMapperMap(linhasEncontradas);
        }
        
        for(String path : mappers.getArquivos()){
            Arquivo arquivo = new Arquivo(path);
            
            ArrayList<Linha> linhasEncontradas = arquivo.BuscarTexto("To<");
            if(linhasEncontradas.size() > 0)
                TrataStringMapperTo(linhasEncontradas);
        }
        
        for(String path : configs.getArquivos()){
            Arquivo arquivo = new Arquivo(path);

            ArrayList<Linha> linhasEncontradas = arquivo.BuscarTexto("CreateMap<");
             if(linhasEncontradas.size() > 0)
                TrataStringCreateMap(linhasEncontradas);
        }
    }

    private static void TrataStringMapperMap(ArrayList<Linha> linhasEncontradas) {

        for(Linha linha : linhasEncontradas)
        {
            String a1[] = linha.getTexto().split("Mapper.Map<");

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


    private static void TrataStringMapperTo(ArrayList<Linha> linhasEncontradas) {

        for(Linha linha : linhasEncontradas)
        {
            String a1[] = linha.getTexto().split("To<");

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


    private static void TrataStringCreateMap(ArrayList<Linha> linhasEncontradas) {
        
        for(Linha linha : linhasEncontradas)
        {
            String a1[] = linha.getTexto().split("CreateMap<");
            String a2[] = a1[1].split(">");
            String a3[] = a2[0].split(",");
            if(a3.length > 1){
                if(!mapeamentosConfigurados.contains(a3[0].replaceAll(" ", "") + ">>" + a3[1].replaceAll(" ", "")))
                    mapeamentosConfigurados.add(a3[0].replaceAll(" ", "") + ">>" + a3[1].replaceAll(" ", ""));
            }
        }
    }

    private static void ImprimirMapeamentosConfigurados() {
        RealizarAnalise();
        System.out.println("** Mapeamentos Configurados **\n");
        
        for(String mapeamentoConfigurado : mapeamentosConfigurados)
        {
            System.out.println(mapeamentoConfigurado);    
        }
    }

    private static void ImprimirMapeamentosUtilizados() {
        RealizarAnalise();
        System.out.println("** Mapeamentos Utilizados **\n");
        
        for(String mapeamentoUtilizado : mapeamentosUtilizados)
        {
            System.out.println(mapeamentoUtilizado);    
        }
    }

    private static void PergMostrarLinhasPath() {
        Scanner kb = new Scanner(System.in);
        System.out.print("Deseja mostrar o numero da linha e o diretorio do arquivo encontrado ?\n<1>Sim        <2>Nao\nOpcao: ");
        int op = kb.nextInt();
        if(op == 1)
            mostrarLinhasPath = true;
        else
            mostrarLinhasPath = false;
    }
    
}
