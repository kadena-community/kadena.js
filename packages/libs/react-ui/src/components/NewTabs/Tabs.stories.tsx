import React from 'react';
// only export this 2 components in the index
import { TabItem, Tabs } from './Tabs';

export default { title: 'NewTabs' };
// add link to docs in decription
// add more stories for usages
export const TabsStory = () => (
  <Tabs aria-label="History of Ancient Rome">
    <TabItem key="FoR" title="Founding of Rome">
      Arma virumque cano, Troiae qui primus ab oris.
    </TabItem>
    <TabItem key="MaR" title="Monarchy and Republic">
      Senatus Populusque Romanus.
    </TabItem>
    <TabItem key="Emp" title="Empire">
      Alea jacta est.
    </TabItem>
  </Tabs>
);

// new story with onSelectionChanged and selectedKey

// export const ControlledTabsStory = () => (
//   <>
//   <p>Selected time period: {timePeriod}</p>
//   <Tabs
//     aria-label="Mesozoic time periods"
//     selectedKey={timePeriod}
//     onSelectionChange={setTimePeriod}
//   >
//     <TabItem key="triassic" title="Triassic">
//       The Triassic ranges roughly from 252 million to 201 million years ago,
//       preceding the Jurassic Period.
//     </TabItem>
//     <TabItem key="jurassic" title="Jurassic">
//       The Jurassic ranges from 200 million years to 145 million years ago.
//     </TabItem>
//     <TabItem key="cretaceous" title="Cretaceous">
//       The Cretaceous is the longest period of the Mesozoic, spanning from
//       145 million to 66 million years ago.
//     </TabItem>
//   </Tabs>
// </>
// )
