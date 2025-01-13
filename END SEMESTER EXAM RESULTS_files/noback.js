function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload=function(){null};

function exportToExcel() {
	$("#tblData").table2csv();
}

// Export to Excel
(function($) {	
	var options = {
		filename: 'cae.csv',		
		appendTo: 'body',		
		separator: ',',
		newline: '\n',
		quoteFields: true,
		excludeColumns: '',
		excludeRows: ''
	};
	
	function quote(text) {
		return '"' + text.replace('"', '""') + '"';
	}
	
	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);		
		element.style.display = 'none';
		document.body.appendChild(element);		
		element.click();		
		document.body.removeChild(element);
	}
	
	function convert(table) {
		var output = "";			
		var rows = table.find('tr').not(options.excludeRows);		
		var numCols = rows.first().find("td,th").filter(":visible").not(options.excludeColumns).length;		
		rows.each(function() {
			$(this).find("td,th").filter(":visible").not(options.excludeColumns)
			.each(function(i, col) {
				col = $(col);				
				output += options.quoteFields ? quote(col.text()) : col.text();
				if(i != numCols-1) {
					output += options.separator;
				} else {
					output += options.newline;
				}
			});
		});	
		return output;
	}	
	$.fn.table2csv = function(action, opt) {
		if(typeof action === 'object') {
			opt = action;
			action = 'download';
		} else if(action === undefined) {
			action = 'download';
		}
		$.extend(options, opt);
		var table = this;
		switch(action) {
			case 'download':
				var csv = convert(table);
				download(options.filename, csv);
				break;
			case 'output':
				var csv = convert(table);
				$(options.appendTo).append($('<pre>').text(csv));
				break;
		}	
		return this;
	}
}(jQuery));