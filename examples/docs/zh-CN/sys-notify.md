<script>
  export default {
    data() {
      return {
        msgCount: 5,
        msgData:[
          {
            c_msg_text:'消息内容A消息内容A消息内容A消息内容A消息内容A容A消息内容A容A消息内容A',
            d_msg_date:'2017-7-11',
            c_doc_no:'2345432345',
            c_doc_url:'/x/123243',
            c_status: 0
          },
          {
            c_msg_text:'消息内容B消息内容B消息内容B消息内容B消息内容B消息内容B',
            d_msg_date:'2017-8-11',
            c_doc_no:'2345432345',
            c_doc_url:'/x/123243',
            c_status: 0
          },
          {
            c_msg_text:'消息内容C消息内容C消息内容C消息内容C消息内容C消息内容C',
            d_msg_date:'2017-9-11',
            c_doc_no:'2345432345',
            c_doc_url:'/x/123243',
            c_status: 0
          }
        ]
      };
    },
    methods:{
      linkClick(item){
        console.log('linkClick', item);
      },
      moreClick(link){
        console.log('moreClick', item);
      },
      delMsg(item){
        this.msgData.splice(this.msgData.indexOf(item), 1);
        this.msgCount--;
        console.log('delMsg', item);
      }
    }
  }
</script>

## SysNotify 消息推送
 
### 基础用法

::: demo
```html
<sys-notify 
  :msg-data="msgData" 
  :msg-count="msgCount"
  @link-click="linkClick"
  @more-click="moreClick"
  @del-msg="delMsg"
  act-default 
  separate 
  scroller>
</sys-notify>

<script>
  export default {
    data() {
      return {
        msgCount: 5,
        msgData:[
          {
            c_msg_text:'消息内容A消息内容A消息内容A消息内容A消息内容A容A消息内容A容A消息内容A',
            d_msg_date:'2017-7-11',
            c_doc_no:'2345432345',
            c_doc_url:'/x/123243',
            c_status: 0
          },
          {
            c_msg_text:'消息内容B消息内容B消息内容B消息内容B消息内容B消息内容B',
            d_msg_date:'2017-8-11',
            c_doc_no:'2345432345',
            c_doc_url:'/x/123243',
            c_status: 0
          },
          {
            c_msg_text:'消息内容C消息内容C消息内容C消息内容C消息内容C消息内容C',
            d_msg_date:'2017-9-11',
            c_doc_no:'2345432345',
            c_doc_url:'/x/123243',
            c_status: 0
          }
        ]
      };
    },
    methods:{
      linkClick(item){
        console.log('linkClick', item);
      },
      moreClick(link){
        console.log('moreClick', item);
      },
      delMsg(item){
        this.msgData.splice(this.msgData.indexOf(item), 1);
        this.msgCount--;
        console.log('delMsg', item);
      }
    }
  }
</script>
```
:::

### msgData数据说明 
```
[
  {
    c_msg_text:消息内容
    d_msg_date:推送时间
    c_doc_no:业务单号
    c_doc_url:路由 
    c_status:状态       // 0 未读  1已读  2 删除
  }
]
```
### 属性参数

| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| msg-data   | 消息内容数据  |  Array     |    ——     |    ——  |
| msg-count   | 未读消息总数  |  Number     |    ——     |   0 |
| more   | 点击更多链接地址  |  String     |    ——     |   ——  |
| icon   | 消息提示图标  |  String     |    ——     |   el-icon-msgbell |
| step   | 消息滚动每步跨度，值越大越慢  |  Number     |    ——     |   2 |
| time   | 消息滚动每步反应时间（毫秒）  |  Number     |    ——     |   100 |
| act-default   | 点击链接时是否默认跳转  |  Boolean     |    ——     |  false |
| separate   | 是否显示右侧分隔竖线  |  Boolean     |    ——     |   false |
| scroller  | 是否显示滚动消息  |  Boolean     |    ——     |   false |
| target  | 目标打开方式  |  String     |    blank 或 self     |   self |
| msg-width  | 滚动窗口宽度  |  Number     |   ——    |   200 |
| msg-height  | 是否显示滚动消息  |  Number     |    ——     |   38 |
| pop-width  | 是否显示滚动消息  |  Number     |    ——     |   380 |
| placement  | 弹出窗口位置  |  String   |top/top-start/top-end/bottom/bottom-start/
bottom-end/left/left-start/left-end/right/right-start/right-end |   bottom |
| trigger  | 弹出窗口触发方式  |  String     | click/focus/hover/manual   |   hover |

### 事件  

| 事件名称 | 说明 | 回调参数 |
|---------|---------|---------| 
|  link-click | 消息链接点击事件     | (item)| 
|  more-click | 更多消息链接点击事件 | (link)| 
|  del-msg    | 消息删除事件        | (item)| 
