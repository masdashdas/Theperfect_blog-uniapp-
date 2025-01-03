<template>
	<view class="custom-tabbar">
		<view :style="{height:safeHeight() + 'px'}"></view>
		<view class="custom-tabbar-ctx" :style="{height:MenuHeight()+'px'}">
			<view class="tabbar-ctx-item">
				<image src="/static/logos.png"></image>
				<text>Ltqblog</text>
			</view>
			<view class="tabbar-ctx-item item1" :style="{width:MenuWidth()+'px'}">
				<slot name="custom"></slot>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {ref,computed} from "vue"
	import {onLoad} from "@dcloudio/uni-app"
	import {safeHeight,MenuHeight,MenuWidth} from "@/utils/system.js"
	onLoad(()=>{
		
	})
	computed(()=>{
		
	})
</script>

<style lang="scss" scoped>
    .custom-tabbar{
		background: rgba(255,255,255,0.5);
		backdrop-filter: blur(25rpx);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		margin: auto;
		padding: 0 25rpx;
		z-index: 99;
		.custom-tabbar-ctx{
			@include flex;
			.tabbar-ctx-item{
				@include flex;
				image{
					height: 70rpx;
					width: 70rpx;
					border-radius: 50%;
				}
				text{
					margin-left: 15rpx;
					font-size: 35rpx;
					font-weight: 550;
				}
			}
			.item1{
				margin-left: 25rpx;
			}
		}
	}
</style>