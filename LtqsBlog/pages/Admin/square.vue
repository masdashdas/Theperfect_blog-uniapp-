<template>
	<view class="square">
		<view class="Mysquare-C">
			<u-tabs active-color="#000" font-size="24" :list="tabList" :is-scroll="false" v-model="currentIndex" @change="Tabchange"></u-tabs>
			<view v-if="currentIndex==0">
				<view v-if="squareData.length!=0">
					<Mysquare-item v-for="(item,index) in squareData" :key="item._id" :item="item"></Mysquare-item>
				</view>
				<view v-else class="empty">
					<Empty-item mode="square"></Empty-item>
				</view>
			</view>
			<view v-if="currentIndex==1">
				<view v-if="squareData.length!=0">
					<Mysquare-item v-for="(item,index) in squareData" :key="item._id" :item="item"></Mysquare-item>
				</view>
				<view v-else class="empty">
					<Empty-item mode="square"></Empty-item>
				</view>
			</view>
			<view v-if="currentIndex==2">
				<view v-if="squareData.length!=0">
					<Mysquare-item v-for="(item,index) in squareData" :key="item._id" :item="item"></Mysquare-item>
				</view>
				<view v-else class="empty">
					<Empty-item mode="square"></Empty-item>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
import {onLoad} from "@dcloudio/uni-app"
import {apiGetAdminSquare} from "@/api/api.js"
onLoad(()=>{
	getSquare()
})
const tabList=ref([{name: '已通过'},{name:'审核中'},{name:'未通过'}])
const currentIndex=ref(0)
const squareData=ref({})//圈子数据

function Tabchange(e){
	currentIndex.value=e
	getSquare()
}
function getSquare(){
	apiGetAdminSquare({Audit:currentIndex.value}).then(res=>{
		squareData.value=res.result.rows
	})
}
</script>

<style lang="scss" scoped>
	.square{
		.Mysquare-C{
			.empty{
				padding-top: 250rpx;
			}
		}
		
	}

</style>
