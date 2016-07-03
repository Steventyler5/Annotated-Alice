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
		// console.log(chapterText);

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


	//addNew button toggles visibility of the div containing instructions for adding new annotations
	$("#addNew").click(function(){
		$("#newAnnotationMenu").toggleClass("hidden");
	});


	$("#newAnnotation").click(function(event){
			//Clicking newAnnotation captures the text selected by the user
	 		let selection = window.getSelection();
	 		//and the range of the selection
	 		let range = selection.getRangeAt(0);
	 		//then creates a span element
	 		let span = document.createElement('span');
	 		//sets the className of the to the appropriate category, designated by the select menu
      span.className = $("#selectCategory").val();
      // console.log($("#selectCategory").val());
      //wraps the selected text in the formatted span element
      range.surroundContents(span);
	 	})


	//delete button changes the visibility of the div containing instructions for deleting annotations
	$("#delete").click(function(){
		//if the delete menu is currently hidden
		if ($("#deleteAnnotationMenu").hasClass("hidden")) {
			//make it visible
			$("#deleteAnnotationMenu").removeClass("hidden");
			//and add an event listener to all of the spans on the page
			//This is an imperfect solution, a better solution maybe be to tag all of the category span with an additional class and then use that as an additional selection criteria for the event listener activation
			$("span").click(function(){
				//clicking on a span will target the contents of the clicked element and then unwrap them (remove their suround element tag)
	 			$(this).contents().unwrap();
	 		});
	 		//if the delete menu is not currently hidden
		} else {
			//hide the menu
			$("#deleteAnnotationMenu").addClass("hidden");
			//deactivate the event listeners
			$("span").off("click");
		}
	});

	//Save button will create a JSON list of 
	$("#save").click(function(){
		let annotationObjectArray = [];
		let characterIndex;
		let textContentsArray = Array.from($("#text").contents());
		// console.log($(textContentsArray[0]).prop("tagName"));
		if ($(textContentsArray[0]).prop("tagName") === "SPAN") {
			characterIndex = 0;
		} else {
			characterIndex = textContentsArray[0].length;
		}
		textContentsArray.forEach((chunk) => {
			if ($(chunk).prop("tagName") === "SPAN") {
				let beginning = characterIndex;
				let length = chunk.innerHTML.length;
				let end = characterIndex + (length - 1);
				let chunkText = chunk.innerHTML;
				let newAnnotationObject = {
					startIndex : beginning,
					endIndex : end,
					text : chunkText
				}
				annotationObjectArray.push(newAnnotationObject);
				characterIndex += length;
			} else {
				characterIndex += chunk.length;
			}
		})
		let annotationsJSON = JSON.stringify(annotationObjectArray);
		console.log(annotationsJSON);
	});

});