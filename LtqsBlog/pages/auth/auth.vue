<template>
	<view class="auth">
		<view class="back" @click="Toindex">
			<view class="back-ctx">
				<uni-icons type="left" size="22"></uni-icons>
			</view>
		</view>
		<view class="auth-ctx">
			<view class="bj">
				<image mode="aspectFill" src="https://env-00jxgxdws3b9.normal.cloudstatic.cn/2024/08/30/02845199-32591958-7540e126897740bbb78afc9fecde0c5a_compressed.png?expire_at=1725003446&er_sign=3bf79f2ac6ab615e190d2658c1a7fbeb"></image>
			</view>
			<view class="login" v-if="currentS==0">
				<view class="login-ctx">
					<view class="login-H">
						<image mode="aspectFill" src="../../static/img/default-bg.jpg"></image>
					</view>
					<view class="form">
						<view class="form-ctx">
							<view class="item1">
								登陆账号
							</view>
							<view class="form-item">
								<text>账号</text>
								<input v-model="loginForm.username" placeholder="请输入账号"/>
							</view>
							<view class="form-item">
								<text>密码</text>
								<input v-model="loginForm.password" placeholder="请输入密码"/>
							</view>
							<view class="form-item" @click="ToReg">
								没有账号?<text style="color: #4FC3F7;">点击注册</text>
							</view>
							<view class="item2" @click="Toindex">
								暂不登陆返回首页
							</view>
							<view class="form-item" @click="login">
								<button>登陆</button>
							</view>
							<view class="form-item item1" @click="TowxLogin">
								<uni-icons color="#07C160" type="weixin" size="40"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="reg login" v-if="currentS==1">
				<view class="login-ctx">
					<view class="login-H">
						<image mode="aspectFill" src="../../static/img/default-bg.jpg"></image>
					</view>
					<view class="form">
						<view class="form-ctx">
							<view class="item1">
								注册账号
							</view>
							<view class="form-item">
								<text>账号</text>
								<input v-model="regForm.username" placeholder="请输入账号"/>
							</view>
							<view class="form-item">
								<text>密码</text>
								<input v-model="regForm.password" placeholder="请输入密码"/>
							</view>
							<view class="form-item">
								<text>确认密码</text>
								<input v-model="regForm.pass1" placeholder="请再次输入密码"/>
							</view>
							<view class="form-item" @click="ToLogin">
								已有账号?<text style="color: #4FC3F7;">点击去登陆</text>
							</view>
							<view class="item2" @click="Toindex">
								暂不登陆返回首页
							</view>
							<view class="form-item" @click="reg">
								<button>注册</button>
							</view>
							<view class="form-item item1" @click="TowxLogin">
								<uni-icons color="#07C160" type="weixin" size="40"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="wxlogin" v-if="currentS==2">
				<view class="wxlogin-C">
					<view class="wxlogin-H">
						<view class="wxlogin-I">
							<image mode="aspectFill" src="../../static/img/default-bg.jpg"></image>
						</view>
						<view class="wxlogin-I name">
							MoeBlog
						</view>
						<view class="wxlogin-I desc">
							欢迎来到Moe博客 登陆后可以让你更方便地畅游在异次元的海湾里
						</view>
						<view class="wxlogin-I name" @click="wxLoign">
							<button>微信一键登陆</button>
						</view>
						<view class="wxlogin-I xy">
							<radio style="width: 35rpx;height: 35rpx;margin-right: 25rpx;"></radio>
							登陆即代表你已阅读并同意<text style="color: #4FC3F7;" @click="ToSa">《用户协议》</text>和<text style="color: #4FC3F7;" @click="ToPP">《隐私政策》</text>
						</view>
						<view class="wxlogin-I btm">
							<view class="btm-I" @click="ToLogin">返回登陆</view>
							<view class="btm-I" @click="ToReg">返回注册</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
