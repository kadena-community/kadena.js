import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';

const renderLayout = (layout: any) => {
  // if(layout.children && layout.children.length > 0) {
  //     return layout.children.map((child: any, index: number) => return renderLayout(child) )
  // }

  console.log(layout);

  const { label, value } = layout ?? {};
  const { style: styleprop, ...props } = layout ?? {};

  const style = layout.style ?? styleprop ?? {};

  return layout.children?.length ? (
    <Stack {...props} style={{ ...(style ?? {}) }}>
      {label && <strong>{label}: </strong>}
      {layout.children?.map((child: any) => renderLayout(child))}
    </Stack>
  ) : (
    <Stack {...props} style={{ ...(style ?? {}) }}>
      {label && <strong>{label}: </strong>}
      {value}
    </Stack>
  );
};

export const AssetMetaData: FC<{ data: any; layout: any }> = ({
  data,
  layout,
}) => {
  if (!data || !layout) return null;

  return <div>{renderLayout(layout)}</div>;
};
