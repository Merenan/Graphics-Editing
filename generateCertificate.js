var Jimp = require('jimp');
var sizeOf = require('image-size');

// Just for testing
const fs = require('fs');

function GenerateCertificate(name/*, number*/, callback){
// Existing image
let imgRaw = 'raw/CertificateTemplate.jpg';

// Targets for active use and saving
let imgActive = 'active/image.jpg';
let imgExported = 'export/' + name + 'Certificate.jpg';
var imgBase = '';

// Fill in the image's dimensions
var dimen = sizeOf(imgRaw);
let width = dimen.width;
let height = dimen.height;

// Object to help with adding text
let textData = {
	text: name, //Text to render
	maxWidth: width - (5+5), //image width - L and R margins
	maxHeight: height - (5+5), //image height - margins
	placementX: 10, // 10 px L margin
	placementY: height - (height - (5+5)) +	650 // bottom of image = imgHeight - maxHeight + margin (to determine exact placement)
};

// Read template and clone raw image
Jimp.read(imgRaw)
	.then(tpl => (tpl.clone().write(imgActive)))
	
	//read cloned image
	.then(() => (Jimp.read(imgActive)))
	
	// load font
	.then(tpl => (Jimp.loadFont("./NameFont.fnt").then(font => ([tpl, font]))))
	
	// add text
	.then(data => {
		tpl = data[0];
		font = data[1];
		
		return tpl.print(font, textData.placementX, textData.placementY, {
			text:textData.text,
			alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
			alignmentY: Jimp.VERTICAL_ALIGN_TOP
		}, textData.maxWidth, textData.maxHeight);
	})
	
	/*
	// For adding the certificate number later!!!
	
	.then(tpl => (Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => ([tpl, font]))))
	
	.then(data => {
		tpl = data[0];
		font = data[1];
		
		return tpl.print(font, textData.placementX, textData.placementY, {
			text: number,
			alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
			alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
		}, textData.maxWidth, textData.maxHeight);
	})
	*/
	
	// export the image
	.then(tpl => (tpl.quality(20).getBase64(Jimp.MIME_JPEG, (err, result) => {callback(result);})))
	
	// Catch errors
	.catch(err => {console.error(err);});	
}// GenerateCertificate()

// Test/example
GenerateCertificate("TEST", (myLine) => {
	fs.writeFile("imgData.txt", myLine, (err) => {
		if (err) console.error(err);
	});
});

