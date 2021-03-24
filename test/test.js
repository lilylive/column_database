'use strict';
const request = require('supertest');
const app = require('../app');
const passportStub = require('passport-stub');
const User = require('../models/user');
const Column= require('../models/column');
const assert = require('assert');

describe('/login', () => {
    before(() => {
        passportStub.install(app);
        passportStub.login({ username: 'testuser' });
      });
    
      after(() => {
        passportStub.logout();
        passportStub.uninstall(app);
      });

  it('ログインのためのリンクが含まれる', (done) => {
    request(app)
      .get('/login')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<a class="btn btn-info my-3" href="\/auth\/twitter"/)
      .expect(200, done);

       
          });
   it('ログイン時はユーザー名が表示される', (done) => {
      request(app)
      .get('/login')
      .expect(/testuser/)
      .expect(200, done);
  });
});
describe('/logout', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ username: 'testuser' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });
   it('/logout にアクセスした際に / にリダイレクトされる', (done) => {
     request(app)
     .get('/logout')
     .expect('Location', '/')
     .expect(302, done);

  });

});

describe('/posts', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ id: 0, username: 'testuser' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('予定が作成でき、表示される', (done) => {
    User.upsert({ userId: 0, username: 'testuser' }).then(() => {
      request(app)
        .get('/posts/new')
        .end((err, res) => {
          const match = res.text.match(/<input type="hidden" name="_csrf" value="(.*?)">/);
          const csrf = match[1];

          request(app)
            .post('/posts')
            .set('cookie', res.headers['set-cookie'])
            .send({ columnName: 'テスト予定1', columnAuthor: 'テスト作者1', memo: 'テストメモ1\r\nテストメモ2',  _csrf: csrf })
            .expect('Location', /columns/)
            .expect(302)
            .end((err, res) => {
                const createdColumnPath = res.headers.location;
                console.log(createdColumnPath);
              request(app)
                .get(createdColumnPath)
                .expect(/テスト予定1/)
                .expect(/テスト作者1/)
                .expect(/テストメモ1/)
                .expect(/テストメモ2/)
                .expect(200)
                .end((err, res) => {
                  const columnId = createdColumnPath.split('/columnId/')[1];
                  Column.findByPk(columnId).then((c) => {
                    c.destroy().then(() => {
                      if(err) {return done(err);}
                      else{
                        done();
                      }
                    });
                  });
                });
            });
        });
    });
  });
});

describe('posts/columnId/:columnId?edit=1', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ id: 0, username: 'testuser' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('コラムが作成でき、編集できる', (done) => {
    User.upsert({ userId: 0, username: 'testuser' }).then(() => {
      request(app)
        .get('/posts/new')
        .end((err, res) => {
          const match = res.text.match(/<input type="hidden" name="_csrf" value="(.*?)">/);
          const csrf = match[1];
          const setCookie = res.headers['set-cookie'];
          request(app)
            .post('/posts')
            .set('cookie', setCookie)
            .send({ columnName: 'テスト更新予定1', memo: 'テスト更新メモ1', columnAuthor: 'テスト作者候補1', _csrf: csrf })
            .end((err, res) => {
              const createdColumnPath = res.headers.location;
              const columnId = createdColumnPath.split('/columnId/')[1];
              // 編集ができることをテスト
              request(app)
                .post(`/posts/columnId/${columnId}?edit=1`)
                .set('cookie', setCookie)
                .send({ columnName: 'テスト更新予定2', memo: 'テスト更新メモ2', columnAuthor: 'テスト作者候補2', _csrf: csrf })
                .end((err, res) => {
                  const columnId = createdColumnPath.split('/columnId/')[1];
                  Column.findByPk(columnId).then((c) => {
                    assert.equal(c.columnName, 'テスト更新予定2');
                    assert.equal(c.memo, 'テスト更新メモ2');
                  });
                  
                  Column.findByPk(columnId).then((c) => {
                    c.destroy().then(() => {
                      if(err) {return done(err);}
                      else{
                        done();
                      }
                    });
                  });
                 
                });
            });
        });
    });
  });
});


describe('posts/columnId/:columnId?delete=1', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ id: 0, username: 'testuser' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('コラムが作成でき、削除できる', (done) => {
    User.upsert({ userId: 0, username: 'testuser' }).then(() => {
      request(app)
        .get('/posts/new')
        .end((err, res) => {
          const match = res.text.match(/<input type="hidden" name="_csrf" value="(.*?)">/);
          const csrf = match[1];
          const setCookie = res.headers['set-cookie'];
          request(app)
            .post('/posts')
            .set('cookie', setCookie)
            .send({ columnName: 'テスト更新予定1', memo: 'テスト更新メモ1', columnAuthor: 'テスト作者候補1', _csrf: csrf })
            .end((err, res) => {
              const createdColumnPath = res.headers.location;
              const columnId = createdColumnPath.split('/columnId/')[1];
              // 編集ができることをテスト
              request(app)
                .post(`/posts/columnId/${columnId}?delete=1`)
                .set('cookie', setCookie)
                .send({  _csrf: csrf })
                .end((err, res) => {
                  //const columnId = createdColumnPath.split('/columnId/')[1];
                  Column.findByPk(columnId).then((c) => {
                    assert.equal(!c, true);
                      if(err) {return done(err);}
                      else{
                        done();
                      }
                      
                    
                  });
                  
                 
                });
            });
        });
    });
  });
});

describe('/editor', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ id: 1356624428679892992, username: 'N202115309491' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('承認が行える', (done) => {
    User.upsert({ userId: 1356624428679892992, username: 'N202115309491' }).then(() => {
      request(app)
        .get(`/editor`)
        .



    });






    
  });