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
				@click="targetGo" 
				:class="{tapnomore:!om.subMenu}" 
				:clicked="om.clicked"
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
							@click="targetGo"
							:clicked="om.clicked" 
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
										@click="targetGo"
										:clicked="om.clicked"
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
											@click="targetGo"
											:clicked="om.clicked"
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
</div>
</template>
<script>
const MAIN_MENUS = window.ComponentsConfig ? window.ComponentsConfig.MAIN_MENUS : [];

export default {
	name: 'NavMenus',
	props: {
		clicked: {
			type: Boolean,
			default: false
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
		}
	},
	data() {
		return {
			toggleHide: false,   // 默认隐藏子菜单
			guideData: [],        // 指示数据
			homeShow: true
		};
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
		// 导航处理
		targetGo(e) {
			let $this = this, attrs = e.target.attributes;
			let Path = attrs['url'];
			let clicked = attrs['clicked'] ? (attrs['clicked'].value === 'true') : this.clicked;

			if (Path) {
				clicked ? this.$emit('menu-click', Path.value) : location.href = Path.value;
				this.toggleHide = true;
				setTimeout(function () { $this.toggleHide = false; }, 1000);
			}
		}
	}
};
</script>
