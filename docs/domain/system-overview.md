```structurizr

!constant ORG "Kadena"

workspace {
  model {

    chainwebNode  = softwareSystem "chainweb-node"  {
    }

    chainwebMiningClient  = softwareSystem "chainweb-mining-client"  {
    }

    chainwebApi  = softwareSystem "chainweb-api"  {
    }

    chainwebData  = softwareSystem "chainweb-data"  {
      cwDataRuntime = container "chainwebDataRuntime"
      cwDataDatabase = container "postgres database"
      cwDataRuntime -> cwDataDatabase "Uses"
    }


    pact  = softwareSystem "pact"  {
    }

    marmelade = softwareSystem "Marmelade" {

    }

     chainweaver = softwareSystem "chainweaver" {

    }

   

    group "kadena-community/kadena.js" {

        kadenaClient = softwareSystem "@kadena/client" "desc" "Typescript" {
        }

        kadenaTransfer = softwareSystem "@kadena/transfer"  {
        }

        kadenaDocs = softwareSystem "@kadena/docs" "desc" "Typescript" {
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

#    container chainwebData {
 #     include *
  #    autolayout lr
   # }




    theme default
  }

}

```
