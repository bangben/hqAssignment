"use strict";

module.exports = function(sequelize, DataTypes) {
	var Order = sequelize.define("order", {
		id: {
			type: DataTypes.BIGINT(15).UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		orderNumber: {
			type: DataTypes.STRING(15),
			allowNull: false
		},
		customerName: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		price:{
			type: DataTypes.DECIMAL(10,2).UNSIGNED,
			allowNull: false,
			defaultValue : 0.00
		},
        transactionResponse: {
        	type: DataTypes.TEXT,
        	allowNull: false
        }

	}, {
		classMethods: {
			associate: function(models) {
				Order.belongsTo(models.currency);
			}
		},
		comment: "Table Order"
	});

	return Order;
};