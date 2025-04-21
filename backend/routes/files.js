const server = require('../server');
const Router = require('koa-router');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

const router = new Router();

router.get('/files', async (ctx) => {
  try {
    const files = fs.readdirSync(server.public);
    ctx.body = {
      success: true,
      files: files.filter(
        file => fs.statSync(
          path.join(server.public, file)
        ).isFile()
      )
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { 
      success: false, 
      error: 'Failed to read directory' 
    };
  }
});

router.post('/files', async (ctx) => {
  let { file } = ctx.request.files;
  const { body } = ctx.request;
  file.originalName = file.name;
  server.db.saveFile(file);
  server.db.addFileMessage(file, body);
  ctx.response.body = { 
    success: true 
  };
});

router.get('/files/:filename', async (ctx) => {
  try {
    const filename = path.basename(ctx.params.filename);
    const filePath = path.join(server.public, filename);
    if (!fs.existsSync(filePath)) {
      ctx.status = 404;
      ctx.body = 'File not found';
      return;
    }
    const mimeType = mime.lookup(filename) || 'application/octet-stream';
    ctx.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': mimeType,
      'Content-Length': fs.statSync(filePath).size
    });
    ctx.body = fs.createReadStream(filePath);
  } catch (err) {
    ctx.status = 500;
    ctx.body = 'Server error';
    console.error('File download error:', err);
  }
});

module.exports = router;
