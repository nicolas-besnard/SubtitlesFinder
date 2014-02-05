function getHashFromSlices(file, slice_1, slice_2)
{
	var tmp;
	var fsize = file.size;
	var arr = new Uint16Array(slice_1);
	var hash = {
		3 : 0,
		2 : 0,
		1 : (fsize >> 16) & 0xFFFF,
		0 : fsize & 0xFFFF
	};


	for (var i = 0; i < 8192; i++)
	{
		hash = AddUINT64(hash, arr.subarray(i*4, i * 4 + 4));
	}

	arr = new Uint16Array(slice_2);

	for (var i = 0; i < 8192; i++)
	{
		hash = AddUINT64(hash, arr.subarray(i*4, i * 4 + 4));
	}


	return UINT64FormatHex(hash);
}

function AddUINT64(a, b) {
	var o = {
		0 : 0,
		1 : 0,
		2 : 0,
		3 : 0
	};
	var carry = 0;

	for (var i = 0; i < 4; i++)
	{
		if ((a[i] + b[i] + carry) > 0xffff )
		{
			o[i] += (a[i] + b[i] + carry) & 0xffff;
			carry = 1;
		}
		else
		{
			o[i] += (a[i] + b[i] + carry);
			carry = 0;
		}
	}

	return o;
}

function UINT64FormatHex(n) {
	return parseInt(n[3], 10).toString(16) + parseInt(n[2], 10).toString(16) + parseInt(n[1], 10).toString(16) + parseInt(n[0], 10).toString(16);
}

function getHash(file, callback) {
	var slice1 = new FileReader();
	var slice2 = new FileReader();
	var slice_1;
	var slice_2;
	var hash;

	slice1.onload = function (event) {

		slice_1 = event.target.result;
	};

	slice2.onload = function (event) {

		slice_2 = event.target.result;

		try
		{
			// Getting the hash
			result = getHashFromSlices(file, slice_1, slice_2);

			// Zero Padding - making sure the returned hash has always a length of 16
			var pad = "0000000000000000";
			hash = (pad+result).slice(-pad.length);

		}
		catch(e)
		{
			console.log(e);
			hash = 'error';
		}

		callback(hash, file.size, file.name);
	};


	if(file.slice)
	{
		slice1.readAsArrayBuffer(file.slice(0,65536));
		slice2.readAsArrayBuffer(file.slice(file.size-65536, file.size));

	}
	else if(file.mozSlice)
	{
		slice1.readAsArrayBuffer(file.mozSlice(0,65536));
		slice2.readAsArrayBuffer(file.mozSlice(file.size-65536, file.size));

	}
	else if(file.webkitSlice)
	{
		slice1.readAsArrayBuffer(file.webkitSlice(0,65536));
		slice2.readAsArrayBuffer(file.webkitSlice(file.size-65536, file.size));
	}

	return false;
};
