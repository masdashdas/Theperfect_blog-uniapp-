<template>
	<view class="index">
		<custom-tabbar-item>
			<template #custom>
				<view class="search" @click="Tosearch">
					<u-icon name="search" color="#E0E0E0" size="28"></u-icon>
					<text>搜索</text>
				</view>
			</template>
		</custom-tabbar-item>
		<view :style="{height:BarHeight()+'px'}"></view>
		<view class="banner">
			<view class="banner-ctx">
				<swiper class="banner-swiper" circular indicator-dots>
					<swiper-item class="banner-swiper-item" v-for="banner in bannerList" :key="banner._id" @click="goBannerLink(banner)">
						<image mode="aspectFill" :src="banner.bannerfile"></image>
					</swiper-item>
				</swiper>
			</view>
		</view>
		
		<u-tabs v-if="tabsStatus" inactive-color="#000" active-color="#000" font-size="25" :list="tabList" :is-scroll="true" v-model="tabCurrent" @change="tabChange"></u-tabs>
		
		<view class="art">
			<view v-if="loading">
				<skeleton-item1 :num="4"></skeleton-item1>
			</view>
			<view v-else>
				<view v-if="artList.length!=0">
					<art-item v-for="item in artList" :key="item._id" :item="item"></art-item>
					<loading-item v-if="btm" :status="noMore"></loading-item>
				</view>
				<view v-else style="padding-top: 250rpx;">
					<Empty-item mode="art"></Empty-item>
				</view>
			</view>
		</view>
	</view>
</template>


<script setup>
	import {onMounted, ref} from "vue"
	import { apiGetBanner,apiGetArt,apiGetIndexTax} from "@/api/api";
	import {onLoad,onReachBottom,onShareTimeline,onShareAppMessage} from "@dcloudio/uni-app"
	import { BarHeight } from "@/utils/system";
	const param=ref({pageIndex:1,taxonmoy:""})
	const tabList=ref([
		{name:"首页",value:""},
		{name:"推荐",value:"sticky"}
	])
	const tabsStatus=ref(false)
	const tabCurrent=ref(0)
	const artList=ref([])
	const loading=ref(true)
	const noMore=ref(false)
	const btm=ref(false)
	onShareAppMessage((res)=>{
		
	})
	//分享盆友圈
	onShareTimeline((res)=>{
		
	})
	onMounted(()=>{
		getBaner()
		getArt()
		getIndexTax()
	})
	onReachBottom(()=>{
		btm.value=true
		//触底加载
		if(noMore.value){
			return
		}
		param.value.pageIndex+=1
		getArt()
		
	})
	
	const bannerList=ref({});
	
	function Tosearch(){
		vk.navigateTo('/pages/search/search');
	}
	function ToArt(id){
		vk.navigateTo('/pages/art/art?id='+id)
	}
	function tabChange(e){
		param.value.taxonmoy=tabList.value[e].value
		param.value.pageIndex=1
		artList.value=[]
		loading.value=true
		noMore.value=false
		getArt()
	}
	function getBaner(){
		//获取轮播图内容地址
		apiGetBanner().then(res=>{
			bannerList.value=res.result.rows
		})
	}
	function goBannerLink(item){
		console.log(item)
		//轮播图跳转地址
		if(item.open_url){
			console.log(item.open_url)
		}else{
			console.log("没有跳转地址")
		}
	}
	function getArt(){
		//获取文章内容
		apiGetArt(param.value).then(res=>{
			loading.value=false
			if(res.result.length==0){
				noMore.value=true
			}
			let newArr=res.result;
			artList.value=[...artList.value,...newArr]
		})
	}
	function getIndexTax(){
		apiGetIndexTax().then(res=>{
			res.result.forEach(item=>{
				let obj={
					name:item.name,
					value:item.taxonomy_id
				}
				tabList.value.push(obj)
			})
			tabsStatus.value=true
			console.log(tabList.value)
		})
	}
	
</script>
<style lang="scss" scoped>
	.index{
		// padding: 25rpx;
		.search{
			@include flex;
			background: rgba(255,255,255,0.8);
			border: 1px solid #EEEEEE;
			padding: 10rpx 25rpx;
			width: 260rpx;
			border-radius: 35rpx;
		}
		.banner{
			margin-top: 25rpx;
			.banner-ctx{
				.banner-swiper{
					height: 320rpx;
					width: 100%;
					.banner-swiper-item{
						box-sizing: border-box;
						padding:0 25rpx;
						image{
							height: 320rpx;
							width: 100%;
							border-radius: 15rpx;
						}
					}
				}
			}
		}
		.art{
			padding: 0 25rpx;
		}
	}
	
</style>