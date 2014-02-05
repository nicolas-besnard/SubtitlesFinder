var handleHash = function(hash, size, filename) {
	console.log("Hash " + hash);
	console.log("File Size " + size);

	$.ajax({
		type: "GET",
		dataType: "json",
		url: "/providers/opensubtitles/hash",
		data:
		{
			hash: hash,
			filename: "FILENAME",
			size: size
		},
		success: function(ret)
		{
			if (ret.length == 0)
			{
				$("#test").append('<li>empty</li>');
				return ;
			}
			for (var _i = 0; _i < ret.length; _i++)
			{
				var sub = ret[_i];
				var language = sub['language'];
				var IMDBId = sub['raw_data']['IDMovieImdb'];
				var link = sub['raw_data']['ZipDownloadLink'];
				var movieKin = sub['raw_data']['MovieKind'];
				$("#test").append("<li>HASH - <a href=\"" + link + "\">" + filename + "</a></li>");
			}
		},
		error: function(ret)
		{
			return console.log("ERROR");
		}
	});
};

var handleFilename = function(filename)
{
	$.ajax({
		type: "GET",
		dataType: "json",
		url: "/providers/opensubtitles",
		data:
		{
			filename: filename
		},
		success: function(ret)
		{
			if (ret.length == 0)
			{
				$("#test").append('<li>empty</li>');
				return ;
			}
			for (var _i = 0; _i < ret.length; _i++)
			{
				var sub = ret[_i];
				var language = sub['language'];
				var IMDBId = sub['raw_data']['IDMovieImdb'];
				var link = sub['raw_data']['ZipDownloadLink'];
				var movieKind = sub['raw_data']['MovieKind'];
				$("#test").append('<li>FILENAME - <a href="/download?link=' + link + '&filename='+ filename +'">' + filename + '</a></li>');
			}
		},
		error: function(ret)
		{
			return console.log("ERROR");
		}
	});
}

var handleFileDropped = function(event)
{
	if (event.stopPropagation())
		{
		event.stopPropagation();
	}
	event.preventDefault();

	getHash(event.dataTransfer.files[0], handleHash);
	handleFilename(event.dataTransfer.files[0].name)
};

handleDragOver = function(event)
{
	event.stopPropagation();
	event.preventDefault();
};

if (window.File && window.FileReader && window.FileList && window.Blob)
{
	console.log("support API");
}
else
{
	console.log("don't support API");
}

window.addEventListener("dragover", handleDragOver, false);
window.addEventListener("drop", handleFileDropped, false);
