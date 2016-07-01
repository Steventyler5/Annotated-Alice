# Annotated Alice

###Milestone 1:
------
#####Display the full document and all annotations on the page.
	Tasks:
	1. Load ch08.txt via AJAX
	2. Write to div in DOM
	3. Load ch08.txt.xml via AJAX
	4. Retrieve array of XML span elements and reverse it
	5. Iterate over reversed array, wrapping annotated text in span tags with category classes
	6. Color-code the background of the spans, include a legend on the page

###Milestone 2:
------
#####Add mechanisms to add and delete annotations.
	Tasks:
	1. Add a button for adding annotations
		1. Reveal a div with select input
		2. If a section of text is highlighted and a category is selected, wrap selected text in a span with a category class
	2. Add a button to delete annotations
		1. Reveal div with instructions
		2. Add an event listener to all spans
	3. Click a span to unwrap contents
    	4. Let that same click turn off the event listener, or else add a button for that purpose in the newly revealed div

###Milestone 3:
------
#####Add save button that spits out a JSON representation of the annotations to the console
  Tasks:
	1. Figure out the locations of all the annotations, relative to an untouched document
	2. Add Save button that packages those annotations into an object, JSON.stringify() the object, print result to console

###Milestone 4:
------
#####Put lipstick on the pig
        Tasks:
        1. Quick and dirty styling, align content and space out buttons and other elements of instructional divs appropriately
