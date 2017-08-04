import validatorSchema  from 'async-validator';
import Notification from 'element-ui/packages/notification';
import { TypeOf, ToPlainObject } from 'element-ui/src/utils/funcs';  //引入类型判断

/**
 * author liuxp
 * 验证 Form-table 表单数据
 * @data [Array, Object] 需要验证的数据
 * @rules 验证规则 https://github.com/yiminghe/async-validator
 * @title [ String ] 弹出错误提示头信息
 * 返回 true | false 表单是否验证成功
 */
export const ValidateSubmitForm = (data, rules, title)=> {

  if(TypeOf(data)==='Object' || TypeOf(data)==='Array'){
    let _title = title || '验证错误';
    let arrData = TypeOf(data) === 'Object' ? [data] : data;
    // 表单提交验证
    let errorsbox=[], vobj = ToPlainObject(arrData);  //转换为纯数据对象
    let validator = new validatorSchema(rules);
    
    for(let i=0, o, e, f; i<vobj.length, o=vobj[i]; i++){
      validator.validate(o, (errors, fields) => {
        if(errors) {
          e = errors[0], f = e['field'];
          return errorsbox.push({msg:e['message'], f:f, v:o[f]});
        }
        // validation passed
      });
    }

    let err = '';
    for(let j=0, errobj; j<errorsbox.length, errobj=errorsbox[j]; j++){
        err+= '<p>值为（'+ errobj.v +'）的输入错误：'+ errobj.msg+'；</p>';
    }
    if(errorsbox.length>0){    // 判断 errorsbox 是否为空，为空则通过验证，不为空则打印出来告诉用户
      Notification.error({ title: _title, message: err });
      return false;
    }else{
      return true;
    }
  }else{
    return false;
  }
};
