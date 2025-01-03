<template>
	<view class="addArt">
		<view class="addArt-C">
			<view class="addArt-I">
				<view class="head">
					<view class="reset" @click="reset">重置</view>
					<view><u-button @click="posts" size="mini" type="primary">发布</u-button></view>
				</view>
			</view>
			<view class="addArt-I">
				<view class="title">
					<input v-model="artCtx.title" placeholder="请输入标题"/>
				</view>
			</view>
			<view class="addArt-I">
				<view class="content">
					<textarea v-model="artCtx.content" auto-height maxlength="-1" class="textarea" placeholder="输入要发布的内容"></textarea>
				</view>
			</view>
			<view class="addArt-I">
				<view class="upIcon">
					<view class="upimg" @click="switchIcon(icon='img')">
						<uni-icons type="images" size="33" :color="currentIcon === 'img' ? '#03A9F4' : ''"></uni-icons>
					</view>
					<view class="uptv" @click="switchIcon(icon='tv')">
						<uni-icons type="videocam" size="33" :color="currentIcon === 'tv' ? '#03A9F4' : ''"></uni-icons>
					</view>
				</view>
				<view class="upBtn">
					<view class="img" v-if="currentIcon=='img'">
						<uni-file-picker 
						    ref="files"
						    v-model="imageValue" 
						    :auto-upload="false"
						    fileMediatype="image" 
						    mode="grid" 
						    @select="select"
						    @success="success"
						    file-extname="png,jpg"
							@delete="del"
						    :limit="9"
							title="上传图片"
						>
						    <uni-icons type="plusempty" size="20"></uni-icons>
						</uni-file-picker>
					</view>
					<view class="tv" v-if="currentIcon=='tv'">
						<uni-file-picker
						    ref="files"
						    v-model="imageValue" 
						    :auto-upload="false"
						    fileMediatype="video" 
						    @select="select"
						    @success="success"
						    :limit="1"
						>
						    <view class="tvCss">+</view>
						</uni-file-picker>
					</view>
				</view>
			</view>
			<view class="addArt-I">
				<view class="cell">
					<view class="cell-item" @click="openPop">
						<view class="cell-L">
							<u-icon class="iconL" name="moments" color="#16D46B" size="38"></u-icon>
							{{selText}}
						</view>
						<view class="cell-R">{{squareText}}<u-icon class="iconR" name="arrow-right" size="28"></u-icon></view>
					</view>
					<view class="cell-item">
						<view class="cell-L">显示文章</view>
						<view class="cell-R">
							<switch :checked="artCtx.art_status" @change="switchS"></switch>
						</view>
					</view>
					<view class="cell-item">
						<view class="cell-L">轮播图展示图片</view>
						<view class="cell-R">
							<switch :checked="artCtx.Carousel" @change="switchC"></switch>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="popup">
			<u-popup mode="bottom" v-model="popStatus">
				<view class="popup-ctx">
					<view class="pop-title">
						选择圈子
					</view>
					<square-item type="sel" @callBack="callBack"></square-item>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
