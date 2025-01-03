'use strict';
module.exports = {
	/**
	 * 获取文章详情
	 * @url client/art/pub/getArtDetail 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		if(userInfo){
			//查询时给文章流量+1
			await vk.baseDao.updateAndReturn({
			  dbName: "MoeBlog-article",
			  whereJson: {
			    _id:data.id
			  },
			  dataJson: {
			    view_count: _.inc(1)
			  }
			});
			//用户已登陆
			let res=await vk.baseDao.selects({
				dbName:"MoeBlog-article",
				whereJson:{
					_id:data.id
				},
				foreignDB: [
				    {
				      dbName: "uni-id-users",
				      localKey: "user_id",
				      foreignKey: "_id",
				      as: "userinfo",
				      limit: 1,
					  fieldJson:{
						  _id:true,
						  username:true,
						  nickname:true,
						  avatar:true,
						  gxqm:true
					  }
				    },
					{
					  dbName: "MoeBlog-taxonomy",
					  localKey: "taxonmoy_id",
					  foreignKey: "_id",
					  as: "taxonmoy_info",
					  limit: 1,
					  fieldJson:{
					  	name:true,
						_id:true
					  }
					},
					{
						dbName:"MoeBlog-likes",
						localKey: "_id",
						foreignKey: "art_id",
						as: "like_info",
						limit: 1,
						fieldJson:{
							user_id:true,
							_id:true
						},
						whereJson:{
							user_id:uid?uid:""
						}
					}
				]
			})
			
			return {
				code:0,
				msg:"查询文章数据成功",
				result:res
				
			}
		}else{
			await vk.baseDao.updateAndReturn({
			  dbName: "MoeBlog-article",
			  whereJson: {
			    _id:data.id
			  },
			  dataJson: {
			    view_count: _.inc(1)
			  }
			});
			let res=await vk.baseDao.selects({
				dbName:"MoeBlog-article",
				whereJson:{
					_id:data.id
				},
				foreignDB: [
				    {
				      dbName: "uni-id-users",
				      localKey: "user_id",
				      foreignKey: "_id",
				      as: "userinfo",
				      limit: 1,
					  fieldJson:{
						  _id:true,
						  username:true,
						  nickname:true,
						  avatar:true,
						  gxqm:true
					  }
				    },
					{
					  dbName: "MoeBlog-taxonomy",
					  localKey: "taxonmoy_id",
					  foreignKey: "_id",
					  as: "taxonmoy_info",
					  limit: 1,
					  fieldJson:{
					  	name:true,
						_id:true
					  }
					}
				]
			})
			return {
				code:0,
				msg:"用户未登陆",
				result:res
			}
		}
		




		// 业务逻辑结束-----------------------------------------------------------
		
	}
}
