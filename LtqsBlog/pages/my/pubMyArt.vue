<template>
	<view class="art">
		<view v-if="loading">
			<skeleton-item1 :num="4"></skeleton-item1>
		</view>
		<view v-else>
			<view v-if="artData.length!=0">
				<art-item v-for="item in artData" :key="item._id" :item="item"></art-item>
				<loading-item v-if="btm" :status="status"></loading-item>
			</view>
			<view v-else style="padding-top: 350rpx;">
				<Empty-item mode="like"></Empty-item>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
import {onLoad,onReachBottom} from "@dcloudio/uni-app"
import {apiGetUserLikeArt} from "@/api/api.js"
onLoad(()=>{
	getUserLikeArt()
})
onReachBottom(()=>{
	if(status.value){
		return
	}
	btm.value=true
	pageIndex.value+=1
	getUserLikeArt()
})
const btm=ref(false)
const status=ref(false)
const loading=ref(true)
const artData=ref([])
const pageIndex=ref(1)
function getUserLikeArt(){
	let data={
		pageIndex:pageIndex.value,
		Audit:0
	}
	apiGetUserLikeArt(data).then(res=>{
		if(res.result.length==0){
			status.value=true
		}
		loading.value=false
		let arr=res.result
		artData.value=[...artData.value,...arr]
		console.log(res)
	})
}
</script>

<style lang="scss">
	.art{
		padding: 0 25rpx;
	}

</style>
