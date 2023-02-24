/* eslint-env es6 */
const disableRegex = /eslint-disable\s/;

function create(context) {
  const comments = context.getSourceCode().getAllComments();
  comments.forEach((comment) => {
    const reportDescriptor = match(comment);
    if (reportDescriptor) {
      context.report(reportDescriptor);
    }
  });

  return {};
}

function match(comment) {
  if (disableRegex.test(comment.value)) {
    return {
      messageId: 'message',
      data: { comment: comment.value.trim() },
      loc: comment.loc.start,
    };
  }
}

module.exports = {
  create,
  meta: {
    docs: {
      description: 'Disallow disable rules by `eslint-disable` comment',
    },
    messages: {
      message:
        'Disabling rules using `{{comment}}` is not allowed. ' +
        'Use line specific exclusion like `eslint-disable-next-line` instead',
    },
  },
};