const currentS=ref(0)
const loginForm=ref({username:"",password:""})
const regForm=ref({username:"",password:"",pass1:""})
function ToSa(){
	vk.navigateTo("/pages/userinfo/SA")
}
function ToPP(){
	vk.navigateTo("/pages/userinfo/PP")
}
function wxLoign(){
	//微信登陆
	vk.userCenter.loginByWeixin({
	  data: {
	    type: ""
	  },
	  success: (data) => {
		  console.log(data)
		  vk.navigateTo('/pages/my/my');
	  }
	});
}
function login(){
	//点击登陆按钮
	if(loginForm.value.username.length==0||loginForm.value.password.length==0){
		vk.toast('账号或密码不能为空');
	}else{
		vk.userCenter.login({
		  data: {
		    username: loginForm.value.username,
		    password: loginForm.value.password
		  },
		  success:data => {
			  vk.reLaunch('/pages/my/my');
		  }
		});
	}
}
function reg(){
	//点击注册
	if(regForm.value.username.length==0 || regForm.value.password.length==0 || regForm.value.pass1.length==0){
		vk.toast('账号或密码不能为空');
	}else if(regForm.value.password!=regForm.value.pass1){
		vk.toast('两次密码输入不一致');
	}else{
		vk.userCenter.register({
		  data: {
		    username: regForm.value.username,
		    password: regForm.value.password
		  },
		  success:data => {
		    vk.reLaunch('/pages/my/my');
		  }
		});
	}
	
}
function Toindex(){
	//返回首页
	vk.navigateTo('/pages/index/index');
}

function ToReg(){
	currentS.value=1
}
function ToLogin(){
	currentS.value=0
}
function TowxLogin(){
	currentS.value=2
}
</script>

<style lang="scss">
      .auth{
		  .back{
			  position: fixed;
			  top: 120rpx;
			  /* #ifdef MP */
			  top: 60rpx;
			  /* #endif */
			  left: 50rpx;
			  .back-ctx{
				  background: #FFFFFF;
				  border-radius: 50%;
				  padding:10rpx;
			  }
		  }
		  .auth-ctx{
			  .bj{
				  position: fixed;
				  top: 0;left: 0;right: 0;bottom: 0;
				  z-index: -1;
				  image{
					  height: 100vh;
					  width: 100vw;
				  }
			  }
			  .login{
				  .login-ctx{
					  .login-H{
						  height: 450rpx;
						  width: 100%;
						  @include flex-center;
						  image{
							  height: 130rpx;
							  width: 130rpx;
							  border-radius: 50%;
						  }
					  }
					  .form{
						  padding: 0 50rpx;
						  .form-ctx{
							 height: fit-content;
							 width: 100%;
							 padding:50rpx;
							 background: rgba(255,255,255,0.5); 
							 backdrop-filter: blur(10rpx);
							 border-radius: 35rpx;
							 .item1{
								 @include flex-center;
								 font-size: 35rpx;
								 font-weight: 550;
							 }
							 .item2{
								  @include flex-center;
							 }
							 .form-item{
								 margin: 30rpx 0;
								 @include flex;
								 padding:0 25rpx;
								 input{
									 width: 70%;
									 padding: 15rpx;
									 margin-left: 25rpx;
									 border-radius: 15rpx;
									 border: 1px solid #BDBDBD;
									 margin-left: auto;
								 }
								 button{
									 background: rgba(0,0,0,0.9);
									 color: #fff;
									 width: fit-content;
									 padding: 0 200rpx;
									 font-size: 28rpx;
									 font-weight: 550;
									 border-radius: 45rpx;
								 }
							 }
						  }
					  }
				  }
			  }
			  .reg{
				  
			  }
			  .wxlogin{
				  .wxlogin-C{
					  padding: 200rpx 25rpx;
					  .wxlogin-H{
						 @include flex;
						 flex-direction: column;
						 background: rgba(255,255,255,0.5);
						 backdrop-filter: blur(10rpx);
						 border-radius: 35rpx;
						 margin: 50rpx 0;
						 .wxlogin-I{
							margin: 25rpx 0;
							 @include flex;
							image{
								width: 180rpx;
								height: 180rpx;
								border-radius: 50%;
							} 
							button{
								background: #07C160;
								color: #fff;
								width: fit-content;
								padding: 8rpx 200rpx;
								font-size: 28rpx;
								font-weight: 550;
								border-radius: 45rpx;
							}
						 }
						 .name{
							font-size: 50rpx;
							font-weight: 550;
						 }
						 .desc{
							 padding: 25rpx 50rpx;
							 text-align: center;
							 font-size: 32rpx;
							 color: #424242;
						 }
						 .xy{
							 font-size: 22rpx;
							 display: flex;align-items: center;
						 }
						 .btm{
							 .btm-I{
								 padding: 0 50rpx;
								 width: 50%;
								 font-weight: 550;
							 }
						 }
					  }
				  }
			  }
		  }
	  }
</style>
