<template>
<div class="nav-box">
	<nav id="main-navbody" class="main-nav">
	<ul class="main container" :class="{'hide-submenu':toggleHide}">
		<li 
			class="menu-cell" 
			@mouseover="menuAlign" 
			v-for="(om, idxom) in cpMenusData"
			:key="idxom">
			<span class="tap" 
				@click="routeGo" 
				:class="{tapnomore:!om.subMenu}" 
				:url="om.url" 
				v-text="om.label">
			</span>

			<ul class="list-box-l1">
				<li 
					class="sub-cell-l1" 
					v-for="(sub, idxsub) in om.subMenu" 
					:key="idxsub"
					:class="{'el-icon-caret-right': !!sub.subMenu.length}">
						<h3 
							class="sub-tap" 
							:class="sub.icon" 
							@click="routeGo" 
							:url="sub.url" 
							v-show="sub.label" 
							v-text="sub.label">
						</h3>
					<ul class="list-box-l2" v-if="!!sub.subMenu.length">
							<li 
								class="sub-cell-l2" 
								v-for="(sub2, idxsub2) in sub.subMenu"
								:key="idxsub2"
								:class="{'el-icon-caret-right': !!sub2.subMenu.length}">
									<h3 
										class="sub-tap" 
										:class="sub2.icon"
										@click="routeGo" 
										:url="sub2.url" 
										v-text="sub2.label">
									</h3>
								<ul class="list-box-l3" v-if="!!sub2.subMenu.length">
									<li 
										class="sub-cell-l3" 
										v-for="(sub3, idxsub3) in sub2.subMenu" 
										:key="idxsub3">
										<span 
											class="sub-tap" 
											:class="sub3.icon" 
											@click="routeGo" 
											:url="sub3.url" 
											v-text="sub3.label">
										</span>
									</li>
								</ul>
							</li>
					</ul>
				</li>
			</ul>
		</li>
	</ul>
	</nav>
	<div class="indicantor fwidth" v-show="!homeHide">
		<a 
			v-for="(item, index) in guideData"
			:key="index" 
			:href="item.url" >
			{{item.label}}
		</a>
	</div>
</div>
</template>
<script>
import { TypeOf } from 'element-ui/src/utils/funcs';
const MAIN_MENUS = window.COMPONENTS_CONFIG ? window.COMPONENTS_CONFIG.MAIN_MENUS : [];

export default {
	name: 'main-nav',
	props: {
		homeHide: {
			type: Boolean,
			default: true
		},
		menusData: {
			type: Array,
			required: false,
			default: function () {
				return MAIN_MENUS;
			}
		}
	},
	computed: {
		// 过滤 subMenu
		cpMenusData() {
			let data = this.menusData || MAIN_MENUS;
			for (let cell of data) {
				for (let sub of cell['subMenu']) {
					if (!sub['label'] || !(/[\W\w]+/i.test(sub['label']))) {
						sub['label'] = false;
					}
				}
				if (cell['subMenu'] && cell['subMenu'].length < 1) {
					cell['subMenu'] = false;
				}
			}
			return data;
		},
		pathname() {
			return location.pathname.replace(/^\//, '');
		}
	},
	data() {
		return {
			toggleHide: false,   // 默认隐藏子菜单
			guideData: [],        // 指示数据
			homeShow: true,
			hashMenus: location.hash.replace('#/', '').split('/')
		};
	},

	watch: {
		hashMenus(n, o) {
			if (n !== o) {
				this.initIndicant();
			}
		}
	},

	methods: {
		// 菜单定位
		menuAlign(e) {
			var bodyEl = document.querySelector('body');
			var eOffsetLeft = e.currentTarget.offsetLeft;
			var menuCell = e.currentTarget;

			if (bodyEl.clientWidth * 0.6 < eOffsetLeft) {
				var clss = menuCell.className.split(' ');
				if (clss) {
					if (clss.indexOf('toleft', 0)) menuCell.className = menuCell.className + ' toleft';
				} else {
					menuCell.className = ' toleft';
				}
			}
		},
		// 路由处理
		routeGo(e) {
			let regx = /(\w+\-?\w+)+\.html/i;
			let _Path = e.target.attributes['url'], $this = this;

			if (_Path) {
				let path = _Path.value.match(regx) ? _Path.value.match(regx)[0] : '';
				/** 支持 ~/ 跳转到根目录导航 */
				if(/^~\//g.test(_Path.value)){
					location.href = '//' + location.host + _Path.value.replace(/^~\//g, '/');
				}else{
					location.href = '//' + location.host +
					location.pathname.replace(regx, '') + path + '#' +
					_Path.value.replace(regx, '');
				}
				
				this.toggleHide = true;
				setTimeout(function () { $this.toggleHide = false; }, 1000);
			}
			this.hashMenus = location.hash.replace('#/', '').split('/');
		},
		// 获取指示器数据
		indicantPath(path, subMenus) {
			let regxhtm = /(\w+\-?\w+)+\.html/i, guideData = this.guideData;
			let regx = /\/$/, this$1 = this, isFind = false;

			path = path.replace(regx, '');

			if (TypeOf(subMenus) === 'Array') {

				subMenus.forEach(function (item) {

					if (item.url && item.url.indexOf(path) !== -1 &&
						item.url.replace(regx, '').length === path.replace(regx, '').length) {

						guideData.push({
							label: item.label,
							url: guideData[0]['url'] + '#' + item.url.replace(regxhtm, '')
						});
						isFind = true;
					}
					if (!isFind && TypeOf(item.subMenu) === 'Array') {
						this$1.indicantPath(path, item.subMenu);
					}
				});
			}
		},
		//初始化指示器
		initIndicant() {
			let i, path, submeuns, this$1 = this, homeUrl = 'index.html';
			let pathname = this.pathname, hashMenus = this.hashMenus;
			let home = MAIN_MENUS[0]
				? { label: MAIN_MENUS[0]["label"], url: MAIN_MENUS[0]["url"] }
				: { label: '首页', url: 'index.html' };
			this$1.guideData = [];
			this$1.guideData.push(home);
			// 获取当前单页面首地址
			MAIN_MENUS.forEach(function (item) {
				if (item.url && item.url.indexOf(pathname) !== -1) {
					homeUrl = this$1.guideData[0]["url"] = item.url;
					this$1.guideData[0]["label"] = item.label;
					submeuns = item.subMenu;
				}
			});

			for (i = 0; i < hashMenus.length; i++) {
				if (path) {
					path += '/' + hashMenus[i];
				} else {
					path = homeUrl + '/' + hashMenus[i];
				}
				this.indicantPath(path, submeuns);
			}

			this.$nextTick(function () {
				if (this.guideData.length < 2 && this.homeHide) {
					this.homeShow = false;
				}
			});
		}
	},
	mounted() {
		this.initIndicant();
	}
};
</script>
