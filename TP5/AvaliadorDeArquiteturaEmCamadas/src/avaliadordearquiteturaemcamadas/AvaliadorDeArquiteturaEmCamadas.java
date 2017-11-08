package avaliadordearquiteturaemcamadas;

public class AvaliadorDeArquiteturaEmCamadas {

    public static void main(String[] args) {
        try {
            Analisador.ExecutarAnalise("C:\\Users\\MONTILA\\Documents\\GitHub\\arqsw_20172_grupo3\\TP5\\SoftwareMVCExemplo");
            System.out.println("Arquitetura validada com sucesso !");            
        } catch (Exception ex) {
            System.out.println(ex.getMessage());            
        }
    }
}
