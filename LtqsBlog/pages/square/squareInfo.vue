<template>
	<view class="square-info">
		<view v-if="squareStatus">
			<Skeleton-item></Skeleton-item>
		</view>
		<view class="square-C">
			<view class="square-H">
				<view class="square-H-bj">
					<image v-if="squareDetail.backgroundUrl" mode="aspectFill" :src="squareDetail.backgroundUrl[0]"></image>
				</view>
				<view class="square-H-C">
					<view class="avatar">
						<image mode="aspectFill" v-if="squareDetail.avatarUrl" :src="squareDetail.avatarUrl[0]"></image>
					</view>
					<view class="info">
						<view class="title">{{squareDetail.name}}</view>
						<view class="desc">
							{{squareDetail.description}}
						</view>
					</view>
				</view>
				<view class="square-H-B">
					<view class="square-H-B-L">
						<text>{{UserNum}}成员</text>
						·
						<text>{{ArtNum}}条内容</text>
					</view>
					<view class="square-H-B-R">
						<view class="gz" @click="addfavorite">
							{{favoriteT?'已关注':'关注'}}
						</view>
						<view class="share">
							<button open-type="share">
								<uni-icons type="upload" size="30" color="#fff"></uni-icons>
							</button>
							
						</view>
					</view>
				</view>
			</view>
			<view class="square-A">
				<view class="square-A-C">
					<view class="square-user">
						<view class="square-user-H">
							<view class="square-user-H-1">圈子成员</view>
							<view class="square-user-H-2" @click="Tosquare_user(squareDetail._id)">查看更多 ></view>
						</view>
						<view v-if="squareUserLoading">
							<skeleton-item1 :num="1"></skeleton-item1>
						</view>
						<view v-else>
							<view class="square-user-U">
								<scroll-view scroll-x class="scroll-x" v-if="UserInfo.length>0">
									<view class="square-user-U-C">
										<view class="square-user-U-I" v-for="items in UserInfo" :key="items._id" @click="ToUserinfo(items._id)">
											<image mode="aspectFill" :src="avatar(items)"></image>
											<view class="name">{{username(items)}}</view>
										</view>
									</view>
								</scroll-view>
								<view v-else style="padding: 25rpx; 0;display: flex;align-items: center;justify-content: center;">
									暂无用户关注
								</view>
							</view>
						</view>
					</view>
					<view class="square-art">
						<view v-if="artLoading">
							<skeleton-item1 :num="2"></skeleton-item1>
						</view>
						<view v-else>
							<view v-if="squareArt.length!=0">
								<art-item v-for="(item,index) in squareArt" :key="item._id" :item="item"></art-item>
								<loading-item v-if="loading" :status="artStatus"></loading-item>
							</view>
							<view v-else style="padding-top: 150rpx;">
								<Empty-item mode="art"></Empty-item>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="add" @click="ToAdd">
			+
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
import {onLoad,onReachBottom,onShareTimeline,onShareAppMessage} from "@dcloudio/uni-app"
import {avatar,username,gxqm} from "@/utils/utils.js"
import {apiGetSquareDetail,apiGerSquareArt,apiAddTaxonomyFavorite,apiGetTaxonomyUser,apiDelTaxonomyFavorite} from "@/api/api.js"
onLoad((id)=>{
	squareId.value=id.id
	getSquareDetail()
	getSquareArt()
	getTaxonomyUser()
})
onShareAppMessage((res)=>{
	
})
//分享盆友圈
onShareTimeline((res)=>{
	
})
onReachBottom(()=>{
	loading.value=true
	if(artStatus.value){
		return
	}
	pageIndex.value+=1
	getSquareArt()
})
const loading=ref(false)
const artStatus=ref(false)
const squareId=ref({id:""})
const squareDetail=ref({})
const squareArt=ref([])
const ArtNum=ref(0)
const UserNum=ref(0)
const UserInfo=ref([])
const pageIndex=ref(1)
const squareStatus=ref(true)
const artLoading=ref(true)
const squareUserLoading=ref(true)
const favoriteT=ref(false)
const favoriteId=ref(null)
function ToUserinfo(id){
	//跳转到用户中心
	vk.navigateTo("/pages/userinfo/userinfo?id="+id)
}
function getSquareDetail(){
	//查询当前分类的详细信息
	let obj={
		id:squareId.value,
		user_id:"_id" in vk.getVuex('$user.userInfo')?vk.getVuex('$user.userInfo')._id:''
	}
	apiGetSquareDetail(obj).then(res=>{
		squareStatus.value=false
		squareDetail.value=res.result[0]
		console.log(squareDetail.value)
		if("FavoriteInfo" in squareDetail.value && "_id" in squareDetail.value.FavoriteInfo){
			favoriteT.value=true
		}else{
			favoriteT.value=false
		}
	})
}
function getSquareArt(){
	apiGerSquareArt({id:squareId.value,pageIndex:pageIndex.value}).then(res=>{
		artLoading.value=false
		if(res.result.rows.length==0){
			artStatus.value=true
		}
		let newArr=res.result.rows
		squareArt.value=[...squareArt.value,...newArr]
		ArtNum.value=res.result.total
	})
}
function Tosquare_user(id){
	vk.navigateTo('/pages/square/squareUser?id='+id)
	console.log(id)
}
function addfavorite(){
	//添加用户关注的此表
	if(favoriteT.value){
		//取消关注
		let obj={
			_id:squareDetail.value.FavoriteInfo._id,
			user_id:vk.getVuex('$user.userInfo')._id,
			taxonomy_id:squareId.value
		}
		let index = UserInfo.value.findIndex(item=>{
			return item._id === vk.getVuex('$user.userInfo')._id
			})
		UserInfo.value.splice(index,1)
		apiDelTaxonomyFavorite(obj).then(res=>{
			favoriteT.value=false
			UserNum.value-=1
		})
		
		
	}else{
		//添加关注
		let obj={
			_id:vk.getVuex('$user.userInfo')._id,
			username:username(vk.getVuex('$user.userInfo')),
			avatar:avatar(vk.getVuex('$user.userInfo'))
		}
		UserInfo.value.push(obj)
		console.log(UserInfo.value)
		apiAddTaxonomyFavorite({id:squareId.value,taxonomy_id:squareId.value}).then(res=>{
			favoriteT.value=true
			UserNum.value+=1
			favoriteId.value=res.result
		})
		
	}
}
function getTaxonomyUser(){
	//查询关注了此分类的用户
	let ids={
		id:squareId.value,
		pageIndex:pageIndex.value
	}
	apiGetTaxonomyUser(ids).then(res=>{
		squareUserLoading.value=false
		UserNum.value=res.result.total
		UserInfo.value=res.result.rows
		console.log(UserInfo.value)
	})
}
function ToAdd(){
	let obj={
		_id:squareDetail.value._id,
		name:squareDetail.value.name
	}
	let item=JSON.stringify(obj)
	vk.navigateTo('/pages/art/addArt?item='+item);
}

