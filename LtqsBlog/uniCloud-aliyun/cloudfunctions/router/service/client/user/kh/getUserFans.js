'use strict';
module.exports = {
	/**
	 * 查询当前用户的关注或者粉丝
	 * @url client/user/kh/getUserFans 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let fielJson={};
		let whereJson = {};
		if ("following_id" in data) {
		  whereJson.following_id = data.following_id;
		  fielJson.follower_id=true
		}
		if ("follower_id" in data) {
		  whereJson.follower_id = data.follower_id;
		  fielJson.following_id=true
		}
		let res=await vk.baseDao.selects({
			dbName:"MoeBlog-UserLike",
			pageIndex:data.pageIndex,
			whereJson:whereJson,
			getMain:true,
			fieldJson:fielJson,
			foreignDB: [
			    {
			      dbName: "uni-id-users",
			      localKey: "following_id" in data?"follower_id":"following_id",
			      foreignKey: "_id",
			      as: "userinfo",
			      limit: 1,
				  fieldJson:{
					  _id:true,
					  nickname:true,
					  username:true,
					  avatar:true
				  }
			    }
			  ]
		})
		return {
			code:0,
			msg:"查询当前粉丝或者关注成功",
			result:res
		};
	}
}
