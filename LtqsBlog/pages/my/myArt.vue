<template>
	<view class="myArt">
		<view class="myArt-C">
			<u-tabs active-color="#000" font-size="24" :list="tabList" :is-scroll="false" v-model="currentIndex" @change="Tabchange"></u-tabs>
			<view v-if="currentIndex==0">
				<view v-if="artData.length!=0">
					<art-item v-for="items in artData" :key="items._id" :item="items"></art-item>
					<loading-item v-if="loading" :status="artStatus"></loading-item>
				</view>
				<view v-else class="empty">
					<Empty-item mode="art"></Empty-item>
				</view>
			</view>
			<view v-if="currentIndex==1">
				<view v-if="artData.length!=0">
					<art-item v-for="items in artData" :key="items._id" :item="items"></art-item>
					<loading-item v-if="loading" :status="artStatus"></loading-item>
				</view>
				<view v-else class="empty">
					<Empty-item mode="art"></Empty-item>
				</view>
			</view>
			<view v-if="currentIndex==2">
				<view v-if="artData.length!=0">
					<art-item v-for="items in artData" :key="items._id" :item="items"></art-item>
					<loading-item v-if="loading" :status="artStatus"></loading-item>
				</view>
				<view v-else class="empty">
					<Empty-item mode="art"></Empty-item>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
import {onLoad,onShow,onReachBottom} from "@dcloudio/uni-app"
import {apiGetUserArt} from "@/api/api.js"
const tabList=ref([{name: '已发布'},{name:'审核中'},{name:'未通过'}])
const currentIndex=ref(0)
const pageIndex=ref(1)
const artData=ref([])//圈子数据
const artStatus=ref(false)
const loading=ref(false)
onLoad(()=>{
	getUserArt()
})
onReachBottom(()=>{
	if(artStatus.value){
		return
	}
	loading.value=true
	pageIndex.value+=1
	getUserArt()
})
function Tabchange(e){
	currentIndex.value=e
	pageIndex.value=1
	artData.value=[]
	artStatus.value=false
	loading.value=false
	getUserArt()
}
function getUserArt(){
	let obj={
		pageIndex:pageIndex.value,
		Audit:currentIndex.value
	}
	apiGetUserArt(obj).then(res=>{
		if(res.result.length==0){
			artStatus.value=true
		}
		let newArr=res.result
		artData.value=[...artData.value,...newArr]
		console.log(res)
	})
}
</script>

<style lang="scss">
      .myArt{
		  .myArt-C{
			  padding: 25rpx;
			  .empty{
				  padding-top: 250rpx;
			  }
		  }
	  }
</style>
