<template>
	<view class="square">
		<view class="name">推荐圈子</view>
		<view v-if="squareCmd">
			<skeleton-item1 :num="1"></skeleton-item1>
		</view>
		<view v-else>
			<view class="square-grid">
				<view class="square-grid-C">
					<view class="square-grid-I">
						<view class="square-grid-I-R" @click.stop="Tosquare(squareCommend[0].id)">
							<image mode="aspectFill" :src="squareCommend[0].background"></image>
							<view class="square-grid-I-R-b">
								<image :src="squareCommend[0].avatar" mode="aspectFill"></image>
								<view>{{squareCommend[0].name}}</view>
								<text>{{squareCommend[0].count}}</text>
							</view>
						</view>
						<view class="square-grid-I-L" @click.stop="Tosquare(squareCommend[1].id)">
							<view class="square-grid-I-L-I">
								<image mode="aspectFill" :src="squareCommend[1].avatar"></image>
								<view>{{squareCommend[1].name}}</view>
								<text>{{squareCommend[1].count}}</text>
							</view>
							<view class="square-grid-I-L-I" @click.stop="Tosquare(squareCommend[2].id)">
								<image mode="aspectFill" :src="squareCommend[2].avatar"></image>
								<view>{{squareCommend[2].name}}</view>
								<text>{{squareCommend[2].count}}</text>
							</view>
						</view>
					</view>
					<view class="square-grid-I">
						<view class="square-grid-I-I" @click.stop="Tosquare(squareCommend[3].id)">
							<image mode="aspectFill" :src="squareCommend[3].avatar"></image>
							<view>{{squareCommend[3].name}}</view>
							<text>{{squareCommend[3].count}}</text>
						</view>
						<view class="square-grid-I-I" @click="ToAllSquare">
							<view>全部圈子</view>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="name">圈子文章</view>
		<view class="square-C" v-if="squareList.length!=0">
			<view class="square-I" v-for="item in squareList" :key="item._id">
				<view class="square-info" @click="Tosquare(item._id)">
					<view class="square-info-L">
						<view class="square-name">
							<image src="../../static/img/square.png"></image>
							<text>{{item.name}}</text>
						</view>
						<view class="square-desc">
							<text>{{item.count}}动态</text>  <text>{{item.fans_count}}用户</text> 
						</view>
					</view>
					<view class="square-info-R">
						<image mode="aspectFill" :src="item.avatarUrl[0]"></image>
					</view>
				</view>
				<view class="square-art" v-if="item.artList.length!=0">
					<view class="square-art-I" v-for="items in item.artList" @click="ToArt(items._id)">
						<view class="square-art-L">
							<view class="userinfo">
								<image :src="avatar(items.userinfo)" mode="aspectFill"></image>
								<text>{{username(items.userinfo)}}</text>
							</view>
							<view class="title">{{items.title}}</view>
							<view class="content">
								{{items.content}}
							</view>
							<view class="btm">
								<text>发布于 {{items._add_time_str.slice(0,10)}}</text>
							</view>
						</view>
						<view class="square-art-R" v-if="items.coverImg.length!=0">
							<image :src="items.coverImg[0]" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
			<loading-item v-if="btm" :status="loading"></loading-item>
		</view>
		<view v-else style="padding-top: 250rpx;">
			<Empty-item mode="square"></Empty-item>
		</view>
	</view>
</template>

<script setup>
import {ref,onMounted,onUnmounted,computed} from "vue"
import {onLoad,onReachBottom,onShareTimeline,onShareAppMessage} from "@dcloudio/uni-app"
import {apiGetSquare,apiGetSquareCommend} from "@/api/api.js"
import { username,avatar} from "@/utils/utils"
onLoad(()=>{
	getSquare()
	getSquareCommend()
})
onReachBottom(()=>{
	if(btm.value){
		return
	}
	pageIndex.value+=1
	getSquare()
})
onShareAppMessage((res)=>{
		
	})
	//分享盆友圈
onShareTimeline((res)=>{
		
})
const squareList=ref([])
const squareCommend=ref([])
const pageIndex=ref(1)
const btm=ref(false)
const loading=ref(false)
const squareCmd=ref(true)
function getSquareCommend(){
	apiGetSquareCommend().then(res=>{
		squareCommend.value=res.result
		squareCommend.value=squareCommend.value.map(item=>{
			return {
				name:item.name,
				background:item.backgroundUrl[0],
				avatar:item.avatarUrl[0],
				id:item._id,
				count:item.count
			}
		})
		for(let i=0;i<4-res.result.length;i++){
			let obj={
				name:"暂无推荐",
				background:"/static/img/default-bg.jpg",
				avatar:"/static/img/user-default.png",
				id:"",
				count:0
			}
			squareCommend.value.push(obj)
		}
		squareCmd.value=false
	})
}
function getSquare(){
	let data={
		pageIndex:pageIndex.value
	}
	apiGetSquare(data).then(res=>{
		if(res.result.rows.length==0){
			btm.value=true
			loading.value=true
		}
		let newArr=res.result.rows
		squareList.value=[...squareList.value,...newArr]
		console.log(res)
	})
}
function ToAllSquare(){
	vk.navigateTo('/pages/square/allSquare');
}
function Tosquare(id){
	if(id===''){
		return 0;
	}
	vk.navigateTo('/pages/square/squareInfo?id='+id);
}
function ToArt(id){
	vk.navigateTo('/pages/art/art?id='+id);
}
</script>

