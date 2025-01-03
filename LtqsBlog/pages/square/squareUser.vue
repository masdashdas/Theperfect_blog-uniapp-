<template>
	<view class="square_User">
		<!-- <view class="title">
			关注{{title}}圈子的分类用户
		</view> -->
		<view class="user-item">
			<view v-if="userData.length!=0">
				<user-item v-for="item in userData" :key="item._id" :item="item"></user-item>
				<loading-item v-if="loading" :status="artStatus"></loading-item>
			</view>
			<view v-else style="padding-top: 250rpx;">
				<Empty-item mode="none"></Empty-item>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
import {onLoad,onReachBottom} from "@dcloudio/uni-app"
import {apiGetSquareUser} from "@/api/api.js"
onLoad((id)=>{
	square_id.value=id.id
	getSquareUser()
})
onReachBottom(()=>{
	loading.value=true
	if(artStatus.value){
		return
	}
	pageIndex.value+=1
	getSquareUser()
})
const square_id=ref("")
const title=ref("")
const pageIndex=ref(1)
const userData=ref([])
const artStatus=ref(false)
const loading=ref(false)
function getSquareUser(){
	let data={
		pageIndex:pageIndex.value,
		square_id:square_id.value
	}
	apiGetSquareUser(data).then(res=>{
		if(res.result.rows.length==0){
			artStatus.value=true
		}
		let newArr=res.result.rows
		userData.value=[...userData.value,...newArr]
	})
}
</script>

<style lang="scss">
	.square_User{
		min-height: 100vh;
		.title{
			padding: 25rpx 0;
			@include flex-center;
			font-size: 28rpx;
			font-weight: 550;
		}
		.user-item{
			padding:0 25rpx;
		}
	}

</style>
