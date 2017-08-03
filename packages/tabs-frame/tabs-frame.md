###在使用 tabs-frame 组件时需要在嵌入进iframe里面的html页面添加如下代码，否则无法自适应高度：

<script type="text/javascript">
  /* Tabs-frame 组件中的 iframe 页面内嵌代码仅适用于同域名下有效 */
  function loadUpdate(){
    window.parent && 
    window.parent.parent && 
    window.parent.parent.tabsFrameUpdateCall &&
    window.parent.parent.tabsFrameUpdateCall();
  }
  if (window.attachEvent){ 
    window.attachEvent("onload", loadUpdate); 
  } else { 
    window.onload = loadUpdate; 
  } 
</script>