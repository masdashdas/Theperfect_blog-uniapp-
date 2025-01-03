<template>
	<view class="myFans">
		<!-- <view class="title">
			{{text}}
		</view> -->
		<view class="fans">
			<view v-if="userData.length!=0">
				<user-item v-for="item in userData" :key="item._id" :item="item"></user-item>
				<loading-item v-if="loading" :status="dataStatus"></loading-item>
			</view>
			<view v-else style="padding-top: 250rpx;">
				<Empty-item mode="user"></Empty-item>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
import {onLoad,onReachBottom} from "@dcloudio/uni-app"
import {apiGetUserFans} from "@/api/api.js"
onLoad((e)=>{
	data.value=e.type
	if(e.type=="fans"){
		// text.value="我的粉丝"
		uni.setNavigationBarTitle({
			title:"我的粉丝"
		})
		type.value="following_id"
		let obj={
			following_id:vk.getVuex('$user.userInfo')._id,
			pageIndex:pageIndex.value
		}
		getUserFans(obj)
		
	}else{
		// text.value="我的关注"
		type.value="follower_id"
		let obj={
			follower_id:vk.getVuex('$user.userInfo')._id,
			pageIndex:pageIndex.value
		}
		uni.setNavigationBarTitle({
			title:"我的关注"
		})
		getUserFans(obj)
	}
})
onReachBottom(()=>{
	loading.value=true
	if(dataStatus.value){
		return
	}
	pageIndex.value+=1
	let obj={
		pageIndex:pageIndex.value
	}
	if(type.value=="following_id"){
		obj.following_id=vk.getVuex('$user.userInfo')._id
	}else{
		obj.follower_id=vk.getVuex('$user.userInfo')._id
	}
	getUserFans(obj)
	
})
const data=ref("")
const text=ref("")
const pageIndex=ref(1)
const userData=ref([])
const dataStatus=ref(false)
const type=ref("")
const loading=ref(false)
function getUserFans(e){
	console.log(e)
	apiGetUserFans(e).then(res=>{
		if(res.result.length==0){
			dataStatus.value=true
		}
		let newArr=res.result
		userData.value=[...userData.value,...newArr]
		console.log(e)
	})
}
</script>

<style lang="scss">
      .myFans{
		  padding: 0 25rpx;
		  min-height: 100vh;
		  .title{
			  padding: 25rpx 0;
			  @include flex-center;
			  font-size: 30rpx;
		  }
		  .fans{
			  
		  }
	  }
</style>
