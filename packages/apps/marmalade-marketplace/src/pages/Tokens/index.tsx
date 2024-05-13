import { Heading, TextField, Button, Tabs, TabItem } from '@kadena/react-ui';
import * as styles from "@/styles/create-token.css"
import Layout from '@/components/Layout';

export default function CreateToken() {
  return (
    <div className={styles.mainWrapperClass}>
    <Heading>
      <title>Create Token</title>
    </Heading>
    <Layout> 
      <h1>Create Token</h1>
      <div className={styles.twoColumnRow}>
        <div className={styles.formSection}>
          {}
          <Button> Upload Image </Button>
        </div>
        <div className={styles.formSection}>
          <form className={styles.verticalForm}>
            <TextField label = "URI"/>
            <TextField label = "Precision"/>
            <TextField label = "Creation Guard"/>
            <TextField label = "Chain"/>
          </form>
        </div>
      </div>
      <div className={styles.oneColumnRow}>
        <div className={styles.formSection}>
        <form className={styles.verticalForm}>
              {/* Adjusted row with two columns */}
              <div className={styles.checkboxRow}>
                {/* First Column */}
                <div className={styles.firstColumn}>
                  <div className={styles.checkboxContainer}>
                    <input className={styles.checkboxInput} type="checkbox" id="nonFungible" name="nonFungible" />
                    <label className={styles.checkboxLabel} htmlFor="nonFungible">Non Fungible Policy</label>
                  </div>
                  <div className={styles.checkboxContainer}>
                    <input className={styles.checkboxInput} type="checkbox" id="collection" name="collection" />
                    <label className={styles.checkboxLabel} htmlFor="collection">Collection Policy</label>
                  </div>
                </div>
                {/* Second Column */}
                <div className={styles.secondColumn}>
                  <div className={styles.checkboxContainer}>
                    <input className={styles.checkboxInput} type="checkbox" id="guard" name="guard" />
                    <label className={styles.checkboxLabel} htmlFor="guard">Guard Policy</label>
                  </div>
                  <div className={styles.checkboxContainer}>
                    <input className={styles.checkboxInput} type="checkbox" id="royalty" name="royalty" />
                    <label className={styles.checkboxLabel} htmlFor="royalty">Royalty Policy</label>
                  </div>
                </div>
              </div>
            </form>
        
        </div>
        
    <div className={styles.oneColumnRow}>
    <div className={styles.formSection}>
      <Tabs> 
        <TabItem title="Guards">
          <form className={styles.verticalForm} title="Guards">
            <TextField label = "URI Guard"/>
            <TextField label = "Mint Guard"/>
            <TextField label = "Burn Guard"/>
            <TextField label = "Sale Guard"/>
            <TextField label = "Transfer Guard"/>
          </form>
        </TabItem>
        <TabItem title="Collection">
          <form className={styles.verticalForm}>
            <TextField label = "Collection Operator Guard"/>
          </form>
        </TabItem>
        <TabItem title="Royalty">
        <form className={styles.verticalForm}>
            <TextField label = "Royalty Fungible"/>
            <TextField label = "Royalty Creator"/>
            <TextField label = "Royalty Guard"/>
            <TextField label = "Royalty Rate"/>
            <TextField label = "Royalty Fungible"/>
          </form>
        
        </TabItem>
      </Tabs>
      </div>
      </div>
      </div>
    </Layout>
  </div>
  );
}