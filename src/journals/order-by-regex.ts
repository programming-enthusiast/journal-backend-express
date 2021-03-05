import RE2 from 're2';

// To avoid security issues, the number of groups should be limited to the number of columns in the Entries table
// See https://github.com/nodesecurity/eslint-plugin-security/blob/master/docs/regular-expression-dos-and-node.md
const entriesOrderByRegex = new RegExp(
  new RE2(
    /^(id|journal_id|title|text|created_at|updated_at)(\s(asc|desc))?(\b\/(id|journal_id|title|text|created_at|updated_at)(\s(asc|desc))?){0,5}$/
  ).source
);

export { entriesOrderByRegex };
