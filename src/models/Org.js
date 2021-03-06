const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
	name: {type: String, index: true, unique: true},
	slug: {type: String, trim: true, unique: true},
	description: String,
	type: String,
	creator: String,
	donateLink: String,
	donateLinkCopy: {type: String, default: "Donate"},
	otherLinks: [{
		copy: String,
		href: String
	}],
	website: String,
	facebook: String,

	favorites: Number,
	favoritedBy: [String],
	rating: Number,
	ratings: [{user: String, rating: Number}],

	featured: Boolean,

	verified: Boolean,
	official: Boolean,

	globalPermission: String, // for manager permission
	managers: [String],

	donations: [{
		dateCreated: {type: Date, default: Date.now()},
		user: String,
		dollars: Number,
		hours: Number,
		memo: String,
		verified: Boolean
	}],
	
	coverImage: String,
	avatar: String,
	videoLink: String,
	gallery: [String],

	categories: Array
},
{
	timestamps: true
});

orgSchema.pre('save', function(next) {
  let org = this;
  function makeid() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-";
    for( var i=0; i < 10; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  if (org.otherLinks && org.otherLinks.length)
  	org.otherLinks[0] = {copy: "Visit our website", href: org.website};
  else {
  	org.otherLinks.push({copy: "Visit our website", href: org.website});
  }
  if (org.isNew || org.isModified("name")) {
  	let firstChar = org.name.charAt(0).toLowerCase();
	  if (firstChar.match(/[a-z0-9]/)) {
	  	org.avatar = "app/images/default-avatars/" + firstChar + ".png";
	  }
	  org.slug = org.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
  }
  if (org.isNew) {
  	org.globalPermission = makeid();
  }
	next();
});

orgSchema.pre('save', function(next) {
	let org = this;
	if (org.isNew || org.isModified("videoLink")) {
		if (org.videoLink) org.videoLink = org.videoLink.replace("watch?v=", "v/");
  }
  next();
});

const Org = mongoose.model('Org', orgSchema);

module.exports = Org;