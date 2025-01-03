<template>
	<view class="admin">
		<u-cell-group>
			<u-cell-item @click="ToBanner" icon="setting-fill" title="轮播图管理"></u-cell-item>
			<u-cell-item @click="ToArt" icon="setting-fill" title="文章管理"></u-cell-item>
			<u-cell-item @click="ToSquare" icon="setting-fill" title="圈子管理"></u-cell-item>
			<u-cell-item @click="ToComments" icon="setting-fill" title="评论管理"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script setup>
import {ref} from "vue"

function ToArt(){
	vk.navigateTo('/pages/Admin/Art');
}
function ToBanner(){
	vk.navigateTo('/pages/Admin/banner');
}
function ToComments(){
	vk.navigateTo('/pages/Admin/comments');
}
function ToSquare(){
	vk.navigateTo('/pages/Admin/square');
}
</script>

<style lang="scss">
	.admin{
		
	}

</style>
