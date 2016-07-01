"use strict";

$(document).ready(function(){
	let chapterText;
	let annotationsArray = [];
	// Adding elements is going to throw throw off the indices in the text string. Maybe add the annotations in reverse order?
	let reversedAnnontationsArray;
	let endOfText;

	$.ajax({
		url: `ch08.txt`
	}).done(function(contents){
		//Set variable to full body text
		chapterText = contents;

		$.ajax({
			url: `ch08.txt.xml`
		}).done(function(contents){
			// console.log(contents);
			//create array from span elements in XML document
			annotationsArray = $(contents).find("span");
			//Array methods aren't working, make sure the previus is formatted as an array, then reverse it
			reversedAnnontationsArray = Array.from(annotationsArray).reverse();
			// console.log(reversedAnnontationsArray);
			//Iterate over reversed array, grab values for beginning and end of annotation, category name, as well as inner text of the charseq element.
			reversedAnnontationsArray.forEach((annotation) => {
				let stringStart = parseInt($(annotation).find('charseq')[0].attributes["START"].value);
				let stringEnd = parseInt($(annotation).find('charseq')[0].attributes["END"].value);
				let categoryClass = $(annotation).attr("category");
				let textElement = $(annotation).find('charseq')[0];
				let elementString = $(textElement).html();
				//capture everything after the annotation
				endOfText = chapterText.slice(stringEnd +1);
				//cut out the raw text for each annotation, add in a span to replace it, with the proper class, and then add back everything that followed the original text.
				chapterText = chapterText.slice(0, stringStart) +  `<span class="${categoryClass}">${elementString}</span>` + endOfText;
			})
				//after the forEach concludes, append the newly built string to the text div.
				$("#text").append(chapterText);
		});
	});

});