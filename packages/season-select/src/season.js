import Month from './month';

export default{

  name: 'Season',

  componentName: 'Season',

  components:{
    Month
  },

  props: {
    months: Array, 
    store: Object,
    labelWidth: String, 
    seasonIndex: Number,          // 季序号
    periodType: [String, Number]  // 季周期类型    1：自然季， 2：非自然季-跨年， 3：非自然季-不跨年
  },

  computed:{
    labelTop(){
      if(this.periodType == 2){
        return '30px';
      }
      return '';
    }
  },

  render(h){
    
    return (
      <div class="season">
        <div class="left-label" style={{width: this.labelWidth, paddingTop: this.labelTop}}>
          <label>{ this.seasonIndex + 1 }</label>
        </div>
        <div class="right-buttons">
          <div class="current-year">
            {
              this.periodType == 2 ? <span class="prefix">当</span> : ''
            }
            {
              this._l(this.months, (item, $index)=>[
                $index < 12 
                ? <month 
                  store={ this.store }
                  index={ $index }
                  status={ item }
                  season-index={ this.seasonIndex }>
                  { $index + 1 }
                </month> : ''
              ])
            }
          </div>
          { 
            this.periodType == 2
              ? <div class="span-year">
                <span class="prefix">跨</span>
                {
                  this._l(this.months, (item, $index)=>[
                      $index > 11
                      ? <month 
                        store={ this.store }
                        index={ $index }
                        status={ item }
                        season-index={ this.seasonIndex }>
                        { $index - 11 }
                      </month> : ''
                  ])
                }
              </div> : ''
          }
        </div>
      </div>
    );
  }
};