</script>

<style lang="scss">
	page{
		box-sizing: border-box;
	}
      .square-info{
		  .square-C{
			  position: relative;
			  .square-H{
				  width: 100%;
				  height: 450rpx;
				  background: rgba(0,0,0,0.4);
				  @include flex;
				  position: relative;
				  .square-H-bj{
					  
					  image{
						  width: 100%;
						  height: 450rpx;
						  position: absolute;
						  top: 0;
						  left: 0;
						  right: 0;
						  z-index: -1;
					  }
				  }
				  .square-H-C{
					  padding: 0 25rpx;
					  @include flex;
					  width: 100%;
					  .avatar{
						  height: 150rpx;
						  width: 150rpx;
						  image{
						  	height: 150rpx;
						  	width: 150rpx;
						  	border-radius: 50%;
						  }
					  }
					  .info{
						  width: 80%;
						  color: #fff;
						  @include flex;
						  flex-direction: column;
						  align-items: flex-start;
						  padding-left: 25rpx;
						  .title{
							  margin: 10rpx 0;
							  font-size: 35rpx;
							  font-weight: 550;
						  }
						  .desc{
							  font-size: 30rpx;
							  margin: 10rpx 0;
							 @include flex;
							  @include ellipsis(2)
						  }
					  }
				  }
				  .square-H-B{
					  position: absolute;
					  bottom: 50rpx;
					  left: 25rpx;
					  right: 25rpx;
					  margin: 0 auto;
					  @include flex;
					  
					  .square-H-B-R{
						  margin-left: auto;
						  @include flex;
						  .gz{
							 background: #fff;
							 padding: 7rpx 35rpx;
							 border-radius: 25rpx;
							 margin: 0 20rpx;
						  }
						  .share{
							  margin: 0 20rpx;
							  button{
								  width: fit-content;
								  background: none;
								  margin: 0;
								  padding: 0;
								  line-height: normal;
							  }
						  }
					  }
					  .square-H-B-L{
						  font-size: 30rpx;
						  color: #E0E0E0; 
					  }
				  }
			  }
		  }
		  .square-A{
			  top: -25rpx;
			  min-height: 70vh;
			  width: 100%;
			  padding: 25rpx;
			  position: relative;
			  background: #fff;
			  border-top-left-radius: 25rpx;
			  border-top-right-radius: 25rpx;
			  .square-A-C{
				  .square-user{
					  .square-user-H{
						  @include flex;
						  width: 100%;
						  .square-user-H-1{
							  font-size: 32rpx;
							  font-weight: 550;
						  }
						  .square-user-H-2{
							  margin-left: auto;
							  color: #9E9E9E;
						  }
					  }
					  .square-user-U{
						  .scroll-x{
							  .square-user-U-C{
								  @include flex;
								.square-user-U-I{
									@include flex;
									flex-direction: column;
									padding: 25rpx;
									width: fit-content;
									image{
										height: 100rpx;
										width: 100rpx;
										border-radius: 50%;
									}
									.name{
										padding: 5rpx 0;
										width: fit-content;
										white-space: nowrap;
										color: #9E9E9E;
									}
								}  
							  }
						  }
						  
					  }
				  }
				  .square-art{
					  
				  }
			  }
		  }
		  .add{
			  position: fixed;
			  bottom: 100rpx;
			  right: 60rpx;
			  background: #6C8FF1;
			  height: 80rpx;
			  width: 80rpx;
			  border-radius: 50%;
			  @include flex-center;
			  font-size: 52rpx;
			  color: #fff;
		  }
	  }
</style>
