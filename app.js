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
		chapterText = contents;

		$.ajax({
			url: `ch08.txt.xml`
		}).done(function(contents){
			console.log(contents);
			annotationsArray = $(contents).find("span");
			reversedAnnontationsArray = Array.from(annotationsArray).reverse();
			console.log(reversedAnnontationsArray);
			reversedAnnontationsArray.forEach((annotation) => {
				let stringStart = parseInt($(annotation).find('charseq')[0].attributes["START"].value);
				let stringEnd = parseInt($(annotation).find('charseq')[0].attributes["END"].value);
				let categoryClass = $(annotation).attr("category");
				let textElement = $(annotation).find('charseq')[0];
				let elementString = $(textElement).html();
				endOfText = chapterText.slice(stringEnd +1);
				// console.log(endOfText);
				chapterText = chapterText.slice(0, stringStart) +  `<span class="${categoryClass}">${elementString}</span>` + endOfText;
			})
				$("#text").append(chapterText);
		});
	});

});