import {onLoad} from "@dcloudio/uni-app"
import {apiAddArt,apiUpArt} from "@/api/api.js"
import { getCheck } from "@/utils/check.js"
const imageValue=ref([])
const imageSel=ref([])
const files = ref(null)
const popStatus=ref(false)
const squareText=ref("")
const selText=ref("未选择")
const artCtx=ref({
	title:"",
	user_id:"",
	taxonmoy_id:"",
	content:"",
	art_status:true,
	view_count:0,
	is_sticky:false,
	coverImg:[],
	coverVideo:[],
	Carousel:false
})
const currentIcon=ref("img")
const checked=ref(true)
const update=ref(false)
const selImg=ref([])
onLoad((e)=>{
	if(e && e.item){
		let item=JSON.parse(e.item)
		if("title" in item){
			update.value=true
			artCtx.value=item
			selText.value="已选择"
			artCtx.value.taxonmoy_id=item.taxonmoy_id
			artCtx.value._id=item._id
			squareText.value=item.taxName
			if(item.coverImg.length>0){
				item.imgList.forEach(item=>{
					let obj={
						url:item
					}
					imageValue.value.push(obj)
				})
			}
			console.log(artCtx.value.coverImg)
			console.log(imageValue.value)
			console.log(artCtx.value)
		}else{
			selText.value="已选择"
			artCtx.value.taxonmoy_id=item._id
			squareText.value=item.name
		}
	}
	getUser()
})
function getUser(){
	vk.userCenter.getCurrentUserInfo({
	  success:data => {
		artCtx.value.user_id=data.userInfo._id
	  }
	});
}
function del(e){
	if(artCtx.value.coverImg.length!=0){
		artCtx.value.coverImg.forEach(item=>{
			if(item==e.tempFilePath){
				let index = artCtx.value.coverImg.findIndex(item=>item==e.tempFilePath)
				console.log(index)
				artCtx.value.coverImg.splice(index,1)
			}
		})
		selImg.value.forEach(item=>{
			if(item.path==e.tempFilePath){
				let index = selImg.value.findIndex(item=>item.path==e.tempFilePath)
				selImg.value.splice(index,1)
			}
		})
	}
	imageSel.value=e.num.length-1
}
function select(e){
	//选择完图片后
	selImg.value.push(e.tempFiles[0])
	imageSel.value=e.tempFiles
	console.log(imageSel.value)
	console.log(selImg.value)
}
function posts(){
	console.log(imageSel.value)
	if(artCtx.value.title.length==0){
		vk.toast('文章标题不能为空');
		return
	}else if(artCtx.value.taxonmoy_id.length==0){
		vk.toast('至少选择一个分类目录');
		return
	}
	if(update.value){
		if(imageSel.value.length==0 || imageSel.value=="" || imageSel.value==null){
			post()
			return
		}
		if(selImg.value.length==0 || imageSel.value=="" || imageSel.value==null){
			post()
			return
		}
		files.value.upload()
		return
	}
	vk.showLoading('图片上传中');
	if(imageSel.value.length==0){
		post()
		return
	}
	//发布文章时先上传图片
	files.value.upload()
}
function success(e){
	//图片上传成功后的回调  在发布整个文章
	vk.hideLoading();
	console.log(e)
	if(currentIcon.value=='img'){
		let imgArr=[]
		imgArr=e.tempFiles.map(item=>{
			return item.url
		})
		artCtx.value.coverImg=[...artCtx.value.coverImg,...imgArr]
		post()
	}
	if(currentIcon.value=='tv'){
		artCtx.value.coverVideo=e.tempFiles[0].url
		post()
	}
	console.log(artCtx.value)
}
function openPop(){
	//打开分类选择
	popStatus.value=true
}
function callBack(item){
	popStatus.value=false
	squareText.value=item.name
	selText.value="已选择"
	artCtx.value.taxonmoy_id=item.id
}
function switchIcon(icon){
	switch (icon){
		case "img":
		   currentIcon.value='img'
		   artCtx.value.coverImg=[]
		   break;
		case "tv":
		   currentIcon.value='tv'
		   break;
	}
}
function reset(){
	//重置表单
	artCtx.value.content=""
}
function post(){
	let obj={
		title:artCtx.value.title,
		content:artCtx.value.content,
		openid:vk.getVuex('$user.userInfo')?.wx_openid?.['mp-weixin'] || "",
		scene:1
	}
	if(update.value){
		if("imgList" in artCtx.value){
			delete artCtx.value.imgList
		}
		getCheck(obj).then(res=>{
			if(res.isT){
				console.log(res)
				apiUpArt(artCtx.value).then(res=>{
					vk.toast('文章修改成功,即将跳转首页');
					setTimeout(()=>{
						vk.navigateTo('/pages/index/index');
					},1000)
				})
			}else{
				vk.toast(res.msg);
				return
			}
		})
		return
	}
	getCheck(obj).then(res=>{
		if(res.isT){
			console.log(res)
			apiAddArt(artCtx.value).then(res=>{
				vk.toast('发布成功,等待管理员审核');
				setTimeout(()=>{
					vk.navigateTo('/pages/my/myArt');
				},1000)
			})
		}else{
			vk.toast(res.msg);
		}
	})
}
function switchC(e){
	artCtx.value.Carousel=e.detail.value
	console.log(artCtx.value)
}
function switchS(e){
	artCtx.value.art_status=e.detail.value
	console.log(artCtx.value)
}
</script>

<style lang="scss">
	page{
		box-sizing: border-box;
	}
	.addArt{
		.addArt-C{
			padding:0 25rpx;
			.addArt-I{
				padding: 25rpx 0;
				.cell{
					.cell-item{
						@include flex;
						padding: 26rpx 32rpx;
						.cell-L{
							@include flex;
							.iconL{
								padding-right:15rpx;
							}
						}
						.cell-R{
							@include flex;
							margin-left: auto;
							.iconR{
								padding-right:15rpx;
							}
						}
					}
				}
				
				.head{
					@include flex;
					justify-content: space-between;
				}
				.title{
					input{
						// padding-left: 20rpx;
						// border-left: 3px solid #2979FF;
						font-size: 30rpx;
						font-weight: 550;
					}
				}
				.content{
					min-height: 350rpx;
					.textarea{
						width: 100%;
						border: 1px solid #BDBDBD;
						box-sizing: border-box;
						font-size: 27rpx;
						font-weight: 550;
						border: none;
						height: 450rpx;
					}
				}
				.upIcon{
					@include flex;
					.upimg{
						margin: 0 20rpx;
					}
					.uptv{
						margin: 0 20rpx;
					}
				}
				.upBtn{
					margin: 25rpx 0;
					.img{
						
					}
					.tv{
						.tvCss{
							padding: 100rpx 0;
							@include flex-center;
							background: #BDBDBD;
							font-size: 60rpx;
						}
					}
				}
			}
		}
		.popup{
			.popup-ctx{
				height: 90vh;
				width: 100vw;
				.pop-title{
					@include flex-center;
					padding: 25rpx 0;
					font-size: 28rpx;
					font-weight: 550;
				}
			}
		}
	}

</style>
