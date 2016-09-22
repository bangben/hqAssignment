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
				OrderStatus.hasMany(models.order);
			}
		},
		comment: "Table OrderStatus"
	});

	return OrderStatus;
};