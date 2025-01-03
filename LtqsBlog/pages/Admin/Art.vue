<template>
	<view class="art">
		<view class="art-C">
			<u-tabs active-color="#000" font-size="24" :list="list" :is-scroll="false" v-model="tabIndex" @change="tabCl"></u-tabs>
		</view>
		<view v-if="tabIndex==0">
			<view v-if="artData.length!=0">
				<art-item v-for="items in artData" :key="items._id" :item="items"></art-item>
				<loading-item v-if="loading" :status="artStatus"></loading-item>
			</view>
			<view v-else class="empty">
				<Empty-item mode="art"></Empty-item>
			</view>
		</view>
		<view v-if="tabIndex==1">
			<view v-if="artData.length!=0">
				<art-item v-for="items in artData" :key="items._id" :item="items"></art-item>
				<loading-item v-if="loading" :status="artStatus"></loading-item>
			</view>
			<view v-else class="empty">
				<Empty-item mode="art"></Empty-item>
			</view>
		</view>
		<view v-if="tabIndex==2">
			<view v-if="artData.length!=0">
				<art-item v-for="items in artData" :key="items._id" :item="items"></art-item>
				<loading-item v-if="loading" :status="artStatus"></loading-item>
			</view>
			<view v-else class="empty">
				<Empty-item mode="art"></Empty-item>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
import {onLoad,onReachBottom} from "@dcloudio/uni-app"
import {apiGetAdminArt} from "@/api/api.js"
onLoad(()=>{
	getArt()
})
onReachBottom(()=>{
	if(artStatus.value){
		return
	}
	loading.value=true
	pageIndex.value+=1
	getArt()
})
const list=ref([
	{name:'已审核'},
	{name:'审核中'},
	{name:'未通过'}
])
const tabIndex=ref(0)
const pageIndex=ref(1)
const btm=ref(false)
const Audit=ref(0)
const artData=ref([])//圈子数据
const artStatus=ref(false)
const loading=ref(false)
function tabCl(e){
	tabIndex.value=e
	Audit.value=e
	pageIndex.value=1
	artData.value=[]
	getArt()
}
function getArt(){
	let data={
		pageIndex:pageIndex.value,
		Audit:Audit.value
	}
	apiGetAdminArt(data).then(res=>{
		if(res.result.length==0){
			artStatus.value=true
		}
		let newArr=res.result
		artData.value=[...artData.value,...newArr]
	})
}
</script>

<style lang="scss" scoped>
	.art{
		padding: 0 32rpx;
		.art-C{
			
		}
		.empty{
			padding-top: 250rpx;
		}
	}

</style>
