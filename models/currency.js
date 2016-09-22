"use strict";
module.exports = function(sequelize, DataTypes) {
	var Currency = sequelize.define("currency", {
		id: {
			type: DataTypes.INTEGER(3).UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(125),
			allowNull: false,
		},
		shortName: {
			type: DataTypes.STRING(3),
			allowNull: false,
		},
		setDefault: {
			type: DataTypes.INTEGER(1).UNSIGNED,
			allowNull: false,
			defaultValue: 0
		},
		activeStatus: {
			type: DataTypes.INTEGER(1).UNSIGNED,
			allowNull: false,
			defaultValue: 1
		},
	}, {
		classMethods: {
			associate: function(models) {

				Currency.hasMany(models.order);
			}
		},
		comment: "Table currency"
	});
	return Currency;
};