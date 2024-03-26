import { token } from '@kadena/react-ui/styles';
import { createVar, style } from '@vanilla-extract/css';
import { bodyBaseRegular } from '../../styles';
import { iconFill } from '../Icon/IconWrapper.css';

const verticalSeparation = createVar();
const segmentHeight = createVar();
const markerBorderWidth = createVar();
const markerTotalBorderWidth = createVar();
const chevronGap = createVar();
const markerLabelGap = createVar();

export const stepList = style({
  padding: 0,
  margin: 0,
  flexWrap: 'nowrap',
  display: 'flex',
  fontSize: token('typography.fontSize.base'),
  color: token('color.text.subtlest.default'),
  gap: token('spacing.lg'),
  vars: {
    [verticalSeparation]: '32px',
    [segmentHeight]: '2px',
    [markerBorderWidth]: '2px',
    [markerTotalBorderWidth]: `calc(${markerBorderWidth} * 4)`,
    [chevronGap]: '16px',
    [markerLabelGap]: '12px',
  },
  selectors: {
    '&[data-orientation="vertical"]': {
      flexDirection: 'column',
      columnGap: '2px',
      rowGap: 0,
    },
  },
});

export const stepListItem = style({
  display: 'grid',
  minWidth: 0,
  selectors: {
    [`${stepList}[data-orientation="vertical"] &`]: {
      listStyle: 'none',
      display: 'unset',
    },
  },
});

export const stepListLink = style([
  bodyBaseRegular,
  {
    cursor: 'default',
    display: 'grid',
    textDecoration: 'none',
    outline: 'none',
    gap: token('spacing.md'),
    selectors: {
      '&[data-disabled="true"]': {
        pointerEvents: 'none',
        // backgroundColor: token('color.background.base.@disabled'),
        color: token('color.text.base.@disabled'),
      },
      '&[data-selectable="true"]': {
        cursor: 'pointer',
      },
      '&[data-selected="true"]': {
        cursor: 'default',
      },
      '&[data-completed="true"]': {
        cursor: 'default',
        color: token('color.text.subtlest.default'),
      },

      [`${stepList}[data-orientation="horizontal"] &`]: {
        display: 'flex',
        alignItems: 'baseline',
      },

      [`${stepList}[data-orientation="vertical"] &`]: {
        display: 'grid',
        gridTemplateAreas: `"marker label" "line label"`,
        gridTemplateColumns: 'minmax(0, min-content) 1fr',
        gridTemplateRows: 'minmax(16px, min-content) 1fr',
        justifyItems: 'start',
        columnGap: '6px',
        rowGap: '0px',
      },

      [`${stepListItem}:last-child &`]: {
        gridTemplateAreas: 'marker label',
        gridTemplateRows: 'minmax(16px, min-content)',
      },
    },
  },
]);

export const stepListLabel = style({
  gridArea: 'label',
  selectors: {
    [`${stepListLink}[data-selected="true"] &`]: {
      fontWeight: 'bold',
    },
    [`${stepListLink}[data-completed="true"] &`]: {
      fontWeight: 'bold',
    },
    [`${stepList}[data-orientation="horizontal"] &`]: {
      order: 1,
    },

    [`${stepList}[data-orientation="vertical"] &`]: {
      alignSelf: 'baseline',
      /* pushes elements too far apart if we don't set this, it doesn't cut off descenders/ascenders */
      lineHeight: '16px',
      minWidth: 0,
      minHeight: 0,
    },
  },
});

export const stepListSegment = style({
  alignItems: 'center',
  display: 'inline-flex',
  selectors: {
    [`${stepList}[data-orientation="horizontal"] &`]: {
      order: 2,
      display: 'flex',
      alignItems: 'center',
      paddingInlineStart: `calc(${chevronGap} - ${markerLabelGap})`,
    },

    [`${stepList}[data-orientation="horizontal"] &::before`]: {
      content: '*',
      width: 0,
      visibility: 'hidden',
    },

    [`${stepList}[data-orientation="vertical"] &`]: {
      gridArea: 'line',
      justifySelf: 'center',
      boxSizing: 'content-box',
      minHeight: verticalSeparation,
      width: '2px',
      pointerEvents: 'none',
      minWidth: 0,
    },

    [`${stepListItem}:last-child &`]: {
      display: 'none',
    },
  },
});

export const stepListSegmentLine = style({
  selectors: {
    [`${stepList}[data-orientation="horizontal"] &`]: {
      display: 'none',
    },

    [`${stepList}[data-orientation="vertical"] &`]: {
      overflow: 'visible',
      width: '2px',
      height: '100%',
    },
  },
});

export const stepListMarkerWrapper = style({
  gridArea: 'marker',
  display: 'flex',
  ':before': {
    content: '*',
    width: 0,
    visibility: 'hidden',
  },
  selectors: {
    [`${stepList}[data-orientation="horizontal"] &`]: {
      flex: 'none',
      order: 0,
      alignItems: 'center',
    },

    [`${stepList}[data-orientation="vertical"] &`]: {
      alignSelf: 'baseline',
      minWidth: 0,
      minHeight: 0,
    },
  },
});

export const stepListMarker = style({
  boxSizing: 'border-box',
  borderRadius: '50%',
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor: token('color.border.base.default'),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  width: token('spacing.lg'),
  height: token('spacing.lg'),
  paddingBlockEnd: '1px',
  color: '#0000',

  selectors: {
    [`${stepListLink}[data-focused="true"] &`]: {
      outline: `2px solid ${token('color.border.semantic.info.@focus')}`,
    },
    [`${stepListLink}[data-completed="true"] &`]: {
      backgroundColor: token('color.background.base.default'),
      color: token('color.text.base.default'),
      borderStyle: 'none',
      borderWidth: 0,
    },
    [`${stepListLink}[data-selected="true"] &`]: {
      backgroundColor: token('color.background.base.default'),
      color: token('color.text.base.default'),
      borderStyle: 'none',
      borderWidth: 0,
    },
  },
});

export const stepListChevron = style({
  vars: {
    [iconFill]: token('color.text.base.default'),
  },
  selectors: {
    [`${stepList}[data-orientation="horizontal"] &`]: {
      paddingTop: '1px',
    },

    [`${stepList}[data-orientation="vertical"] &`]: {
      display: 'none',
    },
  },
});
