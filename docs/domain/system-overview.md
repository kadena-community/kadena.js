```structurizr

!constant ORG "Kadena"

workspace {
  model {
    chainwebNode  = softwareSystem "chainweb-node"  {
    }

    pact  = softwareSystem "pact"  {
    }

    chainwebData  = softwareSystem "chainweb-data"  {
      cwDataRuntime = container "chainwebDataRuntime"
      cwDataDatabase = container "postgres database"
      cwDataRuntime -> cwDataDatabase "Uses"
    }

    group "kadena-community/kadena.js" {

        kadenaClient = softwareSystem "@kadena/client" "desc" "Typescript" {
        }

        kadenaTransfer = softwareSystem "@kadena/transfer"  { 
        }
    }


    kadenaClient -> chainwebNode "Uses"
    kadenaTransfer -> kadenaClient "Uses"
    chainwebNode -> pact
  }

  views {
    systemLandscape KadenaSystemLandscape {
      include *
      autolayout lr
    }

    container chainwebData {
      include * 
      autolayout lr
    }




    theme default
  }

}
```
