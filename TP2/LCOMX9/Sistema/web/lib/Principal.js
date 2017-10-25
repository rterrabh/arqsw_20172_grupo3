require({ paths: { jquery: "jQuery/jquery-3.2.1.min", 
                   tree: "treehugger/tree",
                   traverse: "treehugger/traverse",
                   parsejs: "treehugger/js/parse"}
        }

         // Next is the root module to run, which depends on everything else.
       , [ "analiseAST" ]

         // Finally, start my app in whatever way it uses.
       , function(analiseAST) { 
           analiseAST.start(); 
       }
);
