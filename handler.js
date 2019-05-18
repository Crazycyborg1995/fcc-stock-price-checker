const exphbs = require('express-handlebars');

module.exports = exphbs.create({
  extname: 'hbs',
  defaultLayout: null,
  // create custom helpers
  helpers: {
    a(id) {
      return `<a href="api/books/${id} "class="card-link">Book Link</a>`;
    },
    alert(msg) {
      return `<div class="alert alert-primary">
       ${msg}</div>`;
    }
  }
});
