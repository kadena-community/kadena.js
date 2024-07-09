import { useEffect, useState } from "react";
import { Stack } from "@kadena/kode-ui";
import CrudCard from '@/components/CrudCard';
import { MonoAutoFixHigh } from '@kadena/kode-icons';
import { Checkbox } from '@kadena/kode-ui';
import * as styles from '@/styles/create-sale.css';

export default function CreateSale() {
  return (
    <Stack flex={1} flexDirection="column" className={styles.container}>
      <CrudCard
        headingSize="h3"
        titleIcon={<MonoAutoFixHigh />}
        title="Create Sale"
        description={[
          "Create a new sale for your token",
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi",
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
          "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia"
        ]}
      >
        <div>
          <p>Form to create a new sale</p>
        </div>
      </CrudCard>
      <CrudCard
        title="Metadata"
        description={["Explaining metadata copy"]}
      >
        <div>
          <p>Form to setup metadata</p>
        </div>
      </CrudCard>
      <CrudCard
        title="Policies"
        description={["Explaining copy for the concrete policies"]}
      >
        <div>
          <p>Form to setup policies</p>
        </div>
      </CrudCard>
    </Stack>
  );
}