<style lang="scss">
	page{
		box-sizing: border-box;
	}
	.square{
		.square-grid{
			padding: 25rpx;
			.square-grid-C{
				.square-grid-I{
					@include flex;
					.square-grid-I-I:nth-child(1){
						margin-right: 15rpx;
					}
					.square-grid-I-I:nth-child(2){
						margin-left: 15rpx;
						background: #fff;
						border: 1px solid black;
						color: #333333;
					}
					.square-grid-I-I{
						margin-top: 35rpx;
						@include flex-center;
						justify-content: space-between;
						padding: 0 25rpx;
						height: 70rpx;
						width: 100%;
						background: #333333;
						border-radius: 55rpx;
						color: #fff;
						font-size: 26rpx;
						font-weight: 550;
						view{
							margin-left: 10rpx;
						}
						image{
							width: 45rpx;
							height: 45rpx;
							border-radius: 50%;
						}
						text{
							margin-left: auto;
						}
					}
					.square-grid-I-R{
						position: relative;
						width: 48%;
						margin-right: 15rpx;
						height: 180rpx;
						background: #eee;
						border-radius: 25rpx;
						image{
							height: 180rpx;
							width: 100%;
							border-radius: 25rpx;
						}
						.square-grid-I-R-b{
							position: absolute;
							bottom: 0;
							height: 60rpx;
							width: 100%;
							background: rgba(0,0,0,0.3);
							@include flex-center;
							padding: 0 25rpx;
							color: #fff;
							font-size: 26rpx;
							font-weight: 550;
							border-bottom-left-radius: 25rpx;
							border-bottom-right-radius: 25rpx;
							image{
								height: 45rpx;
								width: 45rpx;
								border-radius: 50%;
							}
							text{
								margin-left: auto;
							}
							view{
								margin-left: 15rpx;
							}
						}
					}
					.square-grid-I-L{
						margin-left: 15rpx;
						width: 48%;
						height: 180rpx;
						@include flex;
						flex-direction: column;
						justify-content: space-between;
						.square-grid-I-L-I{
							@include flex-center;
							justify-content: space-between;
							padding: 0 25rpx;
							height: 70rpx;
							width: 100%;
							background: #333333;
							border-radius: 55rpx;
							color: #fff;
							font-size: 28rpx;
							font-weight: 550;
							image{
								width: 45rpx;
								height: 45rpx;
								border-radius: 50%;
							}
							text{
								margin-left: auto;
							}
							view{
								margin-left: 15rpx;
							}
						}
					}
				}
			}
		}
		.name{
			padding: 0 25rpx;
			font-size: 28rpx;
			font-weight: 550;
			border-left: 5rpx solid black;
		}
		.square-C{
			padding:0 25rpx;
			.square-I{
				.square-info{
					@include flex;
					padding: 25rpx 0;
					.square-info-L{
						margin-right:auto ;
						width: 80%;
						.square-name{
							@include flex;
							height: fit-content;
							box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
							width: fit-content;
							border-radius: 35rpx;
							padding:10rpx 20rpx;
							@include flex;
							margin-right: auto;
							font-size: 25rpx;
							margin-bottom: 25rpx;
							image{
								height: 36rpx;
								width: 36rpx;
							}
							text{
								padding-left: 5rpx;
							}
						}
						.square-desc{
							padding-right:25rpx;
							@include ellipsis(2);
							font-size: 26rpx;
							text{
								color: #999999;
								padding: 0 10rpx;
							}
						}
					}
					.square-info-R{
						width: 20%;
						image{
							width: 120rpx;
							height: 120rpx;
							border-radius: 50%;
						}
					}
				}
				.square-art{
					.square-art-I{
						margin: 15rpx 0;
						background: #F8F8F8;
						padding: 15rpx;
						@include flex;
						box-sizing: border-box;
						align-items: flex-start;
						.square-art-L{
							width: 75%;
							.userinfo{
								@include flex;
								image{
									height: 50rpx;
									width: 50rpx;
									border-radius: 50%;
									margin-right: 15rpx;
								}
								text{
									font-size: 28rpx;
									font-weight: 550;
								}
							}
							.title{
								margin: 10rpx 0;
								@include ellipsis(2);
								font-size: 25rpx;
								font-weight: 550;
							}
							.content{
								margin: 10rpx 0;
								@include ellipsis(2);
								margin-right: 15rpx;
								font-size: 25rpx;
							}
							.btm{
								padding-top: 15rpx;
								font-size: 22rpx;
								color: #9E9E9E;
								text{
									margin-right: 25rpx;
								}
							}
						}
						.square-art-R{
							width: 25%;
							padding-top: 15rpx;
							image{
								
								width: 160rpx;
								height: 160rpx;
								border-radius: 10rpx;
							}
						}
					}
				}
			}
		}
	}

</style>
