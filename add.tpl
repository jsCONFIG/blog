<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <link rel="stylesheet" type="text/css" href="stylesheets/stylesheet.css" media="screen">
    <link rel="stylesheet" type="text/css" href="stylesheets/github-light.css" media="screen">
    <link rel="stylesheet" type="text/css" href="stylesheets/print.css" media="print">

    <!--[if lt IE 9]>
    <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <title>新建文章 BottleLiu Blog</title>
  </head>

  <body>

    <div id="content-wrapper" style="width: 1000px;margin: 10px auto;">
      <div class="inner clearfix">
        <section id="main-content">
          <form action="/submit" method="post" id="form">
            <h3>
              <a class="anchor" href="#top" aria-hidden="true"><span class="octicon octicon-link"></span></a>
              文章标题<input type="text" name="title" />
            </h3>
            <h3>
              <a class="anchor" href="#" aria-hidden="true"><span class="octicon octicon-link"></span></a>
              文件名<input type="text" name="filename" />
            </h3>
            <div contenteditable="true" style="width: 900px;min-height: 300px;border: 1px solid #cfcfcf;border-radius: 3px;" id="editBlock"></div>
            <textarea name="content"  id="textInput" style="display:none;"></textarea>
            <br>
            <button type="button" id="submitNd">提交</button>
          </form>
        </section>
      </div>
    </div>
    <script type="text/javascript">
    ~function () {
      var btn = document.getElementById('submitNd'),
        formNd = document.getElementById('form'),
        editBlock = document.getElementById('editBlock'),
        editInput = document.getElementById('textInput');

        btn.addEventListener('click', function () {
          editInput.value = editBlock.innerHTML;
          formNd.submit();
        });
    } ();
    </script>
  </body>
</html>