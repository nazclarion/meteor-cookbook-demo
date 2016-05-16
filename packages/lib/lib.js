Journal = {};
Journal.VERSION = '0.0.1';

// Alert namespace
Journal.Alert = {}
Journal.Alert.VERSION = '0.0.1'

if (!Journal.Alert.db) {
	Journal.Alert.db = new Meteor.Collection('alerts');
}