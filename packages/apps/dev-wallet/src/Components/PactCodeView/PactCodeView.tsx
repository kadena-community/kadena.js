import { IParsedCode } from '@kadena/pactjs-generator';
import { Box, Text } from '@kadena/react-ui';
import { style } from '@vanilla-extract/css';
import { FC } from 'react';

const Arg: FC<{ arg: IParsedCode['args'][number] }> = ({ arg }) => {
  if ('string' in arg) {
    return <Box style={{ color: 'brown' }}>"{arg.string}"</Box>;
  }
  if ('int' in arg) {
    return <Box style={{ color: 'green' }}>{arg.int}</Box>;
  }
  if ('decimal' in arg) {
    return <Box style={{ color: 'green' }}>{arg.decimal}</Box>;
  }
  if ('list' in arg) {
    return (
      <Box>
        {'['}
        {arg.list.map((item, i) => (
          <Arg key={i} arg={item} />
        ))}
        {']'}
      </Box>
    );
  }
  if ('object' in arg) {
    return (
      <Box>
        {'{'}
        {arg.object.map((item, i) => (
          <Box key={i}>
            <Text>{item.property}:</Text>
            <Arg arg={item.value} />
            {','}
          </Box>
        ))}
        {'}'}
      </Box>
    );
  }

  if ('code' in arg) {
    return <PactCodeView parsedCode={arg.code} />;
  }
};

export const PactCodeView: FC<{ parsedCode: IParsedCode }> = ({
  parsedCode,
}) => {
  return (
    <Box>
      <Text className={style({ color: 'blue' })}> {'('}</Text>
      <Box style={{ paddingLeft: 10 }}>
        <Box style={{ color: 'purple' }}>
          {parsedCode.function.namespace && (
            <>
              <span>{parsedCode.function.namespace}</span>
              {'.'}
            </>
          )}
          {parsedCode.function.module && (
            <>
              <span>{parsedCode.function.module}</span>
              {'.'}
            </>
          )}
          <span>{parsedCode.function.name}</span>
        </Box>
        {parsedCode.args.map((arg, i) => (
          <Arg key={i} arg={arg} />
        ))}
      </Box>
      <Text className={style({ color: 'blue' })}> {')'}</Text>
    </Box>
  );
};
