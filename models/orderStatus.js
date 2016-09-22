"use strict";

module.exports = function(sequelize, DataTypes) {
	var OrderStatus = sequelize.define("orderStatus", {
		id: {
			type: DataTypes.INTEGER(2).UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		orderStatus: {
			type: DataTypes.STRING(60),
			allowNull: false
		},
		activeStatus: {
			type: DataTypes.INTEGER(1).UNSIGNED,
			allowNull: false,
			defaultValue: 1
		}

	}, {
		classMethods: {
			associate: function(models) {
				//User.hasMany(models.Lb);
				//User.hasMany(models.LbPengadaan);
				//Category.hasMany(models.category, {as: 'subCategory', foreignKey: 'parentId'});
				
				//Cart.belongsTo(models.carrier);

				//Category.belongsTo(models.category, {as: 'child', foreignKey: 'parentId'});
				//Cart.belongsToMany(models.product, { through: 'cartProduct' });
				OrderStatus.hasMany(models.order);
				/*Order.belongsTo(models.cart);
				Order.belongsTo(models.customer);
				Order.belongsTo(models.caraBayar);
				Order.belongsTo(models.statusOrder);
				Order.belongsTo(models.carrier);
				Order.belongsTo(models.voucher);
				*/
			}
		},
		comment: "Table OrderStatus"
	});

	return OrderStatus;
};