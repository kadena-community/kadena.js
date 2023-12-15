interface FormattingOptions {
  tabSize: number;
  insertSpaces: boolean;
}

function insertNewline(state: any, token: string, options: FormattingOptions) {
  if (!state.newLine) {
    state.formattedDocument += '\n';
    return state;
  }

  state.newLine = false;

  return state;
}

function formatOpenList(state: any, token: string, options: FormattingOptions) {
  const charIsEscaped = state.escaped;
  if (charIsEscaped) {
    state.escaped = false;
  }

  const charIsInString = !state.string;
  if (charIsInString) {
    const isOnNewLine = !state.newLine;
    if (isOnNewLine) {
      insertNewline(state, token, options);
    }
    if (options.insertSpaces) {
      state.formattedDocument +=
        ' '.repeat(options.tabSize).repeat(state.openLists) + token;
    } else {
      state.formattedDocument += '\t'.repeat(state.openLists) + token;
    }
    state.openLists++;
    state.array = true;
  } else {
    state.formattedDocument += token;
  }

  return state;
}

function formatCloseList(
  state: any,
  token: string,
  options: FormattingOptions,
) {
  const charIsEscaped = state.escaped;
  if (charIsEscaped) {
    state.escaped = false;
  }

  const charIsInString = !state.string;
  if (charIsInString) {
    state.formattedDocument += token;
    state.openLists--;
  }

  return state;
}

function formatNewLine(state: any, token: string, options: FormattingOptions) {
  state.newLine = true;
  state.comment = false;
  state.array = false;
  state.formattedDocument += token;

  return state;
}

function formatWhitespace(
  state: any,
  token: string,
  options: FormattingOptions,
) {
  const charIsInsideACommentStringOrArray =
    state.comment || state.string || state.array;
  if (charIsInsideACommentStringOrArray) {
    state.formattedDocument += token;
  }

  return state;
}

function formatComment(state: any, token: string, options: FormattingOptions) {
  const charIsEscaped = state.escaped;
  const charIsInString = state.string;
  if (charIsEscaped) {
    state.escaped = false;
  } else if (charIsInString) {
    state.comment = true;
  }

  state.formattedDocument += token;

  return state;
}

function escapeFormatter(
  state: any,
  token: string,
  options: FormattingOptions,
) {
  state.escaped = !state.escaped;
  state.formattedDocument += token;

  return state;
}

function stringFormatter(
  state: any,
  token: string,
  options: FormattingOptions,
) {
  const charIsEscaped = state.escaped;
  if (charIsEscaped) {
    state.escaped = false;
  } else {
    state.string = !state.string;
  }

  state.formattedDocument += token;

  return state;
}

export function formatDocument(code: string, options: FormattingOptions) {
  let state = {
    document: code,
    formattedDocument: '',
    openLists: 0,
    comment: false,
    escaped: false,
    string: false,
    newLine: false,
    array: false,
  };

  const formatters: any = {
    '(': formatOpenList,
    ')': formatCloseList,
    '\r': formatNewLine,
    '\n': formatNewLine,
    ' ': formatWhitespace,
    '\t': formatWhitespace,
    ';': formatComment,
    '\\': escapeFormatter,
    '"': stringFormatter,
  };

  for (let i = 0; i < state.document.length; i++) {
    const cursor = state.document.charAt(i);
    const formatter = formatters[cursor];

    if (formatter) {
      state = formatter(state, cursor, options);
    } else {
      state.formattedDocument += cursor;
      state.newLine = false;
      if (state.escaped) {
        state.escaped = false;
      }
    }
  }

  return state.formattedDocument;
}
