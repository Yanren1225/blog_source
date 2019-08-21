{% if page.type ==='picture' %}
  <script src="//cdn.jsdelivr.net/npm/minigrid@3.1.1/dist/minigrid.min.js"></script>
  <script src="/js/photo.js"></script>
{% endif %}

{% if page.type ==='kirbyimage' %}
  <script src="//cdn.jsdelivr.net/npm/minigrid@3.1.1/dist/minigrid.min.js"></script>
  <script src="/js/kirbyimage.js"></script>
{% endif %}

<script src="//cdn.jsdelivr.net/gh/lei2rock/blog/js/comment-locate.js"></script>
<script src="//cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget/autoload.js"></script>

<script>
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';        
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();
</script>
