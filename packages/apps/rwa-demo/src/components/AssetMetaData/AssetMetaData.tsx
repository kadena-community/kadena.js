import type { FC } from 'react';

const renderLayout = (layout: any) => {
  // if(layout.children && layout.children.length > 0) {
  //     return layout.children.map((child: any, index: number) => return renderLayout(child) )
  // }
  const {
    children: propsChildren,
    label,
    value,
    ...restProps
  } = layout.props ?? {};
  const children = layout.children ? layout.children : propsChildren ?? [];
  return (
    <>
      {children?.length ? (
        <div
          {...restProps}
          style={{ flex: 1, width: '100%', ...(restProps.style ?? {}) }}
        >
          {label && <strong>{label}: </strong>}
          {children.map((child: any) => renderLayout(child))}
        </div>
      ) : (
        <div {...restProps} style={{ flex: 1, ...(restProps.style ?? {}) }}>
          {label && <strong>{label}: </strong>}
          {value}
        </div>
      )}
    </>
  );
};

export const AssetMetaData: FC<{ data: any; layout: any }> = ({
  data,
  layout,
}) => {
  if (!data || !layout) return null;

  console.log(layout);

  return <div>{renderLayout(layout)}</div>;
};
