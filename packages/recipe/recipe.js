// Recipe namespace
Journal.Recipe = {}
Journal.Recipe.VERSION = '0.0.1'

if (!Journal.Recipe.db) {
	Journal.Recipe.db = new Meteor.Collection('recipes');
}