import React from 'react';

interface IDynamicComponentBlockField {
  type: 'text' | 'code';
  key: string;
  value: string;
  link?: string;
}

interface IDynamicComponentBlock {
  title?: string;
  fields: IDynamicComponentBlockField[];
}

interface IDataRenderComponentProps {
  data: IDynamicComponentBlock[];
}

const DataRenderComponent: React.FC<IDataRenderComponentProps> = ({ data }) => {
  return (
    <>
      {data.map((block, index) => (
        <div key={index}>
          {block.title && <h3>{block.title}</h3>}
          <table>
            <tbody>
              {block.fields.map((field, index) => (
                <tr key={index}>
                  <td>{field.key}</td>
                  <td>
                    {field.type === 'code' ? (
                      <pre>{field.value}</pre>
                    ) : field.link ? (
                      <a href={field.link}>{field.value}</a>
                    ) : (
                      field.value
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
};

export default DataRenderComponent;
