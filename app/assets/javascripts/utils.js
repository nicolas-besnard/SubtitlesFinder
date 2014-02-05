var checkExt = function (files)
{
	if(typeof files !== 'undefined')
	{
		if(files.length && files.length > 0)
		{
			var name = files[0].name;
			return checkExtFileName(name);
		}
	}
	return false;
}

var checkExtFileName = function (name)
{
	if(typeof name !== 'undefined')
	{
		var reg = new RegExp("^.+\.(mpeg|mpg|avi|flv|mov|mpa|vob|mp4|mkv|m4v|wmv)$","i");
		if(reg.test(name))
		{
			return true;
		}
	}
	return false;
}
