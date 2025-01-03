<template>
	<view class="page">
		<!-- 页面内容开始 -->
		<vk-data-page-header
			title="证书转换"
			subTitle="快速将证书内容变成1行字符串"
		></vk-data-page-header>
		<view class="page-body" style="width: 100%">
			<view style="color: red;font-size: 12px;">全程无网络请求（打开此页面后无网状态也能执行），直接在前端解析证书，没有证书泄露风险</view>
			<el-table :data="certList" style="width: 100%">
				<el-table-column prop="tips" label="说明" minWidth="300"> </el-table-column>
				<el-table-column prop="name" label="选择证书" minWidth="300">
					<template slot-scope="scope">
						<text style="margin-right: 20px;">{{ scope.row.name }}</text>
						<el-button type="success" @click="upload(scope.row)" size="mini" plain> {{ scope.row.content ? '已' : ''}}选择 {{ scope.row.file }} </el-button>
						<text style="margin-left: 20px;color: #c2e7b0;" v-if="scope.row.content && scope.row.file === scope.row.name"> √ </text>
						<text style="margin-left: 20px;color: red;" v-if="scope.row.content && scope.row.file !== scope.row.name"> × </text>
					</template>
				</el-table-column>
				<el-table-column prop="key4" label="选择后可复制" minWidth="200" >
					<template slot-scope="scope">
						<el-button type="success" @click="copy(scope.row.name)" size="mini" plain v-if="scope.row.content && scope.row.file === scope.row.name"> 复制 </el-button>
					<!-- 	<el-button type="success" size="mini" plain v-if="scope.row.content && scope.row.file === scope.row.name"> 请复制下方证书内容 </el-button> -->
					</template>
				</el-table-column>
			</el-table>

			<view class="tips mt15">
				<view class="mt15 json-view" v-if="form1">
					<view style="font-size: 14px;">证书内容</view>
					<pre>
						{{ form1 }}
					</pre>
				</view>
			</view>

		</view>
		<!-- 页面内容结束 -->
	</view>
</template>

<script>
	var that;													// 当前页面对象
	var vk = uni.vk;									// vk实例
	export default {
		data() {
			// 页面数据变量
			return {
				 certList: [
					{
						name: 'apiclient_cert.p12',
						tips: '微信支付v2需要用到的证书（wxpay.pfx）的值',
						file: '',
						content: '',
						key: 'wxpay.pfx'
					},
					{
						name: 'apiclient_cert.pem',
						tips: '微信支付v3需要用到的证书（wxpay.appCertContent）的值',
						file: '',
						content: '',
						key: 'wxpay.appCertContent'
					},
					{
						name: 'apiclient_key.pem',
						tips: '微信支付v3需要用到的证书（wxpay.appPrivateKeyContent）的值',
						file: '',
						content: '',
						key: 'wxpay.appPrivateKeyContent'
					},
					{
						name: 'alipayCertPublicKey_RSA2.crt',
						tips: '支付宝支付 - 支付宝公钥证书（alipay.alipayPublicCertContent）的值',
						file: '',
						content: '',
						key: 'alipay.alipayPublicCertContent'
					},
					{
						name: 'alipayRootCert.crt',
						tips: '支付宝支付 - 支付宝根证书（alipay.alipayRootCertContent）的值',
						file: '',
						content: '',
						key: 'alipay.alipayRootCertContent'
					},
					{
						name: 'appCertPublicKey.crt',
						tips: '支付宝支付 - 应用公钥证书（alipay.appCertContent）的值',
						file: '',
						content: '',
						key: 'alipay.appCertContent'
					}
				],
				// 表单相关开始-----------------------------------------------------------
				form1: {
					wxpay: {
						pfx: "",
						appCertContent: "",
						appPrivateKeyContent: "",
					},
					alipay: {
						alipayPublicCertContent: "",
						alipayRootCertContent: "",
						appCertContent: ""
					}
				},
				// 表单相关结束-----------------------------------------------------------

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
			upload(item={}){
				let { name, key } = item;
				let index = this.certList.findIndex((certItem) => {
					return name === certItem.name;
				});
				let suffix = name.substring(name.lastIndexOf(".") + 1);
				uni.chooseFile({
				  count: 1, //默认100
				  extension: [suffix],
					success: (res) => {
						let tempFile = res.tempFiles[0];
						if (name === "apiclient_cert.p12") {
							vk.pubfn.fileToBase64({
							  file: tempFile,
							  success: (base64) => {
									let base64Index = base64.indexOf("base64,");
									base64 = base64.substring(base64Index+"base64,".length);
									this.form1.wxpay.pfx = base64;
									this.certList[index].content = base64;
									this.certList[index].file = tempFile.name;
							  }
							});
						} else {
							const reader = new FileReader();
							reader.onload = () => {
								let result = reader.result;
								result = result.replace(/\r\n/g, "\n");
								vk.pubfn.setData(this.form1, key, result);
								this.certList[index].content = result;
							};
							reader.readAsText(res.tempFiles[0]);
							if (tempFile.name.indexOf("appCertPublicKey_") == 0) {
								tempFile.name = "appCertPublicKey.crt";
							}
							this.certList[index].file = tempFile.name;
						}
					}
				});
			},
			copy(name){
				let contentItem = this.certList.find((item) => {
					return name === item.name;
				});
				let content = contentItem.content;
				content = content.replace(/\n/g, "\\n");
				uni.setClipboardData({
					data: content,
					success: () => {
						vk.toast("复制成功");
					}
				});
			}
		},
		// 计算属性
		computed:{

		}
	}
</script>
<style lang="scss" scoped>

</style>
