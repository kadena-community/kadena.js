import type { FC } from 'react';

const renderLayout = (layout: any) => {
  // if(layout.children && layout.children.length > 0) {
  //     return layout.children.map((child: any, index: number) => return renderLayout(child) )
  // }

  const children = layout.children
    ? layout.children
    : layout.props?.children ?? [];
  return (
    <div style={layout.props?.style ?? {}}>
      {children?.length ? (
        <div style={layout.props?.style ?? {}}>
          {layout.props?.label && <strong>{layout.props?.label}: </strong>}
          {children.map((child: any) => renderLayout(child))}
        </div>
      ) : (
        <div style={layout.props?.style ?? {}}>
          {layout.props?.label && <strong>{layout.props.label}: </strong>}
          {layout.props?.value}
        </div>
      )}
    </div>
  );
};

export const AssetMetaData: FC<{ data: any; layout: any }> = ({
  data,
  layout,
}) => {
  if (!data || !layout) return null;

  return <div>{renderLayout(layout)}</div>;
};
