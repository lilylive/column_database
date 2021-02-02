'use strict';
import $ from 'jquery';
const global = Function('return this;')();
global.jQuery = $;
import bootstrap from 'bootstrap';
const uuid = require('uuid');

$('.admit-button').each((i, e) => {
  const button = $(e);
  button.click(() => {
    const columnId = button.data('column-id');
    const columnAuthor = button.data('column-author');
    let adminCheck = button.data('admincheck');
    const nextAdminCheck = 1;
    $.post(`/editor/columnId/${columnId}`,
      { columnId: columnId,
        columnAuthor: columnAuthor,
        adminCheck: nextAdminCheck },
      (data) => {
        console.log(data);
        button.data('adminCheck', data.adminCheck);
        //button.submit('adminCheck', data.adminCheck)
        //res.redirect('/editor');
      });
  });
});

$('.disadmit-button').each((i, e) => {
  const button = $(e);
  button.click(() => {
    const columnId = button.data('column-id');
    const columnAuthor = button.data('column-author');
    let adminCheck = button.data('admincheck');
    const nextAdminCheck = 0;
    $.post(`/editor/columnId/${columnId}`,
      { columnId: columnId,
        columnAuthor: columnAuthor,
        adminCheck: nextAdminCheck },
      (data) => {
        console.log(data);
        button.data('adminCheck', data.adminCheck);
        //button.submit('adminCheck', data.adminCheck)
        //res.redirect('/editor');
      });
  });
});
