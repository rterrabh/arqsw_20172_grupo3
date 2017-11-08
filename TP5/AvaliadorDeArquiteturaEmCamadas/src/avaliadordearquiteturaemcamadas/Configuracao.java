package avaliadordearquiteturaemcamadas;

import java.util.ArrayList;
import java.util.List;

public class Configuracao {
    
    private final List<Mapper<String, String>> ConfiguracoesMapper = new ArrayList<>();

    public Configuracao() {
        ConfiguracoesMapper.add(new Mapper("br.TP5.View"      , "br.TP5.Controller"));
        ConfiguracoesMapper.add(new Mapper("br.TP5.Controller", "br.TP5.View"));
        ConfiguracoesMapper.add(new Mapper("br.TP5.Controller", "br.TP5.Model"));
    }
    
    public List<Mapper<String, String>> getRestricoes(){
        return this.ConfiguracoesMapper;
    }
}
