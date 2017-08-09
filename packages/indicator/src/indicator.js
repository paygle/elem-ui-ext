// 独立的导航指示器
import { on,off } from 'element-ui/src/utils/dom';

export default {

  name: 'Indicator',

  props: {
    pathData: Object    // 路径数据
  },

  data(){
    return{
      pathList:[]
    };
  },
  
  watch:{
    pathData:{
      immediate: true,
      handler(val){
        if(val){
          this.initPathList(val);
        }
      }
    }
  },

  methods:{

    initPathList(pathData){

      let paths = this.getCurrentPath();
      let routedata = pathData || this.pathData;
      let pathName = paths[0];
      let pathList = [];

      function getLink(name){
        let pathStr = pathName;
        for(let j=0; j<pathList.length; j++){
          pathStr += "/" + pathList[j]['name'];
        }
        return pathStr + "/" + name;
      }

      function getLabel(name){
        let currentObj={}, cname='';
        let listLen = pathList.length;

        if(routedata){

          if(listLen>0){
            for(let k=0; k<listLen; k++){
              cname = pathList[k]['name'];
              if(routedata[cname] && k===0){
                currentObj = routedata[cname];
              }else if(currentObj.children && currentObj.children[cname]){
                currentObj = currentObj.children[cname];
              }else if(k < listLen - 1){
                return '';
              }
            }
            if(currentObj.children && currentObj.children[name]){
              return currentObj.children[name]['label'];
            }else{
              return '';
            }

          }else if(routedata[name]){
            return routedata[name]['label'] || '';
          }
          
        }
        return '';
      }

      for(let i=0; i<paths.length; i++){
        if(i===1 && paths[1] === '#'){
          pathName += '#';
        }else if(i>0){
          pathList.push({
            name: paths[i],
            label: getLabel(paths[i]),
            link: getLink(paths[i])
          });
        }
      }
      this.pathList = pathList;
    },

    getCurrentPath(){
      let hashPath = String(location.hash).split('/');
      let paths = [];
      paths.push(location.pathname);
      // paths.concat(hashPath);
      return paths.concat(hashPath);
    },

    getCellContent(h, item, $index){
      let angleIcon = $index<this.pathList.length -1 ? 'el-icon-arrow-right' : '';
      return <a class={ angleIcon } href={ item.link }>{ item.label }</a>;
    },

    onClickInit(){
      setTimeout(()=>{ this.initPathList(this.pathData); }, 300);
    }
  },

  mounted(){
    on(document.querySelector('body'), 'click', this.onClickInit);
  },
  beforDestroy(){
    off(document.querySelector('body'), 'click', this.onClickInit);
  },
  render(h){
    return (
      <div class="single-indicator el-icon-home">
        {
          this._l(this.pathList, (item, $index)=>[ this.getCellContent(h, item, $index) ])
        }
      </div>
    );
  }
};
