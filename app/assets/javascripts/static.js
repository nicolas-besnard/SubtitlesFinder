var processOpenSubtitlesSearchResults = function(data)
{
	var subtitles = []

	for (var _i = 0; _i < data.length; ++_i)
	{
		var subtitle = {};

		subtitle['language'] = data[_i]['language'];
		subtitle['link'] = data[_i]['raw_data']['ZipDownloadLink'];
		subtitle['filename'] = data[_i]['filename'];

		subtitles.push(subtitle);
	}

	return subtitles;
};

var handleHash = function(hash, size)
{
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
		success: function(data)
		{
			var subtitles = processOpenSubtitlesSearchResults(data);

			_appendSubtitles(subtitles, true);
		},
		error: function(ret)
		{
			return console.log("ERROR");
		}
	});
};

var handleFilename = function(file)
{
	$.ajax({
		type: "GET",
		dataType: "json",
		url: "/providers/opensubtitles",
		data:
		{
			filename: file
		},
		success: function(data)
		{
			var subtitles = processOpenSubtitlesSearchResults(data);

			_appendSubtitles(subtitles, true);
			$('html,body').animate({scrollTop: $('#subs').offset().top - window.navHeight}, 1000, 'easeInOutExpo');
		},
		error: function(ret)
		{
			return console.log("ERROR");
		}
	});
}

var _appendSubtitles = function (subtitles, isPerfectMatch)
{
	var table = '';

	for (var _i = 0; _i < subtitles.length; ++_i)
	{
		var template = '';
			template += '	<tr>';
			template += '		<td>';
			if (isPerfectMatch)
			{
				template += '<i class="icon-thumbs-up tooltipize" title="Perfect Match" data-toggle="tooltip"/>&nbsp;&nbsp;';
			}
			template += subtitles[_i].language;
			template += '		</td>';
			template += '		<td>'+ subtitles[_i].filename +'</td>';
			template += '		<td><a href="/download?link='+ subtitles[_i].link +'&filename='+ filename +'">Download</a></td>';
			template += '	</tr>';
			template += '	<% }); %>';

		table += template
	}

	$("table tbody").append(table);
};

var dragTimer;

var handleFileDropped = function(event)
{
	console.log(event);
	if (event.stopPropagation())
	{
		event.stopPropagation();
	}
	event.preventDefault();

	$('.overlay').fadeOut();

	filename = event.dataTransfer.files[0].name;

	getHash(event.dataTransfer.files[0], handleHash);
	handleFilename(event.dataTransfer.files[0].name)
};

var handleDragOver = function(event)
{
	$('.overlay').fadeIn();

	event.dataTransfer.dropEffect = 'copy';

	window.clearTimeout(dragTimer);
	event.stopPropagation();
	event.preventDefault();
};

var handleDragLeave = function(event)
{
	dragTimer = window.setTimeout(function() {
		$('.overlay').fadeOut();
	}, 25);
};

if (window.File && window.FileReader && window.FileList && window.Blob)
{
	console.log("support API");
}
else
{
	console.log("don't support API");
}

// $(window).on('drop', handleFileDropped);
// $(window).on('dragover', handleDragOver);
// $('header').on('')

window.addEventListener("dragover", handleDragOver, false);
window.addEventListener('dragleave', handleDragLeave, false);
window.addEventListener("drop", handleFileDropped, false);
