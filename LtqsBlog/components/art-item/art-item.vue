<template>
	<view class="art-item" @click="ToArt(prpop.item._id)">
		<view class="art-ctx">
			<view class="art-head">
				<view class="art-head-R">
					<image @click.stop="Touserinfo(prpop.item.userInfo._id)" mode="aspectFill" :src="avatar(prpop.item.userInfo)"></image>
					<view class="user">
						<view class="name">{{username(prpop.item.userInfo)}}</view>
						<view class="gxqm">{{gxqm(prpop.item.userInfo)}}</view>
					</view>
				</view>
				<view class="art-head-L">
					<view class="art-head-L-c" @click.stop="OpensheetFn">
						<view class="iconS"></view>
						<view class="iconS"></view>
						<view class="iconS"></view>
					</view>
				</view>
			</view>
			<view class="art-center">
				<view class="art-title">
					{{prpop.item.title}}
				</view>
				<view class="art-desc">
					{{prpop.item.content}}
				</view>
				<view v-if="prpop.item.coverVideo.length==0" class="art-C-img" :class="prpop.item.coverImg.length==1?'imgStyle1':(prpop.item.coverImg.length==2)?'imgStyle2':'imgStyle3'">
					<image v-for="(items,index) in prpop.item.coverImg" mode="aspectFill" :src="items"></image>
					<view class="imgicon" v-if="imgNum>3">
						<u-icon name="photo"></u-icon>
						{{imgNum}}
					</view>
				</view>
				<view class="art-C-tv" v-else>
					<video @click.stop="TvClick" :autoplay="false" :src="prpop.item.coverVideo"></video>
				</view>
			</view>
			<view class="art-bottom">
				<view class="category" v-if="prpop.item.taxonomy" @click.stop="Tosquare(prpop.item.taxonmoy_id)">
					<view class="category-icon"><image mode="aspectFill" src="../../static/img/square.png"></image></view>
					<view class="category-name">{{prpop.item.taxonomy.name}}</view>
				</view>
				<view class="art-info">
					<view class="art-info-C">
						<view class="art-info-R">
							{{prpop.item._add_time_str.slice(0,10)}}
						</view>
						<view class="art-info-L">
							<view class="art-info-I">
								<image mode="aspectFill" src="/static/img/look.png"></image>
								{{prpop.item.view_count}}
							</view>
							<view class="art-info-I">
								<image mode="aspectFill" src="/static/img/comments.png"></image>
								{{prpop.item.comment_count}}
							</view>
							<view class="art-info-I">
								<image mode="aspectFill" src="/static/img/like.png"></image>
								{{prpop.item.like_count}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<u-action-sheet @click="sheetFn" :safe-area-inset-bottom="true" z-index="9999" border-radius="25" :list="sheetList" v-model="actionSheet"></u-action-sheet>
</template>

<script setup>
	import {ref} from "vue"
	import {avatar,username,gxqm} from "@/utils/utils.js"
	import {apiDelUserArt,apiUpAdminArt} from "@/api/api.js"
	const isPlaying = ref(false)
	const prpop=defineProps(["item"])
	const actionSheet=ref(false)
	const imgNum=ref(0)
	const imgList=ref(null)
	const sheetList=ref([
		{
			text: '编辑文章',
			disabled:prpop.item.user_id==vk.getVuex('$user.userInfo')._id?false:true,
		},
		{
			text: '删除文章',
			disabled:prpop.item.user_id==vk.getVuex('$user.userInfo')._id?false:true,
			color:"#F44336"
	    }])
	const IsAdmin=ref(false)
	IsAdmin.value=uniCloud.getCurrentUserInfo().role.indexOf('admin')>-1
	if(IsAdmin.value){
		let obj=[{text:'审核通过',disabled:prpop.item.Audit==0},{text:'退回审核',disabled:prpop.item.Audit==2}]
		sheetList.value.push(...obj)
	}
	imgList.value=prpop.item.coverImg
	if(prpop.item.coverImg.length>3){
		let num=prpop.item.coverImg.length
		imgNum.value=num
		prpop.item.coverImg=prpop.item.coverImg.slice(0,3)
	}
	function ToArt(id){
		//跳转到文章界面
		vk.navigateTo('/pages/art/art?id='+id);
	}
	function Tosquare(id){
		//跳转到分类详情
		vk.navigateTo('/pages/square/squareInfo?id='+id);
	}
	function Touserinfo(id){
		//跳转到用户中心
		vk.navigateTo("/pages/userinfo/userinfo?id="+id)
	}
	function OpensheetFn(){
		actionSheet.value=true
	}
	function TvClick(){
		isPlaying.value = true
		// onplay()
	}
	function sheetFn(e){
		console.log(e)
		if(e==0){
			//跳转到编辑文章页面
			let objs=prpop.item
			objs.imgList=imgList.value
			console.log(objs)
			let artCtx = {
			  _id:"",
			  title: "",
			  user_id: "",
			  taxonmoy_id: "",
			  content: "",
			  art_status: true,
			  view_count: 0,
			  is_sticky: false,
			  coverImg: [],
			  coverVideo: [],
			  Carousel: false,
			  imgList: [],
			  taxName:""
			};
			
			// 明确指定需要赋值的属性
			artCtx._id=objs._id
			artCtx.title = objs.title || artCtx.title;
			artCtx.user_id = objs.user_id || artCtx.user_id;
			artCtx.taxonmoy_id = objs.taxonmoy_id || artCtx.taxonmoy_id; // 注意：此处修正了变量名拼写错误
			artCtx.taxName=objs.taxonomy.name
			artCtx.content = objs.content || artCtx.content;
			artCtx.art_status = objs.art_status !== undefined ? objs.art_status : artCtx.art_status;
			artCtx.view_count = objs.view_count !== undefined ? objs.view_count : artCtx.view_count;
			artCtx.is_sticky = objs.is_sticky !== undefined ? objs.is_sticky : artCtx.is_sticky;
			artCtx.coverImg = Array.isArray(objs.imgList) ? [...objs.imgList] : artCtx.imgList; // 如果是数组，进行深拷贝
			artCtx.coverVideo = Array.isArray(objs.coverVideo) ? [...objs.coverVideo] : artCtx.coverVideo; // 同样深拷贝
			artCtx.Carousel = objs.Carousel !== undefined ? objs.Carousel : artCtx.Carousel;
			artCtx.imgList = Array.isArray(objs.imgList) ? [...objs.imgList] : artCtx.imgList;
			let obj=JSON.stringify(artCtx)
			vk.navigateTo('/pages/art/addArt?item='+obj)
		}
		if(e==1){
			//删除文章的操作
			// let pages = getCurrentPages();
			// console.log(pages)
			// console.log(pages[0].$page.fullPath)
			vk.confirm("确定删除文章?", (res) => {
			  if (res.confirm) {
			    // 点击确定按钮后的回调
				let obj={
					user_id:vk.getVuex('$user.userInfo')._id,
					_id:prpop.item._id
				}
				apiDelUserArt(obj).then(res=>{
					let pages = getCurrentPages();
					vk.redirectTo(pages[0].$page.fullPath);
				})
			  }
			});
		}
		if(e==2){
			//审核通过文章
			console.log("审核通过")
			let data={
				_id:prpop.item._id,
				Audit:0
			}
			apiUpAdminArt(data).then(res=>{
				vk.reLaunch('/pages/Admin/Art')
				console.log(res)
			})
		}
		if(e==3){
			//退回审核文章
			let data={
				_id:prpop.item._id,
				Audit:2
			}
			apiUpAdminArt(data).then(res=>{
				vk.reLaunch('/pages/Admin/Art')
				console.log(res)
			})
		}
	}
</script>

<style lang="scss">
      .art-item{
		  margin-top: 25rpx;
		 .art-ctx{
			 // background: #E0E0E0;
			 border-radius: 15rpx;
			 padding: 0 25rpx;
			box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
			 .art-head{
				 padding: 20rpx 0;
				 @include flex;
				 .art-head-R{
					 @include flex;
					 width: 80%;
					 image{
						 height: 70rpx;
						 width: 70rpx;
						 border-radius: 50%;
					 }
					 .user{
						 padding: 0 15rpx;
						 width: 85%;
						 .name{
							 font-size: 28rpx;
							 font-weight: 550;
						 }
						 .gxqm{
							 color: #9E9E9E;
							 font-size: 25rpx;
							 padding: 5rpx 0;
							 @include ellipsis(1);
						 }
					 }
				 }
				 .art-head-L{
					 margin-left: auto;
					 width: 20%;
					 .art-head-L-c{
						 width: 100%;
						 @include flex;
						 justify-content: flex-end;
						 height: 50rpx;
						 .iconS{
							 height: 11rpx;
							 width: 11rpx;
							 border-radius: 50%;
							 margin: 0 4rpx;
						 }
						 .iconS:nth-child(1){
							 background: #FC5F56;
						 }
						 .iconS:nth-child(2){
						 	background: #F9BE37;
						 }
						 .iconS:nth-child(3){
						 	background: #20C637;
						 }
					 }
				 }
			 }
			 .art-center{
				 .art-C-img{
					 position: relative;
					 &.imgStyle1{
						 image{
						 	width: 100%;
						 	height: 360rpx;
						 	border-radius: 15rpx;
						 }
					 }
					 &.imgStyle2{
					 	image{
					 		width: 49%;
					 		height: 280rpx;
							margin: calc(2% / 4);
					 		border-radius: 15rpx;
					 	}					 
					 }
					 &.imgStyle3{
					 	image{
					 		width: 32%;
					 		height: 210rpx;
					 		margin: calc(4% / 6);
					 		border-radius: 10rpx;
					 	}					 
					 }
					 .imgicon{
						 background: rgba(0,0,0,0.4);
						 width: fit-content;
						 padding: 5rpx 10rpx;
						 position: absolute;
						 right: 20rpx;
						 bottom: 40rpx;
						 border-radius: 10rpx;
						 color: #fff;
					 }
				 }
				 .art-C-tv{
					 width: 100%;
					 height: 360rpx;
					 border-radius: 25rpx;
					 video{
					 	width: 100%;
					 	height: 360rpx;
					 	border-radius: 25rpx;
						object-fit: cover;
					 }
				 }
				 .art-title{
					 margin: 10rpx 0;
					 font-weight: 550;
					 font-size: 29rpx;
				 }
				 .art-desc{
					 @include ellipsis(2);
					 margin: 10rpx 0;
				 }
			 }
			 .art-bottom{
				 margin: 20rpx 0;
				 .category{
					 // border: 1px solid #BDBDBD;
					 height: fit-content;
					box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
					 width: fit-content;
					 border-radius: 35rpx;
					 padding:10rpx 20rpx;
					 @include flex;
					 font-size: 25rpx;
					 // margin-left: auto;
					 .category-icon{
						padding-right: 10rpx;
						@include flex;
						image{
							width: 38rpx;
							height: 38rpx;
							border-radius: 50%;
						}
					 }
					 .category-name{
						 
					 }
				 }
				 .art-info{
					 padding: 25rpx 0;
					 .art-info-C{
						 @include flex;
						 .art-info-R{
							 width:50%;
							 color: #9E9E9E;
						 }
						 .art-info-L{
							 width:50%;
							 @include flex; 
							 justify-content: space-between;
							.art-info-I{
								@include flex;
								color: #9E9E9E;
								image{
									height: 56rpx;
									width: 56rpx;
								}
							} 
						 }
					 }
				 }
			 }
		 } 
	  }
</style>