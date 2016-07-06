"use strict";

$(document).ready(function(){
	let chapterText;
	let annotationsArray = [];
	// Adding elements is going to throw throw off the indices in the text string. Maybe add the annotations in reverse order?
	let reversedAnnontationsArray;
	let endOfText;

	//Load the chapter text to the page on load
	$.ajax({
		url: `ch08.txt`
	}).done(function(contents){
		//Set variable to full body text
		chapterText = contents;
		$("#text").append(chapterText);
	});


	//Since the user is able to save the annotations in JSON format (printed to the console), it seemed appropriate to let the user choose to import the annotations via XML or JSON, rather than just loading in the XML document on page load. As such, an import menu was added and the annotation menus are hidden until an import option is chosen.

	//If the user clicks the XML button from the import menu, fire off the ajax request for the XML document and begin replacing the chapterText with an annotated string.
	$("#loadXML").click(() => {
		$.ajax({
			url: `ch08.txt.xml`
		}).done(function(contents){
			//create array from span elements in XML document
			annotationsArray = $(contents).find("span");
			//Array methods aren't working, make sure the previus is formatted as an array, then reverse it
			reversedAnnontationsArray = Array.from(annotationsArray).reverse();
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
				//after the forEach concludes, write the newly built string to the text div.
				$("#text").html(chapterText);
				//On button click, hide the import options and reveal the annotations options
				$("#import-options").addClass("hidden");
				$("#annotation-menus").removeClass("hidden");
		});
	});


	//If the user clicks the JSON button from the import menu, fire off the ajax request for the JSON document and begin replacing the chapterText with an annotated string.
	$("#loadJSON").click(() => {
		$.ajax({
			url: `ch08.json`
		}).done(function(contents){
			//Recycle code from XML import: capture the array from the document, reverse it, capture the components of the annotation element, build up the element, and add it to the chapterText string.
			annotationsArray = contents;
			reversedAnnontationsArray = annotationsArray.reverse();
			annotationsArray.forEach((annotationObject) =>{
				let stringStart = parseInt(annotationObject.startIndex);
				let stringEnd = parseInt(annotationObject.endIndex);
				let categoryClass = annotationObject.category;
				let textString = annotationObject.text;
				endOfText = chapterText.slice(stringEnd +1);
				chapterText = chapterText.slice(0, stringStart) +  `<span class="${categoryClass}">${textString}</span>` + endOfText;
			})
			//Just as above, once the forEach concludes, write the chapterText string to the text div.
			$("#text").html(chapterText);
			//On button click, hide the import options and reveal the annotations options
			$("#import-options").addClass("hidden");
			$("#annotation-menus").removeClass("hidden");
		})
	})


	//addNew button toggles visibility of the div containing instructions for adding new annotations
	$("#addNew").click(function(){
		$("#newAnnotationMenu").toggleClass("hidden");
	});


	$("#newAnnotation").click(function(event){
		//If the delete annotation menu is visible, hide it
		if (!$("#deleteAnnotationMenu").hasClass("hidden")) {
			$("#deleteAnnotationMenu").addClass("hidden");
		}
		//Clicking newAnnotation captures the text selected by the user
 		let selection = window.getSelection();
 		//check to make sure some text has been selected by making sure the beginning and end points of the selection aren't the same
 		if (selection.focusOffset !== selection.anchorOffset) {
	 		//and the range of the selection
	 		let range = selection.getRangeAt(0);
	 		//then creates a span element
	 		let span = document.createElement('span');
      //ensure that the user has selected a category before trying to set the class of the span
      if ($("#selectCategory").val() !== null) {
		 		//sets the className of the to the appropriate category, designated by the select menu
	      span.className = $("#selectCategory").val();
	      //wraps the selected text in the formatted span element
	      range.surroundContents(span);
      }
    }
 	})


	//delete button changes the visibility of the div containing instructions for deleting annotations
	$("#delete").click(function(){
		//If the add annotation menu is visible, hide it
		if (!$("#newAnnotationMenu").hasClass("hidden")) {
			$("#newAnnotationMenu").addClass("hidden")
		}
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
		//use character index to save the starting point of the next annotation
		let characterIndex;
		//create an area from span and text elements in the text div.
		let textContentsArray = Array.from($("#text").contents());

		if ($(textContentsArray[0]).prop("tagName") === "SPAN") {
			//if the first element is a span, then the starting point of the first annotation is 0;
			characterIndex = 0;
		} else {
			//if the first element is a text chunk then the start point of the first annotation is the same as the value of the length of the first string.
			characterIndex = textContentsArray[0].length;
		}
		textContentsArray.forEach((chunk) => {
			//capture the data that represents an annotation
			if ($(chunk).prop("tagName") === "SPAN") {
				//thanks to our local variable we know the annotation begins at characterIndex
				let beginning = characterIndex;
				//grab the length of the annotation for the next bit
				let length = chunk.innerHTML.length;
				//the end of the annotation will characterIndex plus the length of the annotation, minus 1. Since characterIndex takes the place of the first character in the string, we must subtract 1 from the length of the string to make up for the difference.
				let end = characterIndex + (length - 1);
				//obviously the text of the annotation is the innerHTML of the element
				let chunkText = chunk.innerHTML;
				//save the category by grabbing the className. These elements only have one class, but should that change this bit will need to be refactored.
				let chunkCategory = chunk.className;
				//Build up that shiny new annotation object
				let newAnnotationObject = {
					startIndex : beginning,
					endIndex : end,
					text : chunkText,
					category : chunkCategory
				}
				//After the object is constructed, push it to the local array.
				annotationObjectArray.push(newAnnotationObject);
				//increment the value of characterIndex by one after every annotation, to indicate that the next element occupies the space immediately after the annotation, rather than sharing its start with the end of the current element.
				characterIndex += length;
			} else {
				//if the current chunk isn't an annotation, just increase the value of characterIndex by the length of the chunk, to indicate that the next chunk begins after the current chunk ends.
				characterIndex += chunk.length;
			}
		})
		//after the forEach is finished, stringify the local array into valid JSON and cathc it in a new variable.
		let annotationsJSON = JSON.stringify(annotationObjectArray);
		//Print the JSON string to the console.
		console.log(annotationsJSON);
	});

});