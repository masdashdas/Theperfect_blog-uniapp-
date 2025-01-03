<template>
	<view class="page">
		<!-- 页面头部内容开始 -->
		<vk-data-page-header
			title="富文本编辑器"
			subTitle="tinymce"
			@back="pageBack"
		></vk-data-page-header>
		<!-- 页面头部内容结束 -->
		<view class="page-body">
			<!-- 页面主体内容开始 -->
			<view style="display: flex;">
				<el-button @click="setContent('<p>123</p>')">设置固定值123</el-button>
				<el-button @click="setContent('<p>789</p>')">设置固定值789</el-button>
				<el-button @click="save">保存草稿</el-button>
				<el-button @click="restore">从草稿恢复</el-button>
				<el-button @click="setContent('')">清空</el-button>
				<el-select v-model="language.value" placeholder="语言" :clearable="false" style="margin-left: 10px;width: 150px;">
					<el-option v-for="item in language.list" :key="item.value" :label="item.label" :value="item.value"> </el-option>
				</el-select>
			</view>
			<view style="display: flex;flex-direction: column;margin-top: 20px;">
				<view style="flex:1;">
					<custom-editor-tinymce ref="editorTinymce1" id="editor-tinymce" v-model="content" scene="form" placeholder="开始输入..." :language="language.value" :width="750" :height="800"></custom-editor-tinymce>
				</view>
				<view style="flex:1;">
					<view style="display: block; font-size: 35px;font-family: kaiti;color: red;"> HTML效果展示 </view>
					<custom-editor-tinymce id="editorTinymce2" v-model="content" scene="detail" placeholder="开始输入..." :language="language.value" :width="750" class="custom-editor-tinymce-detail"></custom-editor-tinymce>
				</view>
			</view>


			<view class="tips" style="margin-top: 50px;">
				<view style="display: block; font-size: 35px;font-family: kaiti;color: red;"> HTML源码 </view>
				<view class="json-view" v-if="content">
					<pre>
						{{ content }}
					</pre>
				</view>
			</view>

			<!-- 页面主体内容结束 -->
		</view>
	</view>
</template>

<script>
	var that;													// 当前页面对象
	var vk = uni.vk;									// vk实例
	export default {
		data() {
			// 页面数据变量
			return {
				content:"",
				language: {
					value: "zh-Hans",
					list: [
						{ value:"zh-Hans", label: "中文简体" },
						{ value:"zh-Hant", label: "中文繁体" },
						{ value:"en", label: "英文" },
					]
				}
			}
		},
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad(options = {}) {
			that = this;
			vk = that.vk;
			that.options = options;
			that.init(options);
		},
		// 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
		onReady(){

		},
		// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
		onShow() {


		},
		// 监听 - 页面每次【隐藏时】执行(如：返回)
		onHide() {


		},
		// 函数
		methods: {
			// 页面数据初始化函数
			init(options){

			},
			setContent(val){
				this.content = val;
			},
			save(){
				// 方案一
				vk.setStorageSync(`editor-draft-${vk.pubfn.getCurrentPageRoute()}`, this.content);
				// 方案二
				// this.$refs.editorTinymce1.save();
			},
			restore(){
				// 方案一
				this.content = vk.getStorageSync(`editor-draft-${vk.pubfn.getCurrentPageRoute()}`);
				// 方案二
				// this.$refs.editorTinymce1.restore();
			}
		},
		// 监听器
		watch:{

		},
		// 计算属性
		computed:{

		}
	}
</script>
<style lang="scss" scoped>

</style>
